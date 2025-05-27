import AttachFile from 'components/AttachFile/AttachFile';
import { ColorChecker } from 'components/common/ColorChecker';
import { toDateStrings, toDateTimeString } from 'components/common/ConvertTime';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useState } from 'react';
import ReactQuill from 'react-quill';

const PopupDetailExpected = ({
    isOpen,
    setIsOpen,
    dataDetailTestCase,
    setIsOpenTest,
    setEditTestCaseId,
    setSelectForm,
    setOpenDeleteTestCase,
    setArrayTestCaseId,
    setIdTestCase,
    fileSeq,
    setFileSeq
}) => {
    const [isClosing, setIsClosing] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };

    return (
        <div>
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setIsClosing={setIsClosing}
                isClosing={isClosing}
                chooseOut={true}
            >
                <div className="w-[1140px] ">
                    <div className="flex justify-between border-b px-3  pb-2 pt-3">
                        <p className="text-lg font-bold">Test Case Detail</p>
                        <div onClick={() => handleClose()} className="cursor-pointer">
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="px-4 py-3">
                        <div className="border-b pb-4 ">
                            <p className="text-lg font-bold">{dataDetailTestCase?.getTestCaseById?.testCaseName} </p>
                            <p className="text-sm text-[#787878]">
                                ID: {dataDetailTestCase?.getTestCaseById?.testCaseId}
                            </p>
                            <div className="mt-4 flex gap-3">
                                <div
                                    onClick={() => {
                                        setSelectForm('edit'),
                                            setEditTestCaseId(dataDetailTestCase?.getTestCaseById?.testCaseId),
                                            setIsOpenTest(true);
                                        handleClose();
                                    }}
                                    className="flex h-[32px] w-[76px] cursor-pointer items-center justify-center gap-2 bg-[#F4F4F4] text-sm font-medium"
                                >
                                    <Icon name="edit" className="h-4 w-4" />
                                    <p>Edit</p>
                                </div>
                                <div
                                    onClick={() => {
                                        setOpenDeleteTestCase(true),
                                            setArrayTestCaseId([dataDetailTestCase?.getTestCaseById?.testCaseId]),
                                            setIdTestCase(null);
                                        handleClose();
                                    }}
                                    className="flex h-[32px] w-[92px] cursor-pointer items-center justify-center gap-2 bg-[#F4F4F4] text-sm font-medium text-[#FA6161]"
                                >
                                    <Icon name="delete" className="h-4 w-4 fill-[#FA6161]" />
                                    <p> Delete</p>
                                </div>
                            </div>
                        </div>
                        {/*Description  */}
                        <div className="mt-4">
                            <p className="text-[15px] font-semibold">Description</p>

                            {dataDetailTestCase?.getTestCaseById?.description ? (
                                <div className={`   py-2`}>
                                    <ReactQuill
                                        theme="snow"
                                        id="objective"
                                        className={` react-quill-hidden-calendar  `}
                                        value={dataDetailTestCase?.getTestCaseById?.description}
                                        readOnly={true}
                                    />
                                </div>
                            ) : (
                                <div className="max-h-[150px]   py-2  text-sm text-[#787878]">Not set</div>
                            )}
                        </div>

                        {/* Expected */}
                        <div className="mt-1">
                            <p className="text-[15px] font-semibold">Expected</p>
                            {dataDetailTestCase?.getTestCaseById?.expectResult ? (
                                <div className={`  py-2 `}>
                                    <ReactQuill
                                        theme="snow"
                                        id="objective"
                                        className={` react-quill-hidden-calendar max-h-full'`}
                                        value={dataDetailTestCase?.getTestCaseById?.expectResult}
                                        readOnly={true}
                                    />
                                </div>
                            ) : (
                                <div className="max-h-[150px] cursor-pointer   py-2 text-sm text-[#787878] ">
                                    No expected available
                                </div>
                            )}
                        </div>
                        {/* Priority */}
                        <div className="mt-1">
                            <p className="text-[15px] font-semibold">Priority</p>
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
                                <div className={`flex flex-wrap gap-2 `}>
                                    {dataDetailTestCase?.getTestCaseById?.labelsInfo?.map((item, index) => {
                                        return (
                                            <div
                                                className={`mt-1 flex gap-2  px-2 py-1 text-center text-sm ${
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
                                        {' '}
                                        {dataDetailTestCase?.getTestCaseById?.fullName}
                                    </p>
                                    <p className="text-sm text-[#787878]">
                                        @{dataDetailTestCase?.getTestCaseById?.userName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Last Modified */}
                        <div className={`mt-4 flex `}>
                            <div className="mt-1 w-[50%]">
                                <p className="text-[15px] font-semibold">Created at</p>
                                <div className="mt-2 flex gap-2">
                                    <p className="text-sm text-[#787878]">
                                        {toDateStrings(dataDetailTestCase?.getTestCaseById?.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {/* Updated at */}
                            <div className="mt-4 w-[50%]">
                                <p className="text-[15px] font-semibold">Updated at</p>
                                <div className="mt-2 flex gap-2">
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
            </ModalComponent>
        </div>
    );
};

export default PopupDetailExpected;
