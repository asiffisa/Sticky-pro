const { widget } = figma;
const { AutoLayout, SVG, Text } = widget;

import { CloseButton } from './CloseButton';
import { TodoItem } from './TodoItem';
import { themeColors } from '../constants/theme';
import { getPlusIcon } from '../constants/icons';
import type { Block } from '../types';

/**
 * Todo Block Component
 * 
 * Displays a todo list block with checkboxes.
 * Supports adding, editing, and completing todo items.
 * 
 * @param block - The block data object
 * @param width - Width of the block
 * @param isFirst - Whether this is the first block
 * @param isFocused - Whether this block is currently focused
 * @param theme - Current theme
 * @param onFocus - Callback when block or todo gains focus
 * @param onBlur - Callback when block loses focus
 * @param onDelete - Callback to delete the block
 * @param onAddTodo - Callback to add a new todo item
 * @param onUpdateTodo - Callback to update a todo item
 * @param onToggleTodo - Callback to toggle todo completion
 * @param onInsertTodoAfter - Callback to insert todo after another
 */
export function TodoBlock({
    block,
    width,
    isFirst,
    onFocus,
    onBlur,
    onDelete,
    onAddTodo,
    onUpdateTodo,
    onToggleTodo,
    onInsertTodoAfter,
    isFocused,
    theme,
}: {
    block: Block;
    width: number;
    isFirst: boolean;
    isFocused: boolean;
    theme: 'dark' | 'light';
    onFocus: (opts?: { lineId?: string; todoId?: string }) => void;
    onBlur: () => void;
    onDelete: () => void;
    onAddTodo: () => void;
    onUpdateTodo: (todoId: string, text: string) => void;
    onToggleTodo: (todoId: string) => void;
    onInsertTodoAfter?: (todoId: string) => void;
}) {
    const colors = themeColors[theme];
    const todos = block.todos || [];

    return (
        <AutoLayout
            direction="vertical"
            spacing={0}
            width={width}
            padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
            overflow="visible"
        >
            <AutoLayout
                direction="vertical"
                spacing={8}
                width={width}
                padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
                fill={colors.blockBg}
                cornerRadius={10}
                overflow="visible"
                onClick={() => onFocus()}
            >
                {/* Close button - show when focused OR when it's the initial default block */}
                <CloseButton onClick={onDelete} />

                {/* Todo Items */}
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        width={width - 36}
                        theme={theme}
                        onUpdate={(text) => onUpdateTodo(todo.id, text)}
                        onToggle={() => onToggleTodo(todo.id)}
                        onFocus={(opts) => onFocus(opts)}
                    />
                ))}

                {/* Add Todo Button */}
                {(isFocused || (todos.length > 0 && todos[todos.length - 1].text.length > 0)) && (
                    <AutoLayout
                        direction="horizontal"
                        spacing={4}
                        padding={{ top: 4, bottom: 0, left: 0, right: 0 }}
                        verticalAlignItems="center"
                        width="hug-contents"
                        onClick={onAddTodo}
                    >
                        <SVG
                            src={getPlusIcon(colors.addButtonText)}
                        />
                        <Text fontSize={10} lineHeight={12} fontFamily="Inter" fontWeight={400} fill={colors.addButtonText}>
                            Add list
                        </Text>
                    </AutoLayout>
                )}
            </AutoLayout>
        </AutoLayout>
    );
}
