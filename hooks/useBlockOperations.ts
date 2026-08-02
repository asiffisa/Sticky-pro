import type { Block, BlockType, ListType, TextFormat, TextLine, TodoItem } from '../types';
import { createBlock, getTextLines } from '../utils/blockData';
import { generateId } from '../utils/helpers';

type SetBlocks = (next: Block[] | ((current: Block[]) => Block[])) => void;

interface BlockOperationsOptions {
    blocks: Block[];
    blockMap: SyncedMap<Block>;
    setLegacyBlocks: SetBlocks;
    useBlockMap: boolean;
}

/**
 * Manages block mutations while supporting the legacy array during migration.
 * Once migration completes, each block is independently synchronized through
 * Figma's SyncedMap so edits to different blocks can merge in multiplayer.
 */
export function createBlockOperations({
    blocks,
    blockMap,
    setLegacyBlocks,
    useBlockMap,
}: BlockOperationsOptions) {
    const updateBlock = (blockId: string, updater: (block: Block) => Block): boolean => {
        if (useBlockMap) {
            const block = blockMap.get(blockId);
            if (!block) return false;

            blockMap.set(blockId, updater(block));
            return true;
        }

        if (!blocks.some((block) => block.id === blockId)) return false;

        setLegacyBlocks((currentBlocks) => currentBlocks.map((block) => (
            block.id === blockId ? updater(block) : block
        )));
        return true;
    };

    const deleteBlock = (blockId: string): boolean => {
        if (useBlockMap) {
            if (!blockMap.has(blockId)) return false;
            blockMap.delete(blockId);
            return true;
        }

        if (!blocks.some((block) => block.id === blockId)) return false;

        setLegacyBlocks((currentBlocks) => currentBlocks.filter((block) => block.id !== blockId));
        return true;
    };

    const addBlock = (type: BlockType): string => {
        const newBlock = createBlock(type);

        if (useBlockMap) {
            blockMap.set(newBlock.id, newBlock);
        } else {
            setLegacyBlocks((currentBlocks) => [...currentBlocks, newBlock]);
        }

        return newBlock.id;
    };

    const addLineToBlock = (blockId: string, afterLineId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text') return block;

            const lines = getTextLines(block);
            const index = lines.findIndex((line) => line.id === afterLineId);
            if (index === -1) return block;

            const newLine: TextLine = {
                id: generateId(),
                text: '',
                format: lines[index].format,
            };

            return {
                ...block,
                lines: [
                    ...lines.slice(0, index + 1),
                    newLine,
                    ...lines.slice(index + 1),
                ],
            };
        });
    };

    const updateLineInBlock = (blockId: string, lineId: string, text: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text') return block;

            return {
                ...block,
                lines: getTextLines(block).map((line) => (
                    line.id === lineId ? { ...line, text } : line
                )),
            };
        });
    };

    const updateLineFormat = (blockId: string, lineId: string, format: TextFormat) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text') return block;

            return {
                ...block,
                lines: getTextLines(block).map((line) => (
                    line.id === lineId ? { ...line, format } : line
                )),
            };
        });
    };

    const updateBlockFormat = (blockId: string, format: TextFormat) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text') return block;

            return {
                ...block,
                format,
                lines: getTextLines(block).map((line) => ({ ...line, format })),
            };
        });
    };

    const deleteLineFromBlock = (blockId: string, lineId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'text') return block;

            const lines = getTextLines(block).filter((line) => line.id !== lineId);
            return {
                ...block,
                lines: lines.length > 0
                    ? lines
                    : [{ id: generateId(), text: '', format: 'B1' }],
            };
        });
    };

    const updateBlockContent = (blockId: string, content: string) => {
        updateBlock(blockId, (block) => ({ ...block, content }));
    };

    const updateBlockListType = (blockId: string, listType: ListType) => {
        updateBlock(blockId, (block) => (
            block.type === 'text' ? { ...block, listType } : block
        ));
    };

    const addTodoItem = (blockId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            const newTodo: TodoItem = {
                id: generateId(),
                text: '',
                completed: false,
            };

            return { ...block, todos: [...(block.todos || []), newTodo] };
        });
    };

    const updateTodoItem = (blockId: string, todoId: string, text: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            return {
                ...block,
                todos: (block.todos || []).map((todo) => (
                    todo.id === todoId ? { ...todo, text } : todo
                )),
            };
        });
    };

    const toggleTodoCompletion = (blockId: string, todoId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            return {
                ...block,
                todos: (block.todos || []).map((todo) => (
                    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
                )),
            };
        });
    };

    const deleteTodoItem = (blockId: string, todoId: string) => {
        updateBlock(blockId, (block) => {
            if (block.type !== 'todo') return block;

            const todos = (block.todos || []).filter((todo) => todo.id !== todoId);
            return {
                ...block,
                todos: todos.length > 0
                    ? todos
                    : [{ id: generateId(), text: '', completed: false }],
            };
        });
    };

    return {
        deleteBlock,
        addBlock,
        addLineToBlock,
        updateLineInBlock,
        updateLineFormat,
        updateBlockFormat,
        deleteLineFromBlock,
        updateBlockContent,
        updateBlockListType,
        addTodoItem,
        updateTodoItem,
        toggleTodoCompletion,
        deleteTodoItem,
    };
}
