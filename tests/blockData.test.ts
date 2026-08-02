import { describe, expect, it, vi } from 'vitest';
import { createBlockOperations } from '../hooks/useBlockOperations';
import { createFocusManagement } from '../hooks/useFocusManagement';
import { createPropertyMenu } from '../utils/propertyMenu';
import { createBlock, getTextLines, normalizeBlock, sortBlocks } from '../utils/blockData';
import type { Block } from '../types';

function createSyncedMap(initialBlocks: Block[]): SyncedMap<Block> {
    const blocks = new Map(initialBlocks.map((block) => [block.id, block]));

    return {
        get size() { return blocks.size; },
        get length() { return blocks.size; },
        has: (key) => blocks.has(key),
        get: (key) => blocks.get(key),
        set: (key, value) => { blocks.set(key, value); },
        delete: (key) => { blocks.delete(key); },
        keys: () => [...blocks.keys()],
        values: () => [...blocks.values()],
        entries: () => [...blocks.entries()],
    };
}

describe('block data migration', () => {
    it('creates one stable fallback line for legacy text blocks', () => {
        const legacyBlock: Block = {
            id: 'legacy-text',
            type: 'text',
            content: 'Existing note',
            format: 'H1',
        };

        expect(getTextLines(legacyBlock)).toEqual([{
            id: 'legacy-text-legacy-line',
            text: 'Existing note',
            format: 'H1',
        }]);
        expect(getTextLines(legacyBlock)).toEqual(getTextLines(legacyBlock));
    });

    it('normalizes legacy blocks without changing their visible content', () => {
        const legacyBlock: Block = {
            id: 'legacy-text',
            type: 'text',
            content: 'Existing note',
            format: 'C1',
        };

        expect(normalizeBlock(legacyBlock, 2)).toMatchObject({
            id: 'legacy-text',
            content: 'Existing note',
            format: 'C1',
            listType: 'none',
            order: '0:000000000002',
            lines: [{
                id: 'legacy-text-legacy-line',
                text: 'Existing note',
                format: 'C1',
            }],
        });
    });

    it('keeps legacy ordering ahead of newly created blocks', () => {
        const first = normalizeBlock({
            id: 'first',
            type: 'text',
            content: 'First',
            lines: [{ id: 'first-line', text: 'First', format: 'B1' }],
        }, 0);
        const second = normalizeBlock({
            id: 'second',
            type: 'todo',
            content: '',
            todos: [{ id: 'second-todo', text: 'Second', completed: false }],
        }, 1);
        const added = createBlock('code');

        expect(sortBlocks([added, second, first]).map((block) => block.id)).toEqual([
            'first',
            'second',
            added.id,
        ]);
    });
});

describe('block operations', () => {
    it('updates only the targeted synced-map entry', () => {
        const textBlock = normalizeBlock({
            id: 'text',
            type: 'text',
            content: 'Keep me',
            lines: [{ id: 'text-line', text: 'Keep me', format: 'B1' }],
        }, 0);
        const todoBlock = normalizeBlock({
            id: 'todo',
            type: 'todo',
            content: '',
            todos: [{ id: 'todo-item', text: 'Original', completed: false }],
        }, 1);
        const blockMap = createSyncedMap([textBlock, todoBlock]);
        const setLegacyBlocks = vi.fn();
        const operations = createBlockOperations({
            blocks: [textBlock, todoBlock],
            blockMap,
            setLegacyBlocks,
            useBlockMap: true,
        });

        operations.updateTodoItem('todo', 'todo-item', 'Updated');

        expect(blockMap.get('text')).toEqual(textBlock);
        expect(blockMap.get('todo')?.todos?.[0].text).toBe('Updated');
        expect(setLegacyBlocks).not.toHaveBeenCalled();
    });

    it('applies a block-level formatting action to the visible text lines', () => {
        const textBlock = normalizeBlock({
            id: 'text',
            type: 'text',
            content: 'Visible text',
            lines: [{ id: 'text-line', text: 'Visible text', format: 'B1' }],
        }, 0);
        const blockMap = createSyncedMap([textBlock]);
        const operations = createBlockOperations({
            blocks: [textBlock],
            blockMap,
            setLegacyBlocks: vi.fn(),
            useBlockMap: true,
        });

        operations.updateBlockFormat('text', 'H1');

        expect(blockMap.get('text')).toMatchObject({
            format: 'H1',
            lines: [{ id: 'text-line', text: 'Visible text', format: 'H1' }],
        });
    });
});

describe('property-menu focus routing', () => {
    it('clears text-line focus before switching to a to-do block', () => {
        const focusedBlocks: Array<string | null> = [];
        const focusedLines: Array<string | null> = [];
        const focusedTodos: Array<string | null> = [];
        const focusOperations = createFocusManagement(
            'text-block',
            (id) => focusedBlocks.push(id),
            (id) => focusedLines.push(id),
            (id) => focusedTodos.push(id),
        );

        focusOperations.focusBlock('todo-block', { todoId: 'todo-item' });

        expect(focusedBlocks).toEqual(['todo-block']);
        expect(focusedLines).toEqual([null]);
        expect(focusedTodos).toEqual([null, 'todo-item']);
    });

    it('shows formatting controls only for the focused text block', () => {
        const textBlock = normalizeBlock({
            id: 'text',
            type: 'text',
            content: 'Text',
            lines: [{ id: 'text-line', text: 'Text', format: 'B1' }],
        }, 0);
        const codeBlock = normalizeBlock({
            id: 'code',
            type: 'code',
            content: 'const value = 1',
        }, 1);

        const textMenu = createPropertyMenu('text', textBlock, 'dark', 360);
        const codeMenu = createPropertyMenu('code', codeBlock, 'dark', 360);

        expect(textMenu.some((item) => item.itemType === 'action' && item.propertyName === 'format-h1')).toBe(true);
        expect(codeMenu.some((item) => item.itemType === 'action' && item.propertyName === 'format-h1')).toBe(false);
    });
});
