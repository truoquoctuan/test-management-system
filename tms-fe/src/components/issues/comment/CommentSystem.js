// src/components/CommentSystem.js

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { CREATE_COMMENT, GEAT_ALL_COMMENT, GET_REPLIES, UPDATE_COMENT } from 'apis/run-result/test-case';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import Comment from './Comment';
import CommentsList from './CommentsList';

const CommentSystem = ({ issuesId }) => {
    const [size, setSize] = useState(20);

    // eslint-disable-next-line no-unused-vars
    const { isSocketNoti, changeStatusNoti, dataComment } = useGlobalContext();
    const [dataEditComment, setDataEditComment] = useState(null);
    const [commentId, setCommentId] = useState(null);
    const [comments, setComments] = useState([]);
    const { userInfo } = useGlobalContext();
    const [commentText, setCommentText] = useState('');
    const [stringIdMember, setStringIdMember] = useState('');
    const [taggedUsers, setTaggedUsers] = useState([]);
    const quillRef = useRef(null);
    const quillRef1 = useRef(null);
    const quillRef2 = useRef(null);
    const { data: dataComments } = useQuery(GEAT_ALL_COMMENT, {
        client: clientRun,
        variables: { commentEntityId: issuesId, commentType: 2, page: 0, size: size },
        fetchPolicy: 'no-cache'
    });
    const [loadReplies, { data: repliesData, loading: loadingReply }] = useLazyQuery(GET_REPLIES, {
        client: clientRun,
        fetchPolicy: 'no-cache'
    });

    useEffect(() => {
        if (dataComments) {
            const transformedComments = dataComments.getAllComment.comments.map((comment) => ({
                commentId: comment.commentId,
                fullName: comment?.users.fullName,
                userId: comment?.userId,
                userRepliedList: comment?.userRepliedList,
                totalReplies: comment.totalReplies,
                updatedAt: new Date(comment.updatedAt),
                createdAt: new Date(comment.createdAt),
                content: comment.content,
                replies: []
            }));

            setComments(transformedComments);
        }
    }, [dataComments]);

    const transformReplies = (replies) => {
        return replies.map((reply) => ({
            commentId: reply.commentDTO.commentId,
            fullName: reply.commentDTO?.users.fullName,
            userId: reply.commentDTO?.users.userID,
            updatedAt: new Date(reply.commentDTO.updatedAt),
            createdAt: new Date(reply.commentDTO.createdAt),
            content: reply.commentDTO.content,
            totalReplies: reply.commentDTO.totalReplies,
            replies: []
        }));
    };

    const mergeReplies = (comments, replies) => {
        return comments.map((comment) => {
            if (comment.commentId === commentId) {
                return {
                    ...comment,
                    replies: transformReplies(replies)
                };
            }
            return comment;
        });
    };
    useEffect(() => {
        if (repliesData) {
            setComments((prevComments) => mergeReplies(prevComments, repliesData.getReplies.replies));
        }
    }, [repliesData]);

    const addReply = async (parentCommentId, replyText, stringIdMember) => {
        const quill = quillRef2.current.getEditor();
        const plainText = quill.getText().trim();

        if (!plainText) {
            return;
        }

        await createComment({
            variables: {
                commentEntityId: issuesId,
                commentType: 2,
                commentUpperId: parentCommentId,
                userId: String(userInfo?.userID),
                userListId: stringIdMember,
                content: replyText
            }
        });

        setCommentText('');
        setTaggedUsers([]);
    };
    // Tạo comment
    const [createComment] = useMutation(CREATE_COMMENT, { client: clientRun });
    const addComment = async () => {
        const quill = quillRef1.current.getEditor();
        const plainText = quill.getText().trim();

        if (!plainText) {
            return;
        }

        await createComment({
            variables: {
                commentEntityId: issuesId,
                commentType: 2,
                commentUpperId: 0,
                userId: String(userInfo?.userID),
                userListId: stringIdMember,
                content: commentText
            }
        });

        setCommentText('');
        setTaggedUsers([]);
    };
    // Update comment
    const [updateComment] = useMutation(UPDATE_COMENT, { client: clientRun });
    const handleUpdateComment = async (commentId, commentUpperId, content) => {
        setCommentId(commentId);
        const quill = quillRef.current.getEditor();
        const plainText = quill.getText().trim();

        if (!plainText) {
            return;
        }

        try {
            const { data } = await updateComment({
                variables: {
                    commentEntityId: issuesId,
                    commentId: commentId,
                    commentType: 2,
                    commentUpperId: commentUpperId,
                    userId: String(userInfo?.userID),
                    userListId: stringIdMember,
                    content: content
                }
            });

            const updatedComment = data.updateComment;

            setComments((prevComments) => {
                const updateCommentInList = (commentsList) => {
                    return commentsList.map((comment) => {
                        if (comment.commentId === updatedComment.commentId) {
                            return {
                                ...comment,
                                content: updatedComment.content,
                                updatedAt: updatedComment.updatedAt,
                                createdAt: updatedComment.createdAt
                            };
                        }
                        if (comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentInList(comment.replies)
                            };
                        }
                        return comment;
                    });
                };

                return updateCommentInList(prevComments);
            });

            setCommentText('');
            setTaggedUsers([]);
            setDataEditComment(null);
            setEditingCommentId(null);
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleLoadMore = useCallback(
        debounce(() => {
            setLoading(true);
            setSize((prevSize) => prevSize + 10);
            setLoading(false);
        }, 200),
        []
    );

    useEffect(() => {
        if (isSocketNoti) {
            const newComment = {
                commentId: String(dataComment?.comment_id),
                fullName: dataComment?.users?.full_name,
                userId: String(dataComment?.user_id),
                totalReplies: 0,
                updatedAt: new Date(dataComment?.updated_at),
                createdAt: new Date(dataComment?.created_at),
                content: dataComment?.content,
                replies: []
            };
            if (dataComment?.comment_entity_id == issuesId) {
                setComments((prevComments) => {
                    // Check if the comment already exists
                    const commentExists = prevComments.find((comment) => comment?.commentId === newComment?.commentId);

                    if (commentExists) {
                        // Update the existing comment
                        return prevComments.map((comment) =>
                            comment.commentId === newComment.commentId
                                ? { ...comment, content: newComment.content, updatedAt: newComment.updatedAt }
                                : comment
                        );
                    } else {
                        if (dataComment?.comment_upper_id == 0) {
                            // Add new comment
                            return [newComment, ...prevComments];
                        } else {
                            // Handle reply case
                            return prevComments?.map((comment) => {
                                if (comment?.commentId === String(dataComment?.comment_upper_id)) {
                                    const replyExists = comment.replies.find(
                                        (reply) => reply.commentId === newComment?.commentId
                                    );

                                    if (replyExists) {
                                        // Update existing reply
                                        return {
                                            ...comment,
                                            replies: comment?.replies
                                                .map((reply) =>
                                                    reply.commentId === newComment?.commentId
                                                        ? {
                                                              ...reply,
                                                              content: newComment?.content,
                                                              updatedAt: newComment?.updatedAt
                                                          }
                                                        : reply
                                                )
                                                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort replies by updatedAt, newest first
                                        };
                                    } else {
                                        // Add new reply
                                        return {
                                            ...comment,
                                            totalReplies: comment?.totalReplies + 1,
                                            replies: [newComment, ...comment.replies].sort(
                                                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                                            ) // Add new reply and sort replies by updatedAt, newest first
                                        };
                                    }
                                }

                                return comment;
                            });
                        }
                    }
                });
            }

            changeStatusNoti();
        }
    }, [isSocketNoti]);

    const handleViewMoreReplies = async (commentId) => {
        setCommentId(commentId);
        loadReplies({
            variables: { parentId: String(commentId), size: 100, commentType: 2, page: 0 }
        });
    };

    return (
        <div className="py-2">
            <div className="mb-4 mt-2 flex items-center gap-2">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#EDF3FF]">
                    <Icon name="comment" />
                </div>
                <h1 className=" text-xl font-bold">Activity</h1>
            </div>

            <div className="mb-4 flex ">
                <Comment
                    addComment={addComment}
                    setStringIdMember={setStringIdMember}
                    taggedUsers={taggedUsers}
                    setTaggedUsers={setTaggedUsers}
                    quillRef={quillRef1}
                    setCommentText={setCommentText}
                    commentText={commentText}
                    userInfo={userInfo}
                />
            </div>
            <div className="mb-4  min-h-[200px]">
                {comments.map((comment, index) => (
                    <div key={index}>
                        <CommentsList
                            key={comment.id}
                            comment={comment}
                            replies={comment}
                            addReply={addReply}
                            handleUpdateComment={handleUpdateComment}
                            userInfo={userInfo}
                            quillRef={quillRef}
                            quillRef2={quillRef2}
                            dataEditComment={dataEditComment}
                            setDataEditComment={setDataEditComment}
                            handleViewMoreReplies={handleViewMoreReplies}
                            editingCommentId={editingCommentId}
                            setEditingCommentId={setEditingCommentId}
                            loading={loadingReply}
                            isLastComment={index === comments?.length - 1}
                        />
                    </div>
                ))}

                {(comments.length > 10 || dataComments?.getAllComment?.pageInfo?.totalElements > 10) &&
                    Number(dataComments?.getAllComment?.pageInfo?.totalElements) > Number(comments.length) && (
                        <div
                            onClick={handleLoadMore}
                            className="ml-12 flex cursor-pointer items-center justify-start text-blue-500"
                        >
                            <span className="text-sm">See more</span>
                            {loading && (
                                <span className="ml-2 animate-spin">
                                    <svg
                                        className="h-5 w-5 text-blue-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.5v0M12 19.5v0M19.5 12h0M4.5 12h0M16.95 7.05h0M7.05 16.95h0M16.95 16.95h0M7.05 7.05h0"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default CommentSystem;
