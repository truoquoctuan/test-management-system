const TagItem = ({ tag, handleTagSelect, handleTagDelete }) => (
    <div className="flex items-center justify-between gap-4 p-1">
        <div
            className={`flex items-center gap-2 ${tag.selected ? 'bg-gray-200' : ''}`}
            onClick={() => handleTagSelect(tag.id)}
        >
            <div className={`h-4 w-4 ${tag.color}`} />
            <p>{tag.name}</p>
        </div>
        <button onClick={() => handleTagDelete(tag.id)}>Delete</button>
    </div>
);

export default TagItem;
