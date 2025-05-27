import { useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GEAT_ALL_COMMENT } from 'apis/run-result/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import { formatDateTime } from 'components/common/Time';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import CommentEdit from './CommentEdit';

const CommentList = ({ idTestCase }) => {
    const { userInfo } = useGlobalContext();
    const [listComment, setListComment] = useState(null);
    const [commentEdit, setCommentEdit] = useState(null);
    const [idComment, setIdComment] = useState(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const { isSocketNoti, changeStatusNoti } = useGlobalContext();
    const [page, setPage] = useState(20);
    const [loadingDeatail, setLoadingDetail] = useState(true);
    const [editComment, setEditComment] = useState(false);
    const { data: comments, refetch } = useQuery(GEAT_ALL_COMMENT, {
        client: clientRun,
        variables: { commentEntityId: idTestCase, commentType: 1, page: 0, size: page }
    });

    useEffect(() => {
        setLoadingDetail(true);
        if (idTestCase) {
            setTimeout(() => {
                setLoadingDetail(false); // Start loading when idTestCase changes
            }, 500);
        }
    }, [idTestCase]);

    useEffect(() => {
        if (comments) {
            setListComment(comments);
        }
    }, [comments]);

    useEffect(() => {
        if (isSocketNoti) {
            refetch();
            changeStatusNoti();
        }
    }, [isSocketNoti]);
    const tableContainerRef = useRef(null);
    const editCommentRef = useRef(null);

    const handleScroll = () => {
        const container = tableContainerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setPage((prevSize) => prevSize + 5);
        }
    };

    useEffect(() => {
        const container = tableContainerRef.current;

        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [tableContainerRef]);
    useOutsideClick(editCommentRef, setIsOpenEdit);

    return (
        <div>
            {loadingDeatail ? (
                <div className="flex h-[calc(70vh-72px)] items-center justify-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="custom-scroll-y mt-4 h-[calc(66vh-72px)]  bg-white" ref={tableContainerRef}>
                    {listComment?.getAllComment?.comments?.map((item, index) => {
                        return (
                            <div className="mt-2 flex gap-2" key={index}>
                                <AttachFile
                                    attachType="UserAvatar"
                                    entity="user"
                                    seq={item?.userId}
                                    className="h-8 w-9 rounded-full "
                                    keyProp={item?.userId}
                                />
                                <div className="w-full">
                                    <div className="relative flex w-full items-center justify-between">
                                        <div className="flex gap-2">
                                            <p className="text-sm font-medium text-[#121212]">
                                                {item?.users?.fullName}
                                            </p>
                                            <p className="text-sm text-[#787878]">{formatDateTime(item.createdAt)}</p>
                                        </div>
                                        {item?.userId === String(userInfo?.userID) && (
                                            <div
                                                className="cursor-pointer pr-2"
                                                onClick={() => {
                                                    setIsOpenEdit(!isOpenEdit), setIdComment(item);
                                                }}
                                            >
                                                <Icon name="vertical_dots" className="w-full" />
                                            </div>
                                        )}

                                        {isOpenEdit && item?.commentId === idComment?.commentId && (
                                            <div
                                                className="absolute right-4  top-2 z-[30] flex w-[140px] cursor-pointer justify-between border bg-white px-2 py-1.5 text-center text-sm hover:bg-slate-100"
                                                onClick={() => {
                                                    setEditComment(true), setIsOpenEdit(false), setCommentEdit(item);
                                                }}
                                            >
                                                <p>Edit comment</p>
                                                <Icon name="edit" className="fill h-4 w-4 " />
                                            </div>
                                        )}
                                    </div>
                                    {editComment && item?.commentId === commentEdit?.commentId ? (
                                        <CommentEdit
                                            idComment={idComment}
                                            setEditComment={setEditComment}
                                            setIdComment={setIdComment}
                                            idTestCase={idTestCase}
                                        />
                                    ) : (
                                        <div className="mt-2 pr-4 text-sm font-normal">
                                            <ReactQuill
                                                theme="snow"
                                                id="objective"
                                                className="react-quill-hidden-calendar relativ max-h-full"
                                                value={item?.content}
                                                readOnly={true}
                                            />

                                            {(new Date(item.createdAt).getTime() ===
                                                new Date(item.updatedAt).getTime()) ===
                                                false && <p className="text-xs font-normal text-[#787878]">(Edited)</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CommentList;
