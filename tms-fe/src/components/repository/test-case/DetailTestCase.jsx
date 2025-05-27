import { useQuery } from '@apollo/client';
import { GET_TEST_CASE_BY_ID } from 'apis/repository/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import { ColorChecker } from 'components/common/ColorChecker';
import { toDateStrings, toDateTimeString } from 'components/common/ConvertTime';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Icon from '../../icons/icons';
import PopupDetailExpected from './PopupDetailExpected';

// eslint-disable-next-line no-unused-vars
const DetailTestCase = ({
    setIdTestCase,
    idTestCase,
    // eslint-disable-next-line no-unused-vars
    closeFolder,
    setIsOpenTest,
    setSelectForm,
    setEditTestCaseId,
    setOpenDeleteTestCase,
    setArrayTestCaseId
}) => {
    // eslint-disable-next-line no-unused-vars
    const [contentVisible, setContentVisible] = useState(false);
    const [dataDetailTestCase, setDataDetailTestCase] = useState(null);
    const [isOpenPopupExpected, setIsOpenPopupExpected] = useState(false);
    const [loadingDeatail, setLoadingDetail] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const [contentExpected, setContentExpected] = useState(null);
    const checkWidth = 'w-[500px]';
    const [fileSeq, setFileSeq] = useState();
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
    // Api chi tiết test case
    const { data: dataDetail, loading } = useQuery(GET_TEST_CASE_BY_ID, {
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
        }
    }, [dataDetail]);

    return (
        <div>
            <div
                className={`border duration-700 ${
                    idTestCase == null ? ' w-0' : `h-[calc(100vh-72px)] w-[500px] bg-white shadow-xl `
                } `}
                style={{ whiteSpace: 'nowrap' }}
            >
                <div className=" flex justify-between border-b p-4">
                    <p className={`w-1/4 text-lg font-bold`}>Test Case Detail</p>
                    <div className="flex gap-4 pr-3">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setContentExpected(dataDetailTestCase?.getTestCaseById), setIsOpenPopupExpected(true);
                            }}
                        >
                            <Icon name="expand" />
                        </div>
                        <div
                            className="flex cursor-pointer justify-end "
                            onClick={() => {
                                setIdTestCase(null);
                            }}
                        >
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className=" custom-scroll-y h-[83vh] p-3">
                    {loadingDeatail ? (
                        <div className="flex h-full items-center justify-center">
                            <div>
                                <div className="loader"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate__animated animate__fadeIn w-[600px]">
                            <div className="border-b px-1.5 pb-4">
                                <p className=" w-[450px] whitespace-normal text-lg font-bold text-black">
                                    {dataDetailTestCase?.getTestCaseById?.testCaseName}
                                </p>
                                <p className="text-sm text-[#787878]">
                                    ID: {dataDetailTestCase?.getTestCaseById?.testCaseId}
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <div
                                        onClick={() => {
                                            setSelectForm('edit'),
                                                setEditTestCaseId(dataDetailTestCase?.getTestCaseById?.testCaseId),
                                                setIsOpenTest(true);
                                        }}
                                        className="flex h-[32px] w-[76px] cursor-pointer items-center justify-center gap-2 bg-[#F4F4F4] text-sm font-medium"
                                    >
                                        <Icon name="edit" className="h-4 w-4" />
                                        <p>Edit</p>
                                    </div>
                                    <div
                                        onClick={() => {
                                            setOpenDeleteTestCase(true),
                                                setArrayTestCaseId([dataDetailTestCase?.getTestCaseById?.testCaseId]);
                                        }}
                                        className="flex h-[32px] w-[92px] cursor-pointer items-center justify-center gap-2 bg-[#F4F4F4] text-sm font-medium text-[#FA6161]"
                                    >
                                        <Icon name="delete" className="h-4 w-4 fill-[#FA6161]" />
                                        <p> Delete</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                {/*Description  */}
                                <div className="">
                                    <p className="text-[15px] font-semibold ">Description</p>

                                    {dataDetailTestCase?.getTestCaseById?.description ? (
                                        <div className={`w-[450px] py-2`}>
                                            <ReactQuill
                                                theme="snow"
                                                id="objective"
                                                className={` react-quill-hidden-calendar  `}
                                                value={dataDetailTestCase?.getTestCaseById?.description}
                                                readOnly={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="max-h-[150px] py-2 text-sm text-[#787878]">Not set</div>
                                    )}
                                </div>
                                {/* Expected */}
                                <div className="mt-1">
                                    <p className="text-[15px] font-semibold">Expected</p>
                                    {dataDetailTestCase?.getTestCaseById?.expectResult ? (
                                        <div className={`w-[450px] py-2`}>
                                            <ReactQuill
                                                theme="snow"
                                                id="objective"
                                                className={` react-quill-hidden-calendar  max-h-full`}
                                                value={dataDetailTestCase?.getTestCaseById?.expectResult}
                                                readOnly={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="max-h-[150px] cursor-pointer py-2 text-sm text-[#787878]">
                                            Not set
                                        </div>
                                    )}
                                </div>
                                {/* Priority */}
                                <div className="mt-1">
                                    <p className="mt-1 text-[15px] font-semibold ">Priority</p>
                                    {dataDetailTestCase?.getTestCaseById?.priority === 1 && (
                                        <p className="mt-1 w-[80px] bg-[#F0F0F0] py-1 text-center text-sm font-medium text-[#787878]">
                                            Low
                                        </p>
                                    )}
                                    {dataDetailTestCase?.getTestCaseById?.priority === 2 && (
                                        <p className="mt-1 w-[80px] bg-[#FFF6D7] py-1 text-center text-sm font-medium  text-[#F1AD00]">
                                            Medium
                                        </p>
                                    )}
                                    {dataDetailTestCase?.getTestCaseById?.priority === 3 && (
                                        <p className="mt-1 w-[80px] bg-[#FFDEDE] py-1 text-center text-sm font-medium  text-[#B41B1B]">
                                            High
                                        </p>
                                    )}
                                </div>
                                {/* Tags */}
                                {dataDetailTestCase?.getTestCaseById?.labelsInfo && (
                                    <div className="mt-4">
                                        <p className="text-[15px] font-semibold">Tags</p>
                                        <div className={`mt-1 flex flex-wrap gap-2 ${checkWidth}`}>
                                            {dataDetailTestCase?.getTestCaseById?.labelsInfo?.map((item, index) => {
                                                return (
                                                    <div
                                                        className={`mt-1 flex gap-2 px-2 py-1 text-center text-sm ${
                                                            ColorChecker(item?.labelColor) == 'dark'
                                                                ? 'text-white'
                                                                : 'text-black'
                                                        }`}
                                                        key={index}
                                                        style={{ backgroundColor: item.labelColor }}
                                                    >
                                                        <Icon
                                                            name="tag"
                                                            className={`mt-1 ${
                                                                ColorChecker(item?.labelColor) == 'dark'
                                                                    ? 'fill-white'
                                                                    : 'fill-black'
                                                            }`}
                                                        />
                                                        <p>{item?.labelName}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {/* Creator */}
                                <div className="mt-4">
                                    <p className="text-[15px] font-semibold">Creator</p>
                                    <div className="mt-1.5 flex gap-2">
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
                                <div className={`mt-4 flex ${checkWidth}`}>
                                    <div className="m w-[50%]">
                                        <p className="text-[15px] font-semibold">Created at</p>
                                        <div className="mt-1 flex gap-2">
                                            <p className="text-sm text-[#787878]">
                                                {toDateStrings(dataDetailTestCase?.getTestCaseById?.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Updated at */}
                                    <div className="mt-4 w-[50%]">
                                        <p className="text-[15px] font-semibold">Updated at</p>
                                        <div className="mt-1 flex gap-2">
                                            <p className="text-sm text-[#787878]">
                                                {toDateTimeString(dataDetailTestCase?.getTestCaseById?.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-1">
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
                        </div>
                    )}
                </div>

                <PopupDetailExpected
                    isOpen={isOpenPopupExpected}
                    setIsOpen={setIsOpenPopupExpected}
                    dataDetailTestCase={dataDetailTestCase}
                    setSelectForm={setSelectForm}
                    setEditTestCaseId={setEditTestCaseId}
                    setIsOpenTest={setIsOpenTest}
                    setOpenDeleteTestCase={setOpenDeleteTestCase}
                    setArrayTestCaseId={setArrayTestCaseId}
                    setIdTestCase={setIdTestCase}
                    fileSeq={fileSeq}
                    setFileSeq={setFileSeq}
                />
            </div>
        </div>
    );
};

export default DetailTestCase;
