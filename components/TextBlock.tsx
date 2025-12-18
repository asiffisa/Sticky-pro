const { widget } = figma;
const { AutoLayout, Input, Text, SVG } = widget;

import { CloseButton } from './CloseButton';
import { themeColors } from '../constants/theme';
import { getPlusIcon } from '../constants/icons';
import { generateId } from '../utils/helpers';
import { getTextFormat } from '../utils/textFormat';
import type { Block, TextFormat } from '../types';

/**
 * Text Block Component
 * 
 * Displays a text or code block with support for:
 * - Multiple lines with individual formatting
 * - List types (bullet, numbered)
 * - Code syntax highlighting
 * - Inline editing
 * 
 * @param block - The block data object
 * @param width - Width of the block
 * @param isFirst - Whether this is the first block
 * @param theme - Current theme
 * @param onFocus - Callback when block or line gains focus
 * @param onBlur - Callback when block loses focus
 * @param onDelete - Callback to delete the block
 * @param onContentChange - Callback when content changes (code blocks)
 * @param onInsertAfter - Callback to insert block after this one
 * @param onAddLine - Callback to add a new line
 * @param onUpdateLine - Callback to update a line
 * @param onUpdateLineFormat - Callback to update line format
 * @param onDeleteLine - Callback to delete a line
 */
export function TextBlock({
    block,
    width,
    isFirst,
    theme,
    onFocus,
    onBlur,
    onDelete,
    onContentChange,
    onInsertAfter,
    onAddLine,
    onUpdateLine,
    onUpdateLineFormat,
    onDeleteLine,
}: {
    block: Block;
    width: number;
    isFirst: boolean;
    theme: 'dark' | 'light';
    onFocus: (opts?: { lineId?: string; todoId?: string }) => void;
    onBlur: () => void;
    onDelete: () => void;
    onContentChange: (content: string) => void;
    onInsertAfter?: () => void;
    onAddLine?: (afterLineId: string) => void;
    onUpdateLine?: (lineId: string, text: string) => void;
    onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
    onDeleteLine?: (lineId: string) => void;
}) {
    const colors = themeColors[theme];

    // Code blocks use single multi-line input
    if (block.type === 'code') {
        return (
            <AutoLayout
                direction="horizontal"
                spacing={0}
                width={width}
                padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
                overflow="visible"
            >
                <AutoLayout
                    direction="vertical"
                    width="fill-parent"
                    overflow="visible"
                >
                    {/* Outer Container - Acts as the Stroke */}
                    <AutoLayout
                        direction="horizontal"
                        spacing={0}
                        width="fill-parent"
                        fill={colors.codeBlockStroke}
                        cornerRadius={10}
                        padding={{ left: 1.2, right: 0, top: 0, bottom: 0 }}
                        onClick={() => onFocus()}
                        overflow="visible"
                    >
                        {/* Inner Container - Actual Block Content */}
                        <AutoLayout
                            direction="vertical"
                            width="fill-parent"
                            fill={colors.blockBg}
                            cornerRadius={{
                                topLeft: 8.8,
                                bottomLeft: 8.8,
                                topRight: 10,
                                bottomRight: 10,
                            }}
                            padding={{ left: 11, right: 12, top: 12, bottom: 12 }}
                            overflow="visible"
                        >
                            <Input
                                inputBehavior="multiline"
                                placeholder="<Type code>"
                                value={block.content}
                                onTextEditEnd={(e) => onContentChange(e.characters)}
                                onClick={() => onFocus()}
                                fontSize={14}
                                fontFamily="Source Code Pro"
                                fontWeight={400}
                                fill={colors.textPrimary}
                                width="fill-parent"
                                inputFrameProps={{
                                    fill: '#00000000',
                                    padding: 0,
                                }}
                            />
                        </AutoLayout>
                    </AutoLayout>

                    {/* Close button - show when focused OR when it's the initial default block */}
                    <CloseButton onClick={onDelete} />
                </AutoLayout>
            </AutoLayout>
        );
    }

    // Text blocks use existing line-based approach
    const lines = block.lines || [{ id: generateId(), text: block.content || '', format: block.format || 'B1' }];
    return (
        <AutoLayout
            direction="horizontal"
            spacing={0}
            width={width}
            padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
            overflow="visible"
        >
            <AutoLayout
                direction="vertical"
                spacing={4}
                width="fill-parent"
                padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
                fill={colors.blockBg}
                cornerRadius={10}
                overflow="visible"
                onClick={() => onFocus()}
            >
                {/* Close button - show when focused OR when it's the initial default block */}
                <CloseButton onClick={onDelete} />

                {/* Clickable area for focusing */}
                <AutoLayout
                    direction="vertical"
                    spacing={8} // Change this to update gap between text lines
                    width="fill-parent"
                >

                    {/* Multiple Lines */}
                    {lines.map((line, index) => {
                        const { fontSize, fontWeight } = getTextFormat(line.format);
                        const listType = block.listType || 'none';

                        return (
                            <AutoLayout
                                key={line.id}
                                direction="horizontal"
                                spacing={8}
                                verticalAlignItems="start"
                                width="fill-parent"
                            >
                                {/* List Marker */}
                                {listType !== 'none' && (
                                    <Text
                                        fontSize={fontSize}
                                        fontFamily="Inter"
                                        fontWeight={fontWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}
                                        fill={colors.textPrimary}
                                        width={24}
                                        horizontalAlignText="right"
                                    >
                                        {listType === 'bullet' ? '•' : `${index + 1}.`}
                                    </Text>
                                )}

                                <AutoLayout
                                    width="fill-parent"
                                    height="hug-contents"
                                    onClick={() => {
                                        onFocus({ lineId: line.id });
                                    }}
                                >

                                    <Input
                                        inputBehavior="multiline"
                                        placeholder={"Type"}
                                        value={line.text}
                                        onTextEditEnd={(e) => onUpdateLine && onUpdateLine(line.id, e.characters)}
                                        fontSize={fontSize}
                                        fontFamily={block.type === 'code' ? "Source Code Pro" : "Inter"}
                                        fontWeight={fontWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}
                                        fill={colors.textPrimary}
                                        width="fill-parent"
                                        inputFrameProps={{
                                            fill: '#00000000',
                                            padding: 0,
                                        }}
                                    />
                                </AutoLayout>
                            </AutoLayout>
                        );
                    })}

                    {/* Add line button at bottom */}
                    {onAddLine && lines.length > 0 && (
                        <AutoLayout
                            direction="horizontal"
                            spacing={4}
                            padding={{ top: 4, bottom: 0, left: 0, right: 0 }}
                            verticalAlignItems="center"
                            width="hug-contents"
                            onClick={() => {
                                if (lines.length > 0) {
                                    onAddLine(lines[lines.length - 1].id);
                                }
                            }}
                        >
                            <SVG
                                src={getPlusIcon(colors.addButtonText)}
                            />
                            <Text fontSize={10} lineHeight={8} fontFamily="Inter" fontWeight={400} fill={colors.addButtonText}>
                                {block.listType && block.listType !== 'none' ? 'Next list' : 'Add'}
                            </Text>
                        </AutoLayout>
                    )}
                </AutoLayout>
            </AutoLayout>
        </AutoLayout>
    );
}
