import { useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GET_ALL_TEST_CASE } from 'apis/run-result/test-case';
import Empty from 'components/common/Empty';
import Pagination from 'components/common/Pagination';
import SearchInput from 'components/common/SearchInput';
import SortDropdown from 'components/common/SortDropdown ';
import Icon from 'components/icons/icons';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import FillterTestCase from './FillterTestCase';

const TestCase = ({ setIdTestCase, setCloseForder, closeFolder, selectedFolder }) => {
    const [dataFilter, setDataFillter] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchString, setsearchString] = useState('');
    const itemNumber = 10;
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [dataListTestCase, setDataListTestCase] = useState(null);
    const [sortOrder, setSortOrder] = useState(true);
    const modalRef = useRef(null);
    useOutsideClick(modalRef, setIsOpenFilter);
    const sortOptions = [
        { name: 'Created at', anphabet: 'created_at' },
        { name: 'Updated at', anphabet: 'updated_at' }
    ];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

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
            createdBys: dataFilter?.creator ? dataFilter?.creator?.map(Number) : null,
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
    return (
        <div className="flex gap-2">
            <div className={`relative z-[99] h-[82vh] w-full bg-white p-4 duration-700`}>
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
                            setCurrentPage={setCurrentPage}
                            setSearch={setsearchString}
                            inputValue={searchString}
                            maxLength={255}
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
                                setCurrentPage={setCurrentPage}
                                resetFillter={resetFillter}
                            />
                        </div>
                    </div>
                    <div onClick={() => handleReset()} className="cursor-pointer border border-[#B3B3B3] px-1 pt-1">
                        <Icon name="cached" />
                    </div>
                </div>

                {dataListTestCase?.getAllTestCase?.testCases?.length > 0 ? (
                    <table className="animate__animated animate__fadeIn mt-4 min-w-full bg-white duration-1000">
                        <thead>
                            <tr className="bg-[#F4F4F4]">
                                <th className=" h-12 w-[50%] border-b py-2 pl-8 pr-4 text-left font-medium">
                                    Test Case
                                </th>
                                <th className="h-12 w-[25%] border-b px-4 py-2 text-left font-medium">Priority</th>
                                <th className="h-12 w-[25%] border-b px-4 py-2 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {dataListTestCase?.getAllTestCase?.testCases?.map((testCase, index) => {
                                    return (
                                        <tr key={index} className="cursor-pointer hover:bg-[#F4F4F4]">
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
                                                <div className="relative">
                                                    <div
                                                        className={`relative flex h-[32px] w-[96px] cursor-pointer items-center justify-center border ${
                                                            testCase?.status === 5 || testCase?.status === null
                                                                ? 'bg-[#BDBDBD]'
                                                                : ''
                                                        }${testCase?.status === 1 ? 'bg-[#2A9C58]' : ''}${
                                                            testCase?.status === 2 ? 'bg-[#FF6060]' : ''
                                                        }${testCase?.status === 3 ? 'bg-[#F1AD00]' : ''}${
                                                            testCase?.status === 4 ? 'bg-[#1D79ED]' : ''
                                                        }  px-2`}
                                                    >
                                                        <p className={`  text-sm text-white`}>
                                                            {testCase?.status === 1 && 'Passed'}
                                                            {testCase?.status === 2 && 'Failed'}
                                                            {testCase?.status === 3 && 'Retest'}
                                                            {(testCase?.status === 5 || testCase?.status === null) &&
                                                                'Untested'}
                                                            {testCase?.status === 4 && 'Skipped '}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        </tbody>
                    </table>
                ) : (
                    <div className="flex h-[50vh] items-center justify-center">
                        <Empty notFoundMessage={`Test Case is currently empty.`} />
                    </div>
                )}
                {/* Phân trang */}
                {listTestCase?.getAllTestCase.pageInfo.totalElements > 10 && (
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
        </div>
    );
};

export default TestCase;
