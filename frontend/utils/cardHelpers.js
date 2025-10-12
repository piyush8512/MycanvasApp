export function getColorForType(type) {
  const colors = {
    link: '#BFDBFE',
    pdf: '#FECACA',
    note: '#FEF08A',
    folder: '#E5E7EB',
    image: '#E9D5FF',
    youtube: '#FECACA',
  };
  return colors[type] || '#FFFFFF';
}

export function getDefaultPropertiesForType(type) {
  const defaults = {
    note: {
      content: 'Double tap to edit this note',
    },
    folder: {
      items: [],
      size: { width: 200, height: 50 },
    },
    link: {
      url: 'https://example.com',
    },
    pdf: {
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    youtube: {
      videoId: 'dQw4w9WgXcQ',
    },
    image: {
      url: 'https://picsum.photos/200',
    },
  };
  return defaults[type] || {};
}