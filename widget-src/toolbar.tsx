const { widget } = figma;
const { AutoLayout, Text, SVG } = widget;

type TextFormat = 'H1' | 'B1' | 'C1';
type ListType = 'none' | 'bullet' | 'numbered';

interface TextLine {
    id: string;
    text: string;
    format: TextFormat;
}

interface Block {
    id: string;
    type: 'text' | 'quote' | 'todo';
    content: string;
    format?: TextFormat;
    listType?: ListType;
    lines?: TextLine[];
    todos?: Array<{ id: string; text: string; completed: boolean }>;
}

export function Toolbar({
    focusedBlock,
    focusedLine,
    width,
    onFormatChange,
    onListTypeChange,
    onToggleWidth,
}: {
    focusedBlock: Block;
    focusedLine?: TextLine;
    width: number;
    onFormatChange: (format: TextFormat) => void;
    onListTypeChange: (listType: ListType) => void;
    onToggleWidth: () => void;
}) {
    // Safety check - if block is undefined, don't render
    if (!focusedBlock) {
        return null;
    }

    const isTextBlock = focusedBlock.type === 'text';
    // Use focused line's format if available, otherwise use block's format
    const currentFormat = focusedLine?.format || focusedBlock.format || 'B1';

    return (
        <AutoLayout
            name="StyleToolbar"
            effect={{
                type: "drop-shadow",
                color: "#00000066",
                offset: {
                    x: 2,
                    y: 4,
                },
                blur: 12,
                showShadowBehindNode: false,
            }}
            cornerRadius={8}
            verticalAlignItems="center"
            fill="#1E1E1E"
            spacing={0}
        >
            {/* Text Format Section - Only for text blocks */}
            {isTextBlock && (
                <>
                    <AutoLayout
                        name="Text format"
                        fill="#1E1E1E"
                        overflow="visible"
                        spacing={8}
                        padding={{
                            vertical: 8,
                            horizontal: 12,
                        }}
                        verticalAlignItems="center"
                    >
                        <FormatButton label="H1" isActive={currentFormat === 'H1'} onClick={() => onFormatChange('H1')} />
                        <FormatButton label="B1" isActive={currentFormat === 'B1'} onClick={() => onFormatChange('B1')} />
                        <FormatButton label="C1" isActive={currentFormat === 'C1'} onClick={() => onFormatChange('C1')} />
                    </AutoLayout>

                    <SVG
                        name="divider"
                        height="fill-parent"
                        src="<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>
"
                    />

                    <AutoLayout
                        name="list"
                        fill="#1E1E1E"
                        overflow="visible"
                        spacing={11}
                        padding={{
                            vertical: 8,
                            horizontal: 12,
                        }}
                        height="fill-parent"
                        verticalAlignItems="center"
                    >
                        <AutoLayout
                            name="Bulleted list"
                            width={20}
                            height={20}
                            onClick={() => onListTypeChange((focusedBlock?.listType || 'none') === 'bullet' ? 'none' : 'bullet')}
                        >
                            <SVG
                                name="Vector_Vector_Vector_Vector"
                                height={20}
                                width={20}
                                src={`<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M2.71429 6.82799C3.10877 6.82799 3.42857 6.50819 3.42857 6.1137C3.42857 5.71921 3.10877 5.39941 2.71429 5.39941C2.3198 5.39941 2 5.71921 2 6.1137C2 6.50819 2.3198 6.82799 2.71429 6.82799Z' fill='${(focusedBlock?.listType || 'none') === 'bullet' ? '#4ADE80' : 'white'}' stroke='${(focusedBlock?.listType || 'none') === 'bullet' ? '#4ADE80' : 'white'}' stroke-width='0.972644' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M6.42859 6.11426H18.4286' stroke='${(focusedBlock?.listType || 'none') === 'bullet' ? '#4ADE80' : 'white'}' stroke-width='0.972644' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M2.71429 14.2567C3.10877 14.2567 3.42857 13.9369 3.42857 13.5424C3.42857 13.1479 3.10877 12.8281 2.71429 12.8281C2.3198 12.8281 2 13.1479 2 13.5424C2 13.9369 2.3198 14.2567 2.71429 14.2567Z' fill='${(focusedBlock?.listType || 'none') === 'bullet' ? '#4ADE80' : 'white'}' stroke='${(focusedBlock?.listType || 'none') === 'bullet' ? '#4ADE80' : 'white'}' stroke-width='0.972644' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M6.42859 13.543H18.4286' stroke='${(focusedBlock?.listType || 'none') === 'bullet' ? '#4ADE80' : 'white'}' stroke-width='0.972644' stroke-linecap='round' stroke-linejoin='round'/>
</svg>`}
                            />
                        </AutoLayout>
                        <AutoLayout
                            name="Numbered list"
                            width={20}
                            height={20}
                            onClick={() => onListTypeChange((focusedBlock?.listType || 'none') === 'numbered' ? 'none' : 'numbered')}
                        >
                            <SVG
                                name="Vector_Vector_Vector_Vector"
                                height={20}
                                width={20}
                                src={`<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M1.83565 7.49944V4.99248H1V4.5H2.32869V7.5L1.83565 7.49944Z' fill='${(focusedBlock?.listType || 'none') === 'numbered' ? '#4ADE80' : 'white'}'/>
<path d='M5.32874 6H18.1859' stroke='${(focusedBlock?.listType || 'none') === 'numbered' ? '#4ADE80' : 'white'}' stroke-width='0.972644' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M1 15V13.6393C1 13.5301 1.03696 13.4385 1.11088 13.3646C1.18481 13.2907 1.27637 13.2535 1.38559 13.2532H2.39302V12.4926H1V12H2.5C2.60921 12 2.70078 12.037 2.7747 12.1109C2.84863 12.1848 2.88577 12.2764 2.88614 12.3856V13.3607C2.88614 13.4699 2.849 13.5615 2.7747 13.6354C2.70041 13.7093 2.60884 13.7465 2.5 13.7468H1.49257V14.5074H2.88559V15H1Z' fill='${(focusedBlock?.listType || 'none') === 'numbered' ? '#4ADE80' : 'white'}'/>
<path d='M5.88611 13.5H18.7433' stroke='${(focusedBlock?.listType || 'none') === 'numbered' ? '#4ADE80' : 'white'}' stroke-width='0.972644' stroke-linecap='round' stroke-linejoin='round'/>
</svg>`}
                            />
                        </AutoLayout>
                    </AutoLayout>

                    <SVG
                        name="divider"
                        height="fill-parent"
                        src="<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>
"
                    />
                </>
            )}

            {/* Width Toggle */}
            <AutoLayout
                name="window"
                fill="#1E1E1E"
                overflow="visible"
                spacing={11}
                padding={{
                    vertical: 8,
                    horizontal: 12,
                }}
                height="fill-parent"
                verticalAlignItems="center"
            >
                <AutoLayout
                    name="Resize "
                    rotation={width === 360 ? -90 : 90}
                    width={20}
                    height={20}
                    onClick={onToggleWidth}
                >
                    <SVG
                        name="Vector_Vector"
                        height={20}
                        width={20}
                        src="<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M14.1 5.43359L17.7929 9.12649C18.1834 9.51701 18.1834 10.1502 17.7929 10.5407L14.1 14.2336' stroke='white' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M5.80003 5.43359L2.10713 9.12649C1.71661 9.51701 1.71661 10.1502 2.10713 10.5407L5.80003 14.2336' stroke='white' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/>
</svg>
"
                    />
                </AutoLayout>
            </AutoLayout>
        </AutoLayout>
    );
}

// Format Button Component
function FormatButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
    return (
        <AutoLayout
            fill={isActive ? '#4ADE80' : '#2C2C2C'}
            cornerRadius={4}
            padding={{
                vertical: 4,
                horizontal: 8,
            }}
            onClick={onClick}
        >
            <Text
                fill={isActive ? '#000000' : '#FFFFFF'}
                fontSize={12}
                fontFamily="Inter"
                fontWeight={500}
            >
                {label}
            </Text>
        </AutoLayout>
    );
}
