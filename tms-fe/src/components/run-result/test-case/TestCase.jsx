import { useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GET_ALL_TEST_CASE } from 'apis/run-result/test-case';
import Empty from 'components/common/Empty';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useOutsideClick from '../../../hook/useOutsideClick';
import Pagination from '../../common/Pagination';
import SearchInput from '../../common/SearchInput';
import SortDropdown from '../../common/SortDropdown ';
import Icon from '../../icons/icons';
import FillterTestCase from './FillterTestCase';
import FormResult from './FormResult';

const TestCase = ({
    setIdTestCase,
    setCloseForder,
    closeFolder,
    selectedFolder,
    callBack,
    setCallBack,
    setSelectTab
}) => {
    const [isOpenPriority, setIsOpenPriority] = useState(false);
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const [isOpenAddResult, setIsOpenAddResult] = useState(false);
    const [status, setStatus] = useState({ id: 4, name: 'Untested', color: '#979797' });
    const [dataFilter, setDataFillter] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchString, setsearchString] = useState('');
    const itemNumber = 10;
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [testCaseId, setTestCaseId] = useState(null);
    const [selectTestCaseID, setSelectTestCaseID] = useState(null);
    const [operation, setOperation] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [dataListTestCase, setDataListTestCase] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const modalRef = useRef(null);
    const topRef = useRef(null);
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' }); // Cuộn lên đầu danh sách
        }
    }, [currentPage]);
    useOutsideClick(modalRef, setIsOpenFilter);
    const sortOptions = [
        { name: 'Created at', anphabet: 'created_at' },
        { name: 'Updated at', anphabet: 'updated_at' }
    ];
    const dataStatus = [
        { id: 1, name: 'Passed', color: '#2A9C58' },
        { id: 2, name: 'Failed', color: '#FF6060' },
        { id: 3, name: 'Retest', color: '#E1A50A' },
        { id: 4, name: 'Skipped', color: '#1D79ED' }
    ];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };
    const { testPlanId } = useParams();

    // Api danh sách test case
    const { data: listTestCase, refetch } = useQuery(GET_ALL_TEST_CASE, {
        client: clientRun,
        variables: {
            folderId: parseInt(selectedFolder),
            page: currentPage,
            size: itemNumber,
            sort: selectedOption ? selectedOption?.anphabet + '+' + sortOrder : 'created_at+desc',
            searchString: searchString?.trim() === '' ? undefined : searchString.trim(),
            labelIds: dataFilter?.tag ? dataFilter?.tag?.map(Number) : null,
            createdBys: dataFilter?.creator ? dataFilter?.creator?.map(String) : null,
            resultStatus: dataFilter?.resultStatus ? dataFilter?.resultStatus?.map(Number) : null
        }
    });

    useEffect(() => {
        if (listTestCase) {
            // Xử lý dữ liệu listTestCase ở đây
            setDataListTestCase(listTestCase);
        }
    }, [listTestCase]);
    useEffect(() => {
        if (selectedFolder) {
            refetch();
            setDataFillter({});
        }
    }, [selectedFolder]);
    const [resetFillter, setResetFilter] = useState(false);

    const handleReset = () => {
        setsearchString('');
        setSelectedOption(null);
        setDataFillter(null);
        setResetFilter(!resetFillter);
    };
    const refResult = useRef();
    useOutsideClick(refResult, setIsOpenPriority);
    return (
        <div className="flex gap-2">
            <div className={`relative z-[99] h-[calc(87vh-72px)] w-full bg-white p-4 duration-700`}>
                <div
                    className={`absolute ${
                        closeFolder ? '-left-3' : '-left-3 rotate-180'
                    }  top-14 z-[99999] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#EDF3FF] transition-transform duration-1000`}
                    onClick={() => setCloseForder(!closeFolder)}
                >
                    <Icon name="expand_collapse" />
                </div>
                <div className="flex justify-between border-b py-3">
                    <p className="text-lg font-bold">Test Case</p>
                </div>
                <div className="mt-4 flex gap-2">
                    <div className="w-[70%]">
                        <SearchInput
                            placeholder="Filter by name"
                            className="h-full"
                            maxLength={255}
                            inputValue={searchString}
                            setCurrentPage={setCurrentPage}
                            setSearch={setsearchString}
                        />
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
                    <div className="relative w-[32px] cursor-pointer  border border-[#B3B3B3] " ref={modalRef}>
                        <div
                            onClick={() => setIsOpenFilter(!isOpenFilter)}
                            className="flex h-full justify-center text-center"
                        >
                            <Icon name="filter" className="fill-[#787878]" />
                        </div>

                        <div
                            className={`animate__animated animate__fadeIn absolute right-0 z-[30] mt-2 w-[300px] ${
                                isOpenFilter ? '' : 'hidden'
                            }`}
                        >
                            <FillterTestCase
                                selectedFolder={selectedFolder}
                                setDataFillter={setDataFillter}
                                setIsOpenFilter={setIsOpenFilter}
                                dataFilter={dataFilter}
                                setCurrentPage={setCurrentPage}
                                resetFillter={resetFillter}
                            />
                        </div>
                    </div>
                    <div onClick={() => handleReset()} className="border border-[#B3B3B3] px-1 pt-1">
                        <Icon name="cached" />
                    </div>
                </div>
                <div className="custom-scroll-y h-[calc(97vh-333px)]">
                    {dataListTestCase?.getAllTestCase?.testCases?.length > 0 && selectedFolder ? (
                        <table
                            ref={topRef}
                            className="animate__animated animate__fadeIn mt-4 min-w-full bg-white duration-1000"
                        >
                            <thead>
                                <tr className="bg-[#F4F4F4]">
                                    <th className=" h-12 w-[50%] border-b py-2 pl-8 pr-4 text-left font-medium">
                                        Test Case
                                    </th>
                                    <th className="h-12 w-[25%] border-b px-4 py-2 text-left font-medium">Priority</th>
                                    <th className="h-12 w-[20%] border-b px-4 py-2 text-left font-medium">Status</th>
                                    <th className="w-[5%] border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataListTestCase?.getAllTestCase?.testCases?.map((testCase, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="cursor-pointer hover:bg-[#F4F4F4]"
                                            onMouseEnter={() => {
                                                setTestCaseId(testCase?.testCaseId), setHovered(true);
                                            }}
                                            onMouseLeave={() => {
                                                setOperation(false), setHovered(false);
                                            }}
                                        >
                                            <td
                                                className="  h-12 border-b py-2 pl-8 pr-4 "
                                                onClick={() => setIdTestCase(testCase?.testCaseId)}
                                            >
                                                <div className="flex gap-2 ">
                                                    <Icon name="file" />
                                                    <p className=" font-medium">{testCase.testCaseName}</p>
                                                </div>
                                            </td>
                                            <td
                                                className="h-12 border-b px-4 py-2"
                                                onClick={() => setIdTestCase(testCase?.testCaseId)}
                                            >
                                                <p
                                                    className={` w-[70px] border-2 px-2 py-1 text-center text-sm font-medium ${
                                                        testCase.priority === 3
                                                            ? ' border-[#FFDEDE] bg-[#FFE9E9] text-[#B41B1B]'
                                                            : testCase.priority === 1
                                                            ? ' border-[#E1E1E14D] bg-[#F0F0F0] text-[#787878]'
                                                            : ' border-[#FFEF99] bg-[#FFF6D7] text-[#F1AD00]'
                                                    }`}
                                                >
                                                    {testCase.priority === 1 && 'Low'}
                                                    {testCase.priority === 2 && 'Medium'}
                                                    {testCase.priority === 3 && 'High'}
                                                </p>
                                            </td>
                                            <td className="h-12 border-b px-4 py-2">
                                                <div className="">
                                                    <div
                                                        className={`relative flex h-[32px] w-[96px] cursor-pointer items-center justify-center gap-2 border ${
                                                            testCase?.status === 5 || testCase?.status === null
                                                                ? 'bg-[#BDBDBD]'
                                                                : ''
                                                        }${testCase?.status === 1 ? 'bg-[#2A9C58]' : ''}${
                                                            testCase?.status === 2 ? 'bg-[#FF6060]' : ''
                                                        }${testCase?.status === 3 ? 'bg-[#F1AD00]' : ''}${
                                                            testCase?.status === 4 ? 'bg-[#1D79ED]' : ''
                                                        }  px-2`}
                                                        onClick={() => {
                                                            setIsOpenPriority(!isOpenPriority),
                                                                setTestCaseId(testCase?.testCaseId);
                                                            setSelectTestCaseID(testCase?.testCaseId);
                                                        }}
                                                    >
                                                        <p className={`  text-sm text-white`}>
                                                            {testCase?.status === 1 && 'Passed'}
                                                            {testCase?.status === 2 && 'Failed'}
                                                            {testCase?.status === 3 && 'Retest'}
                                                            {(testCase?.status === 5 || testCase?.status === null) &&
                                                                'Untested'}
                                                            {testCase?.status === 4 && 'Skipped '}
                                                        </p>
                                                        {checkStatus === 1 && checkRoleTestPland !== 3 && (
                                                            <div className="">
                                                                <Icon
                                                                    name="caret_right"
                                                                    className="rotate-90 fill-white"
                                                                />
                                                            </div>
                                                        )}
                                                        {isOpenPriority &&
                                                            testCase?.testCaseId === selectTestCaseID &&
                                                            checkStatus === 1 &&
                                                            checkRoleTestPland !== 3 && (
                                                                <div className="absolute top-6 z-30 mt-2 w-[140px] border bg-white p-2">
                                                                    {dataStatus?.map((item, index) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className="flex cursor-pointer items-center gap-2 p-1.5 text-sm font-normal hover:bg-[#F4F4F4] "
                                                                                onClick={() => {
                                                                                    setStatus(item),
                                                                                        setIsOpenPriority(false),
                                                                                        setIsOpenAddResult(true);
                                                                                }}
                                                                            >
                                                                                <p
                                                                                    className={`h-4 w-4 `}
                                                                                    style={{
                                                                                        backgroundColor: item?.color
                                                                                    }}
                                                                                ></p>
                                                                                <p className=" px-1 py-1 ">
                                                                                    {item.name}
                                                                                </p>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="relative h-12 border-b px-4 py-2">
                                                {hovered &&
                                                    testCaseId === testCase?.testCaseId &&
                                                    checkStatus === 1 &&
                                                    checkRoleTestPland !== 3 && (
                                                        <p onClick={() => setOperation(!operation)}>
                                                            <Icon name="three_dots" />
                                                        </p>
                                                    )}
                                                {operation && testCaseId === testCase?.testCaseId && hovered && (
                                                    <div className=" absolute right-8 z-[30] w-[125px] border bg-white p-2 ">
                                                        <p
                                                            className="h-[38px]  pl-2 pt-2 text-start text-sm font-medium hover:bg-[#F4F4F4]"
                                                            onClick={() => {
                                                                setIsOpenAddResult(!isOpenAddResult),
                                                                    setTestCaseId(testCase?.testCaseId);
                                                            }}
                                                        >
                                                            Add Result
                                                        </p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex h-[50vh] items-center justify-center">
                            <Empty notFoundMessage={`Test Case is currently empty.`} />
                        </div>
                    )}
                </div>

                {/* Phân trang */}
                {listTestCase?.getAllTestCase?.pageInfo?.totalElements > 10 && (
                    <div className=" absolute bottom-3 flex w-full justify-center">
                        <div>
                            <Pagination
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                pagination={listTestCase?.getAllTestCase?.pageInfo}
                                itemNumber={itemNumber}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* Chi tiết test case */}

            <FormResult
                refetch={refetch}
                setIsOpen={setIsOpenAddResult}
                isOpen={isOpenAddResult}
                status={status}
                testCaseId={testCaseId}
                setCallBack={setCallBack}
                callBack={callBack}
                testPlanId={testPlanId}
                setSelectTab={setSelectTab}
            />
        </div>
    );
};

export default TestCase;
