import { useQuery } from '@apollo/client';
import { GET_COUNT_TEST_PLANS, GET_TEST_PLANS } from 'apis/apollo/test-plan/query';
import Empty from 'components/common/Empty';
import Loading from 'components/common/Loading';
import Pagination from 'components/common/Pagination';
import SearchInput from 'components/common/SearchInput';
import SortDropdown from 'components/common/SortDropdown ';
import Title from 'components/common/Title';
import Button from 'components/design-system/Button';
import Icon from 'components/icons/icons';
import ArchiveConfirmPopup from 'components/test-plan/ArchiveConfirmPopup';
import FillterTestPlan from 'components/test-plan/list-test-plan/FillterTestPlan';
import GridView from 'components/test-plan/list-test-plan/GridView';
import ListView from 'components/test-plan/list-test-plan/ListView';
import RestoreConfirmPopup from 'components/test-plan/RestoreConfirmPopup';
import TabSwitcher from 'components/test-plan/TabSwitcher';
import { useGlobalContext } from 'context/Context';
import useUpdateUrlParam from 'hook/useUpdateUrlParam';
import useUrlParams from 'hook/useUrlParams';
import { useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';

const TestPlanList = () => {
    const { userInfo } = useGlobalContext();

    const urlParams = useUrlParams();
    const updateUrlParam = useUpdateUrlParam();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState({
        isHandle: urlParams.get('type') ? true : false,
        tabPos: urlParams.get('type') ?? 'Active'
    });
    const [view, setView] = useState(urlParams.get('view') ?? 'list');
    const [isArchive, setIsArchive] = useState(false);
    const [archiveConfirm, setArchiveConfirm] = useState({ isOpen: false, animate: 'animate__fadeInDown__2' });
    const [testPlans, setTestPlans] = useState([]);
    const [pageInfo, setPageInfo] = useState([]);
    const ACTIVE = 1;
    const ARCHIVED = 0;
    const [status, setStatus] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemNumber, setItemNumber] = useState(10);
    const [searchNameValue, setSearchNameValue] = useState('');
    const [testPlansId, setTestPlansId] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [dataFilter, setDataFillter] = useState(null);
    const modalRef = useRef();
    const [allChecked, setAllChecked] = useState(false);
    const [loadingTestPland, setLoadingTestPland] = useState(false);

    // Danh sách test plan
    const { data: dataListTestPlan, refetch } = useQuery(GET_TEST_PLANS, {
        variables: {
            userId: userInfo?.userID,
            status: status,
            page: currentPage,
            size: itemNumber,
            testPlanName: searchNameValue?.trim() === '' ? undefined : searchNameValue.trim(),
            sorted: selectedOption ? selectedOption?.alphabet + '+' + sortOrder : 'createdAt+desc',
            createdBys: dataFilter?.creator
        },
        fetchPolicy: 'network-only',
        skip: userInfo?.userID ? false : true
    });

    // Api Số lượng active
    const { data: activeCount, refetch: refetchActiveCount } = useQuery(GET_COUNT_TEST_PLANS, {
        variables: {
            userId: userInfo?.userID,
            status: 1,
            createdBys: dataFilter?.creator
        },
        fetchPolicy: 'network-only',
        skip: userInfo?.userID ? false : true
    });
    // Api Số lượng archived
    const { data: archivedCount, refetch: refetchArchivedCount } = useQuery(GET_COUNT_TEST_PLANS, {
        variables: {
            userId: userInfo?.userID,
            status: 0,
            createdBys: dataFilter?.creator
        },
        fetchPolicy: 'network-only',
        skip: userInfo?.userID ? false : true
    });

    const updateStatus = () => {
        switch (true) {
            case urlParams.get('type') === 'Active':
                setStatus(ACTIVE);
                break;

            case String(urlParams.get('type')) === 'Archived':
                setStatus(ARCHIVED);
                break;

            default:
                setStatus(ACTIVE);
                break;
        }
    };

    const handleCloseConfirm = () => {
        setTestPlansId([]);
        setIsArchive(false);
        setAllChecked(false);
    };

    const handleArchieConfirm = () => {
        setArchiveConfirm({ isOpen: true, animate: 'animate__fadeInDown__2' });
    };

    const handleView = ({ view }) => {
        setView(view);
        updateUrlParam({ param: 'view', value: view });
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        if (dataListTestPlan) {
            setTestPlans(dataListTestPlan?.getAllTestPlan?.testPlans);
            setPageInfo(dataListTestPlan?.getAllTestPlan?.pageInfo);
        }
    }, [dataListTestPlan]);

    useEffect(() => {
        if (view === 'list') {
            setItemNumber(10);
        }

        if (view === 'grid') {
            setItemNumber(9);
        }
    }, [view]);

    useEffect(() => {
        updateStatus();
    }, [activeTab?.tabPos, urlParams.get('type')]);

    useEffect(() => {
        setIsArchive(testPlansId?.length ? true : false);
    }, [testPlansId]);

    useEffect(() => {
        setLoadingTestPland(true);
        // if (loading == false) {
        setTimeout(() => {
            setLoadingTestPland(false);
        }, [1000]);
        // }
    }, []);
    const [resetFillter, setResetFilter] = useState(false);

    const handleReset = () => {
        setSelectedOption(null);
        setSearchNameValue('');
        setDataFillter(null);
        setResetFilter(!resetFillter);
    };

    return (
        <div className="h-[calc(100vh-72px)] w-full overflow-hidden bg-state-bg">
            <PerfectScrollbar>
                <div className="w-full px-10 pb-20 pt-4">
                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <Title name={'Test Plan'} subtitle={'View and manage all your Test Plans in one place.'} />

                        <Button
                            icon={<Icon name="plus_circle_2" className="h-5 w-5 fill-white" />}
                            className="bg-primary-1 px-3 py-2 text-white"
                            onClick={() => navigate('/test-plan/create')}
                        >
                            New Test Plan
                        </Button>
                    </div>

                    <div className="mt-4 bg-white px-6 pb-6 pt-4">
                        {/* Archived or Tab Switcher */}
                        <>
                            {isArchive ? (
                                <div
                                    className={`animate__animated ${
                                        isArchive ? 'animate__fadeIn' : 'animate__fadeOut'
                                    } flex items-center justify-between bg-neutral-7 px-6 py-2.5`}
                                >
                                    <Icon
                                        name="close_2"
                                        className="h-5 w-5 cursor-pointer fill-neutral-3"
                                        onClick={handleCloseConfirm}
                                    />

                                    <div className="flex items-center gap-x-4">
                                        <div
                                            className={`font-normal ${
                                                activeTab?.tabPos === 'Active' && 'text-state-error'
                                            } ${activeTab?.tabPos === 'Active' && 'text-state-error'} ${
                                                activeTab?.tabPos === 'Archived' && 'text-primary-1'
                                            }`}
                                        >
                                            <span>Selected</span>
                                            <span className="font-bold">({testPlansId?.length ?? 0})</span>
                                        </div>

                                        <button
                                            className={`border  bg-white px-3 py-2 font-bold ${
                                                activeTab?.tabPos === 'Active' && 'border-state-error text-state-error'
                                            } ${activeTab?.tabPos === 'Archived' && 'border-primary-1 text-primary-1'}`}
                                            onClick={handleArchieConfirm}
                                        >
                                            {activeTab?.tabPos === 'Active' ? 'Archive' : ''}
                                            {activeTab?.tabPos === 'Archived' ? 'Restore' : ''}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Tab switcher and filter
                                <div className={` border-b-neutral-5" flex justify-between border-b-[0.5px]`}>
                                    <TabSwitcher
                                        updateUrlParam={updateUrlParam}
                                        firstTabName={'Active'}
                                        countFirstTab={activeCount?.getAllTestPlan?.pageInfo?.totalElements}
                                        countSecondTab={archivedCount?.getAllTestPlan?.pageInfo?.totalElements}
                                        secondTabName={'Archived'}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        setCurrentPage={setCurrentPage}
                                    />

                                    <div className="flex w-1/2 justify-end gap-x-2 pb-2">
                                        {/* Tìm kiếm */}
                                        <div className="w-1/2">
                                            <SearchInput
                                                setCurrentPage={setCurrentPage}
                                                className={'h-full w-full'}
                                                setSearch={setSearchNameValue}
                                                inputValue={searchNameValue}
                                                maxLength={50}
                                                placeholder={`Filter by name`}
                                            />
                                        </div>
                                        {/* Lọc anphabet */}
                                        <SortDropdown
                                            className="flex h-full w-1/4"
                                            options={[
                                                { name: 'Created at', alphabet: 'createdAt' },
                                                { name: 'Updated at', alphabet: 'updatedAt' },
                                                { name: 'Test Plan Name', alphabet: 'testPlanName' }
                                            ]}
                                            selectedOption={selectedOption}
                                            sortOrder={sortOrder}
                                            onOptionSelect={handleOptionSelect}
                                            onSortOrderChange={handleSortOrderChange}
                                            placeholder="Created at"
                                        />
                                        {/* Filter */}
                                        <div
                                            className="relative cursor-pointer  border border-[#B3B3B3] "
                                            ref={modalRef}
                                        >
                                            <div
                                                onClick={() => setIsOpenFilter(!isOpenFilter)}
                                                className="flex h-full   w-[90px] items-center justify-center gap-2 text-center"
                                            >
                                                <p className="text-sm font-normal text-[#BCBCBC]">Filter</p>
                                                <Icon name="filter" className="fill-[#787878]" />
                                            </div>
                                            {/* {isOpenFilter && ( */}
                                            <div
                                                className={`animate__animated animate__fadeIn absolute right-0 z-[30] mt-2 w-[300px] ${
                                                    isOpenFilter ? '' : 'hidden'
                                                }`}
                                            >
                                                <FillterTestPlan
                                                    setDataFillter={setDataFillter}
                                                    setIsOpenFilter={setIsOpenFilter}
                                                    setCurrentPage={setCurrentPage}
                                                    resetFillter={resetFillter}
                                                    isOpenFilter={isOpenFilter}
                                                />
                                            </div>
                                            {/* )} */}
                                        </div>
                                        <div
                                            onClick={() => handleReset()}
                                            className="border border-[#B3B3B3] px-1 pt-1"
                                        >
                                            <Icon name="cached" />
                                        </div>

                                        {/* Dạng danh sách */}
                                        <div className="flex items-center gap-x-2">
                                            {/* Dạng list */}
                                            <div
                                                className={`flex h-8 w-8 cursor-pointer items-center justify-center border p-2 transition-all duration-300 ${
                                                    view === 'list' ? 'bg-primary-2' : ''
                                                }`}
                                                onClick={() => handleView({ view: 'list' })}
                                            >
                                                <Icon
                                                    name="menu"
                                                    className={`h-6 w-6  ${view === 'list' ? 'fill-primary-1' : ''} `}
                                                />
                                            </div>
                                            {/* Dạng lưới */}
                                            <div
                                                className={`flex h-8 w-8 cursor-pointer items-center justify-center border p-2 transition-all duration-300 ${
                                                    view === 'grid' ? 'bg-primary-2' : ''
                                                }`}
                                                onClick={() => handleView({ view: 'grid' })}
                                            >
                                                <Icon
                                                    name="app_store"
                                                    className={`h-6 w-6  ${view === 'grid' ? 'fill-primary-1' : ''} `}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>

                        {/* Views */}
                        <>
                            {!loadingTestPland ? (
                                <>
                                    {testPlans?.length ? (
                                        <div className="mt-4">
                                            <>
                                                {view === 'list' ? (
                                                    <ListView
                                                        testPlans={testPlans}
                                                        testPlansId={testPlansId}
                                                        setTestPlansId={setTestPlansId}
                                                        setArchiveConfirm={setArchiveConfirm}
                                                        refetch={refetch}
                                                        currentPage={currentPage}
                                                        allChecked={allChecked}
                                                        setAllChecked={setAllChecked}
                                                    />
                                                ) : null}
                                            </>
                                            <>
                                                {view === 'grid' ? (
                                                    <GridView
                                                        testPlans={testPlans}
                                                        testPlansId={testPlansId}
                                                        setTestPlansId={setTestPlansId}
                                                        refetch={refetch}
                                                    />
                                                ) : null}
                                            </>
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[calc(100vh-317px)] items-center justify-center">
                                            <Empty
                                                notFoundMessage={`We couldn't find any ${
                                                    status === 1 ? 'assigned' : 'archived'
                                                }  Test Plan.`}
                                            />
                                        </div>
                                    )}

                                    {/* Pagination - Phân trang*/}
                                    <>
                                        {pageInfo?.totalElements > 10 && (
                                            <div className="mt-6">
                                                <Pagination
                                                    setCurrentPage={setCurrentPage}
                                                    currentPage={currentPage}
                                                    pagination={pageInfo}
                                                    itemNumber={itemNumber}
                                                />
                                            </div>
                                        )}
                                    </>
                                </>
                            ) : (
                                <div className="flex min-h-[calc(100vh-317px)] items-center justify-center">
                                    <div className="h-full">
                                        <Loading />
                                    </div>
                                </div>
                            )}
                        </>

                        {/* Archive Confirm Popup */}
                        <>
                            {activeTab?.tabPos === 'Active' ? (
                                <ArchiveConfirmPopup
                                    testPlanCount={testPlansId?.length}
                                    archiveConfirm={archiveConfirm}
                                    setArchiveConfirm={setArchiveConfirm}
                                    testPlansId={testPlansId}
                                    setTestPlansId={setTestPlansId}
                                    refetch={refetch}
                                    refetchActiveCount={refetchActiveCount}
                                    refetchArchivedCount={refetchArchivedCount}
                                    setCurrentPage={setCurrentPage}
                                    setAllChecked={setAllChecked}
                                />
                            ) : null}
                        </>

                        {/* Restore Confirm Popup */}
                        <>
                            {activeTab?.tabPos === 'Archived' ? (
                                <RestoreConfirmPopup
                                    testPlanCount={testPlansId?.length}
                                    archiveConfirm={archiveConfirm}
                                    setArchiveConfirm={setArchiveConfirm}
                                    testPlansId={testPlansId}
                                    setTestPlansId={setTestPlansId}
                                    refetch={refetch}
                                    refetchActiveCount={refetchActiveCount}
                                    refetchArchivedCount={refetchArchivedCount}
                                    setCurrentPage={setCurrentPage}
                                    setAllChecked={setAllChecked}
                                />
                            ) : null}
                        </>
                    </div>
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default TestPlanList;
