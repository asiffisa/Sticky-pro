// Helper functions for the Sticky Pro widget
import type { TextFormat } from './types';
import { TYPOGRAPHY } from './constants/layout';

/**
 * Get typography settings for a given text format
 * @param format - The text format (H1, B1, or C1)
 * @returns Object containing fontSize, fontWeight, and lineHeight
 */
export function getTextFormat(format: TextFormat): { fontSize: number; fontWeight: number; lineHeight: number } {
    switch (format) {
        case 'H1':
            return {
                fontSize: TYPOGRAPHY.H1.size,
                fontWeight: TYPOGRAPHY.H1.weight,
                lineHeight: TYPOGRAPHY.H1.lineHeight
            };
        case 'B1':
            return {
                fontSize: TYPOGRAPHY.B1.size,
                fontWeight: TYPOGRAPHY.B1.weight,
                lineHeight: TYPOGRAPHY.B1.lineHeight
            };
        case 'C1':
            return {
                fontSize: TYPOGRAPHY.C1.size,
                fontWeight: TYPOGRAPHY.C1.weight,
                lineHeight: TYPOGRAPHY.C1.lineHeight
            };
        default:
            // Fallback to B1 if format is somehow invalid
            return {
                fontSize: TYPOGRAPHY.B1.size,
                fontWeight: TYPOGRAPHY.B1.weight,
                lineHeight: TYPOGRAPHY.B1.lineHeight
            };
    }
}

/**
 * Generate a unique ID with guaranteed uniqueness
 * Uses timestamp, counter, and random component
 */
let idCounter = 0;
export function generateId(): string {
    return `${Date.now()}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
