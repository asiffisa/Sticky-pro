const { widget } = figma;
const { AutoLayout, SVG, Text, Frame } = widget;

import { codeIcon } from '../constants/icons';

/**
 * Add Block Menu Component
 * 
 * Displays a floating menu with options to add different block types.
 * Appears at the bottom of the widget when triggered.
 * 
 * @param onAddText - Callback to add a text block
 * @param onAddTodo - Callback to add a todo block
 * @param onAddCode - Callback to add a code block
 */
export function AddBlockMenu({ onAddText, onAddTodo, onAddCode }: { onAddText: () => void; onAddTodo: () => void; onAddCode: () => void }) {
    return (
        <AutoLayout
            name="AddBlock"
            cornerRadius={10}
            verticalAlignItems="center"
            effect={{
                type: 'drop-shadow',
                color: { r: 0, g: 0, b: 0, a: 0.2 },
                offset: { x: 0, y: 4 },
                blur: 12,
            }}
        >
            <SVG
                name="Vector 3372"
                height="fill-parent"
                src={`<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>`}
            />
            <AutoLayout
                name="Notes section"
                fill="#151515"
                overflow="visible"
                spacing={11}
                padding={{
                    top: 8,
                    right: 10,
                    bottom: 8,
                    left: 8,
                }}
                verticalAlignItems="center"
            >
                <AutoLayout
                    name="Notes button"
                    fill="#2D2D2D"
                    cornerRadius={4}
                    overflow="visible"
                    spacing={4}
                    padding={{
                        vertical: 4,
                        horizontal: 8,
                    }}
                    height={24}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={onAddText}
                    hoverStyle={{ fill: "#3D3D3D" }}
                >
                    <Frame
                        name="Notes"
                        width={12}
                        height={12}
                    >
                        <SVG
                            name="notes icon"
                            width={12}
                            height={12}
                            src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.42576 1.76407C8.55708 1.63275 8.71301 1.52858 8.88461 1.45751C9.05613 1.38644 9.24003 1.34985 9.42581 1.34985C9.61151 1.34985 9.79541 1.38644 9.96693 1.45751C10.1385 1.52858 10.2945 1.63275 10.4258 1.76407C10.5571 1.8954 10.6613 2.05129 10.7323 2.22288C10.8034 2.39445 10.84 2.57835 10.84 2.76407C10.84 2.94979 10.8034 3.13368 10.7323 3.30527C10.6613 3.47685 10.5571 3.63275 10.4258 3.76407L4.55078 9.63908L1.80078 10.3891L2.55078 7.63905L8.42576 1.76407Z" stroke="#7BA7AA" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
                        />
                    </Frame>
                    <Text
                        name="Notes"
                        fill="#FFF"
                        verticalAlignText="center"
                        lineHeight={24}
                        fontFamily="Inter"
                        fontSize={12}
                        letterSpacing={0.5}
                        fontWeight={500}
                    >
                        Notes
                    </Text>
                </AutoLayout>
            </AutoLayout>
            <SVG
                name="divider"
                height="fill-parent"
                src={`<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>`}
            />
            <AutoLayout
                name="To-do section"
                fill="#151515"
                overflow="visible"
                spacing={11}
                padding={{
                    top: 8,
                    right: 10,
                    bottom: 8,
                    left: 10,
                }}
                verticalAlignItems="center"
            >
                <AutoLayout
                    name="To do button"
                    fill="#2D2D2D"
                    cornerRadius={4}
                    overflow="visible"
                    spacing={8}
                    padding={{
                        vertical: 4,
                        horizontal: 8,
                    }}
                    height={24}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={onAddTodo}
                    hoverStyle={{ fill: "#3D3D3D" }}
                >
                    <Frame
                        name="to do icon"
                        width={12}
                        height={12}
                    >
                        <SVG
                            name="Tick_box"
                            height={12}
                            width={12}
                            src={`<svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M4 5.29087C4.89297 5.98352 5.36411 6.40284 6.09919 7.25455C7.40407 5.49014 9.0131 3.551 10.5 2' stroke='#7BA7AA' stroke-width='1.13455' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M7.5 1.5H3.3C2.30589 1.5 1.5 2.30589 1.5 3.3V8.7C1.5 9.69411 2.30589 10.5 3.3 10.5H8.7C9.69411 10.5 10.5 9.69411 10.5 8.7V5.5' stroke='#7BA7AA' stroke-width='0.9' stroke-linecap='round'/>
</svg>`}
                        />
                    </Frame>
                    <Text
                        name="To-do"
                        fill="#FFF"
                        verticalAlignText="center"
                        lineHeight={24}
                        fontFamily="Inter"
                        fontSize={12}
                        letterSpacing={0.5}
                        fontWeight={500}
                    >
                        To-do
                    </Text>
                </AutoLayout>
            </AutoLayout>
            <SVG
                name="divider-2"
                height="fill-parent"
                src={`<svg height='40' viewBox='0 0 0 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M0 0V40' stroke='#363636' stroke-width='2'/>
</svg>`}
            />
            <AutoLayout
                name="Code section"
                fill="#151515"
                overflow="visible"
                spacing={11}
                padding={{
                    top: 8,
                    right: 8,
                    bottom: 8,
                    left: 10,
                }}
                verticalAlignItems="center"
            >
                <AutoLayout
                    name="Code button"
                    fill="#2D2D2D"
                    cornerRadius={4}
                    overflow="visible"
                    spacing={8}
                    padding={{
                        vertical: 4,
                        horizontal: 8,
                    }}
                    height={24}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={onAddCode}
                    hoverStyle={{ fill: "#3D3D3D" }}
                >
                    <Frame
                        name="code icon"
                        width={12}
                        height={12}
                    >
                        <SVG
                            name="code-icon"
                            height={12}
                            width={12}
                            src={codeIcon}
                        />
                    </Frame>
                    <Text
                        name="Code"
                        fill="#FFF"
                        verticalAlignText="center"
                        lineHeight={24}
                        fontFamily="Inter"
                        fontSize={12}
                        letterSpacing={0.5}
                        fontWeight={500}
                    >
                        Code
                    </Text>
                </AutoLayout>
            </AutoLayout>
        </AutoLayout>
    );
}
