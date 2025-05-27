import { useQuery } from '@apollo/client';
import { GET_MEMBERS_BY_TEST_PLAN_ID } from 'apis/plan-information/query';
import AttachFile from 'components/AttachFile/AttachFile';
import Empty from 'components/common/Empty';
import Pagination from 'components/common/Pagination';
import SearchInput from 'components/common/SearchInput';
import SortDropdown from 'components/common/SortDropdown ';
import Button from 'components/design-system/Button';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import formatDate from 'utils/formatDate';
import Header from './Header';

const Members = (props) => {
    const { testPlanId } = props;
    const [members, setMembers] = useImmer([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchNameValue, setSearchNameValue] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const itemNumber = 10;
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(0);

    const { data } = useQuery(GET_MEMBERS_BY_TEST_PLAN_ID, {
        variables: {
            testPlanId: testPlanId,
            page: currentPage,
            size: itemNumber,
            name: searchNameValue?.trim() === '' ? undefined : searchNameValue.trim(),
            sorted: selectedOption ? selectedOption?.alphabet + '+' + sortOrder : ''
        },
        fetchPolicy: 'cache-and-network'
    });
    useEffect(() => {
        if (data) {
            setMembers(data?.getMembersByTestPlanId);
        }
    }, [data]);

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };
    const { checkStatus, checkRoleTestPland, roleUser } = useGlobalContext();

    return (
        <div className=" mt-4  w-full bg-white p-6">
            {/* Header */}
            <div className="flex justify-between">
                <Header header={'Members List'} sub={'View members involved in the Test Plan.'} />

                {(checkRoleTestPland === 1 || roleUser === 'ROLE_ADMIN' || roleUser === 'ROLE_SUPER_ADMIN') &&
                    checkStatus === 1 && (
                        <div>
                            <Button
                                icon={<Icon name="edit" className="h-5 w-5 fill-white" />}
                                className="min-w-24 bg-primary-1 px-3 py-2 font-bold text-white"
                                onClick={() => navigate(`/test-plan/plan-information/${testPlanId}/update/member`)}
                            >
                                Edit
                            </Button>
                        </div>
                    )}
            </div>

            <div className={`grid  transition-all duration-500 `}>
                <div className="flex flex-col gap-y-4 overflow-hidden">
                    <div className="mt-4 border-b border-b-neutral-5"></div>

                    {/* Table */}
                    <div>
                        <div className="mb-2 flex justify-end gap-3">
                            {/* Tìm kiếm */}
                            <div className="w-[305px]">
                                <SearchInput
                                    setCurrentPage={setCurrentPage}
                                    className={'h-full w-full'}
                                    setSearch={setSearchNameValue}
                                    inputValue={searchNameValue}
                                    maxLength={20}
                                    placeholder={`Filter by name`}
                                />
                            </div>
                            {/* Lọc anphabet */}
                            <SortDropdown
                                className="flex h-full w-[190px]"
                                options={[
                                    { name: 'Role', alphabet: 'role_test_plan' },
                                    { name: 'Date Added', alphabet: 'added_at' }
                                ]}
                                selectedOption={selectedOption}
                                sortOrder={sortOrder}
                                onOptionSelect={handleOptionSelect}
                                onSortOrderChange={handleSortOrderChange}
                                placeholder="Role"
                            />
                        </div>
                        <div className="min-h-[calc(87vh-333px)]">
                            <table className=" w-full">
                                <thead>
                                    <tr className="[&>th]:bg-neutral-7 [&>th]:px-4 [&>th]:py-3 [&>th]:text-start [&>th]:font-medium">
                                        <th>Account</th>
                                        <th>Role</th>
                                        <th>Position</th>
                                        <th>Activity</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {members?.members?.length ? (
                                        <>
                                            {members?.members?.map((member, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="group border-b-[0.5px] border-b-neutral-5 transition-all duration-300 hover:shadow-lg [&>td]:px-4 [&>td]:py-3 [&>td]:text-start [&>td]:font-medium"
                                                    >
                                                        <td className="min-w-24 max-w-72">
                                                            <div className="flex items-center gap-x-2">
                                                                <AttachFile
                                                                    attachType="UserAvatar"
                                                                    entity="user"
                                                                    seq={member?.userInfo?.userID}
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    keyProp={member?.userInfo?.userID}
                                                                />
                                                                <div className="w-[calc(100%-32px)] break-all">
                                                                    <div>{member?.userInfo?.fullName}</div>
                                                                    <div className="font-normal text-neutral-3">
                                                                        <span>@</span>
                                                                        <span>{member?.userInfo?.userName}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="min-w-24 max-w-96">
                                                            <div className="flex items-center gap-x-2 font-normal">
                                                                {member?.roleTestPlan === 1 && 'Owner'}
                                                                {member?.roleTestPlan === 2 && 'Editor'}
                                                                {member?.roleTestPlan === 3 && 'Viewer'}
                                                            </div>
                                                        </td>

                                                        <td className="min-w-40">
                                                            <div className="font-normal">
                                                                {member?.positions
                                                                    ?.map((x) => x?.positionName)
                                                                    .join(',')}
                                                            </div>
                                                        </td>

                                                        <td className="min-w-40">
                                                            <div className="font-normal">
                                                                <span className="text-neutral-2">Added at: </span>
                                                                <span className="font-medium">
                                                                    {formatDate('dd/mm/yyyy', member?.addedAt)}
                                                                </span>
                                                            </div>
                                                            {member?.adderInfo?.fullName && (
                                                                <div className="font-normal">
                                                                    <span className="text-neutral-2">Added by: </span>
                                                                    <span className="font-medium">
                                                                        {member?.adderInfo?.fullName}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="pt-6">
                                                <Empty notFoundMessage="No assigned members found" />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {members?.pageInfo?.totalElements > 10 && (
                            <div className="mt-6">
                                <Pagination
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    pagination={members?.pageInfo}
                                    itemNumber={itemNumber}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Members;
