/* eslint-disable no-unused-vars */
import { useMutation } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { MODIFY_PRORITY } from 'apis/issues/issues';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
// eslint-disable-next-line no-unused-vars
const EditPrority = ({ dataIssueById, idIssue, refetch }) => {
    const [isOpenPriority, setIsOpenPriority] = useState(false);
    const { control, register, reset, handleSubmit } = useForm();
    const modalRef = useRef();
    const getPriorityDetails = (priority) => {
        switch (priority) {
            case 1:
                return { label: 'Low', bgColor: 'bg-gray-200', textColor: 'text-gray-700' };
            case 2:
                return { label: 'Medium', bgColor: 'bg-[#FFF5BE]', textColor: 'text-[#F1AD00]' };
            case 3:
                return { label: 'High', bgColor: 'bg-red-200', textColor: 'text-red-700' };
            default:
                return { label: 'Unknown', bgColor: 'bg-gray-200', textColor: 'text-gray-700' };
        }
    };
    const priorityDetails = getPriorityDetails(dataIssueById?.priority);
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const [dataTestcase, setDataTestcase] = useState(
        dataIssueById
            ? dataIssueById?.testCases?.map((item) => ({
                  testCaseId: item.testCaseId,
                  testCaseName: item.testCaseName
              }))
            : []
    );
    const [updatePrority] = useMutation(MODIFY_PRORITY, { client: clientRun });

    const handleSubmitPrority = async (data) => {
        const newdata = {
            issuesId: idIssue,
            priority: data
        };
        await updatePrority({
            variables: newdata
        });
        refetch();
    };
    useOutsideClick(modalRef, setIsOpenPriority);
    const [loadingTag, setLoadingTag] = useState(false);

    useEffect(() => {
        if (isOpenPriority == false) {
            setLoadingTag(true);
            setTimeout(() => {
                setLoadingTag(false);
            }, 1000);
        }
    }, [isOpenPriority]);
    return (
        <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-2 " ref={modalRef}>
            <div className="flex justify-between ">
                <div className="text-[14px] font-semibold">Priority</div>
                {checkStatus === 1 && checkRoleTestPland !== 3 && (
                    <button className="text-sm text-[#1D79ED]" onClick={() => setIsOpenPriority(!isOpenPriority)}>
                        Edit
                    </button>
                )}
            </div>
            <div className="flex items-center justify-start gap-8 ">
                {loadingTag ? (
                    <div className="loader h-7 w-7"></div>
                ) : (
                    <div
                        className={`px-3 py-1 text-sm font-semibold ${priorityDetails.bgColor} ${priorityDetails.textColor}`}
                    >
                        {priorityDetails.label}
                    </div>
                )}
            </div>
            {isOpenPriority && (
                <div className="relative ">
                    <Controller
                        name="priority"
                        control={control}
                        defaultValue={1}
                        render={({ field }) => (
                            <>
                                {
                                    <div className="absolute z-30  w-full border bg-white p-2">
                                        <p
                                            className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                            onClick={() => {
                                                field.onChange(3);
                                                setIsOpenPriority(false);
                                                handleSubmitPrority(3);
                                            }}
                                        >
                                            <span className="bg-[#FFE9E9] px-2 py-1 text-red-500">High</span>
                                        </p>
                                        <p
                                            className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                            onClick={() => {
                                                field.onChange(2);
                                                setIsOpenPriority(false);
                                                handleSubmitPrority(2);
                                            }}
                                        >
                                            <span className="bg-[#FFF6D7] px-2 py-1 text-[#E1A50A]">Medium</span>
                                        </p>
                                        <p
                                            className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                            onClick={() => {
                                                field.onChange(1);
                                                setIsOpenPriority(false);
                                                handleSubmitPrority(1);
                                            }}
                                        >
                                            <span className="bg-[#F0F0F0] px-2 py-1 text-[#787878]">Low</span>
                                        </p>
                                    </div>
                                }
                            </>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default EditPrority;
