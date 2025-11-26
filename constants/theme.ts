// Theme color definitions
export const themeColors = {
    dark: {
        widgetBg: '#000000',
        blockBg: '#1A1A1A',
        textPrimary: '#FFFFFF',
        textSecondary: '#505050',
        placeholderOpacity: 0.10,
        checkboxStroke: '#626262',
        checkboxFilled: '#B0B0B0',
        checkboxTick: '#000000',
        todoCompleted: '#B0B0B0',
        addButtonText: '#666666',
        editIcon: '#3C3C3C',
        codeBlockStroke: '#2E757B',
    },
    light: {
        widgetBg: '#D4E8EA',
        blockBg: '#B8D9DC',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B8285',
        placeholderOpacity: 0.2,
        checkboxStroke: '#216267',
        checkboxFilled: '#216267',
        checkboxTick: '#C5E9EC',
        todoCompleted: '#6B8285',
        addButtonText: '#6B8285',
        editIcon: '#98B3B5',
        codeBlockStroke: '#15B3C1',
    }
} as const;

export type Theme = 'dark' | 'light';
export type ThemeColors = typeof themeColors[Theme];
