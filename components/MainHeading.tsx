const { widget } = figma;
const { AutoLayout, Input } = widget;

import { themeColors } from '../constants/theme';

/**
 * Main Heading Component Props
 */
interface MainHeadingProps {
    value: string;
    onChange: (v: string) => void;
    width: number;
    theme: 'dark' | 'light';
    onFocus?: () => void;
}

/**
 * Main Heading Component
 * 
 * Displays the main heading input at the top of the widget.
 * Clears block focus when clicked.
 * 
 * @param value - Current heading text
 * @param onChange - Callback when heading text changes
 * @param width - Width of the heading input
 * @param theme - Current theme ('dark' or 'light')
 * @param onFocus - Optional callback when heading is focused
 */
export function MainHeading({ value, onChange, width, theme, onFocus }: MainHeadingProps) {
    const colors = themeColors[theme];

    return (
        <AutoLayout
            direction="horizontal"
            spacing={6}
            padding={{ top: 0, bottom: 12, left: 0, right: 0 }}
            width={width}
            onClick={onFocus}
        >
            <Input
                value={value}
                placeholder="Header"
                onTextEditEnd={(e) => onChange(e.characters)}
                fontSize={16}
                fontFamily="Inter"
                fontWeight={600}
                fill={colors.textPrimary}
                width={width}
                inputFrameProps={{
                    fill: '#00000000',
                    padding: 0,
                }}
            />
        </AutoLayout>
    );
}
