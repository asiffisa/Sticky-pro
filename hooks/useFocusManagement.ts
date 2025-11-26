/**
 * Custom hook for managing focus state
 * 
 * Centralizes all focus-related state and operations to ensure consistent
 * focus behavior across the widget. Automatically handles cleanup when
 * switching between blocks.
 * 
 * @param focusedBlockId - ID of the currently focused block
 * @param setFocusedBlockId - State setter for focused block ID
 * @param focusedLineId - ID of the currently focused line
 * @param setFocusedLineId - State setter for focused line ID
 * @param focusedTodoId - ID of the currently focused todo
 * @param setFocusedTodoId - State setter for focused todo ID
 * @returns Object containing focus management functions
 * 
 * @example
 * ```typescript
 * const focusOps = createFocusManagement(...);
 * focusOps.focusBlock('block-id', { lineId: 'line-id' });
 * focusOps.clearFocus();
 * ```
 */
export function createFocusManagement(
    focusedBlockId: string | null,
    setFocusedBlockId: (id: string | null) => void,
    focusedLineId: string | null,
    setFocusedLineId: (id: string | null) => void,
    focusedTodoId: string | null,
    setFocusedTodoId: (id: string | null) => void
) {
    /**
     * Sets focus to a specific block with optional line or todo
     */
    const focusBlock = (blockId: string, opts?: { lineId?: string; todoId?: string }) => {
        // Reset line/todo focus if changing blocks
        if (focusedBlockId !== blockId) {
            setFocusedLineId(null);
            setFocusedTodoId(null);
        }

        setFocusedBlockId(blockId);

        if (opts?.lineId !== undefined) {
            setFocusedLineId(opts.lineId);
        }
        if (opts?.todoId !== undefined) {
            setFocusedTodoId(opts.todoId);
        }
    };

    /**
     * Clears all focus state
     */
    const clearFocus = () => {
        setFocusedBlockId(null);
        setFocusedLineId(null);
        setFocusedTodoId(null);
    };

    /**
     * Clears focus if the specified block is currently focused
     * Useful when deleting a block
     */
    const clearFocusIfBlock = (blockId: string) => {
        if (focusedBlockId === blockId) {
            clearFocus();
        }
    };

    /**
     * Sets focus to a specific line within the focused block
     */
    const focusLine = (lineId: string) => {
        setFocusedLineId(lineId);
    };

    /**
     * Sets focus to a specific todo within the focused block
     */
    const focusTodo = (todoId: string) => {
        setFocusedTodoId(todoId);
    };

    return {
        focusBlock,
        clearFocus,
        clearFocusIfBlock,
        focusLine,
        focusTodo,
    };
}
