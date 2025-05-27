import { useMutation, useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GET_ALL_ISSUES_IN_TEST_PLAN, REMOVE_ISSUES, UPDATE_ISSUES_STATUS } from 'apis/issues/issues';
import AttachFile from 'components/AttachFile/AttachFile';
import { ColorChecker } from 'components/common/ColorChecker';
import Empty from 'components/common/Empty';
import Loading from 'components/common/Loading';
import useCloseModalOnOutsideClick from 'components/common/modalMouse';
import Pagination from 'components/common/Pagination';
import SearchInput from 'components/common/SearchInput';
import SortDropdown from 'components/common/SortDropdown ';
import { toDateStringYear } from 'components/common/Time';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FilterComponent from './FilterComponent';

const Issues = ({ testPlanId, topRef }) => {
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const { userInfo } = useGlobalContext();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('currentPage');
        return savedPage ? parseInt(savedPage, 10) : 0;
    });
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);
    const itemNumber = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssues, setSelectedIssues] = useState([]);
    const [isModalOpenStatus, setIsModalOpenStatus] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [sortOrder, setSortOrder] = useState(() => {
        const sortOrder = localStorage.getItem('sortOrder');
        return sortOrder ? JSON.parse(sortOrder) : 'desc';
    });

    const [selectedOption, setSelectedOption] = useState(() => {
        const savedSearchText = localStorage.getItem('selectedOption');
        return savedSearchText ? JSON.parse(savedSearchText) : null;
    });

    useEffect(() => {
        localStorage.setItem('selectedOption', JSON.stringify(selectedOption));
    }, [selectedOption]);

    useEffect(() => {
        localStorage.setItem('sortOrder', JSON.stringify(sortOrder));
    }, [sortOrder]);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [filter, setFilter] = useState(() => {
        const savedSearchText = localStorage.getItem('filter');
        return savedSearchText ? JSON.parse(savedSearchText) : {};
    });
    useEffect(() => {
        localStorage.setItem('filter', JSON.stringify(filter));
    }, [filter]);
    const [idSearch, setIdSearch] = useState(() => {
        const savedSearchText = localStorage.getItem('idSearch');
        return savedSearchText ? JSON.parse(savedSearchText) : 1;
    });
    useEffect(() => {
        localStorage.setItem('idSearch', JSON.stringify(idSearch));
    }, [idSearch]);
    const [searchText, setSearchText] = useState(() => {
        const savedSearchText = localStorage.getItem('searchText');
        return savedSearchText ? JSON.parse(savedSearchText) : '';
    });

    const [searchID, setSearchID] = useState(() => {
        const savedSearchID = localStorage.getItem('searchID');
        return savedSearchID ? JSON.parse(savedSearchID) : '';
    });
    const [searchTestcaseId, setSearhTestcaseId] = useState(() => {
        const savedSearchTestcaseId = localStorage.getItem('searchTestcaseId');
        return savedSearchTestcaseId ? JSON.parse(savedSearchTestcaseId) : '';
    });
    useEffect(() => {
        localStorage.setItem('searchText', JSON.stringify(searchText));
    }, [searchText]);

    useEffect(() => {
        localStorage.setItem('searchID', JSON.stringify(searchID));
    }, [searchID]);

    useEffect(() => {
        localStorage.setItem('searchTestcaseId', JSON.stringify(searchTestcaseId));
    }, [searchTestcaseId]);

    useEffect(() => {
        const valueToStore = selectedOption ? `${selectedOption?.anphabet}+${sortOrder}` : 'created_at+desc';
        localStorage.setItem('sortOption', valueToStore);
    }, [sortOrder]);

    const modalRef = useRef(null);
    useCloseModalOnOutsideClick(modalRef, setIsModalOpenStatus);
    useCloseModalOnOutsideClick(modalRef, setIsOpenSearch);
    const [removeIssues] = useMutation(REMOVE_ISSUES, { client: clientRun });

    // Api get danh sách issue
    const {
        data: getAllIssuesInTestPlan,
        refetch,
        loading
    } = useQuery(GET_ALL_ISSUES_IN_TEST_PLAN, {
        client: clientRun,
        variables: {
            page: currentPage,
            size: itemNumber,
            testPlanId: testPlanId,
            sorted: selectedOption ? selectedOption?.anphabet + '+' + sortOrder : 'created_at+desc',
            issuesName: idSearch == 1 ? (searchText?.trim() === '' ? undefined : searchText.trim()) : null,
            issuesIds:
                idSearch == 2 ? (searchID == '' ? null : searchID?.trim() === '' ? undefined : searchID.trim()) : null,
            testCaseIds: filter
                ? filter.testCases?.map((item) => Number(item))
                : idSearch == 3
                ? searchTestcaseId == ''
                    ? null
                    : searchTestcaseId
                : null,
            prioritys: filter ? filter.priorities?.map((item) => Number(item)) : null,
            status: filter ? filter.statuses?.map((item) => Number(item)) : null,
            tags: filter ? filter.tags?.map((item) => Number(item)) : null,
            dueDate: filter ? `${toDateStringYear(filter.startDate)}/${toDateStringYear(filter.endDate)}` : '',
            assignIds: filter ? filter.selectedAssignees : null,
            exactFilterMatch: filter && filter?.exact?.length > 0 ? true : false
        },
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        setIsLoading(true);
        if (loading == false) {
            setTimeout(() => {
                setIsLoading(false);
            }, 400);
        }
    }, [loading]);

    const [listDataIssuse, setListDataIssuse] = useState(null);

    useEffect(() => {
        if (getAllIssuesInTestPlan) {
            setListDataIssuse(getAllIssuesInTestPlan?.getAllIssuesInTestPlan?.issues);
            setIsfiltercomponent(false);
        }
    }, [getAllIssuesInTestPlan]);

    // Khi `listDataIssue` thay đổi, cuộn lên đầu phần tử được tham chiếu bởi `topRef`
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' }); // Cuộn lên đầu danh sách
        }
    }, [currentPage]);
    const [checkBoxIssue, setCheckBoxIssue] = useState(false);
    const handleSelectAllCheckboxChange = (e) => {
        setCheckBoxIssue(e.target.checked);
        if (e.target.checked) {
            setSelectedIssues(listDataIssuse.map((issue) => issue.issuesId));
        } else {
            setSelectedIssues([]);
        }
    };
    const handleCheckboxChange = (issueId) => {
        setCheckBoxIssue(false);
        setSelectedIssues((prevSelected) =>
            prevSelected.includes(issueId) ? prevSelected.filter((id) => id !== issueId) : [...prevSelected, issueId]
        );
    };
    const handleCloseDelete = () => {
        setSelectedIssues([]);
        setIsModalOpen(false);
    };
    const handleDelete = async () => {
        await removeIssues({ variables: { issuesIds: selectedIssues } });
        toast.success('The problem has been cleared!');
        handleCloseDelete();
        refetch();
    };
    const handleStatusClick = (event, id) => {
        setSelectedIssueId(id);
        setIsModalOpenStatus(true);
    };
    const closeModal = () => {
        setIsModalOpenStatus(false);
        setSelectedIssueId(null);
    };

    // Cập nhật trạng thái issue
    const [updateStatusIssues] = useMutation(UPDATE_ISSUES_STATUS, { client: clientRun });
    const handleStatusSelect = async (status) => {
        if (status !== null && selectedIssueId !== null) {
            await updateStatusIssues({ variables: { issuesId: selectedIssueId, status, userId: userInfo.userID } });
            refetch();
            closeModal();
        }
        toast?.success('Updated status successfully');
    };
    // End
    const today = new Date();

    const sortOptions = [
        { name: 'Issues Name', anphabet: 'issues_name' },
        { name: 'Created At', anphabet: 'created_at' },
        { name: 'Updated At', anphabet: 'updated_at' }
    ];
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };
    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };
    const [checkfiltercomponent, setIsfiltercomponent] = useState(false);
    const handleReset = () => {
        setListDataIssuse(getAllIssuesInTestPlan?.getAllIssuesInTestPlan?.issues);
        setIsfiltercomponent(true);
        setSearchText('');
        setSearchID('');
        setSearhTestcaseId('');
        setCurrentPage(0);
        setSelectedOption(null);
        setSortOrder('desc');
    };
    const handleSearchTypeChange = (newIdSearch) => {
        setIdSearch(newIdSearch);
        setSearchText('');
        setSearchID('');
        setCurrentPage(0);
        setIsOpenSearch(false);
        setSearhTestcaseId('');
    };

    const filterRef = useRef();
    useOutsideClick(filterRef, setIsOpenFilter);

    return (
        <div className=" animate__animated animate__fadeIn  w-full overflow-hidden bg-white p-5">
            <div className="relative z-10 flex h-[53px] items-center justify-between gap-1 border-b-[1px] border-[#DEDEDE]">
                <div className="relative flex h-[37px] w-full gap-2">
                    <div className="w-[70%]">
                        <div className="relative mb-4 flex">
                            {isOpenSearch && (
                                <div ref={modalRef} className="absolute z-[30] mt-8 w-[140px] border bg-white p-2">
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm  text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleSearchTypeChange(1)}
                                    >
                                        Issue Name
                                    </p>
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm   text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleSearchTypeChange(2)}
                                    >
                                        Issue ID
                                    </p>
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm  text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleSearchTypeChange(3)}
                                    >
                                        Test Case ID
                                    </p>
                                </div>
                            )}

                            <div
                                className={`flex h-[30px] w-[170px] cursor-pointer items-center justify-between border-y border-l border-[#B3B3B3] px-2 py-[2px] text-sm text-[#121212] ${
                                    isOpenSearch ? 'border-r border-primary-1' : ''
                                }`}
                                onClick={() => setIsOpenSearch(!isOpenSearch)}
                            >
                                <p>
                                    {idSearch === 1 && 'Issue Name'}
                                    {idSearch === 2 && 'Issue ID'}
                                    {idSearch === 3 && 'Test Case ID'}
                                </p>
                                <Icon name="down" className="mt-1 h-3 w-3" />
                            </div>
                            {idSearch === 1 && (
                                <div className="mb-4 w-full">
                                    <SearchInput
                                        inputValue={searchText}
                                        placeholder="Search"
                                        setCurrentPage={setCurrentPage}
                                        setSearch={setSearchText}
                                        className="h-full "
                                        maxLength={255}
                                    />
                                </div>
                            )}
                            {idSearch === 2 && (
                                <div className="mb-4 w-full">
                                    <SearchInput
                                        inputValue={searchID}
                                        placeholder="Search"
                                        setCurrentPage={setCurrentPage}
                                        setSearch={setSearchID}
                                        className="h-full "
                                        maxLength={255}
                                    />
                                </div>
                            )}
                            {idSearch === 3 && (
                                <div className="mb-4 w-full">
                                    <SearchInput
                                        inputValue={searchTestcaseId}
                                        placeholder="Search"
                                        setCurrentPage={setCurrentPage}
                                        setSearch={setSearhTestcaseId}
                                        className="h-full "
                                        maxLength={255}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-[30%]">
                        <SortDropdown
                            options={sortOptions}
                            selectedOption={selectedOption}
                            onOptionSelect={handleOptionSelect}
                            sortOrder={sortOrder}
                            onSortOrderChange={handleSortOrderChange}
                        />
                    </div>
                    <div
                        className={`relative h-[83%] w-[200px] cursor-pointer border  ${
                            filter === null ? 'border-[#B3B3B3] text-[#787878]' : ' border-primary-1 text-primary-1'
                        }`}
                        ref={modalRef}
                    >
                        <div
                            onClick={() => setIsOpenFilter(!isOpenFilter)}
                            className={`flex h-full items-center justify-between px-2 text-center text-sm  `}
                        >
                            <p>Filter</p>
                            <Icon
                                name="filter"
                                className={`${filter === null ? 'fill-[#787878]' : ' fill-primary-1'}`}
                            />
                        </div>
                        <div
                            className={`animate__animated animate__fadeIn absolute right-0 z-[30] mt-2 w-[300px] ${
                                isOpenFilter ? '' : 'hidden'
                            }`}
                        ></div>
                        {/* Add filter content here */}
                    </div>
                    {/* Fillter */}
                    <div className={`absolute -right-4 -top-7 ${isOpenFilter ? '' : 'hidden'}`} ref={filterRef}>
                        <FilterComponent
                            checkfiltercomponent={checkfiltercomponent}
                            setIsOpenFilter={setIsOpenFilter}
                            setFilter={setFilter}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                    <div className="cursor-pointer" onClick={() => handleReset()}>
                        <div className="mb-[6px] border border-[#787878] px-1 pt-1">
                            <Icon name="cached" />
                        </div>
                    </div>
                </div>
            </div>
            {selectedIssues.length > 0 && (
                <div className="mb-2 flex h-[53px] w-full items-center justify-between bg-[#F4F4F4] px-6">
                    <div className="flex cursor-pointer items-center justify-center">
                        <Icon
                            name="close"
                            onClick={() => {
                                setSelectedIssues([]), setCheckBoxIssue(false);
                            }}
                            className="h-4 w-4"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="text-red-500">
                            {selectedIssues.length === 1
                                ? 'Selected 1 issue'
                                : `Selected ${selectedIssues.length} issues`}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="border border-[red] bg-white px-3 py-1 font-semibold text-red-500"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
            <div className="flex min-h-[calc(80vh-72px)] flex-col">
                <div className=" h-full w-full flex-grow text-neutral-1">
                    <table className="h-full w-full">
                        <thead className="bg-[#F4F4F4]">
                            <tr className="[&>th]:bg-neutral-7 [&>th]:px-1   [&>th]:py-3 [&>th]:text-start [&>th]:font-semibold">
                                <th className="w-[35%] text-end text-sm">
                                    <div className="flex items-center gap-4 pl-3 ">
                                        <input
                                            className="h-4 w-4"
                                            type="checkbox"
                                            onChange={handleSelectAllCheckboxChange}
                                            checked={checkBoxIssue}
                                        />
                                        <p>Issue Name</p>
                                    </div>
                                </th>
                                <th className="w-[10%] text-start text-sm">Test Cases ID</th>
                                <th className="w-[5%] text-end text-sm">Priority</th>
                                <th className="w-[15%] text-start text-sm">Tags</th>
                                <th className=" justify- w-[10%] text-start text-sm">
                                    <div>Assign To</div>
                                </th>
                                <th className="w-[7%] text-start text-sm">End Date</th>
                                <th className="w-[10%] text-start text-sm">Status</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <div className="absolute flex h-[70%] w-[80%] items-center justify-center px-6">
                                <Loading />
                            </div>
                        ) : (
                            <tbody>
                                {listDataIssuse?.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="h-full w-full px-4 py-2 pt-[100px] text-center">
                                            <Empty notFoundMessage={`We couldn't find any Issues.`} />
                                        </td>
                                    </tr>
                                ) : (
                                    listDataIssuse?.map((issue) => {
                                        const endDate = issue.endDate ? new Date(issue.endDate) : null;
                                        const isOverdue =
                                            endDate && toDateStringYear(today) > toDateStringYear(endDate);
                                        return (
                                            <tr
                                                key={issue.issuesId}
                                                className="h-[48px] cursor-pointer hover:bg-[#F4F4F4]"
                                            >
                                                <td className="h-[48px] border-b-[1px] px-4 py-2 text-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <input
                                                                className="h-4 w-4"
                                                                type="checkbox"
                                                                onChange={() => handleCheckboxChange(issue?.issuesId)}
                                                                checked={selectedIssues.includes(issue?.issuesId)}
                                                            />
                                                        </div>
                                                        <div className="w-[90%]">
                                                            <Link
                                                                to={`/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`}
                                                            >
                                                                <>
                                                                    <div className=" break-words font-semibold">
                                                                        {issue?.issuesName}
                                                                    </div>
                                                                    <div className="text-sm text-[#787878]">
                                                                        #{issue?.issuesId}
                                                                    </div>
                                                                </>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="h-[48px] w-[140px] border-b-[1px] px-1 py-2 text-sm text-[#484848]">
                                                    <Link
                                                        to={`/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`}
                                                    >
                                                        <div className="flex flex-wrap">
                                                            {issue.testCases?.length === 0 ? (
                                                                <span>-</span>
                                                            ) : (
                                                                issue.testCases.map((x, index) => (
                                                                    <div
                                                                        className="group relative mb-1 mr-1 cursor-pointer"
                                                                        key={index}
                                                                    >
                                                                        {/* Hiển thị ID của test case */}
                                                                        <div className="block break-words">
                                                                            #{x?.testCaseId ? x?.testCaseId : '-'}
                                                                            {index < issue.testCases.length - 1 && ', '}
                                                                        </div>

                                                                        {/* Tooltip hiển thị tên test case khi hover */}
                                                                        <div
                                                                            className={`absolute bottom-full left-1/2 hidden -translate-x-1/2 transform border
                          bg-black p-2 text-sm text-white shadow-lg group-hover:flex`}
                                                                            style={{
                                                                                wordBreak: 'break-word',
                                                                                overflowWrap: 'break-word',
                                                                                justifyContent:
                                                                                    x?.testCaseName &&
                                                                                    x.testCaseName.split(' ').length <
                                                                                        10
                                                                                        ? 'center'
                                                                                        : 'flex-start',
                                                                                alignItems: 'center',
                                                                                minWidth: '300px',
                                                                                maxWidth: '500px',
                                                                                whiteSpace:
                                                                                    x?.testCaseName &&
                                                                                    x.testCaseName.split(' ').length >=
                                                                                        10
                                                                                        ? 'normal'
                                                                                        : 'nowrap',
                                                                                zIndex: 999 // Thêm z-index cao nhất cho tooltip
                                                                            }}
                                                                        >
                                                                            {x?.testCaseName || 'Unknown'}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </Link>
                                                </td>

                                                <td className="h-[48px] border-b-[1px]   text-[#484848]">
                                                    <Link
                                                        to={`/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`}
                                                    >
                                                        <div
                                                            className={`flex  w-[65px] items-center justify-center py-1  text-sm font-medium  ${
                                                                issue.priority === 1
                                                                    ? 'border-[#ffd0d0] bg-[#F0F0F0] text-[#787878]'
                                                                    : issue.priority === 2
                                                                    ? 'bg-[#FFF5BE] text-[#F1AD00]'
                                                                    : issue.priority === 3
                                                                    ? 'bg-[#FFE9E9] text-[#FA6161]'
                                                                    : 'text-[#787878]'
                                                            }`}
                                                        >
                                                            {issue.priority === 1
                                                                ? 'Low'
                                                                : issue.priority === 2
                                                                ? 'Medium'
                                                                : issue.priority === 3
                                                                ? 'High'
                                                                : 'Unknown'}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td
                                                    onClick={() =>
                                                        navigate(
                                                            `/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`
                                                        )
                                                    }
                                                    className="  mb-2 mt-2 border-b-[1px] px-2 py-2 text-sm font-medium text-[#121212]"
                                                >
                                                    <Link
                                                        to={`/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`}
                                                    >
                                                        <div>
                                                            {issue?.labelsList?.length > 0
                                                                ? issue?.labelsList?.map((x, index) => (
                                                                      <span
                                                                          key={index}
                                                                          style={{ backgroundColor: x?.labelColor }}
                                                                          className={`${
                                                                              index === issue?.labelsList?.length - 1
                                                                                  ? ''
                                                                                  : 'mb-2'
                                                                          } ml-1 inline-block px-2 py-0.5 font-medium ${
                                                                              ColorChecker(x?.labelColor) == 'dark'
                                                                                  ? 'text-white'
                                                                                  : 'text-black'
                                                                          }`}
                                                                      >
                                                                          {x?.labelName || '-'}
                                                                      </span>
                                                                  ))
                                                                : '-'}
                                                        </div>
                                                    </Link>
                                                </td>
                                                {/* img member */}
                                                <td
                                                    onClick={() =>
                                                        navigate(
                                                            `/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`
                                                        )
                                                    }
                                                    className="border-b-[1px] text-[#484848]"
                                                >
                                                    <Link
                                                        to={`/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`}
                                                    >
                                                        <div className="flex flex-wrap gap-2 p-1 pl-1">
                                                            {issue?.users?.map((item, index) => (
                                                                <div key={index} className="w-1/7 group relative">
                                                                    <AttachFile
                                                                        attachType="UserAvatar"
                                                                        entity="user"
                                                                        seq={item?.userID}
                                                                        className="h-8 w-8 rounded-full object-cover"
                                                                        keyProp={item?.userID}
                                                                    />
                                                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 transform whitespace-nowrap border bg-black p-1 text-sm  text-white opacity-0 shadow-lg group-hover:opacity-100">
                                                                        {item?.fullName || 'Unknown'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {issue?.users?.length == 0 && '-'}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td
                                                    className={`h-[48px] border-b-[1px] px-1 py-2 text-sm ${
                                                        issue?.status === 1
                                                            ? endDate && isOverdue
                                                                ? 'text-red-500' // Nếu status là 1 và ngày endDate nhỏ hơn ngày hiện tại, chữ màu đỏ
                                                                : 'text-gray-500' // Nếu status là 1 và ngày endDate lớn hơn hoặc bằng ngày hiện tại, chữ màu xám
                                                            : 'text-gray-500' // Mặc định nếu status là 2 hoặc 3, chữ màu xám
                                                    }`}
                                                >
                                                    <Link
                                                        to={`/test-plan/issues/${testPlanId}/detail-issues/${issue?.issuesId}`}
                                                    >
                                                        <div>
                                                            {endDate
                                                                ? format(endDate, 'dd/MM/yyyy', { locale: vi })
                                                                : '-'}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="relative h-[48px] border-b-[1px] px-1 py-2">
                                                    <div
                                                        onClick={(event) => handleStatusClick(event, issue.issuesId)}
                                                        className={`cursor-spointer relative flex w-[120px] justify-center gap-2 py-1 text-[13px]  ${
                                                            issue?.status === 1
                                                                ? 'bg-[#FA6161]'
                                                                : issue?.status === 2
                                                                ? 'bg-[#24AB5A]'
                                                                : issue?.status === 3
                                                                ? 'bg-[#BDBDBD]'
                                                                : 'bg-[#BDBDBD]'
                                                        }`}
                                                    >
                                                        <div className="text-white">
                                                            {issue?.status === 1
                                                                ? 'Unresolved'
                                                                : issue?.status === 2
                                                                ? 'Resolved'
                                                                : issue?.status === 3
                                                                ? 'Non-issue'
                                                                : ''}
                                                        </div>
                                                        <div className="">
                                                            <Icon name="caret_right" className="rotate-90 fill-white" />
                                                        </div>
                                                        {isModalOpenStatus && selectedIssueId === issue.issuesId && (
                                                            <div
                                                                ref={modalRef}
                                                                className="absolute bottom-8 z-30 mt-2  w-[123px] border bg-white p-1 "
                                                                onClick={() => closeModal()}
                                                            >
                                                                <div className="flex flex-col gap-2 ">
                                                                    <div
                                                                        onClick={() => handleStatusSelect(1)}
                                                                        className="cursor-pointer px-3 py-1 text-start text-sm font-normal hover:bg-gray-300"
                                                                    >
                                                                        Unresolved
                                                                    </div>
                                                                    <div
                                                                        onClick={() => handleStatusSelect(2)}
                                                                        className="cursor-pointer px-3 py-1 text-start text-sm font-normal hover:bg-gray-300"
                                                                    >
                                                                        Resolved
                                                                    </div>
                                                                    <div
                                                                        onClick={() => handleStatusSelect(3)}
                                                                        className="cursor-pointer px-3 py-1 text-start text-sm font-normal hover:bg-gray-300"
                                                                    >
                                                                        Non-issue
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
                {/* Phân trang */}
                {isLoading == false && (
                    <div className=" pt-3">
                        {getAllIssuesInTestPlan?.getAllIssuesInTestPlan?.pageInfo?.totalPages > 1 && (
                            <Pagination
                                pagination={getAllIssuesInTestPlan?.getAllIssuesInTestPlan?.pageInfo}
                                currentPage={currentPage}
                                itemNumber={itemNumber}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex h-[268px] w-[485px] flex-col items-center justify-center gap-2 bg-white p-4 shadow-md">
                        <div>
                            <Icon name="delete_outlined" />
                        </div>
                        <div className="text-[16px] font-semibold">
                            {selectedIssues?.length === 1
                                ? 'Delete 1 Issue?'
                                : `Delete ${selectedIssues?.length} Issues?`}
                        </div>
                        <div className="text-center text-[14px] text-[#787878]">
                            This action cannot be undone and all contents within the issue will be permanently deleted.
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCloseDelete}
                                className="border border-red-500 bg-white px-10 py-1 text-red-600"
                            >
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="bg-red-500 px-10 py-1 text-white">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Issues;
