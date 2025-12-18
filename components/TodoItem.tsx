const { widget } = figma;
const { AutoLayout, Input, SVG } = widget;

import { themeColors } from '../constants/theme';
import type { TodoItem as TodoItemType } from '../types';

/**
 * Todo Item Component
 * 
 * Displays a single todo item with checkbox and text input.
 * 
 * @param todo - The todo item data
 * @param width - Width of the todo item
 * @param theme - Current theme
 * @param onUpdate - Callback when todo text is updated
 * @param onToggle - Callback when checkbox is toggled
 * @param onFocus - Callback when todo gains focus
 */
export function TodoItem({
    todo,
    width,
    theme,
    onUpdate,
    onToggle,
    onFocus,
}: {
    todo: TodoItemType;
    width: number;
    theme: 'dark' | 'light';
    onUpdate: (text: string) => void;
    onToggle: () => void;
    onFocus?: (opts?: { todoId?: string }) => void;
}) {
    const colors = themeColors[theme];

    return (
        <AutoLayout
            direction="horizontal"
            spacing={12}
            width={width}
            verticalAlignItems="center"
        >
            {/* Checkbox */}
            <AutoLayout
                width={16}
                height={16}
                fill={todo.completed ? colors.checkboxFilled : '#00000000'}
                stroke={todo.completed ? colors.checkboxFilled : colors.checkboxStroke}
                strokeWidth={1.6}
                cornerRadius={4}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                onClick={onToggle}
            >
                {todo.completed && (
                    <SVG
                        src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 3L4.5 8.5L2 6" stroke="${colors.checkboxTick}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
                    />
                )}
            </AutoLayout>


            {/* Todo Text */}
            <AutoLayout
                width={width - 24}
                height="hug-contents"
                onClick={() => {
                    if (onFocus) onFocus({ todoId: todo.id });
                }}
            >
                <Input
                    value={todo.text}
                    placeholder={`To do`}
                    onTextEditEnd={(e) => onUpdate(e.characters)}
                    fontSize={14}
                    fontFamily="Inter"
                    fontWeight={400}
                    textDecoration={todo.completed ? 'strikethrough' : 'none'}
                    fill={todo.completed ? colors.todoCompleted : colors.textPrimary}
                    width="fill-parent"
                    inputFrameProps={{
                        fill: '#00000000',
                        padding: 0,
                    }}
                />
            </AutoLayout>
        </AutoLayout>
    );
}
