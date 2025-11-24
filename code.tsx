const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, Text, SVG, Rectangle, Frame } = widget;

// Types
type BlockType = 'text' | 'todo' | 'code';
type TextFormat = 'H1' | 'B1' | 'C1';
type ListType = 'none' | 'bullet' | 'numbered';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TextLine {
  id: string;
  text: string;
  format: TextFormat;
}

interface Block {
  id: string;
  type: BlockType;
  content: string;
  format?: TextFormat;
  listType?: ListType;
  lines?: TextLine[];  // For multi-line text blocks
  todos?: TodoItem[];
}

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const bulletIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.71429 6.82799C3.10877 6.82799 3.42857 6.50819 3.42857 6.1137C3.42857 5.71921 3.10877 5.39941 2.71429 5.39941C2.3198 5.39941 2 5.71921 2 6.1137C2 6.50819 2.3198 6.82799 2.71429 6.82799Z" fill="white" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.42857 6.11426H18.4286" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.71429 14.2567C3.10877 14.2567 3.42857 13.9369 3.42857 13.5424C3.42857 13.1479 3.10877 12.8281 2.71429 12.8281C2.3198 12.8281 2 13.1479 2 13.5424C2 13.9369 2.3198 14.2567 2.71429 14.2567Z" fill="white" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.42857 13.543H18.4286" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const numberedIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.83565 7.49944V4.99248H1V4.5H2.32869V7.5L1.83565 7.49944Z" fill="white"/>
<path d="M5.32869 6H18.1858" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 15V13.6393C1 13.5301 1.03696 13.4385 1.11088 13.3646C1.18481 13.2907 1.27637 13.2535 1.38559 13.2532H2.39302V12.4926H1V12H2.5C2.60921 12 2.70078 12.037 2.7747 12.1109C2.84863 12.1848 2.88577 12.2764 2.88614 12.3856V13.3607C2.88614 13.4699 2.849 13.5615 2.7747 13.6354C2.70041 13.7093 2.60884 13.7465 2.5 13.7468H1.49257V14.5074H2.88559V15H1Z" fill="white"/>
<path d="M5.88614 13.5H18.7433" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const expandIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1 5.43359L17.7929 9.12649C18.1834 9.51701 18.1834 10.1502 17.7929 10.5407L14.1 14.2336" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.7999 5.43359L2.10701 9.12649C1.71649 9.51701 1.71649 10.1502 2.10701 10.5407L5.7999 14.2336" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const shrinkIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.1998 5.43359L14.5069 9.12649C14.1164 9.51701 14.1164 10.1502 14.5069 10.5407L18.1998 14.2336" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.8002 5.43359L5.49309 9.12649C5.88361 9.51701 5.88361 10.1502 5.49309 10.5407L1.8002 14.2336" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const lightThemeIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_96_3387)">
<path d="M10.0002 12.4997C10.6946 12.4997 11.2849 12.2566 11.771 11.7705C12.2571 11.2844 12.5002 10.6941 12.5002 9.99968C12.5002 9.30523 12.2571 8.71496 11.771 8.22884C11.2849 7.74273 10.6946 7.49968 10.0002 7.49968C9.30572 7.49968 8.71544 7.74273 8.22933 8.22884C7.74322 8.71496 7.50017 9.30523 7.50017 9.99968C7.50017 10.6941 7.74322 11.2844 8.22933 11.7705C8.71544 12.2566 9.30572 12.4997 10.0002 12.4997ZM10.0002 14.1663C8.84739 14.1663 7.86489 13.76 7.05267 12.9472C6.24044 12.1344 5.83405 11.1519 5.8335 9.99968C5.83294 8.84746 6.23933 7.86495 7.05267 7.05218C7.866 6.2394 8.8485 5.83301 10.0002 5.83301C11.1518 5.83301 12.1346 6.2394 12.9485 7.05218C13.7624 7.86495 14.1685 8.84746 14.1668 9.99968C14.1652 11.1519 13.7588 12.1347 12.9477 12.948C12.1366 13.7613 11.1541 14.1675 10.0002 14.1663ZM1.66683 10.833C1.43072 10.833 1.23294 10.753 1.0735 10.593C0.914055 10.433 0.834055 10.2352 0.833499 9.99968C0.832943 9.76412 0.912943 9.56634 1.0735 9.40634C1.23405 9.24634 1.43183 9.16634 1.66683 9.16634H3.3335C3.56961 9.16634 3.76767 9.24634 3.92767 9.40634C4.08767 9.56634 4.16739 9.76412 4.16683 9.99968C4.16628 10.2352 4.08628 10.4333 3.92683 10.5938C3.76739 10.7544 3.56961 10.8341 3.3335 10.833H1.66683ZM16.6668 10.833C16.4307 10.833 16.2329 10.753 16.0735 10.593C15.9141 10.433 15.8341 10.2352 15.8335 9.99968C15.8329 9.76412 15.9129 9.56634 16.0735 9.40634C16.2341 9.24634 16.4318 9.16634 16.6668 9.16634H18.3335C18.5696 9.16634 18.7677 9.24634 18.9277 9.40634C19.0877 9.56634 19.1674 9.76412 19.1668 9.99968C19.1663 10.2352 19.0863 10.4333 18.9268 10.5938C18.7674 10.7544 18.5696 10.8341 18.3335 10.833H16.6668ZM10.0002 4.16634C9.76406 4.16634 9.56628 4.08634 9.40683 3.92634C9.24739 3.76634 9.16739 3.56857 9.16683 3.33301V1.66634C9.16683 1.43023 9.24683 1.23246 9.40683 1.07301C9.56683 0.913566 9.76461 0.833566 10.0002 0.833011C10.2357 0.832455 10.4338 0.912455 10.5943 1.07301C10.7549 1.23357 10.8346 1.43134 10.8335 1.66634V3.33301C10.8335 3.56912 10.7535 3.76718 10.5935 3.92718C10.4335 4.08718 10.2357 4.1669 10.0002 4.16634ZM10.0002 19.1663C9.76406 19.1663 9.56628 19.0863 9.40683 18.9263C9.24739 18.7663 9.16739 18.5686 9.16683 18.333V16.6663C9.16683 16.4302 9.24683 16.2325 9.40683 16.073C9.56683 15.9136 9.76461 15.8336 10.0002 15.833C10.2357 15.8325 10.4338 15.9125 10.5943 16.073C10.7549 16.2336 10.8346 16.4313 10.8335 16.6663V18.333C10.8335 18.5691 10.7535 18.7672 10.5935 18.9272C10.4335 19.0872 10.2357 19.1669 10.0002 19.1663ZM4.7085 5.87468L3.81267 4.99968C3.646 4.8469 3.566 4.65246 3.57267 4.41634C3.57933 4.18023 3.65933 3.97884 3.81267 3.81218C3.97933 3.64551 4.18072 3.56218 4.41683 3.56218C4.65294 3.56218 4.84739 3.64551 5.00017 3.81218L5.87517 4.70801C6.02794 4.87468 6.10433 5.06912 6.10433 5.29134C6.10433 5.51357 6.02794 5.70801 5.87517 5.87468C5.72239 6.04134 5.53155 6.12134 5.30267 6.11468C5.07378 6.10801 4.87572 6.02801 4.7085 5.87468ZM15.0002 16.1872L14.1252 15.2913C13.9724 15.1247 13.896 14.9269 13.896 14.698C13.896 14.4691 13.9724 14.278 14.1252 14.1247C14.2779 13.958 14.4691 13.8783 14.6985 13.8855C14.9279 13.8927 15.1257 13.9725 15.2918 14.1247L16.1877 14.9997C16.3543 15.1525 16.4343 15.3469 16.4277 15.583C16.421 15.8191 16.341 16.0205 16.1877 16.1872C16.021 16.3538 15.8196 16.4372 15.5835 16.4372C15.3474 16.4372 15.1529 16.3538 15.0002 16.1872ZM14.1252 5.87468C13.9585 5.7219 13.8785 5.53107 13.8852 5.30218C13.8918 5.07329 13.9718 4.87523 14.1252 4.70801L15.0002 3.81218C15.1529 3.64551 15.3474 3.56551 15.5835 3.57218C15.8196 3.57884 16.021 3.65884 16.1877 3.81218C16.3543 3.97884 16.4377 4.18023 16.4377 4.41634C16.4377 4.65246 16.3543 4.8469 16.1877 4.99968L15.2918 5.87468C15.1252 6.02745 14.9307 6.10384 14.7085 6.10384C14.4863 6.10384 14.2918 6.02745 14.1252 5.87468ZM3.81267 16.1872C3.646 16.0205 3.56267 15.8191 3.56267 15.583C3.56267 15.3469 3.646 15.1525 3.81267 14.9997L4.7085 14.1247C4.87517 13.9719 5.07294 13.8955 5.30183 13.8955C5.53072 13.8955 5.72183 13.9719 5.87517 14.1247C6.04183 14.2775 6.12183 14.4686 6.11517 14.698C6.1085 14.9275 6.0285 15.1252 5.87517 15.2913L5.00017 16.1872C4.84739 16.3538 4.65294 16.4338 4.41683 16.4272C4.18072 16.4205 3.97933 16.3405 3.81267 16.1872Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_96_3387">
<rect width="100%" height="100%" fill="white"/>
</clipPath>
</defs>
</svg>` ;

const darkThemeIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 17.5C7.91667 17.5 6.14583 16.7708 4.6875 15.3125C3.22917 13.8542 2.5 12.0833 2.5 10C2.5 7.91667 3.22917 6.14583 4.6875 4.6875C6.14583 3.22917 7.91667 2.5 10 2.5C10.1944 2.5 10.3856 2.50694 10.5733 2.52083C10.7611 2.53472 10.945 2.55556 11.125 2.58333C10.5556 2.98611 10.1006 3.51056 9.76 4.15667C9.41944 4.80278 9.24944 5.50056 9.25 6.25C9.25 7.5 9.6875 8.5625 10.5625 9.4375C11.4375 10.3125 12.5 10.75 13.75 10.75C14.5139 10.75 15.2153 10.5797 15.8542 10.2392C16.4931 9.89861 17.0139 9.44389 17.4167 8.875C17.4444 9.05555 17.4653 9.23944 17.4792 9.42667C17.4931 9.61389 17.5 9.805 17.5 10C17.5 12.0833 16.7708 13.8542 15.3125 15.3125C13.8542 16.7708 12.0833 17.5 10 17.5ZM10 15.8333C11.2222 15.8333 12.3194 15.4964 13.2917 14.8225C14.2639 14.1486 14.9722 13.2703 15.4167 12.1875C15.1389 12.2569 14.8611 12.3125 14.5833 12.3542C14.3056 12.3958 14.0278 12.4167 13.75 12.4167C12.0417 12.4167 10.5867 11.8158 9.385 10.6142C8.18333 9.4125 7.58278 7.95778 7.58333 6.25C7.58333 5.97222 7.60417 5.69444 7.64583 5.41667C7.6875 5.13889 7.74306 4.86111 7.8125 4.58333C6.72917 5.02778 5.85056 5.73611 5.17667 6.70833C4.50278 7.68056 4.16611 8.77778 4.16667 10C4.16667 11.6111 4.73611 12.9861 5.875 14.125C7.01389 15.2639 8.38889 15.8333 10 15.8333Z" fill="white"/>
</svg>` ;

