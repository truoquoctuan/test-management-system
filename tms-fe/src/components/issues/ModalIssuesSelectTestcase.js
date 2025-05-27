import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { GET_ALL_TEST_CASES_BY_TEST_PLAN_ID_WITH_SEARCH } from 'apis/issues/issues';
import Empty from 'components/common/Empty';
import useCloseModalOnOutsideClick from 'components/common/modalMouse';
import Pagination from 'components/common/Pagination';
import SearchInput from 'components/common/SearchInput';
import Icon from 'components/icons/icons';
import { useEffect, useRef, useState } from 'react';

const ModalSelectTestcase = ({
    onClose,
    selectedIdTestCases,
    setSelectedIdTestCases,
    testPlanId,
    setDataTestcase,
    dataTestcase,
    keyEdit,
    handleSubmit
}) => {
    const Ref = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchID, setSearchID] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [idSearch, setIdSearch] = useState(1); // Default search by Title
    const [tempSelectedTestCases, setTempSelectedTestCases] = useState([...selectedIdTestCases]); // Temporary storage
    const itemNumber = 10;
    useCloseModalOnOutsideClick(Ref, setIsOpenSearch);

    // Determine which variable to use for searching based on idSearch
    const searchVariables = idSearch === 1 ? { testCaseName: searchText } : { testCaseId: searchID };

    const { data } = useQuery(GET_ALL_TEST_CASES_BY_TEST_PLAN_ID_WITH_SEARCH, {
        client: clientRepo,
        variables: {
            ...searchVariables,
            testPlanId: testPlanId,
            page: currentPage,
            size: itemNumber
        },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (data?.getAllTestCaseByTestPlanIdWithSearch?.testCases.length > 0) {
            setTempSelectedTestCases(selectedIdTestCases);
        }
    }, [data, selectedIdTestCases]);

    const handleCheckboxChange = (testCase) => {
        if (keyEdit) {
            setDataTestcase([...dataTestcase, testCase]);
            setSelectedIdTestCases((prevSelected) => {
                const isSelected = prevSelected.some((tc) => tc.id === testCase.testCaseId);
                if (isSelected) {
                    return prevSelected.filter((tc) => tc.id !== testCase.testCaseId);
                } else {
                    return [...prevSelected, { id: testCase.testCaseId, title: testCase.testCaseName }];
                }
            });
        } else {
            setTempSelectedTestCases((prevSelected) => {
                const isSelected = prevSelected.some((tc) => tc.id === testCase.testCaseId);
                if (isSelected) {
                    return prevSelected.filter((tc) => tc.id !== testCase.testCaseId);
                } else {
                    return [...prevSelected, { id: testCase.testCaseId, title: testCase.testCaseName }];
                }
            });
        }
    };

    const handleSearchTypeChange = (newIdSearch) => {
        setIdSearch(newIdSearch);
        setSearchText('');
        setSearchID('');
        setCurrentPage(0);
        setIsOpenSearch(false);
    };

    const handleCancel = () => {
        onClose();
    };

    const handleConfirm = () => {
        setSelectedIdTestCases(tempSelectedTestCases);
        if (keyEdit == false) {
            setDataTestcase(tempSelectedTestCases.map((tc) => ({ id: tc.id, title: tc.title })));
        }

        if (handleSubmit) {
            handleSubmit();
        }
        onClose();
    };

    const [listDataTestCase, setListDataTestCase] = useState(null);

    useEffect(() => {
        if (data) {
            setListDataTestCase(data);
        }
    }, [data]);

    const testCases = listDataTestCase?.getAllTestCaseByTestPlanIdWithSearch?.testCases || [];
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative flex h-[820px] w-[800px] flex-col overflow-hidden bg-white shadow-xl">
                <div className="flex items-center justify-between p-4">
                    <div className="text-[18px] font-bold text-[#121212]">Test Cases Selection</div>
                    <div onClick={handleCancel} className="cursor-pointer">
                        <Icon name="close" className="h-4 w-4" />
                    </div>
                </div>
                <div className="flex flex-grow flex-col overflow-hidden">
                    <div className="flex-grow overflow-auto px-5 pt-3">
                        <div className="relative mb-4 flex">
                            {isOpenSearch && (
                                <div ref={Ref} className="absolute z-[30] mt-8 w-[140px] border bg-white">
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleSearchTypeChange(1)}
                                    >
                                        Title
                                    </p>
                                    <p
                                        className="cursor-pointer px-2 py-1.5 text-sm text-[#121212] hover:bg-[#F4F4F4]"
                                        onClick={() => handleSearchTypeChange(2)}
                                    >
                                        ID
                                    </p>
                                </div>
                            )}

                            <div
                                className={`flex h-[30px] w-[170px] cursor-pointer items-center justify-between border-y border-l border-[#B3B3B3] px-2 py-[2px] text-sm ${
                                    isOpenSearch ? 'border-r border-primary-1' : ''
                                }`}
                                onClick={() => setIsOpenSearch(!isOpenSearch)}
                            >
                                <p>
                                    {idSearch === 1 && 'Title'}
                                    {idSearch === 2 && 'ID'}
                                </p>
                                <Icon name="down" className="mt-1 h-3 w-3" />
                            </div>
                            {idSearch === 1 && (
                                <div className="mb-4 w-full">
                                    <SearchInput
                                        inputValue={searchText}
                                        placeholder="Filter by name"
                                        setCurrentPage={setCurrentPage}
                                        setSearch={setSearchText}
                                        maxLength={50}
                                        className="h-full"
                                    />
                                </div>
                            )}
                            {idSearch === 2 && (
                                <div className="mb-4 w-full">
                                    <SearchInput
                                        inputValue={searchID}
                                        placeholder="Filter by ID"
                                        setCurrentPage={setCurrentPage}
                                        setSearch={setSearchID}
                                        maxLength={50}
                                        className="h-full"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="overflow-auto">
                            <table className="min-h-min w-full">
                                <thead>
                                    <tr className="[&>th]:bg-neutral-7 [&>th]:px-4 [&>th]:py-3 [&>th]:font-semibold">
                                        <th className="w-[15%] text-center">ID</th>
                                        <th className="w-[75%] text-start">Title</th>
                                        <th className="w-[10%] text-start"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testCases?.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="w-full px-4 py-2 pt-[100px] text-center">
                                                <Empty notFoundMessage={`We couldn't find any test cases.`} />
                                            </td>
                                        </tr>
                                    ) : (
                                        testCases?.map((testCase) => (
                                            <tr key={testCase?.testCaseId}>
                                                <td className="h-[48px] border-b-[1px] px-4 text-center text-sm">
                                                    #{testCase?.testCaseId}
                                                </td>
                                                <td className="h-[48px] border-b-[1px] px-4 text-start text-sm">
                                                    {testCase?.testCaseName}
                                                </td>
                                                <td className="h-[48px] border-b-[1px] px-4 text-start">
                                                    <input
                                                        className="h-4 w-4"
                                                        type="checkbox"
                                                        checked={tempSelectedTestCases.some(
                                                            (tc) => tc.id === testCase?.testCaseId
                                                        )}
                                                        onChange={() => handleCheckboxChange(testCase)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-6  bg-white p-4">
                        <div className="w-full border-b-[1px] pb-6">
                            {data?.getAllTestCaseByTestPlanIdWithSearch?.pageInfo?.totalPages > 1 && (
                                <Pagination
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    itemNumber={itemNumber}
                                    pagination={data?.getAllTestCaseByTestPlanIdWithSearch?.pageInfo || 0}
                                />
                            )}
                        </div>
                        <div className="flex w-full items-center justify-center gap-6">
                            <button
                                type="button"
                                className="h-[40px] w-[140px]  border border-primary-1 text-primary-1"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="h-[40px] w-[140px]  bg-primary-1 text-white"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSelectTestcase;
