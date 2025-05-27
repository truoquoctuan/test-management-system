// export default tagsIssuesimport { useMutation, useQuery } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { DELETE_LABELS, GET_ALL_LABEL_INTEST_PLAN, SAVE_LABEL } from 'apis/repository/test-case';
import Icon from 'components/icons/icons';
import useOutsideClick from 'hook/useOutsideClick';
import { useRef, useState } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const TagsEdit = ({
    tags,
    setTags,
    modalSelectTestcase,
    refetch,
    setModalSelectTestcase,
    // eslint-disable-next-line no-unused-vars
    handleModifylabel
}) => {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [color, setColor] = useState('#ee321a');
    const { testPlanId } = useParams();
    const colorPickerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const modalRef1 = useRef(null);
    const [newTag, setNewTag] = useState('');
    const [idEditLabel, setIdEditLabel] = useState(null);
    const [editTag, setEditTag] = useState({ labelName: '', labelColor: color });
    const [isColorEdit, setIsColorEdit] = useState(false);
    const editRef = useRef(null);
    const handleTagSelect = (e, label) => {
        const updatedTags = e.target.checked ? [...tags, label] : tags.filter((item) => item.labelId !== label.labelId);
        setTags(updatedTags);
    };

    //    Danh sách lable
    const { data: listLabel } = useQuery(GET_ALL_LABEL_INTEST_PLAN, {
        client: clientRepo,
        variables: { testPlanId: parseInt(testPlanId), labelTypes: [2], labelName: searchTerm, page: 0, size: 100 }
    });
    //    Xóa lable
    const [delete_Label] = useMutation(DELETE_LABELS, {
        client: clientRepo,
        refetchQueries: [
            {
                query: GET_ALL_LABEL_INTEST_PLAN,
                variables: { testPlanId: parseInt(testPlanId), labelTypes: [2], labelName: '', page: 0, size: 100 }
            }
        ]
    });

    const handleTagDelete = async (id) => {
        const data = await delete_Label({ variables: { labelIds: [parseInt(id)] } });
        if (data?.data?.deleteLabels === false) {
            toast.error('The tag is currently attached to an issue.');
        } else {
            await refetch();
            setTags(tags?.filter((item) => item.labelId !== id));
        }
    };
    // End

    // Thêm lable
    const [save_Label] = useMutation(SAVE_LABEL, {
        client: clientRepo,
        refetchQueries: [
            {
                query: GET_ALL_LABEL_INTEST_PLAN,
                variables: { testPlanId: parseInt(testPlanId), labelTypes: [2], labelName: '', page: 0, size: 100 }
            }
        ]
    });

    const handleSavedTag = (id) => {
        if (newTag.trim() !== '') {
            if (newTag.length < 31) {
                save_Label({
                    variables: {
                        labelColor: color,
                        labelId: id ? id : null,
                        labelType: 2,
                        labelName: newTag,
                        testPlanId: parseInt(testPlanId)
                    }
                });

                setNewTag('');
                setIsColorPickerOpen(false);
            } else {
                toast.error('Maximum 30 characters');
            }
        } else {
            toast.error('Please enter information');
        }
    };
    // Sửa lable
    const handleEditSave = async (id) => {
        if (editTag.labelName.trim() !== '') {
            if (editTag.labelName.length < 31) {
                await save_Label({
                    variables: {
                        labelColor: color,
                        labelId: id,
                        labelType: 2,
                        labelName: editTag.labelName,
                        testPlanId: parseInt(testPlanId)
                    }
                });
                await refetch();
                setIdEditLabel(null);
                setIsColorEdit(false);
            } else {
                toast.error('Maximum 30 characters');
            }
        } else {
            toast.error('Please enter information');
        }
    };

    useOutsideClick(modalRef1, () => {
        setModalSelectTestcase(false);
        handleModifylabel();
    });

    return (
        <div className="w-[360px]">
            <div className="relative " ref={modalRef1}>
                {modalSelectTestcase && (
                    <div className=" absolute z-[30] w-full border bg-white px-2 pt-2">
                        <div className="mb-1.5 flex justify-between">
                            <p className="text-sm font-semibold">Tags</p>
                            <Icon
                                name="close"
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                    setModalSelectTestcase(false), handleModifylabel();
                                }}
                            />
                        </div>

                        <div className="relative w-full border p-1">
                            <div className="absolute top-1">
                                <Icon name="search" className="fill-[#787878]" />
                            </div>
                            <input
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className=" w-[95%] pl-8 placeholder:text-sm focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        {/* Danh sách lable */}
                        <div className=" ">
                            <div
                                className={` z-999 ${
                                    isColorEdit ? '' : 'custom-scroll-y max-h-[400px] min-h-[150px] '
                                } `}
                            >
                                {listLabel?.getAllLabel?.labels?.map((tag) => (
                                    <div
                                        key={tag.labelId}
                                        className={` group relative mt-[2px] flex cursor-pointer items-center justify-between px-2 hover:bg-slate-200 ${
                                            idEditLabel === tag.labelId && 'bg-slate-200'
                                        }`}
                                        ref={idEditLabel === tag.labelId ? editRef : null}
                                    >
                                        <div className="flex h-[38px] w-full items-center gap-2">
                                            {idEditLabel !== tag.labelId && (
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4"
                                                    defaultChecked={tags
                                                        ?.map((item) => item?.labelId)
                                                        ?.includes(tag.labelId)}
                                                    onChange={(e) => handleTagSelect(e, tag)}
                                                />
                                            )}
                                            {idEditLabel === tag.labelId ? (
                                                <>
                                                    <div
                                                        className={`flex cursor-pointer items-center gap-2   `}
                                                        onClick={() => setIsColorEdit(!isColorEdit)}
                                                    >
                                                        <p className="h-4 w-4" style={{ backgroundColor: color }}></p>
                                                        <Icon name="caret_right" className="rotate-90" />
                                                    </div>
                                                    {isColorEdit && (
                                                        <div
                                                            className="absolute  top-10 z-[999]  border bg-white p-2"
                                                            ref={colorPickerRef}
                                                        >
                                                            <div className="">
                                                                <ColorPicker
                                                                    height={200}
                                                                    hideControls={true}
                                                                    hideOpacity={true}
                                                                    value={color}
                                                                    onChange={setColor}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p
                                                    className={`h-[16px] w-[16px]`}
                                                    style={{ backgroundColor: tag.labelColor }}
                                                ></p>
                                            )}

                                            {idEditLabel === tag.labelId ? (
                                                <>
                                                    <div className="flex w-full ">
                                                        <input
                                                            defaultValue={editTag.labelName}
                                                            autoFocus
                                                            onChange={(e) =>
                                                                setEditTag({ ...editTag, labelName: e.target.value })
                                                            }
                                                            className="w-full border border-white px-2 text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                        <div
                                                            className="flex cursor-pointer items-center  px-2 py-1 text-white"
                                                            onClick={() => handleEditSave(tag.labelId)}
                                                        >
                                                            <Icon name="check_circle" className="fill-[#2A9C58]" />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-sm font-normal">{tag.labelName}</p>
                                            )}
                                        </div>
                                        {idEditLabel === null && (
                                            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform gap-2 opacity-0 group-hover:opacity-100">
                                                <Icon
                                                    name="edit"
                                                    className="h-4 w-4 fill-[#B3B3B3] hover:fill-[#1D79ED]"
                                                    onClick={() => {
                                                        setIdEditLabel(tag.labelId);
                                                        setColor(tag.labelColor);
                                                        setEditTag({
                                                            labelName: tag.labelName,
                                                            labelColor: tag.labelColor
                                                        });
                                                        setTags(tags?.filter((item) => item.labelId !== tag.labelId));
                                                    }}
                                                />
                                                <Icon
                                                    name="delete"
                                                    className="fill-[#B3B3B3] hover:fill-red-500"
                                                    onClick={() => handleTagDelete(tag.labelId)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Form thêm lable */}
                            <div className="z-[30] mt-2 border-t px-2">
                                <div className=" mb-1 flex items-center gap-2">
                                    <div className="">
                                        <div
                                            className={`flex cursor-pointer items-center gap-2   `}
                                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                        >
                                            <p className="h-5 w-5" style={{ backgroundColor: color }}></p>
                                            <Icon name="caret_right" className="rotate-90" />
                                        </div>
                                        {isColorPickerOpen && (
                                            <div
                                                className="absolute z-[30] mt-2  border bg-white p-2"
                                                ref={colorPickerRef}
                                            >
                                                <ColorPicker
                                                    height={200}
                                                    hideControls={true}
                                                    hideOpacity={true}
                                                    value={color}
                                                    onChange={setColor}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {/* Input thêm tag */}
                                    <input
                                        placeholder="Add new tag"
                                        value={newTag}
                                        autoFocus
                                        onChange={(e) => setNewTag(e.target.value)}
                                        className="w-full  px-2 py-1 placeholder:text-sm  focus:outline-none"
                                    />
                                    <div
                                        className="flex cursor-pointer items-center  px-2 py-1 text-white"
                                        onClick={() => handleSavedTag(null)}
                                    >
                                        <Icon name="check_circle" className="fill-[#2A9C58]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagsEdit;
