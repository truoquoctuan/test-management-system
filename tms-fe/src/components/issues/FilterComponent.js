import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { GET_ALL_TEST_CASES_BY_TEST_PLAN_ID_WITH_SEARCH } from 'apis/issues/issues';
import { GET_MEMBERS_BY_TEST_PLAN_ID } from 'apis/plan-information/query';
import { GET_ALL_LABEL_INTEST_PLAN } from 'apis/repository/test-case';
import AttachFile from 'components/AttachFile/AttachFile';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useParams } from 'react-router-dom';

const arrStatus = [
    { idStatus: 1, name: 'Unresolved' },
    { idStatus: 2, name: 'Resolved' },
    { idStatus: 3, name: 'Non-issue' }
];
const arrPriority = [
    { idPri: 1, name: 'Low' },
    { idPri: 2, name: 'Medium' },
    { idPri: 3, name: 'High' }
];
const FilterComponent = ({ setIsOpenFilter, setFilter, checkfiltercomponent, setCurrentPage }) => {
    const dataFilter = JSON.parse(localStorage?.getItem('filter')) || {};
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [size, setSize] = useState(10);
    const [sizeTag, setSizeTag] = useState(10);
    const [sizeTestCase, setSizeTestCase] = useState(5);
    const [idSearch, setIdSearch] = useState(1);
    const [assignedToMe, setAssignedToMe] = useState(dataFilter?.assignedToMe || false);
    const [selectedAssignees, setSelectedAssignees] = useState(dataFilter?.selectedAssignees || []);
    const [exact, setExact] = useState(dataFilter?.exact || []);

    const [statuses, setStatuses] = useState(dataFilter?.statuses || []);
    const [priorities, setPriorities] = useState(dataFilter?.priorities || []);
    const [tags, setTags] = useState(dataFilter?.tags || []);
    const [startDate, setStartDate] = useState(dataFilter?.startDate || '');
    const [endDate, setEndDate] = useState(dataFilter?.endDate || '');
    const [testCases, setTestCases] = useState(dataFilter?.testCases || []);
    const [searchTestCase, setSearchTestCase] = useState('');
    const { testPlanId } = useParams();
    const { userInfo } = useGlobalContext();
    const [listAllTestCase, setListAllTestCase] = useState(null);
    const [listMember, setListMember] = useState(null);
    const { data: getAllWithSearch } = useQuery(GET_ALL_TEST_CASES_BY_TEST_PLAN_ID_WITH_SEARCH, {
        client: clientRepo,
        variables: {
            testCaseId: idSearch == 1 ? searchTestCase : null,
            testCaseName: idSearch == 2 ? searchTestCase : null,
            testPlanId: testPlanId,
            page: 0,
            size: sizeTestCase
        },
        skip: testPlanId ? false : true,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (getAllWithSearch) {
            setListAllTestCase(getAllWithSearch?.getAllTestCaseByTestPlanIdWithSearch);
        }
    }, [getAllWithSearch]);
    const handleChangeClickTestCase = (id) => {
        setIdSearch(id);
        setIsOpenSearch(false);
        setListAllTestCase(getAllWithSearch?.getAllTestCaseByTestPlanIdWithSearch);
        setSearchTestCase('');
    };
    // Api danh sách lable
    const { data: getAllLabelsByTestPlanId } = useQuery(GET_ALL_LABEL_INTEST_PLAN, {
        client: clientRepo,
        variables: { testPlanId: parseInt(testPlanId), labelTypes: [2], page: 0, size: sizeTag },
        fetchPolicy: 'cache-and-network'
    });
    const [listAllTag, setListAllTag] = useState(null);
    useEffect(() => {
        if (getAllLabelsByTestPlanId) {
            setListAllTag(getAllLabelsByTestPlanId);
        }
    }, [getAllLabelsByTestPlanId]);
    const { data: getMembersByTestPlanId } = useQuery(GET_MEMBERS_BY_TEST_PLAN_ID, {
        client: clientRepo,
        variables: {
            testPlanId: testPlanId,
            page: 0,
            size: size,
            name: '',
            sorted: ''
        },
        fetchPolicy: 'cache-and-network'
    });
    useEffect(() => {
        if (getMembersByTestPlanId) {
            setListMember(getMembersByTestPlanId);
        }
    }, [getMembersByTestPlanId]);

    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const toggleSelectionNotAssign = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };
    useEffect(() => {
        if (checkfiltercomponent === true) {
            resetFilters();
        }
    }, [checkfiltercomponent]);
    const resetFilters = () => {
        setAssignedToMe(false);
        setSelectedAssignees([]);
        setStatuses([]);
        setPriorities([]);
        setTags([]);
        setTestCases([]);
        setStartDate('');
        setEndDate('');
        setFilter(null);
        setSearchTestCase('');
        setExact([]);
    };

    const handleConfirm = () => {
        const filterData = {
            assignedToMe,
            selectedAssignees,
            statuses,
            priorities,
            testCases,
            tags,
            startDate,
            endDate,
            exact
        };
        setFilter(filterData);
        setCurrentPage(0);
    };

    const tableContainerRef = useRef(null);

    const handleScroll = () => {
        const container = tableContainerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setSizeTestCase((prevSize) => prevSize + 5);
        }
    };

    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);
    const handleStartDateChange = (date) => {
        setStartDate(date[0]);
        // If endDate is set and is before the new startDate, clear endDate
        if (endDate && date[0] > endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (date) => {
        if (startDate && date[0] < startDate) {
            // Display an error message or set endDate to the previous valid value
            alert('End date cannot be before the start date.');
            return;
        }
        setEndDate(date[0]);
    };

    return (
        <div className="relative z-[99999] mx-auto w-full max-w-[420px] border bg-white shadow-lg focus:outline-none">
            <div className="absolute flex w-[390px] items-center justify-between border-b bg-white p-3 focus:outline-none">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                    onClick={() => {
                        setIsOpenFilter(false);
                    }}
                >
                    <Icon name="close" className="h-3 w-3" />{' '}
                </button>
            </div>
            <div className="custom-scroll-y mb-5 mt-8 h-[calc(80vh-64px)] p-4 focus:outline-none ">
                <div className="flex  gap-2  border-b pb-1 pt-3">
                    <div onClick={() => toggleSelectionNotAssign(exact, setExact, 1)} className={`m-1 rounded-full `}>
                        {exact.length > 0 ? <Icon name="checkbox" /> : <Icon name="checkbox_input" />}
                    </div>
                    <p className="pt-1 text-sm">Exact Match</p>
                </div>
                <div className="flex  gap-2    pt-2">
                    <button
                        onClick={() => toggleSelection(selectedAssignees, setSelectedAssignees, userInfo?.userID)}
                        className={`m-1 cursor-pointer rounded-full`}
                    >
                        {selectedAssignees.includes(userInfo?.userID) ? (
                            <Icon name="checkbox" />
                        ) : (
                            <Icon name="checkbox_input" />
                        )}
                    </button>
                    <p className="pt-1 text-sm">Assigned to me</p>
                </div>
                <div className="flex  gap-2  border-b pb-2">
                    <button
                        onClick={() => toggleSelectionNotAssign(selectedAssignees, setSelectedAssignees, null)}
                        className={`m-1 cursor-pointer rounded-full`}
                    >
                        {selectedAssignees.includes(null) ? <Icon name="checkbox" /> : <Icon name="checkbox_input" />}
                    </button>
                    <p className="pt-1 text-sm">Unassigned</p>
                </div>

                <div className="mb-4">
                    <label className="mb-2 mt-2 block text-sm font-medium">Link to Test Cases</label>
                    <div className="border p-2">
                        <div></div>
                        <div className="custom-scroll-y h-[calc(20vh-64px)]" ref={tableContainerRef}>
                            {listAllTestCase?.testCases?.length === 0 ? (
                                <div>
                                    <div colSpan="1" className="mt-8 object-cover py-4 text-center">
                                        No data
                                    </div>
                                </div>
                            ) : (
                                listAllTestCase?.testCases?.map((item, index) => (
                                    <div className="mb-1 flex items-center" key={index}>
                                        <input
                                            type="checkbox"
                                            id={item.testCaseId}
                                            checked={testCases.includes(item.testCaseId)}
                                            onChange={() => toggleSelection(testCases, setTestCases, item.testCaseId)}
                                            className="h-[16px] w-[16px] cursor-pointer"
                                        />
                                        <div className="ml-2 text-sm">
                                            <label htmlFor={item.testCaseId}>{item.testCaseName}</label>
                                            <p className="text-xs text-[#787878]">#{item.testCaseId}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className=" relative  mt-2 flex items-center bg-white ">
                            {isOpenSearch && (
                                <div className="-2 absolute top-8 z-[999] w-[80px] border bg-white">
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleChangeClickTestCase(1)}
                                    >
                                        ID
                                    </p>
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleChangeClickTestCase(2)}
                                    >
                                        Name
                                    </p>
                                </div>
                            )}

                            <div
                                className={`flex w-[80px] cursor-pointer justify-between border-y border-l border-[#B3B3B3] px-2 py-[2px] pt-[2px] text-sm ${
                                    isOpenSearch ? 'border-r border-primary-1' : ''
                                }`}
                                onClick={() => setIsOpenSearch(!isOpenSearch)}
                            >
                                <p>
                                    {idSearch === 1 && 'ID  '}
                                    {idSearch === 2 && 'Name '}
                                </p>
                                <Icon name="down" className="mt-1 h-3 w-3" />
                            </div>
                            <input
                                type={`${idSearch == 1 ? 'number' : 'text'}`}
                                className="flex-1 border border-[#B3B3B3] px-2 placeholder:text-sm focus:border-primary-1 focus:outline-none"
                                placeholder="Search"
                                onChange={(e) => setSearchTestCase(e.target.value)}
                                value={searchTestCase}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mb-4">
                    <label className="mb-2 mt-2 block text-sm font-medium">Assign To</label>
                    <div className="flex flex-wrap gap-1">
                        {listMember?.getMembersByTestPlanId?.members.map((assignee, index) => (
                            <div key={index} className="tooltip ml-11 ">
                                <button
                                    onClick={() =>
                                        toggleSelection(
                                            selectedAssignees,
                                            setSelectedAssignees,
                                            assignee?.userInfo?.userID
                                        )
                                    }
                                    className={`relative rounded-full  ${
                                        selectedAssignees.includes(assignee?.userInfo?.userID)
                                            ? 'border-2 border-primary-1'
                                            : ' border-2 border-white'
                                    }`}
                                >
                                    {selectedAssignees.includes(assignee?.userInfo?.userID) && (
                                        <div className="absolute -top-3 right-0">
                                            <Icon name="check" />
                                        </div>
                                    )}
                                    <AttachFile
                                        attachType="UserAvatar"
                                        entity="user"
                                        seq={assignee?.userInfo?.userID}
                                        className="h-8 w-8 rounded-full object-cover"
                                        keyProp={assignee?.userInfo?.userID}
                                    />
                                </button>
                                <span className="tooltip-text z-[300] text-[13px]">{assignee?.userInfo?.fullName}</span>
                            </div>
                        ))}
                        {listMember?.getMembersByTestPlanId?.pageInfo.totalElements > 10 &&
                            listMember?.getMembersByTestPlanId?.members.length <
                                listMember?.getMembersByTestPlanId?.pageInfo.totalElements && (
                                <div className="relative">
                                    <div
                                        className="mr-4 mt-1 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border bg-[#E8E8E8]"
                                        onClick={() => setSize(size + 10)}
                                    >
                                        <Icon name="vertical_dots" className="rotate-90" />
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="mb-2 mt-2 block text-sm font-medium">Status</label>
                    <div className="flex flex-wrap">
                        {arrStatus.map((status, index) => (
                            <div
                                key={index}
                                className={`mb-2 mr-2 flex  items-center border px-1.5 py-[3px] text-sm ${
                                    statuses.includes(status.idStatus)
                                        ? 'border-primary-1 bg-[#F8F8F8] text-primary-1'
                                        : ''
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    id={status.idStatus}
                                    checked={statuses.includes(status.idStatus)}
                                    onChange={() => toggleSelection(statuses, setStatuses, status.idStatus)}
                                    className="h-[16px] w-[16px] cursor-pointer"
                                />
                                <label className="ml-2">{status.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="mb-2 mt-2 block text-sm font-medium">Priority</label>
                    <div className="flex">
                        {arrPriority.map((priority, index) => (
                            <div
                                key={index}
                                className={`mr-2 flex items-center border px-2 py-[3px] text-sm ${
                                    priorities.includes(priority.idPri)
                                        ? 'border-primary-1 bg-[#F8F8F8] text-primary-1'
                                        : ''
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    id={priority.idPri}
                                    checked={priorities.includes(priority.idPri)}
                                    onChange={() => toggleSelection(priorities, setPriorities, priority.idPri)}
                                    className="h-[16px] w-[16px] cursor-pointer"
                                />
                                <label className="ml-2">{priority.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="mb-2 mt-2 block text-sm font-medium">Tags</label>
                    <div className="flex flex-wrap">
                        {listAllTag?.getAllLabel?.labels.map((tag, index) => (
                            <div
                                key={index}
                                className={`mb-2 mr-2 flex items-center border px-2 py-[3px] text-sm ${
                                    tags.includes(tag.labelId) ? 'border-primary-1 bg-[#F8F8F8] text-primary-1' : ''
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    id={tag.labelId}
                                    checked={tags.includes(tag.labelId)}
                                    onChange={() => toggleSelection(tags, setTags, tag.labelId)}
                                    className="h-[16px] w-[16px] cursor-pointer"
                                />
                                <label className="ml-2">{tag.labelName}</label>
                            </div>
                        ))}
                        {listAllTag?.getAllLabel?.pageInfo.totalElements > 10 &&
                            listAllTag?.getAllLabel?.labels.length <
                                listAllTag?.getAllLabel?.pageInfo.totalElements && (
                                <div className="relative">
                                    <div
                                        className="mr-4 mt-1 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border bg-[#E8E8E8]"
                                        onClick={() => setSizeTag(size + 10)}
                                    >
                                        <Icon name="vertical_dots" className="rotate-90" />
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                <div className="mb-8">
                    <label className="mb-2 mt-2 block text-sm font-medium">End Date</label>
                    <div className="flex gap-5">
                        <div className="flex flex-col gap-1">
                            <div className="text-[13px] text-[#484848]">From</div>
                            <Flatpickr
                                className=" w-[170px] cursor-pointer border border-neutral-4 px-3 py-1 placeholder:text-sm focus:border-neutral-1 focus:outline-none"
                                placeholder="dd/mm/yyyy"
                                value={startDate}
                                options={{ dateFormat: 'd/m/Y', theme: 'material_blue' }}
                                onChange={(date) => handleStartDateChange(date)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-[13px] text-[#484848]">To</div>
                            <Flatpickr
                                className="  w-[170px] cursor-pointer border border-neutral-4 px-3 py-1 placeholder:text-sm focus:border-neutral-1 focus:outline-none"
                                placeholder="dd/mm/yyyy"
                                value={endDate}
                                options={{ dateFormat: 'd/m/Y', minDate: startDate, theme: 'material_blue' }}
                                onChange={(date) => handleEndDateChange(date)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0.5  z-[99] flex w-full items-center justify-center gap-2 bg-white py-2  shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
                <button
                    onClick={resetFilters}
                    className=" w-[120px] border border-primary-1 px-4 py-1 text-sm text-primary-1"
                >
                    Reset
                </button>
                <button onClick={handleConfirm} className=" w-[120px] bg-blue-500 px-3 py-1 text-sm text-white">
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default FilterComponent;
