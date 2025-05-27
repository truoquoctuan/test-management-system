import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { GET_TEST_CASE_BY_ID } from 'apis/repository/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import { ColorChecker } from 'components/common/ColorChecker';
import { toDateStrings, toDateTimeString } from 'components/common/ConvertTime';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Icon from '../../../icons/icons';

const Detail = ({ idTestCase, setDetailTestCase, expand }) => {
    const [contentVisible, setContentVisible] = useState(false);
    const [dataDetailTestCase, setDataDetailTestCase] = useState(null);
    const [fileSeq, setFileSeq] = useState([]);
    const [loadingDeatail, setLoadingDetail] = useState(true);

    useEffect(() => {
        if (idTestCase !== null) {
            setContentVisible(false);
            const timer = setTimeout(() => {
                setContentVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setContentVisible(false);
        }
    }, [idTestCase]);

    // API chi tiết test case
    const { data: dataDetail, loading } = useQuery(GET_TEST_CASE_BY_ID, {
        client: clientRepo,
        variables: { id: idTestCase },
        skip: idTestCase ? false : true
    });
    useEffect(() => {
        setLoadingDetail(true);
        if (idTestCase) {
            setTimeout(() => {
                setLoadingDetail(false); // Start loading when idTestCase changes
            }, 500);
        }
    }, [idTestCase, loading]);

    useEffect(() => {
        if (dataDetail) {
            setDataDetailTestCase(dataDetail);
            setFileSeq(dataDetail?.getTestCaseById?.files);
            setDetailTestCase(dataDetail);
        }
    }, [dataDetail]);

    return (
        <div
            className={`${
                idTestCase == null ? '' : `p-3 ${expand ? 'min-h-[calc(70vh-72px)]' : 'h-[calc(88vh-72px)]'}  bg-white`
            }`}
        >
            <div
                className={`${idTestCase == null && 'hidden'} ${
                    expand == true ? 'w-full' : 'w-[480px]'
                }  transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                {loadingDeatail ? (
                    <div className="flex h-[calc(70vh-72px)] items-center justify-center">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div className={`${expand == true ? '' : 'custom-scroll-y h-[calc(75vh-72px)]'} `}>
                        {/* Description */}
                        <div className="mt-1">
                            <p className="text-[15px] font-semibold">Description</p>
                            {dataDetailTestCase?.getTestCaseById?.description ? (
                                <div className={`${expand == true ? 'w-full' : 'w-[450px]'}`}>
                                    <ReactQuill
                                        theme="snow"
                                        id="objective"
                                        className="react-quill-hidden-calendar "
                                        value={dataDetailTestCase?.getTestCaseById?.description}
                                        readOnly={true}
                                    />
                                </div>
                            ) : (
                                <div className="max-h-[150px] text-sm text-[#787878]">Not set</div>
                            )}
                        </div>
                        {/* Expected */}
                        <div className="mt-4">
                            <p className="text-[15px] font-semibold">Expected</p>
                            {dataDetailTestCase?.getTestCaseById?.expectResult ? (
                                <div className={`${expand == true ? 'w-full' : 'w-[450px]'}`}>
                                    <ReactQuill
                                        theme="snow"
                                        id="objective"
                                        className="react-quill-hidden-calendar "
                                        value={dataDetailTestCase?.getTestCaseById?.expectResult}
                                        readOnly={true}
                                    />
                                </div>
                            ) : (
                                <div className="max-h-[150px]  text-sm text-[#787878]">Not set</div>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="mt-4">
                            <p className="text-[15px] font-semibold">Priority</p>
                            {dataDetailTestCase?.getTestCaseById?.priority === 1 && (
                                <p className="mt-1 w-[80px] bg-[#F0F0F0] py-1 text-center text-sm font-medium text-[#787878]">
                                    Low
                                </p>
                            )}
                            {dataDetailTestCase?.getTestCaseById?.priority === 2 && (
                                <p className="mt-1 w-[80px] bg-[#FFF6D7] py-1 text-center text-sm font-medium text-[#F1AD00]">
                                    Medium
                                </p>
                            )}
                            {dataDetailTestCase?.getTestCaseById?.priority === 3 && (
                                <p className="mt-1 w-[80px] bg-[#FFDEDE] py-1 text-center text-sm font-medium text-[#B41B1B]">
                                    High
                                </p>
                            )}
                        </div>
                        {/* Tags */}
                        <div className="mt-4">
                            <p className="text-[15px] font-semibold">Tags</p>
                            <div className={`flex flex-wrap gap-2 ${expand == true ? 'w-full' : 'w-[450px]'}`}>
                                {dataDetailTestCase?.getTestCaseById?.labelsInfo?.map((item, index) => (
                                    <div
                                        className={`mt-1 flex gap-2  px-2 py-1 text-center text-sm ${
                                            ColorChecker(item?.labelColor) == 'dark' ? 'text-white' : 'text-black'
                                        }`}
                                        key={index}
                                        style={{ backgroundColor: item.labelColor }}
                                    >
                                        <Icon
                                            name="tag"
                                            className={`mt-1 ${
                                                ColorChecker(item?.labelColor) == 'dark' ? 'fill-white' : 'fill-black'
                                            }`}
                                        />
                                        <p>{item?.labelName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Creator */}
                        <div className="mt-4">
                            <p className="text-[15px] font-semibold">Creator</p>
                            <div className="mt-1 flex gap-2">
                                <AttachFile
                                    attachType="UserAvatar"
                                    entity="user"
                                    seq={dataDetailTestCase?.getTestCaseById?.createdBy}
                                    className="h-10 w-10 rounded-full object-cover"
                                    keyProp={dataDetailTestCase?.getTestCaseById?.createdBy}
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        {dataDetailTestCase?.getTestCaseById?.fullName}
                                    </p>
                                    <p className="text-sm text-[#787878]">
                                        @{dataDetailTestCase?.getTestCaseById?.userName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Last Modified */}
                        <div className={`mt-4 flex ${expand == true ? 'w-full' : 'w-[450px]'}`}>
                            <div className=" w-[50%]">
                                <p className="text-[15px] font-semibold">Created at</p>
                                <div className="mt-1 flex gap-2">
                                    <p className="text-sm text-[#787878]">
                                        {toDateStrings(dataDetailTestCase?.getTestCaseById?.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {/* Updated at */}
                            <div className="mt-2 w-[50%]">
                                <p className="text-[15px] font-semibold">Updated at</p>
                                <div className="mt-1 flex gap-2">
                                    <p className="text-sm text-[#787878]">
                                        {toDateTimeString(dataDetailTestCase?.getTestCaseById?.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 ">
                            <p className="text-[15px] font-semibold">Attachments</p>
                            {fileSeq !== null ? (
                                <div className="mt-1 ">
                                    <AttachFile
                                        attachType="MultipleFiles"
                                        fileSeq={fileSeq}
                                        seq={null}
                                        setFileSeq={setFileSeq}
                                        viewMode={false}
                                        mode="member"
                                        className="h-20 w-20 rounded-full object-cover"
                                        displayType={true}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-[#787878]">None</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detail;
