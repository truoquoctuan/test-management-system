import AttachFile from 'components/AttachFile/AttachFile';
import { formatTime } from 'components/common/ConvertTime';
import Icon from 'components/icons/icons';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import formatDate from 'utils/formatDate';
import Comment from './Comment';

const CommentsList = ({
    comment,
    replies,
    addReply,
    userInfo,
    handleUpdateComment,
    quillRef,
    dataEditComment,
    setDataEditComment,
    handleViewMoreReplies,
    currentLevel = 1,
    editingCommentId,
    setEditingCommentId,
    // eslint-disable-next-line no-unused-vars
    loading,
    isLastComment,
    quillRef2
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [stringIdMember, setStringIdMember] = useState('');
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [isOpenReply, setIsOpenReply] = useState(false);
    const [idReply, setIdReply] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [dataReply, setDataReply] = useState(replies?.replies);
    useEffect(() => {
        setDataReply(replies?.replies);
    }, [replies]);

    const replyRef = useRef();

    const handleReply = useCallback(
        debounce(async () => {
            if (dataEditComment) {
                handleUpdateComment(comment?.commentId, comment?.commentUpperId, commentText);
            } else {
                await addReply(comment.commentId, commentText, stringIdMember, taggedUsers);
            }
            setCommentText('');
            setShowReplyInput(false);
        }, 300),
        [comment, commentText, stringIdMember, taggedUsers, dataEditComment]
    );

    return (
        <div className="relative my-3">
            <div className={`flex  ${currentLevel == 1 ? 'gap-3' : ''}`}>
                <div className="mt-1 w-[35px]">
                    <AttachFile
                        attachType="UserAvatar"
                        entity="user"
                        seq={comment?.userId}
                        className="mr-2 h-8 w-8 rounded-full object-cover"
                        keyProp={comment?.userId}
                    />
                    {currentLevel == 1 && !isLastComment && (
                        <p className=" ml-4 h-full  justify-center border-l border-[#E8E8E8]"></p>
                    )}
                </div>
                <div className={`relative  w-[95%] gap-2 ${currentLevel == 1 ? 'border py-2' : ''} `} ref={replyRef}>
                    {dataEditComment && editingCommentId == comment?.commentId ? (
                        <div className="relative z-[999]  m-2">
                            <Comment
                                addComment={handleReply}
                                setStringIdMember={setStringIdMember}
                                taggedUsers={taggedUsers}
                                setTaggedUsers={setTaggedUsers}
                                quillRef={quillRef}
                                setCommentText={setCommentText}
                                commentText={commentText}
                                userInfo={userInfo}
                                dataEditComment={dataEditComment}
                            />
                            <div className="mt-2 flex gap-2">
                                <div
                                    className="focus:shadow-outline w-[120px]  cursor-pointer border border-primary-1 bg-primary-1 py-1 text-center text-sm  text-white focus:outline-none"
                                    onClick={handleReply}
                                >
                                    <p className="h-full">Save comment</p>
                                </div>
                                <div
                                    className=" w-[80px] border border-[#787878] py-1 text-center text-sm text-black"
                                    onClick={() => {
                                        setDataEditComment(null), setEditingCommentId(null);
                                    }}
                                >
                                    Cancel
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full    px-3 py-1">
                                <div className="flex justify-between gap-2">
                                    <div className="flex gap-2">
                                        <h4 className=" text-sm font-[500]">{comment?.fullName}</h4>
                                        <p className="text-[13px] text-gray-600">{formatTime(comment?.updatedAt)}</p>
                                        <div className=" flex space-x-2">
                                            {formatDate('dd/mm/yyyy hh:mm:ss', comment?.updatedAt) >
                                                formatDate('dd/mm/yyyy hh:mm:ss', comment?.createdAt) && (
                                                <p className="text-[13px] text-[#787878]">(Edited)</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {currentLevel < 2 && (
                                            <>
                                                <button
                                                    className="tooltip flex items-center text-[13px] font-medium text-[#1D79ED]"
                                                    onClick={() => {
                                                        setShowReplyInput(!showReplyInput), setIsOpenReply(true);
                                                        setIdReply(comment?.commentId);
                                                        setCommentText(''),
                                                            setDataEditComment(null),
                                                            setEditingCommentId(comment?.commentId);
                                                        handleViewMoreReplies(comment?.commentId);
                                                    }}
                                                >
                                                    <Icon name="corner_up_left" />
                                                    <span className="tooltip-text z-[300] text-[13px]">Reply</span>
                                                </button>
                                            </>
                                        )}
                                        {userInfo?.userID === Number(comment?.userId) && (
                                            <div
                                                className=""
                                                onClick={() => {
                                                    setShowReplyInput(false), setEditingCommentId(comment?.commentId);
                                                    setCommentText(comment.content), setDataEditComment(comment);
                                                }}
                                            >
                                                <button className="tooltip text-[13px] font-medium text-[#787878]">
                                                    <Icon name="edit" className="h-4 w-4 fill-[#484848]" />
                                                    <span className="tooltip-text z-[300] text-[13px]">Edit</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="">
                                    <ReactQuill
                                        theme="snow"
                                        id="objective"
                                        className="react-quill-hidden-calendar"
                                        value={comment?.content}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            {comment?.totalReplies > 0 && (
                                <>
                                    <>
                                        {isOpenReply == false && dataReply.length == 0 ? (
                                            <div
                                                className=" flex w-full items-center gap-2 border-t bg-[#F8F8F8] px-2"
                                                onClick={() => {
                                                    setIdReply(comment?.commentId);
                                                    handleViewMoreReplies(comment?.commentId),
                                                        setEditingCommentId(comment?.commentId);
                                                    setIsOpenReply(true);
                                                }}
                                            >
                                                <Icon name="caret_right" className={``} />
                                                <div className=" flex cursor-pointer py-1.5  text-sm font-medium text-[#121212]">
                                                    {comment?.userRepliedList?.map((item, index) => {
                                                        return (
                                                            <div key={index} className="tooltip">
                                                                <AttachFile
                                                                    attachType="UserAvatar"
                                                                    entity="user"
                                                                    seq={item?.userID}
                                                                    className=" h-6 w-6 rounded-full object-cover"
                                                                    keyProp={comment?.userId}
                                                                />
                                                                <span className="tooltip-text z-[300] text-[13px]">
                                                                    {item?.fullName}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="ml-2 flex items-center gap-2">
                                                        <Icon name="dot" className="fill-primary-1" />
                                                        <p className="text-primary-1">
                                                            {' '}
                                                            {comment?.totalReplies} replies
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        setIsOpenReply(false);
                                                        setIdReply(comment?.commentId);
                                                        setDataReply([]);
                                                    }}
                                                    className="flex cursor-pointer gap-2 border-y bg-[#F8F8F8] px-2 py-1.5 text-sm font-medium text-[#121212]"
                                                >
                                                    <Icon name="caret_right" className={` rotate-90`} />
                                                    <p>Collapse replies</p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                </>
                            )}
                        </>
                    )}
                    <div>
                        {isOpenReply == false && comment?.commentId === idReply ? (
                            ''
                        ) : (
                            <>
                                {replies?.replies?.map((reply, index) => (
                                    <div key={index} className="animate__animated animate__fadeIn mx-3">
                                        <CommentsList
                                            comment={reply}
                                            replies={reply}
                                            addReply={addReply}
                                            userInfo={userInfo}
                                            setDataEditComment={setDataEditComment}
                                            handleUpdateComment={handleUpdateComment}
                                            dataEditComment={dataEditComment}
                                            quillRef={quillRef}
                                            handleViewMoreReplies={handleViewMoreReplies}
                                            currentLevel={currentLevel + 1}
                                            editingCommentId={editingCommentId}
                                            setEditingCommentId={setEditingCommentId}
                                            quillRef2={quillRef2}
                                        />
                                    </div>
                                ))}
                                {(idReply == comment?.commentId || dataReply.length > 0) && (
                                    <div className="animate__animated animate__fadeIn relative z-[999] mx-3 mb-3 mt-2">
                                        <Comment
                                            addComment={handleReply}
                                            setStringIdMember={setStringIdMember}
                                            taggedUsers={taggedUsers}
                                            setTaggedUsers={setTaggedUsers}
                                            quillRef={quillRef2}
                                            setCommentText={setCommentText}
                                            commentText={commentText}
                                            userInfo={userInfo}
                                            currentLevel={currentLevel}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentsList;
