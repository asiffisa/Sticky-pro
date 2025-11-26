import type { Block, TextFormat } from '../types';
import { bulletIcon, numberedIcon, lightThemeIcon, darkThemeIcon, expandIcon, shrinkIcon, deleteIcon } from '../constants/icons';

/**
 * Creates the property menu configuration
 * This is extracted to reduce complexity in the main component
 */
export function createPropertyMenu(
    focusedBlockId: string | null,
    focusedBlock: Block | undefined,
    theme: 'dark' | 'light',
    width: 360 | 480
) {
    return [
        // Text format buttons (only show when a text block is actually focused)
        ...(focusedBlockId && focusedBlock && focusedBlock.type === 'text' ? [
            {
                itemType: 'action' as const,
                tooltip: 'H1',
                propertyName: 'format-h1',
            },
            {
                itemType: 'action' as const,
                tooltip: 'B1',
                propertyName: 'format-b1',
            },
            {
                itemType: 'action' as const,
                tooltip: 'C1',
                propertyName: 'format-c1',
            },
            {
                itemType: 'separator' as const,
            },
            {
                itemType: 'toggle' as const,
                tooltip: 'Bullet List',
                propertyName: 'list-bullet',
                isToggled: (focusedBlock?.listType || 'none') === 'bullet',
                icon: bulletIcon,
            },
            {
                itemType: 'toggle' as const,
                tooltip: 'Numbered List',
                propertyName: 'list-numbered',
                isToggled: (focusedBlock?.listType || 'none') === 'numbered',
                icon: numberedIcon,
            },
            {
                itemType: 'separator' as const,
            },
            {
                itemType: 'action' as const,
                tooltip: 'Delete Line',
                propertyName: 'delete-line',
                icon: deleteIcon,
            },
            {
                itemType: 'separator' as const,
            },
        ] : []),
        // Delete option for todo blocks
        ...(focusedBlockId && focusedBlock?.type === 'todo' ? [
            {
                itemType: 'action' as const,
                tooltip: 'Delete Item',
                propertyName: 'delete-todo-item',
                icon: deleteIcon,
            },
            {
                itemType: 'separator' as const,
            },
        ] : []),
        // Theme and Width toggle (always visible)
        {
            itemType: 'action' as const,
            tooltip: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            propertyName: 'toggle-theme',
            icon: theme === 'dark' ? lightThemeIcon : darkThemeIcon,
        },
        {
            itemType: 'separator' as const,
        },
        {
            itemType: 'action' as const,
            tooltip: width === 360 ? 'Expand Width' : 'Shrink Width',
            propertyName: 'toggle-width',
            icon: width === 360 ? expandIcon : shrinkIcon,
        },
    ];
}

/**
 * Handles property menu actions
 */
export function handlePropertyMenuAction(
    propertyName: string,
    focusedBlockId: string | null,
    focusedBlock: Block | undefined,
    focusedLineId: string | null,
    focusedTodoId: string | null,
    callbacks: {
        toggleWidth: () => void;
        setTheme: (theme: 'dark' | 'light') => void;
        updateLineFormat: (blockId: string, lineId: string, format: TextFormat) => void;
        updateBlockFormat: (blockId: string, format: TextFormat) => void;
        updateBlockListType: (blockId: string, listType: 'none' | 'bullet' | 'numbered') => void;
        deleteLineFromBlock: (blockId: string, lineId: string) => void;
        setFocusedLineId: (id: string | null) => void;
        deleteTodoItem: (blockId: string, todoId: string) => void;
        setFocusedTodoId: (id: string | null) => void;
    },
    theme: 'dark' | 'light'
) {
    // Handle width toggle
    if (propertyName === 'toggle-width') {
        callbacks.toggleWidth();
        return;
    }

    // Handle theme toggle
    if (propertyName === 'toggle-theme') {
        callbacks.setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
    }

    if (!focusedBlockId || !focusedBlock) return;

    // Handle format changes
    if (propertyName === 'format-h1' || propertyName === 'format-b1' || propertyName === 'format-c1') {
        const format = propertyName.split('-')[1].toUpperCase() as TextFormat;
        if (focusedLineId) {
            callbacks.updateLineFormat(focusedBlockId, focusedLineId, format);
        } else {
            callbacks.updateBlockFormat(focusedBlockId, format);
        }
    }

    // Handle list type changes
    if (propertyName === 'list-bullet') {
        const newListType = (focusedBlock.listType || 'none') === 'bullet' ? 'none' : 'bullet';
        callbacks.updateBlockListType(focusedBlockId, newListType);
    }

    // Handle numbered list toggle
    if (propertyName === 'list-numbered') {
        const newListType = (focusedBlock.listType || 'none') === 'numbered' ? 'none' : 'numbered';
        callbacks.updateBlockListType(focusedBlockId, newListType);
    }

    // Handle delete line
    if (propertyName === 'delete-line') {
        if (focusedLineId) {
            callbacks.deleteLineFromBlock(focusedBlockId, focusedLineId);
            callbacks.setFocusedLineId(null);
        }
    }

    // Handle delete todo item
    if (propertyName === 'delete-todo-item') {
        if (focusedTodoId) {
            callbacks.deleteTodoItem(focusedBlockId, focusedTodoId);
            callbacks.setFocusedTodoId(null);
        }
    }
}
