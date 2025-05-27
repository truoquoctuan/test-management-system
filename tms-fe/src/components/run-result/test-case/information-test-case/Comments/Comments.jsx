import { useMutation, useQuery } from '@apollo/client';
import { clientRepo, clientRun } from 'apis/apollo/apolloClient';
import { LIST_MEMBER_TEST_PLAND } from 'apis/apollo/test-plan/mutation';
import { CREATE_COMMENT } from 'apis/run-result/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import EmojiPicker from 'emoji-picker-react';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import CommentList from './CommentList';

const CommentForm = ({ idTestCase, expand }) => {
    const [commentText, setCommentText] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [cursorPosition, setCursorPosition] = useState(null);
    const [listMemberComment, setListMemberComment] = useState(null);
    const [stringIdMember, setStringIdMember] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [isOpenReact, setIsOpenReact] = useState(false);
    const quillRef = useRef(null);
    const memberRef = useRef(null);
    const { userInfo } = useGlobalContext();
    const { testPlanId } = useParams();

    // Danh sách thành viên testPlan
    const { data: listMemberTestLand } = useQuery(LIST_MEMBER_TEST_PLAND, {
        client: clientRepo,
        variables: { page: 0, size: 30, testPlanId: testPlanId }
    });

    useOutsideClick(memberRef, () => setShowUserList(false));

    useEffect(() => {
        if (listMemberTestLand) {
            setListMemberComment(listMemberTestLand);
        }
    }, [listMemberTestLand]);

    const handleInputChange = (value, delta, source, editor) => {
        setCommentText(value);
        const text = editor.getText();
        const cursorPos = editor.getSelection(true).index;
        setCursorPosition(cursorPos);

        if (text[cursorPos - 1] === '@') {
            setShowUserList(true);
        } else {
            setShowUserList(false);
        }

        // Kiểm tra và xóa ID người dùng khi tên bị xóa
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

        const quill = quillRef.current.getEditor();
        quill.focus();

        const range = quill.getSelection();
        const cursorPosition = range ? range.index : quill.getLength();

        // Lấy văn bản hiện tại xung quanh dấu "@"
        const textBeforeCursor = quill.getText(0, cursorPosition);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        // Chèn tên người dùng
        const userFullName = selectedUser.fullName;
        quill.deleteText(atIndex, cursorPosition); // Xóa văn bản từ dấu "@" đến con trỏ
        quill.insertText(atIndex, userFullName, {
            bold: false,
            color: 'black',
            'data-id': selectedUser.userID
        });

        // Thêm khoảng trắng sau khi chèn tên để con trỏ thoát khỏi thẻ
        quill.insertText(atIndex + userFullName.length, ' ');

        // Thiết lập lại tất cả các định dạng văn bản về mặc định
        quill.formatText(atIndex, userFullName.length, {
            bold: true,
            color: 'blue'
        });

        quill.setSelection(atIndex + userFullName.length + 1);

        setShowUserList(false);
    };

    const handleEmojiClick = (emojiData) => {
        const emoji = emojiData ? emojiData.emoji : '';
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertText(range.index, emoji, 'emoji');
        setShowEmojiPicker(false);
    };
    const [createComment] = useMutation(CREATE_COMMENT, { client: clientRun });
    const handleComment = () => {
        const quill = quillRef.current.getEditor();
        const plainText = quill.getText().trim();

        if (!plainText) {
            // If the plain text comment is empty, do not send
            return;
        }

        createComment({
            variables: {
                commentEntityId: idTestCase,
                commentType: 1,
                commentUpperId: 0,
                userId: String(userInfo?.userID),
                userListId: stringIdMember,
                content: commentText
            }
        });
        setCommentText('');
        setTaggedUsers([]);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleComment();
        }
    };

    const handleFocus = () => {
        setIsOpenReact(true);
    };

    const handleBlur = () => {
        // Hide the EmojiPicker and send button when the input loses focus
        setIsOpenReact(false);
    };
    const emojiRef = useRef(null);

    useOutsideClick(emojiRef, setShowEmojiPicker);

    const insertBold = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
            quill.format('bold', !quill.getFormat(range).bold);
        }
    };

    const insertItalic = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
            quill.format('italic', !quill.getFormat(range).italic);
        }
    };

    const insertOrderedList = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
            quill.format('list', 'ordered');
        }
    };

    const insertBulletList = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
            quill.format('list', 'bullet');
        }
    };
    const toggleUnderline = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
            const currentUnderline = quill.getFormat(range).underline;
            quill.format('underline', !currentUnderline);
        }
    };

    return (
        <div
            className={`comment-form animate__animated animate__fadeIn ${
                expand == true
                    ? 'w-full'
                    : `p-3 ${expand ? 'min-h-[calc(70vh-72px)] w-[500px]' : 'h-[calc(88vh-72px)]'}  bg-white`
            }   rounded border-gray-300 p-4`}
        >
            <div>
                <div className="relative" ref={memberRef}>
                    <div
                        className=" absolute top-10  z-30  mt-2  w-[98%] border bg-white p-2 drop-shadow-md "
                        style={{ display: showUserList ? 'block' : 'none' }}
                    >
                        {listMemberComment?.getMembersByTestPlanId?.members.map((user, index) => {
                            return (
                                <div
                                    className="flex cursor-pointer gap-3 p-2 hover:bg-gray-200"
                                    key={index}
                                    onClick={() => handleTagUser(user.userInfo)}
                                >
                                    <AttachFile
                                        attachType="UserAvatar"
                                        entity="user"
                                        seq={user?.userId}
                                        className="h-8 w-8 rounded-full "
                                        keyProp={user?.userId}
                                    />
                                    <p className="mr-2 mt-1    py-1  text-sm  font-semibold text-gray-700 ">
                                        {user.userInfo.fullName}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mr-3 border" ref={emojiRef}>
                        <div className={`${expand == true ? 'w-full' : 'w-[450px]'}`}></div>
                        <ReactQuill
                            ref={quillRef}
                            value={commentText}
                            onChange={handleInputChange}
                            placeholder="Add comment"
                            className="react-quill-comment w-full rounded      placeholder-gray-400 focus:border-blue-300 focus:outline-none focus:ring"
                            modules={{
                                toolbar: false
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                        <div
                            className={`flex justify-between px-2 pb-1 ${
                                isOpenReact ? 'h-[30px] duration-300' : ' h-0 duration-700'
                            }`}
                        >
                            {isOpenReact && (
                                <>
                                    <div className="mt-1">
                                        <button
                                            className="rounded-full  px-2  focus:outline-none"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            title="Insert an emoji"
                                        >
                                            <div>
                                                <Icon name="smile" className="fill-[#B3B3B3] hover:fill-primary-1" />
                                            </div>
                                        </button>
                                        <button
                                            className=" rounded-full  px-2  focus:outline-none"
                                            onClick={insertBold}
                                        >
                                            <Icon name="bold" className="fill-[#B3B3B3] hover:fill-primary-1" />
                                        </button>
                                        <button
                                            className=" rounded-full  px-2  focus:outline-none"
                                            onClick={insertItalic}
                                        >
                                            <Icon name="italic" className="fill-[#B3B3B3] hover:fill-primary-1" />
                                        </button>
                                        <button
                                            className=" rounded-full  px-2  focus:outline-none"
                                            value="bullet"
                                            onClick={toggleUnderline}
                                        >
                                            <Icon name="under_line" className=" fill-[#B3B3B3] hover:fill-primary-1" />
                                        </button>
                                        <button
                                            className=" rounded-full  px-2  focus:outline-none"
                                            value="ordered"
                                            onClick={insertOrderedList}
                                        >
                                            <Icon name="orderedList" className="fill-[#B3B3B3] hover:fill-primary-1" />
                                        </button>
                                        <button
                                            className=" rounded-full  px-2  focus:outline-none"
                                            value="bullet"
                                            onClick={insertBulletList}
                                        >
                                            <Icon
                                                name="unorderedList"
                                                className=" fill-[#B3B3B3] hover:fill-primary-1"
                                            />
                                        </button>
                                    </div>

                                    <button
                                        className="focus:shadow-outline rounded-full p-1 text-white  focus:outline-none"
                                        onClick={handleComment}
                                    >
                                        <Icon name="send" className="fill-[#B3B3B3] hover:fill-primary-1" />
                                    </button>
                                </>
                            )}
                        </div>

                        {showEmojiPicker && (
                            <div className="absolute w-full">
                                <EmojiPicker
                                    className="z-10"
                                    onEmojiClick={handleEmojiClick}
                                    autoFocusSearch={false}
                                    height={400}
                                    width={400}
                                    showPreview={false}
                                    searchDisabled={true}
                                    emojiVersion="0.6"
                                    lazyLoadEmojis={false}
                                    previewConfig={{
                                        defaultCaption: 'Pick one!',
                                        defaultEmoji: '1f92a'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <CommentList idTestCase={idTestCase} />
            </div>
        </div>
    );
};

export default CommentForm;