const codeIcon = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.87812 6.51925L4.10407 8.94362C4.20939 9.05833 4.26204 9.20431 4.26204 9.38158C4.26204 9.55884 4.20939 9.70482 4.10407 9.81953C3.99876 9.93423 3.86472 9.99158 3.70196 9.99158C3.53921 9.99158 3.40517 9.93423 3.29986 9.81953L0.657432 6.94156C0.599988 6.879 0.559203 6.81122 0.535076 6.73823C0.51095 6.66523 0.499269 6.58703 0.500035 6.50361C0.500801 6.42019 0.512864 6.34198 0.536225 6.26899C0.559586 6.196 0.600179 6.12822 0.658006 6.06566L3.30043 3.18769C3.41532 3.06256 3.55184 3 3.71001 3C3.86817 3 4.0045 3.06256 4.11901 3.18769C4.23351 3.31282 4.29096 3.46152 4.29134 3.63378C4.29172 3.80604 4.23428 3.95453 4.11901 4.07924L1.87812 6.51925ZM10.1213 6.48797L7.89538 4.0636C7.79006 3.94889 7.73741 3.80291 7.73741 3.62564C7.73741 3.44838 7.79006 3.30239 7.89538 3.18769C8.00069 3.07299 8.13473 3.01564 8.29749 3.01564C8.46024 3.01564 8.59428 3.07299 8.69959 3.18769L11.342 6.06566C11.3995 6.12822 11.4402 6.196 11.4644 6.26899C11.4885 6.34198 11.5004 6.42019 11.5 6.50361C11.4996 6.58703 11.4877 6.66523 11.4644 6.73823C11.441 6.81122 11.4002 6.879 11.342 6.94156L8.69959 9.81953C8.58471 9.94466 8.45067 10.0047 8.29749 9.99971C8.1443 9.99471 8.01027 9.92943 7.89538 9.80389C7.78049 9.67834 7.72305 9.52985 7.72305 9.35843C7.72305 9.187 7.78049 9.03831 7.89538 8.91234L10.1213 6.48797Z" fill="#7BA7AA"/>
</svg>`;

// Theme colors
const themeColors = {
  dark: {
    widgetBg: '#000000',
    blockBg: '#1A1A1A',
    textPrimary: '#FFFFFF',
    textSecondary: '#505050',
    placeholderOpacity: 0.10,
    checkboxStroke: '#626262',
    checkboxFilled: '#B0B0B0',
    todoCompleted: '#B0B0B0',
    addButtonText: '#666666',
    editIcon: '#3C3C3C',
  },
  light: {
    widgetBg: '#D4E8EA',
    blockBg: '#B8D9DC',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B8285',
    placeholderOpacity: 0.2,
    checkboxStroke: '#508B8E',
    checkboxFilled: '#508B8E',
    todoCompleted: '#6B8285',
    addButtonText: '#6B8285',
    editIcon: '#98B3B5',
  }
};

// Main Widget Component
function StickyProWidget() {
  const [mainHeading, setMainHeading] = useSyncedState<string>('mainHeading', '');
  const [blocks, setBlocks] = useSyncedState<Block[]>('blocks', [
    {
      id: 'initial-block',
      type: 'text',
      content: '',
      format: 'B1',
      listType: 'none',
      lines: [{ id: 'initial-line', text: '', format: 'B1' }],
    },
  ]);
  const [width, setWidth] = useSyncedState<360 | 480>('width', 360);
  const [focusedBlockId, setFocusedBlockId] = useSyncedState<string | null>('focusedBlockId', 'initial-block');
  const [focusedLineId, setFocusedLineId] = useSyncedState<string | null>('focusedLineId', null);
  const [showAddBlockToolbar, setShowAddBlockToolbar] = useSyncedState<boolean>('showAddBlockToolbar', false);
  const [showFormatDropdown, setShowFormatDropdown] = useSyncedState<boolean>('showFormatDropdown', false);
  const [theme, setTheme] = useSyncedState<'dark' | 'light'>('theme', 'dark');

  // Get focused block
  const focusedBlock = blocks.find((b) => b.id === focusedBlockId);

  // Get focused line for formatting
  const focusedLine = focusedBlock?.lines?.find((l) => l.id === focusedLineId);

  // Property Menu for native Figma toolbar
  // Note: The position of this menu is controlled by Figma and cannot be changed.
  usePropertyMenu(
    [
      // Text format buttons (only for text blocks)
      ...(focusedBlock?.type === 'text' ? [
        {
          itemType: 'action' as const,
          tooltip: 'H1',
          propertyName: 'format-h1',
        },
        {
          itemType: 'action' as const,
          tooltip: 'B1',
          propertyName: 'format-b1',
        },
        {
          itemType: 'action' as const,
          tooltip: 'C1',
          propertyName: 'format-c1',
        },
        {
          itemType: 'separator' as const,
        },
        {
          itemType: 'toggle' as const,
          tooltip: 'Bullet List',
          propertyName: 'list-bullet',
          isToggled: (focusedBlock?.listType || 'none') === 'bullet',
          icon: bulletIcon,
        },
        {
          itemType: 'toggle' as const,
          tooltip: 'Numbered List',
          propertyName: 'list-numbered',
          isToggled: (focusedBlock?.listType || 'none') === 'numbered',
          icon: numberedIcon,
        },
        {
          itemType: 'separator' as const,
        },
      ] : []),
      // Theme and Width toggle (for all blocks when focused)
      // Theme and Width toggle (always visible)
      {
        itemType: 'action' as const,
        tooltip: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        propertyName: 'toggle-theme',
        icon: theme === 'dark' ? lightThemeIcon : darkThemeIcon,
      },
      {
        itemType: 'separator' as const,
      },
      {
        itemType: 'action' as const,
        tooltip: width === 360 ? 'Expand Width' : 'Shrink Width',
        propertyName: 'toggle-width',
        icon: width === 360 ? expandIcon : shrinkIcon,
      },
    ],
    ({ propertyName }) => {
      // Handle width toggle
      if (propertyName === 'toggle-width') {
        toggleWidth();
        return;
      }

      // Handle theme toggle
      if (propertyName === 'toggle-theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
      }

      if (!focusedBlockId || !focusedBlock) return;

      // Handle format changes
      if (propertyName === 'format-h1' || propertyName === 'format-b1' || propertyName === 'format-c1') {
        const format = propertyName.split('-')[1].toUpperCase() as TextFormat;
        if (focusedLineId) {
          updateLineFormat(focusedBlockId, focusedLineId, format);
        } else {
          updateBlockFormat(focusedBlockId, format);
        }
      }

      // Handle list type changes
      if (propertyName === 'list-bullet') {
        const newListType = (focusedBlock.listType || 'none') === 'bullet' ? 'none' : 'bullet';
        updateBlockListType(focusedBlockId, newListType);
      }
      if (propertyName === 'list-numbered') {
        const newListType = (focusedBlock.listType || 'none') === 'numbered' ? 'none' : 'numbered';
        updateBlockListType(focusedBlockId, newListType);
      }
    }
  );

  // Handle block deletion
  const deleteBlock = (blockId: string) => {


    // Clear focus states FIRST if the deleted block was focused
    // This prevents the toolbar from trying to access a deleted block
    if (focusedBlockId === blockId) {
      setFocusedBlockId(null);
      setFocusedLineId(null);
    }

    // Then delete the block
    const newBlocks = blocks.filter((b) => b.id !== blockId);
    setBlocks(newBlocks);
  };

  // Handle adding new block
  const addBlock = (type: BlockType) => {
    const blockId = generateId();
    const newBlock: Block = {
      id: blockId,
      type,
      content: '',
      ...(type === 'text' && {
        format: 'B1',
        listType: 'none',
        lines: [{ id: generateId(), text: '', format: 'B1' }]
      }),
      ...(type === 'todo' && {
        todos: [{ id: generateId(), text: '', completed: false }]
      }),
    };

    setBlocks([...blocks, newBlock]);
    setFocusedBlockId(blockId);
    setShowAddBlockToolbar(false);
  };

  // Add line to text block
  const addLineToBlock = (blockId: string, afterLineId?: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === blockId && (b.type === 'text' || b.type === 'code')) {
          const lines = b.lines || [{ id: generateId(), text: b.content || '', format: b.format || 'B1' }];
          const newLine: TextLine = {
            id: generateId(),
            text: '',
            format: lines[lines.length - 1]?.format || 'B1',
          };

          if (afterLineId) {
            const index = lines.findIndex(l => l.id === afterLineId);
            const newLines = [
              ...lines.slice(0, index + 1),
              newLine,
              ...lines.slice(index + 1),
            ];
            return { ...b, lines: newLines };
          }

          return { ...b, lines: [...lines, newLine] };
        }
        return b;
      })
    );
  };

  // Update line in text block
  const updateLineInBlock = (blockId: string, lineId: string, text: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === blockId && (b.type === 'text' || b.type === 'code')) {
          const lines = b.lines || [];
          return {
            ...b,
            lines: lines.map(l => l.id === lineId ? { ...l, text } : l)
          };
        }
        return b;
      })
    );
  };

  // Update line format in text block
  const updateLineFormat = (blockId: string, lineId: string, format: TextFormat) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || (b.type !== 'text' && b.type !== 'code')) return b;
        return {
          ...b,
          lines: (b.lines || []).map(l => l.id === lineId ? { ...l, format } : l)
        };
      })
    );
  };

  // Delete line from text block
  const deleteLineFromBlock = (blockId: string, lineId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || (b.type !== 'text' && b.type !== 'code')) return b;

        const lines = (b.lines || []).filter(l => l.id !== lineId);
        // If no lines left, keep at least one empty line
        return {
          ...b,
          lines: lines.length === 0 ? [{ id: generateId(), text: '', format: 'B1' }] : lines
        };
      })
    );
  };

  // Update block content
  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, content } : b));
  };

  // Update block format
  const updateBlockFormat = (blockId: string, format: TextFormat) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, format } : b));
    setShowFormatDropdown(false);
  };

  // Update block list type
  const updateBlockListType = (blockId: string, listType: ListType) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, listType } : b));
  };

  // Toggle width
  const toggleWidth = () => {
    setWidth(width === 360 ? 480 : 360);
  };

  // Add todo item
  const addTodoItem = (blockId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;
        const newTodo: TodoItem = {
          id: generateId(),
          text: '',
          completed: false,
        };
        return { ...b, todos: [...(b.todos || []), newTodo] };
      })
    );
  };

  // Update todo item
  const updateTodoItem = (blockId: string, todoId: string, text: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;
        return {
          ...b,
          todos: (b.todos || []).map((t) => t.id === todoId ? { ...t, text } : t)
        };
      })
    );
  };

  // Toggle todo completion
  const toggleTodoCompletion = (blockId: string, todoId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;
        return {
          ...b,
          todos: (b.todos || []).map((t) => t.id === todoId ? { ...t, completed: !t.completed } : t)
        };
      })
    );
  };

  // Insert block after a specific block
  const insertBlockAfter = (blockId: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const newBlock: Block = {
      id: generateId(),
      type: 'text',
      content: '',
      format: 'B1',
      listType: 'none',
      lines: [{ id: generateId(), text: '', format: 'B1' }],
    };

    const newBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1),
    ];
    setBlocks(newBlocks);
  };

  // Insert todo item after a specific todo
  const insertTodoAfter = (blockId: string, todoId: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'todo') return b;

        const todos = b.todos || [];
        const todoIndex = todos.findIndex((t) => t.id === todoId);
        if (todoIndex === -1) return b;

        const newTodo: TodoItem = {
          id: generateId(),
          text: '',
          completed: false,
        };

        return {
          ...b,
          todos: [
            ...todos.slice(0, todoIndex + 1),
            newTodo,
            ...todos.slice(todoIndex + 1),
          ]
        };
      })
    );
  };

  // Get current theme colors
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      width={width}
      fill={colors.widgetBg}
      cornerRadius={20}
      overflow="visible"
    >
      {/* Main Content Container */}
      <AutoLayout
        direction="vertical"
        spacing={0}
        width={width}
        padding={12}
        fill={colors.widgetBg}
        cornerRadius={20}
        overflow="visible"
      >
        {/* Main Heading */}
        <MainHeading
          value={mainHeading}
          onChange={setMainHeading}
          width={width - 40}
          theme={theme}
          onFocus={() => {
            setFocusedBlockId(null);
            setFocusedLineId(null);
          }}
        />

        {/* Blocks */}
        {blocks.map((block, index) => (
          <BlockComponent
            key={block.id}
            block={block}
            width={width - 24}
            isFirst={index === 0}
            isFocused={focusedBlockId === block.id}
            theme={theme}
            onFocus={() => {
              // Only update if actually changing blocks for better performance
              if (focusedBlockId !== block.id) {
                setFocusedLineId(null);
                setFocusedBlockId(block.id);
              }
            }}
            onBlur={() => setFocusedBlockId(null)}
            onDelete={() => deleteBlock(block.id)}
            onContentChange={(content) => updateBlockContent(block.id, content)}
            onInsertAfter={() => insertBlockAfter(block.id)}
            onAddLine={(afterLineId) => addLineToBlock(block.id, afterLineId)}
            onUpdateLine={(lineId, text) => updateLineInBlock(block.id, lineId, text)}
            onUpdateLineFormat={(lineId, format) => updateLineFormat(block.id, lineId, format)}
            onDeleteLine={(lineId) => deleteLineFromBlock(block.id, lineId)}
            onLineClick={(lineId) => setFocusedLineId(lineId)}
            onAddTodo={() => addTodoItem(block.id)}
            onUpdateTodo={(todoId, text) => updateTodoItem(block.id, todoId, text)}
            onToggleTodo={(todoId) => toggleTodoCompletion(block.id, todoId)}
            onInsertTodoAfter={(todoId) => insertTodoAfter(block.id, todoId)}
          />
        ))}

        {/* Add Block Button */}
        <AutoLayout
          direction="horizontal"
          spacing={6}
          padding={{ top: 12, bottom: 0, left: 0, right: 0 }}
          width="hug-contents"
          onClick={() => setShowAddBlockToolbar(!showAddBlockToolbar)}
        >
          <Text
            fontSize={12}
            fontFamily="Inter"
            fontWeight={400}
            fill={colors.addButtonText}
            horizontalAlignText="center"
          >
            + Add new block
          </Text>
        </AutoLayout>
      </AutoLayout>

      {/* Add Block Menu - Positioned at bottom with 32px gap */}
      {showAddBlockToolbar && (
        <AutoLayout
          direction="horizontal"
          width="hug-contents"
          positioning="absolute"
          y={{ type: 'bottom', offset: -56 }}
          x={{ type: 'center', offset: 0 }}
        >
          <AddBlockMenu
            onAddText={() => addBlock('text')}
            onAddTodo={() => addBlock('todo')}
            onAddCode={() => addBlock('code')}
          />
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

// Main Heading Component
function MainHeading({ value, onChange, width, theme, onFocus }: { value: string; onChange: (v: string) => void; width: number; theme: 'dark' | 'light'; onFocus?: () => void }) {
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

// Block Component
function BlockComponent({
  block,
  width,
  isFirst,
  onFocus,
  onBlur,
  onDelete,
  onContentChange,
  onInsertAfter,
  onAddLine,
  onUpdateLine,
  onUpdateLineFormat,
  onDeleteLine,
  onLineClick,
  onAddTodo,
  onUpdateTodo,
  onToggleTodo,
  onInsertTodoAfter,
  isFocused,
  theme,
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  isFocused?: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onInsertAfter?: () => void;
  onAddLine?: (afterLineId: string) => void;
  onUpdateLine?: (lineId: string, text: string) => void;
  onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
  onDeleteLine?: (lineId: string) => void;
  onLineClick?: (lineId: string) => void;
  onAddTodo?: () => void;
  onUpdateTodo?: (todoId: string, text: string) => void;
  onToggleTodo?: (todoId: string) => void;
  onInsertTodoAfter?: (todoId: string) => void;
}) {
  if (block.type === 'text' || block.type === 'code') {
    return (
      <TextBlock
        block={block}
        width={width}
        isFirst={isFirst}
        isFocused={!!isFocused}
        theme={theme}
        onFocus={onFocus}
        onBlur={onBlur}
        onDelete={onDelete}
        onContentChange={onContentChange}
        onInsertAfter={onInsertAfter}
        onAddLine={onAddLine}
        onUpdateLine={onUpdateLine}
        onUpdateLineFormat={onUpdateLineFormat}
        onDeleteLine={onDeleteLine}
        onLineClick={onLineClick}
      />
    );
  } else {
    return (
      <TodoBlock
        block={block}
        width={width}
        isFirst={isFirst}
        isFocused={!!isFocused}
        theme={theme}
        onFocus={onFocus}
        onBlur={onBlur}
        onDelete={onDelete}
        onAddTodo={onAddTodo!}
        onUpdateTodo={onUpdateTodo!}
        onToggleTodo={onToggleTodo!}
        onInsertTodoAfter={onInsertTodoAfter!}
      />
    );
  }
}

// Text Block Component
function TextBlock({
  block,
  width,
  isFirst,
  isFocused,
  theme,
  onFocus,
  onBlur,
  onDelete,
  onContentChange,
  onInsertAfter,
  onAddLine,
  onUpdateLine,
  onUpdateLineFormat,
  onDeleteLine,
  onLineClick,
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  isFocused: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onInsertAfter?: () => void;
  onAddLine?: (afterLineId: string) => void;
  onUpdateLine?: (lineId: string, text: string) => void;
  onUpdateLineFormat?: (lineId: string, format: TextFormat) => void;
  onDeleteLine?: (lineId: string) => void;
  onLineClick?: (lineId: string) => void;
}) {
  const colors = themeColors[theme];

  // Code blocks use single multi-line input
  if (block.type === 'code') {
    return (
      <AutoLayout
        direction="horizontal"
        spacing={0}
        width={width}
        padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
        overflow="visible"
      >
        <AutoLayout
          direction="vertical"
          spacing={4}
          width="fill-parent"
          padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
          fill={colors.blockBg}
          cornerRadius={10}
          overflow="visible"
          onClick={onFocus}
        >
          {/* Close button */}
          {isFocused && <CloseButton onClick={onDelete} />}

          <Input
            inputBehavior="multiline"
            placeholder="<Type code>"
            value={block.content}
            onTextEditEnd={(e) => onContentChange(e.characters)}
            onClick={onFocus}
            fontSize={14}
            fontFamily="IBM Plex Mono"
            fontWeight={400}
            fill={colors.textPrimary}
            width="fill-parent"
            inputFrameProps={{
              fill: '#00000000',
              padding: 0,
            }}
          />
        </AutoLayout>
      </AutoLayout>
    );
  }

  // Text blocks use existing line-based approach
  const lines = block.lines || [{ id: generateId(), text: block.content || '', format: block.format || 'B1' }];
  return (
    <AutoLayout
      direction="horizontal"
      spacing={0}
      width={width}
      padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
      overflow="visible"
    >
      <AutoLayout
        direction="vertical"
        spacing={4}
        width="fill-parent"
        padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
        fill={colors.blockBg}
        cornerRadius={10}
        overflow="visible"
        onClick={onFocus}
      >
        {/* Close button - positioned outside clickable area */}
        {isFocused && <CloseButton onClick={onDelete} />}

        {/* Clickable area for focusing */}
        <AutoLayout
          direction="vertical"
          spacing={8} // Change this to update gap between text lines
          width="fill-parent"
        >

          {/* Multiple Lines */}
          {lines.map((line, index) => {
            const { fontSize, fontWeight } = getTextFormat(line.format);
            const listType = block.listType || 'none';

            return (
              <AutoLayout
                key={line.id}
                direction="horizontal"
                spacing={8}
                verticalAlignItems="start"
                width="fill-parent"
              >
                {/* List Marker */}
                {listType !== 'none' && (
                  <Text
                    fontSize={fontSize}
                    fontFamily="Inter"
                    fontWeight={fontWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}
                    fill={colors.textPrimary}
                    width={24}
                    horizontalAlignText="right"
                  >
                    {listType === 'bullet' ? '•' : `${index + 1}.`}
                  </Text>
                )}

                <AutoLayout
                  width="fill-parent"
                  height="hug-contents"
                >

                  <Input
                    inputBehavior="multiline"
                    placeholder={"Type"}
                    value={line.text}
                    onClick={() => {
                      onFocus();
                      if (onLineClick) onLineClick(line.id);
                    }}
                    onTextEditEnd={(e) => onUpdateLine && onUpdateLine(line.id, e.characters)}
                    fontSize={fontSize}
                    fontFamily={block.type === 'code' ? "IBM Plex Mono" : "Inter"}
                    fontWeight={fontWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}
                    fill={colors.textPrimary}
                    width="fill-parent"
                    inputFrameProps={{
                      fill: '#00000000',
                      padding: 0,
                    }}
                  />
                </AutoLayout>
              </AutoLayout>
            );
          })}

          {/* Add line button at bottom */}
          {onAddLine && lines.length > 0 && (
            <AutoLayout
              direction="horizontal"
              spacing={4}
              padding={{ top: 4, bottom: 0, left: 0, right: 0 }}
              verticalAlignItems="center"
              width="hug-contents"
              onClick={() => {
                if (lines.length > 0) {
                  onAddLine(lines[lines.length - 1].id);
                }
              }}
            >
              <SVG
                src={`<svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.42857 6.57143H2.57143C2.40953 6.57143 2.27391 6.51657 2.16457 6.40686C2.05524 6.29714 2.00038 6.16153 2 6C1.99962 5.83848 2.05448 5.70286 2.16457 5.59314C2.27467 5.48343 2.41029 5.42857 2.57143 5.42857H5.42857V2.57143C5.42857 2.40953 5.48343 2.27391 5.59314 2.16457C5.70286 2.05524 5.83848 2.00038 6 2C6.16153 1.99962 6.29734 2.05448 6.40743 2.16457C6.51753 2.27467 6.57219 2.41029 6.57143 2.57143V5.42857H9.42857C9.59048 5.42857 9.72629 5.48343 9.836 5.59314C9.94572 5.70286 10.0004 5.83848 10 6C9.99962 6.16153 9.94476 6.29734 9.83543 6.40743C9.7261 6.51753 9.59048 6.57219 9.42857 6.57143H6.57143V9.42857C6.57143 9.59048 6.51657 9.72629 6.40686 9.836C6.29714 9.94572 6.16153 10.0004 6 10C5.83848 9.99962 5.70286 9.94476 5.59314 9.83543C5.48343 9.7261 5.42857 9.59048 5.42857 9.42857V6.57143Z" fill="${colors.addButtonText}"/>
