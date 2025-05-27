import { useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { TEST_RESULTS } from 'apis/run-result/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import ModalComponent from 'components/common/Modal';
import NotFound from 'components/common/NotFound';
import { formatDateTime } from 'components/common/Time';
import Icon from 'components/icons/icons';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

const Results = ({ idTestCase, contentVisible, callBack, expand }) => {
    const [listTestResults, setListTestResults] = useState([]);
    const [idTestResults, setIdTestResults] = useState();
    const [page, setPage] = useState(10);
    const tableContainerRef = useRef(null);
    const [isOpendetailActi, setIsOpneDetailActi] = useState(false);
    const [loadingDeatail, setLoadingDetail] = useState(true);

    const {
        data: results,
        refetch,
        loading
    } = useQuery(TEST_RESULTS, {
        client: clientRun,
        variables: {
            id: idTestCase,
            page: 0,
            size: page
        }
    });

    useEffect(() => {
        if (idTestCase) {
            refetch();
        }
    }, [callBack, refetch]);
    useEffect(() => {
        if (results) {
            setListTestResults(results?.getTestResultById?.testResults);
        }
    }, [results]);

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
    }, []);
    useEffect(() => {
        setLoadingDetail(true);
        if (idTestCase) {
            setTimeout(() => {
                setLoadingDetail(false); // Start loading when idTestCase changes
            }, 500);
        }
    }, [idTestCase, loading]);

    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpneDetailActi(false);
        }, 500);
    };

    return (
        <div
            className={`${
                idTestCase == null ? '' : `${expand ? 'min-h-[calc(72vh-72px)]' : 'h-[calc(88vh-72px)]'}  bg-white p-3`
            }`}
            ref={tableContainerRef}
        >
            {loadingDeatail ? (
                <div className="flex h-[calc(70vh-72px)] items-center justify-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <div
                    className={`${idTestCase == null && 'hidden'}    p-2 transition-opacity duration-1000 ${
                        contentVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {listTestResults?.map((item, index) => {
                        return (
                            <div
                                className={`mb-4 mt-4 ${
                                    expand == true ? 'w-full' : 'w-[450px]'
                                }  cursor-pointer border-x  border-b border-t-4 ${
                                    item?.status === 1 ? 'border-t-[#2A9C58] bg-[#FAFFFB]' : ''
                                } ${item?.status === 2 ? 'border-t-[#FF6060] bg-[#FFFAFA]' : ''}  ${
                                    item?.status === 3 ? 'border-t-[#F1AD00] bg-[#FFFBF1]' : ''
                                }  ${item?.status === 4 ? 'border-t-[#1D79ED] bg-[#F6F8FF]' : ''}   `}
                                key={index}
                            >
                                <div
                                    className={`flex justify-between px-4 py-3`}
                                    onClick={() => {
                                        setIsOpneDetailActi(true), setIdTestResults(item);
                                    }}
                                >
                                    <div className="flex">
                                        <AttachFile
                                            attachType="UserAvatar"
                                            entity="user"
                                            seq={item?.userId}
                                            className="h-10 w-10 rounded-full object-cover"
                                            keyProp={item?.userId}
                                        />
                                        <div className=" items-center">
                                            <div className="ml-3 flex gap-2 ">
                                                <p className="text-sm font-medium text-[#121212]">
                                                    {item.createFullName}
                                                </p>
                                                <p className="text-sm">{formatDateTime(item.updatedAt)}</p>
                                            </div>
                                            <p className=" ml-3 text-sm text-[#787878]">
                                                A {item?.status === 1 && 'Passed'} {item?.status === 2 && 'Failed'}{' '}
                                                {item?.status === 3 && 'Retest'}
                                                {item?.status === 4 && 'Skipped'} result was added.
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {item?.status === 1 && (
                                            <p
                                                className={` w-[82px] bg-[#2A9C58] px-4 py-1 text-center  text-sm text-white`}
                                            >
                                                Passed
                                            </p>
                                        )}
                                        {item?.status === 2 && (
                                            <p
                                                className={` w-[82px] bg-[#FF6060] px-4 py-1 text-center text-sm text-white`}
                                            >
                                                Failed
                                            </p>
                                        )}
                                        {item?.status === 3 && (
                                            <p
                                                className={` w-[82px] bg-[#F1AD00] px-4 py-1 text-center text-sm  text-white`}
                                            >
                                                Retest
                                            </p>
                                        )}
                                        {item?.status === 4 && (
                                            <p
                                                className={` w-[82px] bg-[#1D79ED] px-4 py-1 text-center text-sm text-white`}
                                            >
                                                Skipped
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {listTestResults?.length === 0 && (
                        <div className="flex h-full items-center justify-center">
                            <NotFound />
                        </div>
                    )}
                </div>
            )}

            {/* Modal chi tiết hoạt động */}
            <ModalComponent
                isOpen={isOpendetailActi}
                setIsOpen={setIsOpneDetailActi}
                setIsClosing={setIsClosing}
                isClosing={isClosing}
            >
                <div className="  w-[747px] p-5">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold text-black">Activity Details </p>
                        <div onClick={() => handleClose()} className="cursor-pointer">
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="custom-scroll-y ">
                        <div className={`mb-4 mt-4  w-full    `}>
                            <div className={`flex justify-between  pb-3`}>
                                <div className="flex">
                                    <AttachFile
                                        attachType="UserAvatar"
                                        entity="user"
                                        seq={idTestResults?.userId}
                                        className="h-10 w-10 rounded-full object-cover"
                                        keyProp={idTestResults?.userId}
                                    />
                                    <div className=" items-center">
                                        <div className="ml-3 flex gap-2 ">
                                            <p className="text-sm font-medium text-[#121212]">
                                                {idTestResults?.createFullName}
                                            </p>
                                            <p className="text-[13px] text-[#787878]">
                                                {formatDateTime(idTestResults?.updatedAt)}
                                            </p>
                                        </div>
                                        <p className=" ml-3 text-sm text-[#787878]">
                                            A {idTestResults?.status === 1 && 'Passed'}{' '}
                                            {idTestResults?.status === 2 && 'Failed'}{' '}
                                            {idTestResults?.status === 3 && 'Retest'}
                                            {idTestResults?.status === 4 && 'Skipped'} result was added.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {idTestResults?.status === 1 && (
                                        <p className={` w-[82px] bg-[#2A9C58] px-4 py-1  text-sm text-white`}>Passed</p>
                                    )}
                                    {idTestResults?.status === 2 && (
                                        <p className={` w-[82px] bg-[#FF6060] px-4 py-1 text-sm text-white`}>Failed</p>
                                    )}
                                    {idTestResults?.status === 3 && (
                                        <p className={` w-[82px] bg-[#F1AD00] px-4 py-1 text-sm  text-white`}>Retest</p>
                                    )}
                                    {idTestResults?.status === 4 && (
                                        <p className={` w-[82px] bg-[#1D79ED] px-4 py-1 text-sm text-white`}>Skipped</p>
                                    )}
                                </div>
                            </div>
                            <div className={` opacity-100 transition-all duration-1000`}>
                                <div className="m-auto w-full">
                                    <div className="border  ">
                                        <p className="border-b bg-[#F4F4F4] py-1.5 pl-4 text-sm font-semibold text-[#121212]">
                                            Assign To
                                        </p>
                                        <div className="flex flex-wrap py-2">
                                            {idTestResults?.users?.map((item, index) => {
                                                return (
                                                    <div className="flex items-center px-4 py-[2px]" key={index}>
                                                        <AttachFile
                                                            attachType="UserAvatar"
                                                            entity="user"
                                                            seq={item?.userID}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            keyProp={item?.userID}
                                                        />
                                                        <div className="ml-3">
                                                            <p className="text-[13px] font-semibold">{item.fullName}</p>
                                                            <p className="text-[13px] text-[#787878]">
                                                                @{item.userName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-2 border ">
                                        <p className="border-b bg-[#F4F4F4] py-1.5 pl-4 text-sm font-semibold text-[#121212] ">
                                            Execution Detail
                                        </p>
                                        <div className="p-2">
                                            <ReactQuill
                                                theme="snow"
                                                id="objective"
                                                className="react-quill-hidden-calendar  relativ max-h-full"
                                                value={idTestResults?.content}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>
                                    {idTestResults?.files && (
                                        <div className="mt-2 border ">
                                            <p className="border-b py-1.5 pl-4 text-sm font-semibold text-[#121212]">
                                                Attachments
                                            </p>
                                            <div className=" px-2 pb-2">
                                                <AttachFile
                                                    attachType="MultipleFiles"
                                                    fileSeq={idTestResults?.files}
                                                    seq={null}
                                                    setFileSeq={null}
                                                    viewMode={false}
                                                    displayType={true}
                                                    mode="member"
                                                    className="h-20 w-20 rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Results;
