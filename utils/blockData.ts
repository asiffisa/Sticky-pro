import type { Block, BlockType, TextLine } from '../types';
import { generateId } from './helpers';

const LEGACY_ORDER_PREFIX = '0';
const NEW_ORDER_PREFIX = '1';

function padOrderValue(value: number, width: number): string {
    const stringValue = String(value);
    return stringValue.length >= width
        ? stringValue
        : `${'0'.repeat(width - stringValue.length)}${stringValue}`;
}

export function getTextLines(block: Block): TextLine[] {
    if (block.type !== 'text') return [];

    if (block.lines && block.lines.length > 0) {
        return block.lines;
    }

    return [{
        id: `${block.id}-legacy-line`,
        text: block.content || '',
        format: block.format || 'B1',
    }];
}

export function createBlockOrder(): string {
    return `${NEW_ORDER_PREFIX}:${padOrderValue(Date.now(), 13)}:${generateId()}`;
}

function getLegacyOrder(index: number): string {
    return `${LEGACY_ORDER_PREFIX}:${padOrderValue(index, 12)}`;
}

export function normalizeBlock(block: Block, index: number): Block {
    const order = block.order || getLegacyOrder(index);

    if (block.type === 'text') {
        return {
            ...block,
            order,
            format: block.format || 'B1',
            listType: block.listType || 'none',
            lines: getTextLines(block),
        };
    }

    if (block.type === 'todo') {
        return {
            ...block,
            order,
            todos: block.todos && block.todos.length > 0
                ? block.todos
                : [{ id: `${block.id}-legacy-todo`, text: '', completed: false }],
        };
    }

    return { ...block, order };
}

export function createBlock(type: BlockType): Block {
    const id = generateId();
    const block: Block = {
        id,
        type,
        content: '',
        order: createBlockOrder(),
    };

    if (type === 'text') {
        return {
            ...block,
            format: 'B1',
            listType: 'none',
            lines: [{ id: generateId(), text: '', format: 'B1' }],
        };
    }

    if (type === 'todo') {
        return {
            ...block,
            todos: [{ id: generateId(), text: '', completed: false }],
        };
    }

    return block;
}

export function sortBlocks(blocks: Block[]): Block[] {
    return [...blocks].sort((left, right) => {
        const orderComparison = (left.order || '').localeCompare(right.order || '');
        return orderComparison !== 0 ? orderComparison : left.id.localeCompare(right.id);
    });
}
