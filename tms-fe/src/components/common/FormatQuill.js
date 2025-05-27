import hljs from 'highlight.js';
import { Quill } from 'react-quill';

const labelColor = [
    { id: 1, colorCode: '#B9BCFF' },
    { id: 2, colorCode: '#FABDFC' },
    { id: 3, colorCode: '#FFC2C2' },
    { id: 4, colorCode: '#FFDDBD' },
    { id: 5, colorCode: '#F97316' },
    { id: 6, colorCode: '#FACC15' },
    { id: 7, colorCode: '#EC4899' },
    { id: 8, colorCode: '#D946EF' },
    { id: 9, colorCode: '#3B82F6' },
    { id: 10, colorCode: '#6366F1' },
    { id: 11, colorCode: '#8B5CF6' },
    { id: 12, colorCode: '#0EA5E9' },
    { id: 13, colorCode: '#4ADE80' },
    { id: 14, colorCode: '#84CC16' },
    { id: 15, colorCode: '#10B981' },
    { id: 16, colorCode: '#2DD4BF' },
    { id: 17, colorCode: '#9c5c5c' },
    { id: 18, colorCode: '#e63e3e' },
    { id: 19, colorCode: '#ed0c0c' },
    { id: 20, colorCode: '#8f0606' }
];
export default labelColor;
export const colorDesc = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#0000FF',
    '#00FF00',
    '#FFFF00',
    '#FFA500',
    '#FFC0CB',
    '#800080',
    '#A52A2A',
    '#808080',
    '#000080',
    '#ADD8E6',
    '#90EE90',
    '#FFFFE0',
    '#8A2BE2',
    '#FFD700',
    '#32CD32',
    '#FF4500',
    '#DA70D6',
    '#00CED1',
    '#FF6347',
    '#008080',
    '#DAA520',
    '#6A5ACD',
    '#FF69B4',
    '#CD5C5C',
    '#556B2F',
    '#9400D3',
    '#F08080',
    '#2F4F4F',
    '#4B0082',
    '#DC143C',
    '#00FA9A',
    '#BDB76B',
    '#696969',
    '#20B2AA',
    '#9370DB',
    '#FF7F50',
    '#1E90FF',
    '#FF8C00',
    '#9932CC'
];

export const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'color',
    'indent',
    'background',
    'align',
    'image',
    'size',
    'font',
    'video'
];

hljs.configure({
    languages: ['javascript', 'python', 'ruby', 'java'] // Thêm ngôn ngữ bạn cần
});
export const modulesImage = {
    toolbar: [
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ size: [] }],
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'video', 'code-block'],
        [{ color: colorDesc }],
        [
            {
                background: colorDesc
            }
        ],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: true
    },
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
    }
};

export const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'video'],
        [{ color: colorDesc }],
        [
            {
                background: colorDesc
            }
        ],
        ['clean']
    ]
};
