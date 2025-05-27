import { useQuery } from '@apollo/client';
import { GET_ALL_TEST_CASE } from 'apis/repository/test-case';
import Empty from 'components/common/Empty';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '../../../hook/useOutsideClick';
import Pagination from '../../common/Pagination';
import SearchInput from '../../common/SearchInput';
import SortDropdown from '../../common/SortDropdown ';
import Icon from '../../icons/icons';
import DeleteTestCase from './DeleteTestCase';
import FillterTestCase from './FillterTestCase';
import FormTestCase from './FormTestCase';
import ImportCSV from './ImportCSV';
const TestCase = ({
    setIdTestCase,
    setCloseForder,
    closeFolder,
    selectedFolder,
    checKAddTestCase,
    isOpenTest,
    setIsOpenTest,
    selectForm,
    setSelectForm,
    editTestCaseId,
    setEditTestCaseId,
    arrayTestCaseId,
    setArrayTestCaseId,
    openDeleteTestCase,
    setOpenDeleteTestCase
}) => {
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const [dataFilter, setDataFillter] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchString, setsearchString] = useState('');
    const itemNumber = 10;
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [testCaseId, setTestCaseId] = useState(null);
    const [operation, setOperation] = useState(false);
    const [checkAllTestCase, setCheckAllTestCase] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [dataListTestCase, setDataListTestCase] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const modalRef = useRef(null);
    const [isOpenCSV, setIsOpenCSV] = useState(false);
    const topRef = useRef(null);
    useOutsideClick(modalRef, setIsOpenFilter);

    const sortOptions = [
        { name: 'Created at', anphabet: 'created_at' },
        { name: 'Updated at', anphabet: 'updated_at' }
    ];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };
    // Khi `listDataIssue` thay đổi, cuộn lên đầu phần tử được tham chiếu bởi `topRef`
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' }); // Cuộn lên đầu danh sách
        }
    }, [currentPage]);
    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    // Api danh sách test case
    const { data: listTestCase, refetch } = useQuery(GET_ALL_TEST_CASE, {
        variables: {
            folderId: parseInt(selectedFolder?.folderId),
            page: currentPage,
            size: itemNumber,
            sorted: selectedOption ? selectedOption?.anphabet + '+' + sortOrder : '',
            testCaseName: searchString?.trim() === '' ? undefined : searchString.trim(),
            labelIds: dataFilter?.tag ? dataFilter?.tag?.map(Number) : null,
            createdBys: dataFilter?.creator ? dataFilter?.creator?.map(String) : null
        },
        skip: selectedFolder?.folderId ? false : true
    });

    useEffect(() => {
        setCurrentPage(0);
    }, [selectedFolder?.folderId]);

    useEffect(() => {
        if (currentPage) {
            refetch();
        }
    }, [currentPage, refetch]);

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

    // Hàm chọn một test case
    const handlerCheckTestCase = (e, testCaseId) => {
        if (e.target.checked) {
            setArrayTestCaseId([...arrayTestCaseId, testCaseId]);
        } else {
            setArrayTestCaseId(arrayTestCaseId?.filter((id) => id !== testCaseId));
        }
    };

    // Hàm chọn tất cả test case
    const handleCheckAll = (e) => {
        setCheckAllTestCase(e.target.checked);
        if (e.target.checked) {
            setArrayTestCaseId(listTestCase?.getAllTestCase?.testCases?.map((item) => item.testCaseId));
        } else {
            setArrayTestCaseId([]);
        }
    };

    const [resetFillter, setResetFilter] = useState(false);
    const handleReset = () => {
        setsearchString('');
        setSelectedOption(null);
        setDataFillter(null);
        setResetFilter(!resetFillter);
    };
    return (
        <div className="flex gap-2 overflow-y-auto">
            <div className={` relative z-[99] h-[calc(87vh-72px)] w-full bg-white p-4 duration-700`}>
                <div
                    className={`absolute ${
                        closeFolder ? '-left-1' : '-left-1 rotate-180'
                    }  top-14 z-[99999] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#EDF3FF] transition-transform duration-1000`}
                    onClick={() => setCloseForder(!closeFolder)}
                >
                    <Icon name="expand_collapse" />
                </div>
                <div className="flex justify-between border-b py-3">
                    <p className="text-lg font-bold">Test Case</p>

                    <ImportCSV
                        folderId={selectedFolder?.folderId}
                        isOpenCSV={isOpenCSV}
                        setIsOpenCSV={setIsOpenCSV}
                        refetch={refetch}
                    />

                    {checkStatus === 1 && selectedFolder?.status == 1 && checkRoleTestPland !== 3 && (
                        <div className="flex gap-2">
                            {/* Import CSV */}
                            <div
                                className={`flex cursor-pointer justify-center gap-2 border px-2 py-1 ${
                                    checKAddTestCase === false && selectedFolder?.folderId
                                        ? 'border-[#0066CC] text-[#0066CC]'
                                        : ' text-[#787878]'
                                }`}
                            >
                                <Icon
                                    name="import"
                                    className={` ${
                                        checKAddTestCase === false && selectedFolder?.folderId
                                            ? 'fill-[#0066CC] '
                                            : ' fill-[#787878]'
                                    }`}
                                />
                                <p
                                    onClick={() =>
                                        setIsOpenCSV(
                                            checKAddTestCase === false && selectedFolder?.folderId ? true : false
                                        )
                                    }
                                    className="text-sm font-semibold"
                                >
                                    Import CSV
                                </p>
                            </div>

                            <div
                                className={`flex h-[32px] w-[149px] cursor-pointer items-center justify-center gap-2 border  ${
                                    checKAddTestCase === false && selectedFolder?.folderId
                                        ? 'border-[#0066CC] text-[#0066CC]'
                                        : ' text-[#787878]'
                                }`}
                                onClick={() => {
                                    setIsOpenTest(
                                        checKAddTestCase === false && selectedFolder?.folderId ? true : false
                                    ),
                                        setSelectForm('add');
                                }}
                            >
                                <Icon
                                    name="plus_circle"
                                    className={` ${
                                        checKAddTestCase === false && selectedFolder?.folderId
                                            ? 'fill-[#0066CC] '
                                            : ' fill-[#787878]'
                                    }`}
                                />
                                <p className="text-sm font-semibold ">Add Test Case</p>
                            </div>
                        </div>
                    )}
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
                            className={` animate__animated animate__fadeIn absolute right-0 z-[30] mt-2 w-[300px] ${
                                isOpenFilter ? '' : 'hidden'
                            }`}
                        >
                            <FillterTestCase
                                selectedFolder={selectedFolder}
                                setDataFillter={setDataFillter}
                                setIsOpenFilter={setIsOpenFilter}
                                setCurrentPage={setCurrentPage}
                                resetFillter={resetFillter}
                                isOpenFilter={isOpenFilter}
                            />
                        </div>
                    </div>
                    <div onClick={() => handleReset()} className="cursor-pointer border border-[#B3B3B3] px-1 pt-1">
                        <Icon name="cached" />
                    </div>
                </div>
                {arrayTestCaseId.length > 0 && (
                    <div className="mt-2 flex h-[45px] items-center justify-between bg-[#F4F4F4] px-3">
                        <div
                            className="mt-2 cursor-pointer"
                            onClick={() => {
                                setArrayTestCaseId([]), setCheckAllTestCase(false);
                            }}
                        >
                            <Icon name="close" className="h-4 w-4" />
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="font-normal text-[#FF6060]">Selected ({arrayTestCaseId.length})</p>
                            <p
                                className="cursor-pointer border border-[#FF6060] px-2 py-1 text-sm font-bold text-[#FF6060]"
                                onClick={() => {
                                    setOpenDeleteTestCase(true), setIdTestCase(null);
                                }}
                            >
                                Delete
                            </p>
                        </div>
                    </div>
                )}
                <div className="custom-scroll-y h-[calc(97vh-333px)]">
                    {dataListTestCase?.getAllTestCase?.testCases?.length > 0 ? (
                        <table
                            ref={topRef}
                            className="animate__animated animate__fadeIn mt-4 min-w-full bg-white duration-1000"
                        >
                            <thead>
                                <tr className="bg-[#F4F4F4]">
                                    <th className="h-12 w-[40px] border-b px-4 py-2">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            onChange={handleCheckAll}
                                            checked={checkAllTestCase}
                                        />
                                    </th>
                                    <th className="h-12 w-[70%] border-b px-4 py-2 text-left text-[15px] font-medium">
                                        Test Case
                                    </th>
                                    <th className="h-12 w-[25%] border-b px-4 py-2 text-left text-[15px] font-medium">
                                        Priority
                                    </th>
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
                                            <td className=" h-12 border-b px-4 py-2">
                                                <div className="">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4"
                                                        onChange={(e) => handlerCheckTestCase(e, testCase?.testCaseId)}
                                                        checked={arrayTestCaseId?.includes(testCase?.testCaseId)}
                                                    />
                                                </div>
                                            </td>
                                            <td
                                                className="h-12  border-b px-4 py-2"
                                                onClick={() => setIdTestCase(testCase?.testCaseId)}
                                            >
                                                <div className="flex gap-2">
                                                    <Icon name="file" />
                                                    <p className="text-[15px] font-light">{testCase.testCaseName}</p>
                                                </div>
                                            </td>
                                            <td
                                                className="h-12 border-b px-4 py-2"
                                                onClick={() => setIdTestCase(testCase?.testCaseId)}
                                            >
                                                <p
                                                    className={` w-[70px] px-2 py-1 text-center text-sm font-medium ${
                                                        testCase.priority === 3
                                                            ? ' bg-[#FFE9E9] text-red-500'
                                                            : testCase.priority === 1
                                                            ? ' bg-[#F0F0F0] text-[#787878]'
                                                            : ' bg-[#FFF6D7] text-yellow-500'
                                                    }`}
                                                >
                                                    {testCase.priority === 1 && 'Low'}
                                                    {testCase.priority === 2 && 'Medium'}
                                                    {testCase.priority === 3 && 'High'}
                                                </p>
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
                                                    <div className=" absolute right-8 z-[30] w-[95px] border bg-white p-2 ">
                                                        <p
                                                            className="h-[38px] border-b pl-2 pt-2 text-start text-sm font-medium hover:bg-[#F4F4F4]"
                                                            onClick={() => {
                                                                setSelectForm('edit'),
                                                                    setEditTestCaseId(testCase?.testCaseId),
                                                                    setIsOpenTest(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </p>
                                                        <p
                                                            className="h-[38px] pl-2 pt-2 text-start text-sm font-medium text-red-500 hover:bg-[#F4F4F4]"
                                                            onClick={() => {
                                                                setOpenDeleteTestCase(true),
                                                                    setArrayTestCaseId([testCase?.testCaseId]),
                                                                    setIdTestCase(null);
                                                            }}
                                                        >
                                                            Delete
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

                {listTestCase?.getAllTestCase?.pageInfo?.totalElements > 10 && (
                    <div className={`flex w-full justify-center  `}>
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

                {/* Form tạo test case */}
                <FormTestCase
                    setIsOpen={setIsOpenTest}
                    isOpen={isOpenTest}
                    selectForm={selectForm}
                    editTestCaseId={editTestCaseId}
                    selectedFolder={selectedFolder}
                    refetch={refetch}
                />
                {/* Xóa test case */}
                <DeleteTestCase
                    isOpen={openDeleteTestCase}
                    setIsOpen={setOpenDeleteTestCase}
                    arrayTestCaseId={arrayTestCaseId}
                    setArrayTestCaseId={setArrayTestCaseId}
                    selectedFolder={selectedFolder}
                    refetch={refetch}
                    setCheckAllTestCase={setCheckAllTestCase}
                    setIdTestCase={setIdTestCase}
                />
            </div>
        </div>
    );
};

export default TestCase;
