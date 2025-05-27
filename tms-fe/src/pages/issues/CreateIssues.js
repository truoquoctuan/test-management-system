/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import { clientRepo, clientRun } from 'apis/apollo/apolloClient';
import { LIST_MEMBER_TEST_PLAND } from 'apis/apollo/test-plan/mutation';
import { CREATE_ISSUE } from 'apis/issues/issues';
import AttachFile from 'components/AttachFile/AttachFile';
import UploadImage from 'components/AttachFile/UploadImage';
import { modulesImage } from 'components/common/FormatQuill';
import Loading from 'components/common/Loading';
import useCloseModalOnOutsideClick from 'components/common/modalMouse';
import { toDateStringYear } from 'components/common/Time';
import Title from 'components/common/Title';
import Button from 'components/design-system/Button';
import Icon from 'components/icons/icons';
import ModalIssuesSelectTestcase from 'components/issues/ModalIssuesSelectTestcase';
import TagsIssue from 'components/issues/TagsIssues';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { debounce } from 'lodash';
import ImageResize from 'quill-image-resize-module-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Flatpickr from 'react-flatpickr';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

Quill.register('modules/imageResize', ImageResize);

const CreateIssues = () => {
    const [createIssues] = useMutation(CREATE_ISSUE, { client: clientRun });
    const [tags, setTags] = useState([]);
    const [isLoadingCreateForm, setIsLoadingCreateForm] = useState(true);
    const navigate = useNavigate();
    const [selectedIdTestCases, setSelectedIdTestCases] = useState([]);
    const { testPlanName } = useGlobalContext();
    const [fileSeq, setFileSeq] = useState([]);
    const modalRef = useRef(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [dataStatus, setDataStatus] = useState({ name: 'Select the priority' });
    const [isOpenAssign, setIsOpenAssign] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { testPlanId } = useParams();
    const [dataTestcase, setDataTestcase] = useState([]);
    const { userInfo } = useGlobalContext();
    const [ModalSelectTestcase, setModalSelectTestcase] = useState(false);
    useOutsideClick(modalRef, setIsOpenAssign);
    useEffect(() => {
        setTimeout(() => {
            setIsLoadingCreateForm(false);
        }, 1000);
    }, []);
    const {
        control,
        watch,
        register,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const errorRef = useRef(null);
    const [name, setName] = useState('');
    const [listMemberComment, setListMemberComment] = useState(null);
    const handleDelete = (id) => {
        const dataNew = selectedIdTestCases?.filter((item) => item?.id !== id);
        setSelectedIdTestCases(dataNew);
    };
    const { data: listMemberTestLand } = useQuery(LIST_MEMBER_TEST_PLAND, {
        client: clientRepo,
        variables: { page: 0, size: 30, testPlanId: testPlanId, name: name?.trim() === '' ? undefined : name.trim() }
    });

    useEffect(() => {
        // if (isOpenAssign == false) {
        setName('');
        // }
    }, [isOpenAssign]);

    useEffect(() => {
        if (listMemberTestLand) {
            setListMemberComment(listMemberTestLand);
        }
    }, [listMemberTestLand]);
    const listMember = listMemberComment?.getMembersByTestPlanId?.members?.map((item) => ({
        userId: item?.userInfo?.userID,
        fullName: item?.userInfo?.fullName,
        userName: item?.userInfo?.userName
    }));

    const handleSelectTestCasesClick = () => {
        setModalSelectTestcase(true);
    };
    const closeModal = () => {
        setModalSelectTestcase(false);
    };
    const debouncedSearch = useCallback(
        debounce((value) => {
            setName(value);
        }, 300),
        []
    );
    const handleInputChange = (e) => {
        debouncedSearch(e.target.value);
    };
    const prorityRef = useRef(null);
    const [isOpenPriority, setIsOpenPriority] = useState(false);
    useCloseModalOnOutsideClick(prorityRef, setIsOpenPriority);
    const startDate = watch('startDate');
    const SubmitForm = async (data) => {
        const idString = data?.assignIds
            ?.filter((item) => item?.userId !== undefined)
            ?.map((item) => item.userId)
            ?.join(',')
            .toString();
        const newdata = {
            description: data?.description,
            endDate: data?.endDate ? toDateStringYear(data?.endDate) + 'T00:00:00' : '',
            issuesName: data?.title,
            note: data?.note,
            priority: data?.priority?.value,
            scope: data?.scope,
            startDate: data?.startDate ? toDateStringYear(data?.startDate) + 'T00:00:00' : '',
            status: 1,
            createdBy: userInfo?.userID?.toString(),
            assignIds: idString,
            testPlanId: testPlanId.toString(),
            testCaseSelection: selectedIdTestCases?.map((x) => x?.id).join(),
            uploadKey: data?.uploadKey,
            labels: tags?.map((item) => item?.labelId).join()
        };
        try {
            await createIssues({ variables: newdata });
            toast.success('Issue created successfully!');
            navigate(`/test-plan/issues/${testPlanId}`);
        } catch (error) {
            toast.error('An error occurred.');
        }
    };
    useEffect(() => {
        if (errors.assignIds) {
            errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errors.assignIds]);

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
    useEffect(() => {
        if (errors?.priority) {
            errorRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }, [errors?.priority]);
    return (
        <div className="flex h-screen w-full flex-col gap-2 py-3">
            <div className="mt-2 flex gap-2 text-sm">
                <p
                    className="max-w-[150px] truncate font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/plan-information/${testPlanId}`)}
                >
                    {testPlanName}
                </p>
                <p className="font-normal text-[#787878]">/</p>
                <p
                    className="cursor-pointer font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/issues/${testPlanId}`)}
                >
                    Issues
                </p>
                <p className="font-normal text-[#787878]">/</p>
                <p className="max-w-[250px] truncate font-semibold text-black">Add issue</p>
            </div>

            <div className="flex gap-2">
                <div title="Return" onClick={() => navigate(`/test-plan/issues/${testPlanId}`)}>
                    <Icon name="arrow_back" className="mt-2 cursor-pointer" />
                </div>
                <Title
                    name="Add Issue"
                    subtitle="Report a new issue to track and resolve problems within your Test Plan."
                />
            </div>
            {isLoadingCreateForm ? (
                <div className="absolute flex  h-[80%]  w-[80%]  items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <form onSubmit={handleSubmit(SubmitForm)} className="flex h-full w-full flex-col ">
                    <div className={`flex flex-col bg-white p-4`}>
                        {/* id */}
                        <div className="mb-2 flex flex-col">
                            <div className="mb-1 flex gap-1 text-sm font-semibold">
                                <span>ID</span>
                                <span className="text-state-error "> *</span>
                            </div>
                            <div className="flex h-[40px] w-[300px] items-center justify-start border border-[#B3B3B3] bg-[#F4F4F4] p-2 text-sm text-[#787878]">
                                Auto
                            </div>
                            <div className="text-[13px] text-[#787878]">Unique identifier for the Issue.</div>
                        </div>
                        {/* Title */}
                        <div className="mb-2 flex w-[70%] flex-col">
                            <div className="mb-1 flex items-center justify-start gap-1 text-sm font-semibold">
                                <div>Name</div>
                                <div className="text-red-500">*</div>
                            </div>
                            <input
                                {...register('title', {
                                    required: 'This field is required.',
                                    maxLength: { value: 255, message: 'Maximum 255 characters' },
                                    validate: (value) => value.trim() !== '' || 'This field is required.'
                                })}
                                placeholder="Enter a name for issue"
                                className="flex h-[40px] w-full items-center justify-start border border-[#B3B3B3] p-3  placeholder:text-[14px] focus:border-primary-1 focus:outline-none"
                            />
                            <div className="text-[13px] text-[#787878]">Enter a name to identify the Issue.</div>
                            {errors.title && (
                                <p className="flex gap-1 text-[13px] font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.title.message}</span>
                                </p>
                            )}
                        </div>
                        {/* Assign To */}
                        <div className="mb-2 w-[70%] ">
                            <div ref={errorRef} className="">
                                <div className="relative w-full">
                                    <div className="mb-1 flex gap-1 text-sm font-semibold">
                                        <span> Assign To </span>
                                    </div>
                                    <div className="relative" ref={modalRef}>
                                        <Controller
                                            name="assignIds"
                                            control={control}
                                            defaultValue={[]}
                                            render={({ field }) => (
                                                <>
                                                    <div
                                                        className={`relative flex max-h-[200px] min-h-[42px] w-full cursor-pointer items-center justify-between border border-[#B3B3B3] px-2`}
                                                        onClick={() => setIsOpenAssign(!isOpenAssign)}
                                                    >
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedMembers?.length > 0 ? (
                                                                selectedMembers?.map((member) => (
                                                                    <div
                                                                        key={member.userId}
                                                                        className="flex items-center gap-2 bg-[#F4F4F4] px-2 py-1 font-medium"
                                                                    >
                                                                        <p className={`text-sm`}>{member.fullName}</p>
                                                                        <Icon
                                                                            name="close"
                                                                            className="h-3 w-3"
                                                                            onClick={() => {
                                                                                const newSelectedMembers =
                                                                                    selectedMembers?.filter(
                                                                                        (m) =>
                                                                                            m.userId !== member.userId
                                                                                    );
                                                                                setSelectedMembers(newSelectedMembers);
                                                                                setValue(
                                                                                    'assignIds',
                                                                                    newSelectedMembers
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className={`text-sm text-[#B3B3B3]`}>
                                                                    Select members
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Icon name="down" className="fill-black" />
                                                        </div>
                                                    </div>
                                                    {isOpenAssign && (
                                                        <div className="custom-scroll-y absolute top-9 z-30 mt-2 max-h-[500px] min-h-[100px] w-full border bg-white p-2">
                                                            <div className="relative">
                                                                <div className="absolute left-2 top-2">
                                                                    <Icon name="search" className="fill-[#9C9C9C]" />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search members"
                                                                    className="focus:border-primary-100 h-[36px]   w-full border  border-[#F1F3FD] bg-white  pl-8 placeholder:text-[13px]  placeholder:font-light focus:outline-none"
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            {listMember?.map((item) => (
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
                                                                        const isSelected = selectedMembers?.some(
                                                                            (m) => m.userId === item.userId
                                                                        );
                                                                        const newSelectedMembers = isSelected
                                                                            ? selectedMembers?.filter(
                                                                                  (m) => m.userId !== item.userId
                                                                              )
                                                                            : [...selectedMembers, item];
                                                                        setSelectedMembers(newSelectedMembers);
                                                                        setValue('assignIds', newSelectedMembers);
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
                                                                        <p className="px-1 pt-1">{item.fullName}</p>
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
                                    <div className="text-[13px] text-[#787878]">Assign ownership of Issue.</div>
                                </div>
                            </div>
                        </div>
                        {/* Scope of Impact */}
                        <div className="mb-2 flex w-[70%] flex-col ">
                            <div className="flex items-center justify-start text-sm font-semibold">
                                <div>Scope of Impact</div>
                            </div>
                            <input
                                {...register('scope', { maxLength: 255 })}
                                placeholder="Enter a scope of impact"
                                className="flex h-[40px] w-full items-center justify-start border border-[#B3B3B3] p-3   placeholder:text-[14px] focus:border-primary-1 focus:outline-none"
                            />
                            <div className="text-[13px] text-[#787878]">
                                Describe the extent of the Issue{`'`}s impact.
                            </div>
                            {errors?.scope && (
                                <p className="flex gap-1 text-[13px] font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">Maximum 255 characters</span>
                                </p>
                            )}
                        </div>
                        {/* Tags */}
                        <div className="mb-2">
                            <TagsIssue tags={tags} setTags={setTags} />
                            <div className="text-[13px] text-[#787878]">Select or create tags to categorize.</div>
                        </div>
                        {/* Priority */}
                        <div className="mb-2">
                            <div className="flex gap-1 text-sm font-semibold">
                                <span>Priority</span>
                                <span className="text-state-error "> *</span>
                            </div>
                            <div className="relative mt-1">
                                <Controller
                                    name="priority"
                                    control={control}
                                    defaultValue={dataStatus}
                                    rules={{
                                        validate: (value) => {
                                            return (
                                                (value && [1, 2, 3].includes(value.value)) ||
                                                'Please select a valid option'
                                            );
                                        }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <div
                                                className="flex w-[385px] cursor-pointer justify-between  border border-[#B3B3B3] p-2"
                                                onClick={() => setIsOpenPriority(!isOpenPriority)}
                                            >
                                                <p
                                                    className={`text-sm font-medium ${
                                                        field.value.value === 1
                                                            ? 'text-[#787878]'
                                                            : field.value.value === 2
                                                            ? 'text-[#FFA500]'
                                                            : field.value.value === 3
                                                            ? 'text-[#B41B1B]'
                                                            : 'text-[#787878]'
                                                    }`}
                                                >
                                                    {field.value.name}
                                                </p>
                                                <Icon name="down" className="fill-neutral-1 p-0.5" />
                                            </div>
                                            {isOpenPriority && (
                                                <div
                                                    ref={prorityRef}
                                                    className="absolute z-30 mt-1 w-[385px] border bg-white text-[14px]"
                                                >
                                                    <p
                                                        className="cursor-pointer p-2 font-medium text-[#787878] hover:bg-[#F4F4F4]"
                                                        onClick={() => {
                                                            field.onChange({ name: 'Low', value: 1 });
                                                            setDataStatus({ name: 'Low', value: 1 });
                                                            setIsOpenPriority(false);
                                                        }}
                                                    >
                                                        Low
                                                    </p>
                                                    <p
                                                        className="cursor-pointer p-2 font-medium text-[#FFA500] hover:bg-[#F4F4F4]"
                                                        onClick={() => {
                                                            field.onChange({ name: 'Medium', value: 2 });
                                                            setDataStatus({ name: 'Medium', value: 2 });
                                                            setIsOpenPriority(false);
                                                        }}
                                                    >
                                                        Medium
                                                    </p>
                                                    <p
                                                        className="cursor-pointer p-2 font-medium text-[#B41B1B] hover:bg-[#F4F4F4]"
                                                        onClick={() => {
                                                            field.onChange({ name: 'High', value: 3 });
                                                            setDataStatus({ name: 'High', value: 3 });
                                                            setIsOpenPriority(false);
                                                        }}
                                                    >
                                                        High
                                                    </p>
                                                </div>
                                            )}
                                            <div className="text-[13px] text-[#787878]">
                                                Select the priority level for Issue.
                                            </div>
                                            {errors.priority && (
                                                <p className="flex gap-1 text-[13px] font-normal text-red-500">
                                                    <Icon name="input_form" />
                                                    <span className="text-sm text-red-500">
                                                        {errors.priority.message}
                                                    </span>
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                        {/* Link to Test Case */}

                        <div className=" mb-4 flex w-[70%] flex-col gap-1 ">
                            <div className=" text-sm font-semibold">Link to Test case</div>
                            {selectedIdTestCases?.length > 0 && (
                                <div>
                                    {selectedIdTestCases?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="relative mb-2 flex h-[40px] items-center justify-start gap-2 border bg-[#F4F4F4] pl-2 text-[14px] font-semibold text-[#121212] "
                                        >
                                            <div className="flex items-center gap-2   p-2 ">
                                                <Icon name="file_issue" />
                                                <div>
                                                    #<span>{item?.id}</span>
                                                </div>
                                            </div>
                                            <div
                                                className="absolute right-1 top-1/2 z-10 translate-y-[-50%] cursor-pointer  px-2 pt-2"
                                                onClick={() => handleDelete(item?.id)}
                                            >
                                                <Icon name="close_Circle" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex h-[80px] w-full  items-center justify-center border border-dashed border-[#B3B3B3]">
                                <button
                                    type="button"
                                    onClick={handleSelectTestCasesClick}
                                    className="border border-[#B3B3B3] px-3 py-1 text-sm text-[#787878]"
                                >
                                    Select Test Cases
                                </button>
                            </div>
                            {/* Modal */}
                            {ModalSelectTestcase && (
                                <ModalIssuesSelectTestcase
                                    dataTestcase={dataTestcase}
                                    setDataTestcase={setDataTestcase}
                                    testPlanId={testPlanId}
                                    onClose={closeModal}
                                    selectedIdTestCases={selectedIdTestCases}
                                    setSelectedIdTestCases={setSelectedIdTestCases}
                                />
                            )}
                        </div>
                        {/* startdate and enddate */}
                        <div className="mb-2 flex justify-start gap-6">
                            <div className=" flex gap-3">
                                <div>
                                    <div className="mb-1 text-sm font-semibold">Start Date</div>

                                    <div className="relative">
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Flatpickr
                                                    {...field}
                                                    className=" min-w-96 border border-neutral-4 px-3 py-2 text-sm focus:border-neutral-1 focus:outline-none"
                                                    placeholder="dd/mm/yyyy"
                                                    options={{
                                                        dateFormat: 'd/m/Y',
                                                        theme: 'material_blue'
                                                    }}
                                                    onChange={(date) => field.onChange(date[0])}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="text-[13px] text-[#787878]">
                                        Estimated time to start the process.
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-1 text-sm font-semibold">End Date</div>
                                    <div className="relative">
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Flatpickr
                                                    {...field}
                                                    className="flatpickr-input min-w-96 border border-neutral-4 px-3 py-2 text-sm focus:border-neutral-1 focus:outline-none"
                                                    placeholder="dd/mm/yyyy"
                                                    options={{
                                                        dateFormat: 'd/m/Y',
                                                        minDate: startDate,
                                                        theme: 'material_blue'
                                                    }}
                                                    onChange={(date) => field.onChange(date[0])}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="text-[13px] text-[#787878]">Estimated time to end the process.</div>
                                </div>
                            </div>
                        </div>
                        {/* Description (optional) */}
                        <div className="mb-2">
                            <p className={` mb-1 text-sm font-semibold`} htmlFor="">
                                Description
                            </p>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                rules={{
                                    maxLength: { value: 10000, message: 'Maximum 10000 characters.' }
                                }}
                                render={({ field }) => (
                                    <div className="relative w-[70%]">
                                        <div className="absolute -top-1.5  left-2.5 z-[10] cursor-pointer">
                                            <UploadImage insertToEditor={insertToEditor} />
                                        </div>

                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            className="react-quill react-quill-testplan relative   placeholder:text-sm"
                                            modules={modulesImage}
                                            ref={quillRef}
                                            placeholder="Enter a brief description of the issue"
                                        />
                                    </div>
                                )}
                            />
                            <div className={`text-[13px] text-[#787878] `}>
                                Provide a detailed description of the Issue.
                            </div>
                            {errors.description && (
                                <p className="flex gap-1 text-[13px] font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.description.message}</span>
                                </p>
                            )}
                        </div>
                        {/* Note */}
                        <div className="mb-2 flex w-[70%] flex-col ">
                            <div className="mb-1 flex items-center justify-start gap-1 text-sm font-semibold">
                                <div>Note</div>
                            </div>
                            <input
                                {...register('note', {
                                    maxLength: {
                                        value: 255,
                                        message: 'Maximum 255 characters.'
                                    }
                                })}
                                placeholder="Enter a note"
                                className="flex h-[40px] w-full items-center justify-start border border-[#B3B3B3] p-3  placeholder:text-[14px] focus:border-primary-1 focus:outline-none"
                            />
                            <div className="text-[13px] text-[#787878]">Additional information or comments.</div>
                            {errors.note && (
                                <p className="flex gap-1 text-[13px] font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.note.message}</span>
                                </p>
                            )}
                        </div>
                        {/*Attachments */}
                        <div className="relative w-[70%]">
                            <p className=" text-sm font-semibold">Attachments</p>
                            <AttachFile
                                attachType="UploadIssuse"
                                fileSeq={fileSeq}
                                seq={null}
                                setFileSeq={setFileSeq}
                                register={register}
                                viewMode={true}
                                mode="member"
                                className="h-20 rounded-full object-cover"
                                filters={{
                                    max_file_size: '10mb',
                                    mime_types: [
                                        {
                                            title: 'Tệp đã được nhận: ',
                                            extensions: 'xlsx,pptx,txt,csv,docx,pdf,png,jpg,jpeg,zip,rar,doc,ppt'
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        {/* Cancel / Submit */}
                        <div className="flex w-full items-center justify-center gap-3 pb-16 pt-6">
                            <button
                                onClick={() => navigate(`/test-plan/issues/${testPlanId}`)}
                                type="button"
                                className=" w-[120px]  border border-[#787878] px-3 py-2 text-center text-sm font-medium text-[#787878] hover:bg-[#f0efef]"
                            >
                                Cancel
                            </button>

                            <Button
                                type="submit"
                                icon={
                                    isLoading ? (
                                        <Icon name="loading" className="h-5 w-5 animate-spin text-white" />
                                    ) : null
                                }
                                className="w-[120px] border  border-primary-1 bg-primary-1 px-3 py-2 text-center text-sm font-medium text-white transition-all duration-150 hover:bg-[#0066cc]"
                            >
                                Add Issue
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
export default CreateIssues;
