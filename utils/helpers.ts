// Helper functions for the Sticky Pro widget

/**
 * Generate a unique ID with guaranteed uniqueness
 * Uses timestamp, counter, and random component
 */
let idCounter = 0;
export function generateId(): string {
    return `${Date.now()}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
