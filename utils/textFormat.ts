import type { TextFormat } from '../types';

/**
 * Typography settings for a text format
 */
export interface TextFormatSettings {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
}

/**
 * Returns the typography settings for a given text format
 * 
 * Maps text format types (H1, B1, C1) to their corresponding
 * font size, weight, and line height values.
 * 
 * @param format - The text format type (H1, B1, or C1)
 * @returns Object containing fontSize, fontWeight, and lineHeight
 * 
 * @example
 * ```typescript
 * const settings = getTextFormat('H1');
 * // Returns: { fontSize: 16, fontWeight: 700, lineHeight: 24 }
 * ```
 */
export function getTextFormat(format: TextFormat): TextFormatSettings {
    switch (format) {
        case 'H1':
            return { fontSize: 16, fontWeight: 700, lineHeight: 24 };
        case 'B1':
            return { fontSize: 14, fontWeight: 400, lineHeight: 22 };
        case 'C1':
            return { fontSize: 10, fontWeight: 400, lineHeight: 17 };
    }
}
