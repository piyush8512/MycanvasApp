export const TOOLS = ['Select', 'Pan', 'Add'];

export const CARD_TYPES = [
  { type: 'link', label: 'Add Link', icon: 'Link', color: '#3B82F6' },
  { type: 'pdf', label: 'Add PDF', icon: 'File', color: '#EF4444' },
  { type: 'note', label: 'Add Note', icon: 'StickyNote', color: '#EAB308' },
  { type: 'folder', label: 'Add Folder', icon: 'Folder', color: '#6B7280' },
  { type: 'image', label: 'Add Image', icon: 'ImageIcon', color: '#8B5CF6' },
];

export const INITIAL_CANVAS_ITEMS = [
  {
    id: '1',
    type: 'pdf',
    name: 'PDF notes',
    position: { x: 120, y: 180 },
    size: { width: 200, height: 280 },
    collaborators: ['user1', 'user2'],
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    color: '#FECACA',
  },
  {
    id: '2',
    type: 'youtube',
    name: 'YouTube Video',
    position: { x: 120, y: 320 },
    size: { width: 280, height: 160 },
    collaborators: ['user3'],
    videoId: 'dQw4w9WgXcQ',
    color: '#FECACA',
  },
  {
    id: '3',
    type: 'note',
    name: 'My Note',
    position: { x: 420, y: 180 },
    size: { width: 200, height: 150 },
    collaborators: ['user4'],
    content: 'This is an editable note. Tap to edit!',
    color: '#FEF08A',
  },
  {
    id: '4',
    type: 'folder',
    name: 'Resources',
    position: { x: 420, y: 450 },
    size: { width: 200, height: 50 },
    collaborators: ['user4'],
    items: [
      {
        id: '4-1',
        type: 'link',
        name: 'Important Link',
        url: 'https://example.com',
      },
    ],
    color: '#E5E7EB',
  },
  {
    id: '5',
    type: 'image',
    name: 'Sample Image',
    position: { x: 650, y: 180 },
    size: { width: 200, height: 200 },
    collaborators: ['user1'],
    url: 'https://picsum.photos/200',
    color: '#E9D5FF',
  },
  {
    id: '6',
    type: 'link',
    name: 'Example Website',
    position: { x: 650, y: 400 },
    size: { width: 200, height: 100 },
    collaborators: ['user2'],
    url: 'https://example.com',
    color: '#BFDBFE',
  },
];