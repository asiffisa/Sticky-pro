// Type definitions for the Sticky Pro widget

export type BlockType = 'text' | 'todo' | 'code';
export type TextFormat = 'H1' | 'B1' | 'C1';
export type ListType = 'none' | 'bullet' | 'numbered';

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface TextLine {
    id: string;
    text: string;
    format: TextFormat;
}

export interface Block {
    id: string;
    type: BlockType;
    content: string;
    format?: TextFormat;
    listType?: ListType;
    lines?: TextLine[];
    todos?: TodoItem[];
}
