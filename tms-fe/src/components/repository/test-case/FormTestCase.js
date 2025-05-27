import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TEST_CASE, GET_TEST_CASE_BY_ID, UPDATE_TEST_CASE_BY_ID } from 'apis/repository/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import { formats, modules } from 'components/common/FormatQuill';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { toast } from 'sonner';
import useOutsideClick from '../../../hook/useOutsideClick';
import ModalComponent from '../../common/Modal';
import Icon from '../../icons/icons';
import TagsTestCase from './TagsTestCase';

const FormTestCase = ({ isOpen, setIsOpen, testPlanId, selectedFolder, selectForm, editTestCaseId, refetch }) => {
    const [isOpenPriority, setIsOpenPriority] = useState(false);
    const [tags, setTags] = useState([]);
    const modalRef = useRef(null);
    const { userInfo } = useGlobalContext();
    const [fileSeq, setFileSeq] = useState([]);
    useOutsideClick(modalRef, setIsOpenPriority);

    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    // eslint-disable-next-line no-unused-vars
    const { data: dataDetail, refetch: reFetchDetail } = useQuery(GET_TEST_CASE_BY_ID, {
        variables: { id: editTestCaseId },
        skip: editTestCaseId ? false : true
    });

    useEffect(() => {
        reFetchDetail();
    }, [isOpen]);

    useEffect(() => {
        if (dataDetail?.getTestCaseById && selectForm === 'edit') {
            reset(dataDetail?.getTestCaseById);
            setTags(dataDetail?.getTestCaseById.labelsInfo ? dataDetail?.getTestCaseById.labelsInfo : []);
            setFileSeq(dataDetail?.getTestCaseById.files ? dataDetail?.getTestCaseById.files : []);
        } else {
            reset({});
            setFileSeq([]);
        }
    }, [dataDetail, reset, selectForm, isOpen]);

    // eslint-disable-next-line no-unused-vars
    const [createTestCase] = useMutation(CREATE_TEST_CASE);
    const [updateTestCase] = useMutation(UPDATE_TEST_CASE_BY_ID);

    // Thêm ,edit test case
    const onSubmit = async (data) => {
        const newData = {
            testCaseName: data.testCaseName,
            expectResult: data.expectResult,
            priority: data.priority,
            createdBy: String(userInfo?.userID),
            description: data.description,
            folderId: selectedFolder?.folderId,
            labels: tags?.map((label) => ({
                labelId: parseInt(label.labelId)
            })),
            fileSeqs: fileSeq ? fileSeq?.map((item) => item.fileSeq).join(',') : ''
        };
        const newDataEdit = {
            testCaseId: editTestCaseId,
            testCaseName: data.testCaseName,
            expectResult: data.expectResult,
            priority: data.priority,
            description: data.description,
            labels: tags?.map((label) => ({
                labelId: parseInt(label.labelId)
            })),
            fileSeqs: fileSeq ? fileSeq?.map((item) => item.fileSeq).join(',') : ''
        };
        if (selectForm === 'edit') {
            try {
                await updateTestCase({ variables: newDataEdit });
                await refetch();
                toast.success('Successfully update test case');
            } catch (error) {
                toast.error('Error');
            }
        } else {
            try {
                await createTestCase({
                    variables: newData
                });
                toast.success('Successfully create test case');
                await refetch();
            } catch (error) {
                toast.error('Error');
            }
        }
        handleClose();
    };

    useEffect(() => {
        if (isOpen === false) {
            setTags([]);
            reset({});
        }
    }, [isOpen]);

    return (
        <div className="">
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                reset={reset}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                className=""
            >
                <div className=" w-[1000px] bg-white p-4 ">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">
                            {selectForm === 'edit' ? 'Edit Test Case' : 'Add Test Case'}
                        </p>
                        <div
                            onClick={() => {
                                handleClose();
                            }}
                            className="cursor-pointer"
                        >
                            <Icon name="close" className="h-3 w-3" />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-2 ">
                            <div className="mt-4 h-full w-[720px]  pr-4">
                                <div className="flex gap-2">
                                    <div className="relative w-full">
                                        <p className="mb-2 text-sm font-semibold">
                                            Test Case Name <span className="text-red-500">*</span>
                                        </p>
                                        <Controller
                                            name="testCaseName"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: 'The Test Case Name field is required.',
                                                maxLength: { value: 255, message: 'Maximum 255 characters.' }
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    className="h-[40px] w-full border border-[#B3B3B3] px-2 placeholder:text-sm focus:border-blue-600 focus:outline-none"
                                                    placeholder="Enter a name for test case"
                                                />
                                            )}
                                        />

                                        <p className="absolute -bottom-5 text-[13px] font-normal text-[#787878]">
                                            Enter a name to identify the test case.
                                        </p>
                                        {errors.testCaseName && (
                                            <p className="absolute -bottom-10 flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                                <Icon name="input_form" />
                                                <p className=" text-sm text-red-500">{errors.testCaseName.message}</p>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="relative mt-8">
                                    <p className="mb-2 text-sm font-semibold">Description</p>
                                    <Controller
                                        name="description"
                                        control={control}
                                        defaultValue=""
                                        rules={{ maxLength: { value: 10000, message: 'Maximum 10000 characters.' } }}
                                        render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                className="react-quill react-quill-testplan2 relative z-[9999]  w-[650px] placeholder:text-sm"
                                                modules={modules}
                                                formats={formats}
                                                placeholder="Enter a brief description of the test case"
                                            />
                                        )}
                                    />
                                    <p className="mt-1 text-[13px] font-normal text-[#787878]">
                                        Provide a detailed description of the Test Case.
                                    </p>
                                    {errors.description && (
                                        <p className="absolute -bottom-20 flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                            <Icon name="input_form" />
                                            <p className=" text-sm text-red-500">{errors.description.message}</p>
                                        </p>
                                    )}
                                </div>
                                <div className="relative mt-4">
                                    <p className="mb-2 text-sm font-semibold">
                                        Expected <span className="text-red-500">*</span>
                                    </p>
                                    <Controller
                                        name="expectResult"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: 'The Expected field is required.',
                                            maxLength: { value: 10000, message: 'Maximum 10000 characters.' },
                                            validate: (value) => {
                                                const isEmpty = value === '' || value === '<p><br></p>';
                                                return !isEmpty || 'The Expected field cannot be empty.';
                                            }
                                        }}
                                        render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                theme="snow"
                                                className="react-quill react-quill-testplan2 relative  w-[650px] placeholder:text-sm"
                                                modules={modules}
                                                formats={formats}
                                                placeholder="Enter a brief expected of the test case "
                                            />
                                        )}
                                    />
                                    <p className="mt-1 text-[13px] font-normal text-[#787878]">
                                        Describe the expected outcome for this Test Case.
                                    </p>
                                    {errors.expectResult && (
                                        <p className="flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                            <Icon name="input_form" />
                                            <span className="text-sm text-red-500">{errors.expectResult.message}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 w-[400px]">
                                {/* Priority */}
                                <div className="relative" ref={modalRef}>
                                    <p className="mb-2 text-sm font-semibold">
                                        Priority <span className="text-red-500">*</span>
                                    </p>
                                    <Controller
                                        name="priority"
                                        control={control}
                                        rules={{
                                            required: 'The Priority field is required.'
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <div
                                                    className="relative w-full cursor-pointer border"
                                                    onClick={() => setIsOpenPriority(!isOpenPriority)}
                                                >
                                                    <p
                                                        className={`py-2 pl-2 text-sm ${
                                                            !field.value
                                                                ? 'text-gray-500'
                                                                : field.value === 3
                                                                ? 'text-red-500'
                                                                : field.value === 2
                                                                ? 'text-[#E1A50A]'
                                                                : field.value === 1 && 'text-[#787878]'
                                                        }`}
                                                    >
                                                        {!field.value && 'Select Priority'}
                                                        {field.value === 3 && 'High'}
                                                        {field.value === 2 && 'Medium'}
                                                        {field.value === 1 && 'Low'}
                                                    </p>
                                                    <div className="absolute right-2 top-1">
                                                        <Icon name="down" />
                                                    </div>
                                                </div>
                                                {isOpenPriority && (
                                                    <div className=" absolute z-30 mt-2 w-full border bg-white p-2">
                                                        <p
                                                            className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                                            onClick={() => {
                                                                field.onChange(3);
                                                                setIsOpenPriority(false);
                                                            }}
                                                        >
                                                            <span className="bg-[#FFE9E9] px-2 py-1 text-red-500">
                                                                High
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                                            onClick={() => {
                                                                field.onChange(2);
                                                                setIsOpenPriority(false);
                                                            }}
                                                        >
                                                            <span className="bg-[#FFF6D7] px-2 py-1 text-[#E1A50A]">
                                                                Medium
                                                            </span>
                                                        </p>
                                                        <p
                                                            className="cursor-pointer p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                                            onClick={() => {
                                                                field.onChange(1);
                                                                setIsOpenPriority(false);
                                                            }}
                                                        >
                                                            <span className="bg-[#F0F0F0] px-2 py-1 text-[#787878]">
                                                                Low
                                                            </span>
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                    <p className="mt-1 text-[13px] font-normal text-[#787878]">
                                        Select the priority level for this test case.
                                    </p>
                                    {errors.priority && (
                                        <p className=" flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                            <Icon name="input_form" />
                                            <span className="text-sm text-red-500">{errors.priority.message}</span>
                                        </p>
                                    )}
                                </div>
                                {/* Tags */}
                                <div className="mt-6">
                                    <TagsTestCase testPlanId={testPlanId} tags={tags} setTags={setTags} />
                                    <p className="mt-1 text-[13px] font-normal text-[#787878]">
                                        Select or create tags to categorize.
                                    </p>
                                </div>

                                {/*Attachments */}
                                <div className="relative mt-6 w-[290px]">
                                    <p className="mb-2 text-sm font-semibold">Attachments</p>
                                    <AttachFile
                                        attachType="MultipleFiles"
                                        fileSeq={fileSeq}
                                        seq={editTestCaseId}
                                        setFileSeq={setFileSeq}
                                        viewMode={true}
                                        checkSeq={true}
                                        mode="member"
                                        className=" w-[150px] object-cover"
                                        filters={{
                                            max_file_size: '5mb',
                                            mime_types: [
                                                {
                                                    title: 'Tệp đã được nhận: ',
                                                    extensions: 'xlsx,pptx,txt,csv,docx,pdf,png,jpg,jpeg,ppt,zip,rar'
                                                }
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className=" mt-2 flex w-[95%] justify-center gap-3">
                            <div
                                className="w-[160px] cursor-pointer border border-[#0066CC] py-1.5 text-center font-semibold text-[#0066CC]"
                                onClick={() => {
                                    handleClose();
                                }}
                            >
                                Cancel
                            </div>
                            <button
                                type="submit"
                                className="w-[160px] border border-[#0066CC] bg-[#0066CC] py-1.5 text-center font-semibold text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </ModalComponent>
        </div>
    );
};

export default FormTestCase;
