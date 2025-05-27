import { useMutation, useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GET_ISSUES_BY_ID, REMOVE_ISSUES, UPDATE_ISSUES_STATUS } from 'apis/issues/issues';
import AttachFile from 'components/AttachFile/AttachFile';
import { customStyles } from 'components/common/FormatModal';
import Loading from 'components/common/Loading';
import ModalComponent from 'components/common/Modal';
import Title from 'components/common/Title';
import Icon from 'components/icons/icons';
import EditPrority from 'components/issues/EditPrority';
import Response from 'components/issues/Response';
import EditAssignTo from 'components/issues/updateIssue/EditAssignTo';
import EditEndDate from 'components/issues/updateIssue/EditEndDate';
import EditLabel from 'components/issues/updateIssue/EditLabel';
import EditLinkToTestCase from 'components/issues/updateIssue/EditLinkToTestCase';
import EditStartDate from 'components/issues/updateIssue/EditStartDate';
import UpdateIssuse from 'components/issues/updateIssue/UpdateIssuse';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
const DetailIssues = () => {
    const [removeIssues] = useMutation(REMOVE_ISSUES, { client: clientRun });
    const { id, testPlanId } = useParams();
    const { data: dataIssuesByid, refetch } = useQuery(GET_ISSUES_BY_ID, {
        client: clientRun,
        variables: {
            issuesId: id
        },
        fetchPolicy: 'cache-and-network'
    });
    const { checkStatus, checkRoleTestPland, testPlanName, userInfo } = useGlobalContext();
    const dataIssueById = dataIssuesByid?.getIssuesById;
    const [updateStatusIssues] = useMutation(UPDATE_ISSUES_STATUS, { client: clientRun });
    const [isDeleteIssue, setDeleteIssue] = useState(false);
    const modalRef = useRef(null);
    const [isModalOpenStatus, setIsModalOpenStatus] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [fileSeq, setFileSeq] = useState([]);
    const [isOpenDeleteIssue, setIsOpenDeleteIssue] = useState(false);
    useOutsideClick(modalRef, setDeleteIssue);
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({
        Impact: true,
        Description: true,
        Note: true,
        Attach: true
    });

    useEffect(() => {}, []);
    const handleToggle = (section) => {
        setOpenSections((prevSections) => ({
            ...prevSections,
            [section]: !prevSections[section]
        }));
    };
    const handleStatusClick = (event, id) => {
        setSelectedIssueId(id);
        setIsModalOpenStatus(!isModalOpenStatus);
    };
    const handleDelete = async () => {
        await removeIssues({ variables: { issuesIds: dataIssueById?.issuesId } });
        toast.success('Issue deleted successfully');
        refetch();
        navigate(`/test-plan/issues/${testPlanId}`);
    };
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpenDeleteIssue(false);
            setIsClosing(false);
        }, 500);
    };
    const closeModal = () => {
        setIsModalOpenStatus(false);
        setSelectedIssueId(null);
    };
    const handleStatusSelect = async (status) => {
        if (status !== null && selectedIssueId !== null) {
            await updateStatusIssues({ variables: { issuesId: selectedIssueId, status, userId: userInfo.userID } });
            refetch();
            closeModal(); // Close modal after status update
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setFileSeq([]);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [id]);
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };
    const [loadingTag, setLoadingTag] = useState(false);

    useEffect(() => {
        setLoadingTag(true);
        setTimeout(() => {
            setLoadingTag(false);
        }, 2000);
    }, []);
    return (
        <div className="  h-full w-full">
            <div className="sticky top-0 z-10 bg-state-bg">
                <div className="my-2 flex gap-2 text-sm">
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
                    <p className="break-word max-w-[250px] truncate font-semibold text-black">
                        {dataIssueById?.issuesName}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div title="Return" onClick={() => navigate(`/test-plan/issues/${testPlanId}`)}>
                        <Icon name="arrow_back" className="mt-4 cursor-pointer" />
                    </div>
                    <div className="my-2">
                        <Title name="Issue Details" subtitle="Review detailed issue info." />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="absolute flex h-[80%] w-[80%]  items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <div className="mb-6  ">
                    <div className="flex bg-white  ">
                        <div className="flex h-full w-3/4 flex-col gap-4 border-r  p-4 ">
                            {isOpenEdit === false ? (
                                <div className="m-auto flex w-[98%] flex-col gap-4">
                                    <div className="flex flex-col">
                                        <div className="break-words text-2xl font-bold">
                                            {dataIssueById?.issuesName}
                                        </div>
                                        <div className=" text-sm text-[#787878]">#{dataIssueById?.issuesId}</div>
                                    </div>
                                    <div className="flex items-center justify-start gap-2">
                                        <div className="flex h-[32px] w-[120px] items-center justify-center gap-2 border bg-red-500 ">
                                            <div className="relative h-[48px] px-4 py-2">
                                                <div
                                                    onClick={(event) => {
                                                        checkStatus === 1 &&
                                                            checkRoleTestPland !== 3 &&
                                                            handleStatusClick(event, dataIssueById?.issuesId);
                                                    }}
                                                    className={`flex w-[120px] cursor-pointer justify-center gap-2 py-1 text-[13px] ${
                                                        dataIssueById?.status === 1
                                                            ? 'bg-[#FA6161]' // Unresolved màu đỏ
                                                            : dataIssueById?.status === 2
                                                            ? 'bg-[#24AB5A]' // Resolved màu xanh lá cây
                                                            : dataIssueById?.status === 3
                                                            ? 'bg-[#BDBDBD]' // Non-issue màu xám
                                                            : 'bg-[#BDBDBD]'
                                                    }`}
                                                >
                                                    <div className="text-white">
                                                        {dataIssueById?.status === 1
                                                            ? 'Unresolved'
                                                            : dataIssueById?.status === 2
                                                            ? 'Resolved'
                                                            : dataIssueById?.status === 3
                                                            ? 'Non-issue'
                                                            : ''}
                                                    </div>
                                                    {checkStatus === 1 && checkRoleTestPland !== 3 && (
                                                        <div className="">
                                                            <Icon name="caret_right" className="rotate-90 fill-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                {isModalOpenStatus && selectedIssueId === dataIssueById.issuesId && (
                                                    <div
                                                        className="absolute top-10 z-30 mt-2 w-[120px] border bg-white p-1 "
                                                        onClick={() => closeModal()} // Close modal when clicking outside
                                                    >
                                                        <div className="flex flex-col gap-2 ">
                                                            <div
                                                                onClick={() => handleStatusSelect(1)}
                                                                className="cursor-pointer px-3 py-1.5 text-start text-sm font-normal hover:bg-[#F4F4F4]"
                                                            >
                                                                Unresolved
                                                            </div>
                                                            <div
                                                                onClick={() => handleStatusSelect(2)}
                                                                className="cursor-pointer px-3 py-1.5 text-start text-sm font-normal hover:bg-[#F4F4F4]"
                                                            >
                                                                Resolved
                                                            </div>
                                                            <div
                                                                onClick={() => handleStatusSelect(3)}
                                                                className="cursor-pointer px-3 py-1.5  text-start text-sm font-normal hover:bg-[#F4F4F4]"
                                                            >
                                                                Non-issue
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {checkStatus === 1 && checkRoleTestPland !== 3 && (
                                            <div
                                                className="flex h-[32px] w-[120px] cursor-pointer items-center justify-center gap-2 border bg-[#E8E8E8]"
                                                onClick={() => setIsOpenEdit(true)}
                                            >
                                                <div className="h-[18px] w-[18px]">
                                                    <Icon name="edit" />
                                                </div>
                                                <div className="text-sm font-medium">Edit</div>
                                            </div>
                                        )}

                                        {checkStatus === 1 && checkRoleTestPland !== 3 && (
                                            <div
                                                onClick={() => setDeleteIssue(true)}
                                                className="relative flex h-[32px] w-[32px] cursor-pointer items-center justify-center bg-[#F4F4F4]"
                                            >
                                                <Icon name="ellipsis" />
                                                {isDeleteIssue && (
                                                    <div
                                                        ref={modalRef}
                                                        onClick={() => setIsOpenDeleteIssue(true)}
                                                        className="absolute left-4 top-10 flex h-[38px] w-[110px] cursor-pointer items-center justify-center border border-[#DEDEDE] bg-white text-[14px] text-[#FA6161]"
                                                    >
                                                        Delete Issue
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className=" border-[1px]">
                                        <div
                                            className="flex cursor-pointer justify-between border-b-[1px]  px-3 py-1.5"
                                            onClick={() => handleToggle('Impact')}
                                        >
                                            <div className="text-[14px] font-semibold">Scope of Impact</div>
                                            {openSections.Impact ? (
                                                <Icon name="caretDown" />
                                            ) : (
                                                <Icon name="caretRight" />
                                            )}
                                        </div>
                                        {loadingTag ? (
                                            <div className="flex justify-center bg-[#FBFAFD] py-2">
                                                <div className="loader h-7 w-7"></div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`overflow-hidden bg-[#FBFAFD] text-[14px] transition-all duration-500 ease-in-out ${
                                                    openSections.Impact
                                                        ? 'max-h-[10000px] opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="p-3">
                                                    {dataIssueById?.scope
                                                        ? dataIssueById?.scope
                                                        : 'Currently, there is no information about the extent of the impact.'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-[1px] ">
                                        <div
                                            className="flex cursor-pointer justify-between border-b-[1px]  px-3 py-1.5"
                                            onClick={() => handleToggle('Description')}
                                        >
                                            <div className="text-[14px] font-semibold">Description</div>
                                            {openSections.Description ? (
                                                <Icon name="caretDown" />
                                            ) : (
                                                <Icon name="caretRight" />
                                            )}
                                        </div>
                                        {loadingTag ? (
                                            <div className="flex justify-center bg-[#FBFAFD] py-2">
                                                <div className="loader h-7 w-7"></div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`overflow-hidden bg-[#FBFAFD] text-[14px] transition-all duration-500  ease-in-out ${
                                                    openSections.Description
                                                        ? 'max-h-[10000px] opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="p-3">
                                                    {dataIssueById?.description != '' ||
                                                    dataIssueById?.description != '<p><br></p>' ? (
                                                        <ReactQuill
                                                            theme="snow"
                                                            id="objective"
                                                            className="react-quill-hidden-calendar "
                                                            value={dataIssueById?.description}
                                                            readOnly={true}
                                                        />
                                                    ) : (
                                                        'Currently, there is no information about the description.'
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-[1px] ">
                                        <div
                                            className="flex cursor-pointer justify-between border-b-[1px]  px-3 py-1.5"
                                            onClick={() => handleToggle('Note')}
                                        >
                                            <div className="text-[14px] font-semibold">Note</div>
                                            {openSections.Note ? <Icon name="caretDown" /> : <Icon name="caretRight" />}
                                        </div>
                                        {loadingTag ? (
                                            <div className="flex justify-center bg-[#FBFAFD] py-2">
                                                <div className="loader h-7 w-7"></div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`overflow-hidden bg-[#FBFAFD] text-[14px] transition-all duration-500 ease-in-out ${
                                                    openSections.Note
                                                        ? 'max-h-[1000px] opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="p-3">
                                                    {dataIssueById?.note
                                                        ? dataIssueById?.note
                                                        : 'Currently, there is no information about the notes.'}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-[1px] ">
                                        <div
                                            className="flex cursor-pointer justify-between border-b-[1px]  px-3 py-1.5"
                                            onClick={() => handleToggle('Attach')}
                                        >
                                            <div className="text-[14px] font-semibold">Attachments</div>
                                            {openSections.Attach ? (
                                                <Icon name="caretDown" />
                                            ) : (
                                                <Icon name="caretRight" />
                                            )}
                                        </div>

                                        {loadingTag ? (
                                            <div className="flex justify-center bg-[#FBFAFD] py-2">
                                                <div className="loader h-7 w-7"></div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`overflow-hidden bg-[#FBFAFD] text-[14px] transition-all duration-500 ease-in-out ${
                                                    openSections.Attach
                                                        ? 'max-h-[1000px] opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="px-2 pb-2">
                                                    <AttachFile
                                                        attachType="UploadIssuse"
                                                        fileSeq={fileSeq}
                                                        seq={dataIssueById?.issuesId}
                                                        setFileSeq={setFileSeq}
                                                        register={null}
                                                        entity={`Issues`}
                                                        viewMode={false}
                                                        mode="member"
                                                        className="h-20 w-20 rounded-full object-cover"
                                                        filters={{
                                                            max_file_size: '10mb',
                                                            mime_types: [
                                                                {
                                                                    title: 'Tệp đã được nhận: ',
                                                                    extensions:
                                                                        'xlsx,pptx,txt,csv,docx,pdf,png,jpg,jpeg'
                                                                }
                                                            ]
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Update Issue
                                <div className="flex h-full w-full flex-col gap-4 ">
                                    <UpdateIssuse
                                        dataIssueById={dataIssueById}
                                        refetch={refetch}
                                        setIsOpenEdit={setIsOpenEdit}
                                    />{' '}
                                </div>
                            )}
                            <div className=" ">
                                <Response issuesId={id} />
                            </div>
                        </div>

                        {/* ----------------------- ---------------------- */}
                        <div className="flex h-full w-1/4 flex-col gap-4  p-4 ">
                            <div className="m-auto flex w-[95%] flex-col gap-4">
                                {/* creator */}
                                <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-2">
                                    <div className="text-[14px] font-semibold">Creator</div>
                                    {loadingTag ? (
                                        <div className="loader h-7 w-7"></div>
                                    ) : (
                                        <div className="flex items-center gap-x-2">
                                            <div className="h-8 w-8">
                                                <AttachFile
                                                    attachType="UserAvatar"
                                                    entity="user"
                                                    seq={dataIssueById?.creator?.userID}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    keyProp={dataIssueById?.creator?.userID}
                                                />
                                            </div>
                                            <div className="w-[calc(100%-32px)] break-all">
                                                <div className="text-sm">{dataIssueById?.creator?.fullName}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Prority */}
                                <EditPrority dataIssueById={dataIssueById} idIssue={id} refetch={refetch} />
                                {/* Assign To */}
                                <EditAssignTo dataIssueById={dataIssueById} idIssue={id} refetch={refetch} />
                                {/* tags */}
                                <EditLabel dataIssueById={dataIssueById} refetch={refetch} issuesId={id} />
                                {/* Link to Test Cases */}
                                <EditLinkToTestCase dataIssueById={dataIssueById} idIssue={id} refetch={refetch} />
                                {/* Start Date */}
                                <EditStartDate
                                    dataIssueById={dataIssueById}
                                    startDate={formatDate(dataIssueById?.startDate)}
                                    idIssue={id}
                                    refetch={refetch}
                                />

                                {/* End Date */}
                                <EditEndDate
                                    dataIssueById={dataIssueById}
                                    endDate={formatDate(dataIssueById?.endDate)}
                                    idIssue={id}
                                    refetch={refetch}
                                />

                                {/* Created At */}
                                <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-1">
                                    <div className="text-[14px] font-semibold">Created At</div>
                                    {loadingTag ? (
                                        <div className="loader h-7 w-7"></div>
                                    ) : (
                                        <div className="text-[14px] text-[#484848]">
                                            {formatDate(dataIssueById?.createdAt)}
                                        </div>
                                    )}
                                </div>
                                {/* Updated At */}
                                <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-1">
                                    <div className="text-[14px] font-semibold">Updated At</div>
                                    {loadingTag ? (
                                        <div className="loader h-7 w-7"></div>
                                    ) : (
                                        <div className="text-[14px] text-[#484848]">
                                            {formatDateTime(dataIssueById?.updatedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ModalComponent
                isOpen={isOpenDeleteIssue}
                setIsOpen={setIsOpenDeleteIssue}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                style={customStyles}
            >
                <div className="h-[268px] w-[500px] p-3">
                    <div className="mt-5 text-center">
                        <div>
                            <Icon name="delete_outlined" />
                        </div>
                        <p className="text-base font-semibold">Delete Issue? </p>
                        <p className="mt-2 text-sm font-normal text-[#787878]">
                            This action cannot be undone and all contents within the issue will be permanently deleted.
                        </p>
                    </div>

                    <div className="  mt-6 flex w-full justify-center gap-3">
                        <div
                            className="w-[160px] cursor-pointer border border-red-500 py-1.5 text-center font-semibold text-red-500"
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </div>
                        <button
                            className="w-[160px] border border-red-500 bg-red-500 py-1.5 text-center font-semibold text-white"
                            onClick={() => handleDelete()}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default DetailIssues;
