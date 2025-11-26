const { widget } = figma;
const { AutoLayout, SVG } = widget;

/**
 * Close Button Component Props
 */
interface CloseButtonProps {
    onClick: () => void;
}

/**
 * Close Button Component
 * 
 * Displays a circular close (X) button for deleting blocks.
 * Positioned absolutely in the top-right corner of blocks.
 * 
 * @param onClick - Callback when close button is clicked
 */
export function CloseButton({ onClick }: CloseButtonProps) {
    return (
        <AutoLayout
            width={16}
            height={16}
            fill="#00000000"
            positioning="absolute"
            x={{ type: 'right', offset: -6 }}
            y={-6}
            onClick={onClick}
            horizontalAlignItems="center"
            verticalAlignItems="center"
        >
            <SVG
                src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="12" height="12" rx="6" fill="black"/>
<path d="M5.9999 6.70039L3.5499 9.15039C3.45824 9.24206 3.34157 9.28789 3.1999 9.28789C3.05824 9.28789 2.94157 9.24206 2.8499 9.15039C2.75824 9.05872 2.7124 8.94206 2.7124 8.80039C2.7124 8.65872 2.75824 8.54206 2.8499 8.45039L5.2999 6.00039L2.8499 3.55039C2.75824 3.45872 2.7124 3.34206 2.7124 3.20039C2.7124 3.05872 2.75824 2.94206 2.8499 2.85039C2.94157 2.75872 3.05824 2.71289 3.1999 2.71289C3.34157 2.71289 3.45824 2.75872 3.5499 2.85039L5.9999 5.30039L8.4499 2.85039C8.54157 2.75872 8.65824 2.71289 8.7999 2.71289C8.94157 2.71289 9.05824 2.75872 9.1499 2.85039C9.24157 2.94206 9.2874 3.05872 9.2874 3.20039C9.2874 3.34206 9.24157 3.45872 9.1499 3.55039L6.6999 6.00039L9.1499 8.45039C9.24157 8.54206 9.2874 8.65872 9.2874 8.80039C9.2874 8.94206 9.24157 9.05872 9.1499 9.15039C9.05824 9.24206 8.94157 9.28789 8.7999 9.28789C8.65824 9.28789 8.54157 9.24206 8.4499 9.15039L5.9999 6.70039Z" fill="white"/>
</svg>`}
            />
        </AutoLayout>
    );
}