</svg>`}
              />
              <Text fontSize={10} lineHeight={8} fontFamily="Inter" fontWeight={400} fill={colors.addButtonText}>
                {block.listType && block.listType !== 'none' ? 'Next list' : 'Add'}
              </Text>
            </AutoLayout>
          )}
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}



// Todo Block Component
function TodoBlock({
  block,
  width,
  isFirst,
  onFocus,
  onBlur,
  onDelete,
  onAddTodo,
  onUpdateTodo,
  onToggleTodo,
  onInsertTodoAfter,
  isFocused,
  theme,
}: {
  block: Block;
  width: number;
  isFirst: boolean;
  isFocused: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  onAddTodo: () => void;
  onUpdateTodo: (todoId: string, text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onInsertTodoAfter?: (todoId: string) => void;
}) {
  const colors = themeColors[theme];
  const todos = block.todos || [];

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      width={width}
      padding={{ top: isFirst ? 0 : 8, bottom: 8, left: 0, right: 0 }}
      overflow="visible"
    >
      <AutoLayout
        direction="vertical"
        spacing={8}
        width={width}
        padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
        fill={colors.blockBg}
        cornerRadius={10}
        overflow="visible"
        onClick={onFocus}
      >
        {/* Close button */}
        {isFocused && <CloseButton onClick={onDelete} />}

        {/* Todo Items */}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            width={width - 36}
            theme={theme}
            onUpdate={(text) => onUpdateTodo(todo.id, text)}
            onToggle={() => onToggleTodo(todo.id)}
            onFocus={onFocus}
          />
        ))}

        {/* Add Todo Button */}
        {(isFocused || (todos.length > 0 && todos[todos.length - 1].text.length > 0)) && (
          <AutoLayout
            direction="horizontal"
            spacing={4}
            padding={{ top: 4, bottom: 0, left: 0, right: 0 }}
            verticalAlignItems="center"
            width="hug-contents"
            onClick={onAddTodo}
          >
            <SVG
              src={`<svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.42857 6.57143H2.57143C2.40953 6.57143 2.27391 6.51657 2.16457 6.40686C2.05524 6.29714 2.00038 6.16153 2 6C1.99962 5.83848 2.05448 5.70286 2.16457 5.59314C2.27467 5.48343 2.41029 5.42857 2.57143 5.42857H5.42857V2.57143C5.42857 2.40953 5.48343 2.27391 5.59314 2.16457C5.70286 2.05524 5.83848 2.00038 6 2C6.16153 1.99962 6.29734 2.05448 6.40743 2.16457C6.51753 2.27467 6.57219 2.41029 6.57143 2.57143V5.42857H9.42857C9.59048 5.42857 9.72629 5.48343 9.836 5.59314C9.94572 5.70286 10.0004 5.83848 10 6C9.99962 6.16153 9.94476 6.29734 9.83543 6.40743C9.7261 6.51753 9.59048 6.57219 9.42857 6.57143H6.57143V9.42857C6.57143 9.59048 6.51657 9.72629 6.40686 9.836C6.29714 9.94572 6.16153 10.0004 6 10C5.83848 9.99962 5.70286 9.94476 5.59314 9.83543C5.48343 9.7261 5.42857 9.59048 5.42857 9.42857V6.57143Z" fill="${colors.addButtonText}"/>
