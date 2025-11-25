// Layout and dimension constants
export const DIMENSIONS = {
    WIDTH_NARROW: 360,
    WIDTH_WIDE: 480,
    CORNER_RADIUS_WIDGET: 20,
    CORNER_RADIUS_BLOCK: 10,
    CORNER_RADIUS_MENU: 8,
    CORNER_RADIUS_BUTTON: 4,
    CHECKBOX_SIZE: 16,
    ICON_SIZE_SMALL: 10,
    ICON_SIZE_MEDIUM: 12,
    ICON_SIZE_LARGE: 20,
} as const;

export const SPACING = {
    BLOCK_VERTICAL: 8,
    CONTENT: 12,
    COMPACT: 4,
    LINE: 8,
    MENU_ITEMS: 11,
    TOOLBAR_ITEMS: 8,
    BUTTON_HORIZONTAL: 8,
    BUTTON_VERTICAL: 4,
} as const;

export const PADDING = {
    WIDGET: 12,
    BLOCK_HORIZONTAL: 12,
    BLOCK_VERTICAL: 12,
    MENU_HORIZONTAL: 12,
    MENU_VERTICAL: 8,
} as const;

// Typography constants
export const TYPOGRAPHY = {
    H1: {
        size: 16,
        weight: 700,
        lineHeight: 24,
    },
    B1: {
        size: 14,
        weight: 400,
        lineHeight: 22,
    },
    C1: {
        size: 10,
        weight: 400,
        lineHeight: 17,
    },
    HEADER: {
        size: 16,
        weight: 600,
    },
    TODO: {
        size: 14,
        weight: 400,
    },
    MENU_LABEL: {
        size: 12,
        weight: 500,
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    ADD_BUTTON: {
        size: 10,
        lineHeight: 8,
    },
    ADD_LIST: {
        size: 10,
        lineHeight: 12,
    },
} as const;
