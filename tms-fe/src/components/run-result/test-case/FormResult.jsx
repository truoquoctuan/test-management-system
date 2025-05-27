import { useMutation, useQuery } from '@apollo/client';
import { clientRepo, clientRun } from 'apis/apollo/apolloClient';
import { LIST_MEMBER_TEST_PLAND } from 'apis/apollo/test-plan/mutation';
import { CREATE_TEST_RESULT } from 'apis/run-result/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import UploadImage from 'components/AttachFile/UploadImage';
import { modulesImage } from 'components/common/FormatQuill';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { debounce } from 'lodash';
import ImageResize from 'quill-image-resize-module-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import { toast } from 'sonner';
import ModalComponent from '../../common/Modal';
import Icon from '../../icons/icons';
const dataStatus = [
    { id: 1, name: 'Passed', color: '#2A9C58' },
    { id: 2, name: 'Failed', color: '#FF6060' },
    { id: 3, name: 'Retest', color: '#E1A50A' },
    { id: 4, name: 'Skipped', color: '#1D79ED' }
];

Quill.register('modules/imageResize', ImageResize);
const FormResult = ({
    isOpen,
    setIsOpen,
    status,
    testCaseId,
    refetch,
    setCallBack,
    callBack,
    testPlanId,
    // eslint-disable-next-line no-unused-vars
    setSelectTab
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpenPriority, setIsOpenPriority] = useState(false);
    const [isOpenAssign, setIsOpenAssign] = useState(false);
    const modalRef = useRef(null);
    const [fileSeq, setFileSeq] = useState([]);
    const { userInfo } = useGlobalContext();
    const [selectedMembers, setSelectedMembers] = useState([]);
    useOutsideClick(modalRef, setIsOpenAssign);

    // getMember
    const [name, setName] = useState('');

    const debouncedSearch = useCallback(
        debounce((value) => {
            setName(value);
        }, 300), // Adjust the debounce delay (in milliseconds) as needed
        []
    );

    const handleInputChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const [listMemberComment, setListMemberComment] = useState(null);
    // Danh sách thành viên testPlan
    const { data: listMemberTestLand } = useQuery(LIST_MEMBER_TEST_PLAND, {
        client: clientRepo,
        variables: { page: 0, size: 30, testPlanId: testPlanId, name: name }
    });

    const listMember = listMemberComment?.getMembersByTestPlanId?.members?.map((item) => ({
        userId: item?.userInfo?.userID,
        fullName: item?.userInfo?.fullName,
        userName: item?.userInfo?.userName
    }));

    useEffect(() => {
        if (listMemberTestLand) {
            setListMemberComment(listMemberTestLand);
        }
    }, [listMemberTestLand]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setSelectedMembers([]);
            reset({});
        }, 500);
    };
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            assignIds: null,
            status: status
        }
    });
    useEffect(() => {
        setValue('status', status);
    }, [status, setValue]);

    // Add result
    const quillRef = useRef(null);
    const insertToEditor = (fileSeq) => {
        const range = quillRef.current.getEditor().getSelection(true) || 1;
        // eslint-disable-next-line no-undef
        const imageUrl = `${process.env.REACT_APP_SERVICE_IMAGE}/${fileSeq?.fileSeq}`;
        const quillEditor = quillRef.current.getEditor();
        quillEditor.insertEmbed(range.index, 'image', `${imageUrl}`);
        quillEditor.format('align', 'center', Quill.sources.USER);
        quillEditor.setSelection(range.index + 1, Quill.sources.SILENT);
    };

    const [createResult] = useMutation(CREATE_TEST_RESULT, { client: clientRun });
    const onSubmit = async (data) => {
        try {
            const newData = {
                assignIds: data.assignIds.map((member) => member.userId).join(','),
                content: data.content,
                status: data.status.id,
                testCaseId: String(testCaseId),
                userId: String(userInfo.userID),
                fileSeqs: fileSeq ? fileSeq?.map((item) => item.fileSeq).join(',') : ''
            };
            await createResult({ variables: newData });
            await refetch();
            toast.success('Result added successfully. ');
            setIsOpen(false);
            reset({});
            setFileSeq([]);
            setCallBack(!callBack);
            setSelectedMembers([]);
        } catch (error) {
            toast.error('An error occurred.');
        }
    };

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
                <div className="custom-scroll-y   w-[910px] bg-white p-4 ">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">Add result</p>
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
                        <div className="">
                            <div className="mt-4 h-full w-full  pr-4">
                                <div className="mt-2 flex gap-2">
                                    <div className="relative w-full">
                                        <p className="mb-2 text-sm font-semibold">
                                            Status <span className="text-red-500">*</span>
                                        </p>
                                        <div className="relative">
                                            <Controller
                                                name="status"
                                                control={control}
                                                defaultValue={null}
                                                rules={{ required: 'You must select a status' }}
                                                render={({ field }) => (
                                                    <>
                                                        <div
                                                            className={`relative flex h-[42px] w-full cursor-pointer items-center justify-between border px-2 ${
                                                                errors.status ? 'border-red-500' : ''
                                                            }`}
                                                            onClick={() => setIsOpenPriority(!isOpenPriority)}
                                                        >
                                                            <div className="flex gap-2">
                                                                <p
                                                                    style={{ backgroundColor: field.value?.color }}
                                                                    className="h-5 w-5"
                                                                ></p>
                                                                <p className={`text-sm`}>
                                                                    {field.value?.name || 'Chọn trạng thái'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <Icon name="arrow_down_2" className="fill-black" />
                                                            </div>
                                                        </div>
                                                        {isOpenPriority && (
                                                            <div className="absolute top-9 z-[999] mt-2 w-[199px] border bg-white p-2">
                                                                {dataStatus?.map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex cursor-pointer items-center gap-2 p-2 text-sm font-normal hover:bg-[#F4F4F4]"
                                                                        onClick={() => {
                                                                            field.onChange(item);
                                                                            setIsOpenPriority(false);
                                                                        }}
                                                                    >
                                                                        <p
                                                                            className={`h-4 w-4`}
                                                                            style={{ backgroundColor: item.color }}
                                                                        ></p>
                                                                        <p className="px-1 py-1">{item.name}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            />
                                            {errors.status && (
                                                <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
                                            )}
                                        </div>
                                        <p className="absolute -bottom-5 text-[13px] font-normal text-[#787878]">
                                            Select the result of this Test Case.
                                        </p>
                                    </div>
                                </div>
                                {/* Assign To */}
                                <div className="mt-8  ">
                                    <div className="mt-8  ">
                                        <div className="relative w-full">
                                            <p className="mb-2 text-sm font-semibold">
                                                Assign To <span className="text-red-500">*</span>
                                            </p>
                                            <div className="relative" ref={modalRef}>
                                                <Controller
                                                    name="assignIds"
                                                    control={control}
                                                    defaultValue={[]}
                                                    rules={{ required: 'You must select at least one member' }}
                                                    // eslint-disable-next-line no-unused-vars
                                                    render={({ field }) => (
                                                        <>
                                                            <div
                                                                className={`relative flex max-h-[200px] min-h-[42px] w-full cursor-pointer items-center justify-between border px-2`}
                                                                onClick={() => setIsOpenAssign(!isOpenAssign)}
                                                            >
                                                                <div className="flex flex-wrap gap-2">
                                                                    {selectedMembers.length > 0 ? (
                                                                        selectedMembers.map((member) => (
                                                                            <div
                                                                                key={member.userId}
                                                                                className="flex  items-center gap-2 bg-[#F4F4F4] px-2 py-1 font-medium"
                                                                            >
                                                                                <p className={`text-sm`}>
                                                                                    {member.fullName}
                                                                                </p>
                                                                                <Icon
                                                                                    name="close"
                                                                                    className="h-3 w-3"
                                                                                    onClick={() => {
                                                                                        const newSelectedMembers =
                                                                                            selectedMembers.filter(
                                                                                                (m) =>
                                                                                                    m.userId !==
                                                                                                    member.userId
                                                                                            );
                                                                                        setSelectedMembers(
                                                                                            newSelectedMembers
                                                                                        );
                                                                                        setValue(
                                                                                            'assignIds',
                                                                                            newSelectedMembers
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className={`text-sm`}>Select members</p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <Icon name="arrow_down_2" className="fill-black" />
                                                                </div>
                                                            </div>
                                                            {isOpenAssign && (
                                                                <div className="custom-scroll-y absolute top-9 z-[100] mt-2 max-h-[500px] min-h-[100px] w-full border bg-white p-2">
                                                                    <div className="relative">
                                                                        <div className="absolute left-2 top-2">
                                                                            <Icon
                                                                                name="search"
                                                                                className="fill-[#9C9C9C]"
                                                                            />
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search members"
                                                                            className="focus:border-primary-100 h-[36px]   w-full border  border-[#F1F3FD] bg-white  pl-8 placeholder:text-[13px]  placeholder:font-light focus:outline-none"
                                                                            onChange={handleInputChange}
                                                                        />
                                                                    </div>
                                                                    {listMember.map((item) => (
                                                                        <div
                                                                            key={item.userId}
                                                                            className={`flex cursor-pointer items-center gap-2 px-2 py-1 text-sm font-normal hover:bg-[#F4F4F4] ${
                                                                                selectedMembers.some(
                                                                                    (m) => m.userId === item.userId
                                                                                )
                                                                                    ? 'bg-[#F4F4F4]'
                                                                                    : ''
                                                                            }`}
                                                                            onClick={() => {
                                                                                const isSelected = selectedMembers.some(
                                                                                    (m) => m.userId === item.userId
                                                                                );
                                                                                const newSelectedMembers = isSelected
                                                                                    ? selectedMembers.filter(
                                                                                          (m) =>
                                                                                              m.userId !== item.userId
                                                                                      )
                                                                                    : [...selectedMembers, item];
                                                                                setSelectedMembers(newSelectedMembers);
                                                                                setValue(
                                                                                    'assignIds',
                                                                                    newSelectedMembers
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Icon
                                                                                name={
                                                                                    selectedMembers.some(
                                                                                        (m) => m.userId === item.userId
                                                                                    )
                                                                                        ? 'checkbox'
                                                                                        : 'checkbox_input'
                                                                                }
                                                                            />
                                                                            <AttachFile
                                                                                attachType="UserAvatar"
                                                                                entity="user"
                                                                                seq={item.userId}
                                                                                className="h-8 w-8 rounded-full object-cover"
                                                                                keyProp={item.userId}
                                                                            />
                                                                            <div>
                                                                                <p className="px-1 pt-1">
                                                                                    {item.fullName}
                                                                                </p>
                                                                                <p className="px-1">@{item.userName}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            {errors.assignIds && (
                                                <p className="absolute -bottom-9 flex gap-1 text-[13px]  font-normal text-red-500">
                                                    <Icon name="input_form" />
                                                    <span className="text-sm text-red-500">
                                                        {errors.assignIds.message}
                                                    </span>
                                                </p>
                                            )}
                                            <p className="absolute -bottom-5 text-[13px] font-normal text-[#787878]">
                                                Assign ownership of this Test Case.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mt-10">
                                    <p className="mb-2 text-sm font-semibold">
                                        Execution Detail <span className="text-red-500">*</span>
                                    </p>
                                    <Controller
                                        name="content"
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
                                            <div className="relative">
                                                <div className="absolute -top-1.5 left-2.5 z-[99] cursor-pointer">
                                                    <UploadImage insertToEditor={insertToEditor} />
                                                </div>

                                                <ReactQuill
                                                    {...field}
                                                    theme="snow"
                                                    className="react-quill react-quill-testplan relative  w-full placeholder:text-sm"
                                                    modules={modulesImage}
                                                    ref={quillRef}
                                                    placeholder="Enter a brief description of the folder"
                                                />
                                            </div>
                                        )}
                                    />
                                    <p className="absolute -bottom-6 text-[13px] font-normal text-[#787878]">
                                        Provide execution details for this Test Case.{' '}
                                    </p>
                                    {errors.content && (
                                        <p className="absolute -bottom-11 flex gap-1 text-[13px]   font-normal text-red-500">
                                            <Icon name="input_form" />
                                            <span className="text-sm text-red-500">{errors.content.message}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="mt-10 w-full">
                                    {/*Attachments */}
                                    <div className="relative ">
                                        <p className=" text-sm font-semibold">Attachments</p>
                                        <AttachFile
                                            attachType="MultipleFiles"
                                            fileSeq={fileSeq}
                                            seq={null}
                                            setFileSeq={setFileSeq}
                                            viewMode={true}
                                            mode="member"
                                            className="h-20 w-20 rounded-full object-cover"
                                            filters={{
                                                max_file_size: '10mb',
                                                mime_types: [
                                                    {
                                                        title: 'Tệp đã được nhận: ',
                                                        extensions:
                                                            'xlsx,pptx,txt,csv,docx,pdf,png,jpg,jpeg,ppt,zip,rar'
                                                    }
                                                ]
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="  mt-3 flex w-full justify-center gap-3">
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

export default FormResult;