</svg>`}
            />
            <Text fontSize={10} lineHeight={12} fontFamily="Inter" fontWeight={400} fill={colors.addButtonText}>
              Add list
            </Text>
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  );
}

// Todo Item Component
function TodoItem({
  todo,
  width,
  theme,
  onUpdate,
  onToggle,
  onFocus,
}: {
  todo: TodoItem;
  width: number;
  theme: 'dark' | 'light';
  onUpdate: (text: string) => void;
  onToggle: () => void;
  onFocus?: () => void;
}) {
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="horizontal"
      spacing={12}
      width={width}
      verticalAlignItems="center"
    >
      {/* Checkbox */}
      <AutoLayout
        width={16}
        height={16}
        fill={todo.completed ? colors.checkboxFilled : '#00000000'}
        stroke={todo.completed ? colors.checkboxFilled : colors.checkboxStroke}
        strokeWidth={1.6}
        cornerRadius={4}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={onToggle}
      >
        {todo.completed && (
          <SVG
            src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 3L4.5 8.5L2 6" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}
          />
        )}
      </AutoLayout>

      {/* Todo Text */}
      <Input
        value={todo.text}
        placeholder={`To do`}
        onClick={() => {
          if (onFocus) onFocus();
        }}
        onTextEditEnd={(e) => onUpdate(e.characters)}
        fontSize={14}
        fontFamily="Inter"
        fontWeight={400}
        textDecoration={todo.completed ? 'strikethrough' : 'none'}
        fill={todo.completed ? colors.todoCompleted : colors.textPrimary}
        width={width - 24}
        inputFrameProps={{
          fill: '#00000000',
          padding: 0,
        }}
      />
    </AutoLayout>
  );
}



// Add Block Menu Component
function AddBlockMenu({ onAddText, onAddTodo, onAddCode }: { onAddText: () => void; onAddTodo: () => void; onAddCode: () => void }) {
  return (
    <AutoLayout
      name="AddBlock"
      cornerRadius={8}
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
          right: 12,
          bottom: 8,
          left: 12,
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
          right: 12,
          bottom: 8,
          left: 12,
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
          right: 12,
          bottom: 8,
          left: 12,
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



// Close Button Component
function CloseButton({ onClick }: { onClick: () => void }) {
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


// Helper Functions
function getTextFormat(format: TextFormat): { fontSize: number; fontWeight: number; lineHeight: number } {
  switch (format) {
    case 'H1':
      return { fontSize: 16, fontWeight: 700, lineHeight: 24 };
    case 'B1':
      return { fontSize: 14, fontWeight: 400, lineHeight: 22 };
    case 'C1':
      return { fontSize: 10, fontWeight: 400, lineHeight: 17 };
  }
}

function getIconSymbol(icon: string): string {
  switch (icon) {
    case 'bulletList':
      return '\u2022'; // Bullet
    case 'numberedList':
      return '1.';
    case 'expand':
      return '< >';
    case 'collapse':
      return '> <';
    case 'theme':
      return '\u2600'; // Sun
    case 'dropdown':
      return '\u25BE'; // Down triangle
    default:
      return '';
  }
}

widget.register(StickyProWidget);
