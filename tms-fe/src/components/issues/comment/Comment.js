import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { LIST_MEMBER_TEST_PLAND } from 'apis/apollo/test-plan/mutation';
import AttachFile from 'components/AttachFile/AttachFile';
import UploadImage from 'components/AttachFile/UploadImage';
import { modulesImage } from 'components/common/FormatQuill';
import 'highlight.js/styles/github.css';
import ImageResize from 'quill-image-resize-module-react';
import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
Quill.register('modules/imageResize', ImageResize);
const Comment = ({
    addComment,
    setStringIdMember,
    taggedUsers,
    setTaggedUsers,
    quillRef,
    setCommentText,
    commentText,
    currentLevel,
    dataEditComment
}) => {
    const [showUserList, setShowUserList] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState([]); // Trạng thái mới để lưu trữ danh sách thành viên đã lọc
    const [listMemberComment, setListMemberComment] = useState(null);
    const [isOpenReact, setIsOpenReact] = useState(false);
    const memberRef = useRef(null);
    const { testPlanId } = useParams();

    const { data: listMemberTestLand } = useQuery(LIST_MEMBER_TEST_PLAND, {
        client: clientRepo,
        variables: { page: 0, size: 30, testPlanId: testPlanId }
    });

    useEffect(() => {
        if (listMemberTestLand) {
            setListMemberComment(listMemberTestLand.getMembersByTestPlanId.members);
            setFilteredMembers(listMemberTestLand.getMembersByTestPlanId.members); // Khởi tạo danh sách đã lọc bằng danh sách thành viên gốc
        }
    }, [listMemberTestLand]);

    const handleInputChange = (value, delta, source, editor) => {
        setCommentText(value);
        const text = editor.getText();
        const cursorPos = editor.getSelection(true).index;

        const lastAtIndex = text.lastIndexOf('@');
        const searchTerm = text.slice(lastAtIndex + 1, cursorPos).trim(); // Lấy ký tự sau @ đến vị trí con trỏ

        // Chỉ hiển thị danh sách thành viên khi có ký tự '@' trước đó
        if (lastAtIndex !== -1 && cursorPos > lastAtIndex) {
            setShowUserList(true);

            if (searchTerm) {
                const filtered = listMemberComment.filter((user) =>
                    user.userInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredMembers(filtered);
            } else {
                setFilteredMembers(listMemberComment);
            }
        } else {
            setShowUserList(false);
        }

        const currentTaggedUsernames = taggedUsers.map((user) => user.fullName);
        currentTaggedUsernames.forEach((username, index) => {
            if (!text.includes(`${username}`)) {
                const userId = taggedUsers[index].userID;
                setTaggedUsers((prevTaggedUsers) => prevTaggedUsers.filter((user) => user.userID !== userId));
                setStringIdMember((prevStringId) => {
                    const idArray = prevStringId.split(',').filter((id) => id !== userId);
                    return idArray.join(',');
                });
            }
        });
    };

    const handleTagUser = (selectedUser) => {
        setStringIdMember((prevStringId) => {
            const updatedStringId = prevStringId ? `${prevStringId},${selectedUser.userID}` : selectedUser.userID;
            return updatedStringId;
        });
        setTaggedUsers((prevTaggedUsers) => [...prevTaggedUsers, selectedUser]);

        const quill = quillRef?.current?.getEditor();
        quill?.focus();

        const range = quill?.getSelection();
        const cursorPosition = range ? range.index : quill?.getLength();

        const textBeforeCursor = quill?.getText(0, cursorPosition);
        const atIndex = textBeforeCursor?.lastIndexOf('@');

        const userFullName = selectedUser.fullName;
        if (atIndex !== -1) {
            // Xóa từ vị trí @ đến con trỏ mà không chạm vào phần văn bản sau con trỏ
            quill?.deleteText(atIndex, cursorPosition - atIndex);

            // Chèn tên thành viên vào vị trí @
            quill?.insertText(atIndex, userFullName, {
                bold: false,
                color: 'black',
                'data-id': selectedUser.userID
            });
            quill?.insertText(atIndex + userFullName.length, ' ');
            // Định dạng tên thành viên
            quill?.formatText(atIndex, userFullName.length, {
                medium: true,
                color: '#1D79ED'
            });

            // Đặt lại con trỏ sau tên thành viên và dấu cách
            quill?.setSelection(atIndex + userFullName.length + 1);
        }

        setShowUserList(false);
    };

    const handleFocus = () => {
        setIsOpenReact(true);
    };

    const handleBlur = () => {
        // Hide the EmojiPicker and send button when the input loses focus
        setIsOpenReact(false);
    };
    const emojiRef = useRef(null);

    const insertToEditor = (fileSeq) => {
        const range = quillRef.current.getEditor().getSelection(true) || 1;
        // eslint-disable-next-line no-undef
        const imageUrl = `${process.env.REACT_APP_SERVICE_IMAGE}/${fileSeq?.fileSeq}`;
        const quillEditor = quillRef.current.getEditor();
        quillEditor.insertEmbed(range.index, 'image', `${imageUrl}`);
        quillEditor.format('align', 'center', Quill.sources.USER);
        quillEditor.setSelection(range.index + 1, Quill.sources.SILENT);
    };

    return (
        <div className="comment-form animate__animated animate__fadeIn  z-[99999] w-full rounded border-gray-300 ">
            <div>
                <div className="relative" ref={memberRef}>
                    <div className="relative flex items-center gap-2">
                        <div
                            className="custom-scroll-y absolute  left-12 top-16 z-[99999]  mt-2 max-h-64 w-[50%]  overflow-y-auto border bg-white p-2 drop-shadow-md "
                            style={{ display: showUserList ? 'block' : 'none' }}
                        >
                            {filteredMembers.map((user, index) => (
                                <div
                                    className="flex cursor-pointer gap-3 p-2 hover:bg-gray-200"
                                    key={index}
                                    onClick={() => handleTagUser(user.userInfo)}
                                >
                                    <AttachFile
                                        attachType="UserAvatar"
                                        entity="user"
                                        seq={user?.userId}
                                        className="h-8 w-8 rounded-full"
                                        keyProp={user?.userId}
                                    />
                                    <p className="mr-2 mt-1 py-1 text-sm font-semibold text-gray-700">
                                        {user.userInfo.fullName}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className=" relative mb-2 w-full" ref={emojiRef}>
                            <div onClick={() => handleFocus()} className="relative">
                                {isOpenReact && (
                                    <div className="absolute -top-1 left-2.5 z-[99] cursor-pointer">
                                        <UploadImage insertToEditor={insertToEditor} />
                                    </div>
                                )}

                                <ReactQuill
                                    ref={quillRef}
                                    value={commentText}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    theme="snow"
                                    className={`${
                                        isOpenReact
                                            ? 'react-quill-testplan animate__animated animate__fadeIn'
                                            : 'react-quill-hidden-comment '
                                    } react-quill  relative w-full  duration-300 placeholder:text-sm`}
                                    modules={modulesImage}
                                    placeholder="Add comment"
                                />
                            </div>

                            {!dataEditComment && (
                                <div
                                    className={`flex justify-between   ${
                                        isOpenReact ? 'h-[30px] duration-300' : ' h-0 duration-700'
                                    }`}
                                >
                                    {isOpenReact && (
                                        <>
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    className="focus:shadow-outline  h-[32px] w-[80px] border border-primary-1 bg-primary-1 text-sm  text-white focus:outline-none"
                                                    onClick={() => {
                                                        addComment(), setIsOpenReact(false);
                                                    }}
                                                >
                                                    {currentLevel == 1 ? ' Reply' : 'Comment'}
                                                </button>
                                                <button
                                                    className="h-[32px] w-[80px] border border-[#787878] text-sm text-black"
                                                    onClick={() => {
                                                        setCommentText(''), handleBlur();
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comment;
