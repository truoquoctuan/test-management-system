import { useMutation, useQuery } from '@apollo/client';
import { clientRepo, clientRun } from 'apis/apollo/apolloClient';
import { LIST_MEMBER_TEST_PLAND } from 'apis/apollo/test-plan/mutation';
import { MODIFY_ASSIGNS } from 'apis/issues/issues';
import AttachFile from 'components/AttachFile/AttachFile';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const EditAssignTo = ({ dataIssueById, idIssue, refetch }) => {
    const modalRef2 = useRef(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isOpenEdit, setOpenEdit] = useState(false);
    const { testPlanId } = useParams();
    const { control, setValue, handleSubmit } = useForm();
    const [name, setName] = useState('');
    const [listMemberComment, setListMemberComment] = useState(null);
    const { checkStatus, checkRoleTestPland, userInfo } = useGlobalContext();
    const { data: listMemberTestLand } = useQuery(LIST_MEMBER_TEST_PLAND, {
        client: clientRepo,
        variables: { page: 0, size: 100, testPlanId: testPlanId, name: name?.trim() === '' ? undefined : name.trim() },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (listMemberTestLand) {
            setListMemberComment(listMemberTestLand);
        }
    }, [listMemberTestLand]);

    useEffect(() => {
        if (dataIssueById?.users) {
            setSelectedMembers(
                dataIssueById.users.map((item) => ({
                    userId: item?.userID,
                    fullName: item?.fullName,
                    userName: item?.userName
                }))
            );
        }
    }, [dataIssueById]);

    const listMember = listMemberComment?.getMembersByTestPlanId?.members?.map((item) => ({
        userId: item?.userInfo?.userID,
        fullName: item?.userInfo?.fullName,
        userName: item?.userInfo?.userName
    }));

    const debouncedSearch = useCallback(
        debounce((value) => {
            setName(value);
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        debouncedSearch(e.target.value);
    };
    // eslint-disable-next-line no-unused-vars
    const [updateIssue] = useMutation(MODIFY_ASSIGNS, { client: clientRun });

    const onSubmit = async (data) => {
        const dataIdUser = data?.assignIds?.map((item) => item.userId);
        const newdata = {
            issuesId: idIssue,
            assignIds: dataIdUser.join(','),
            userId: userInfo?.userID
        };
        await updateIssue({ variables: newdata });
        refetch();
    };
    useOutsideClick(modalRef2, setOpenEdit);
    const [loadingTag, setLoadingTag] = useState(false);

    useEffect(() => {
        if (isOpenEdit == false) {
            setLoadingTag(true);
            setTimeout(() => {
                setLoadingTag(false);
            }, 1000);
        }
    }, [isOpenEdit]);
    return (
        <div className="relative flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-2">
            <div className="flex justify-between">
                <div className="text-[14px] font-semibold">Assign To</div>
                {checkStatus === 1 && checkRoleTestPland !== 3 && (
                    <button className="text-sm text-[#1D79ED]" onClick={() => setOpenEdit(true)}>
                        Edit
                    </button>
                )}
            </div>
            {loadingTag ? (
                <div className="loader h-7 w-7"></div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {dataIssueById?.users?.length > 0 ? (
                        <>
                            {dataIssueById?.users?.map((item, index) => (
                                <li key={index}>
                                    <div className="flex items-center gap-x-2">
                                        <AttachFile
                                            attachType="UserAvatar"
                                            entity="user"
                                            seq={item?.userID}
                                            className="h-8 w-8 rounded-full object-cover"
                                            keyProp={item?.userID}
                                        />
                                        <div className="w-[calc(100%-32px)] break-all">
                                            <div className="text-sm">{item?.fullName}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </>
                    ) : (
                        <li className="text-sm">None</li>
                    )}
                </ul>
            )}

            <div ref={modalRef2}>
                {isOpenEdit && (
                    <div className="absolute top-6 z-30 w-[100%] border bg-white p-2">
                        <div className="bg-white">
                            <div className="mb-2 flex  justify-between ">
                                <p className="text-sm font-semibold">Assign To</p>
                                <Icon
                                    name="close"
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => {
                                        setName(''), setOpenEdit(false);
                                    }}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-2 top-2">
                                    <Icon name="search" className="fill-[#9C9C9C]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search members"
                                    className="focus:border-primary-100 h-[36px] w-full border border-[#F1F3FD] bg-white pl-8 placeholder:text-[13px] placeholder:font-light focus:outline-none"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="assignIds"
                                    control={control}
                                    defaultValue={[]}
                                    // eslint-disable-next-line no-unused-vars
                                    render={({ field }) => (
                                        <>
                                            <div className="custom-scroll-y    mt-2 max-h-[300px] min-h-[100px] w-full  bg-white ">
                                                {listMember?.map((item) => (
                                                    <div
                                                        key={item.userId}
                                                        className={`flex cursor-pointer items-center gap-2 px-2 py-1 text-sm font-normal hover:bg-[#F4F4F4] ${
                                                            selectedMembers.some((m) => m.userId === item.userId)
                                                                ? 'bg-[#F4F4F4]'
                                                                : ''
                                                        }`}
                                                        onClick={() => {
                                                            const isSelected = selectedMembers.some(
                                                                (m) => m.userId === item.userId
                                                            );
                                                            const newSelectedMembers = isSelected
                                                                ? selectedMembers.filter(
                                                                      (m) => m.userId !== item.userId
                                                                  )
                                                                : [...selectedMembers, item];
                                                            setSelectedMembers(newSelectedMembers);
                                                            setValue('assignIds', newSelectedMembers);
                                                            handleSubmit(onSubmit)();
                                                        }}
                                                    >
                                                        <Icon
                                                            name={
                                                                selectedMembers.some((m) => m.userId === item.userId)
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
                                        </>
                                    )}
                                />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditAssignTo;
