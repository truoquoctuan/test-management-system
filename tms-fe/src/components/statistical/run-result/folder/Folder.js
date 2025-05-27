import { useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';

import { GET_ALL_CHILD_FOLDERS_BY_UPPERID, GET_ALL_FOLDERS_RUNNING_BY_TES_PLAN_ID } from 'apis/run-result/folder';
import Empty from 'components/common/Empty';
import Pagination from 'components/common/Pagination';
import SearchInput from 'components/common/SearchInput';
import SortDropdown from 'components/common/SortDropdown ';
import Icon from 'components/icons/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubFolder from './SubFolder';

// eslint-disable-next-line no-unused-vars
const Folder = ({ closeFolder, selectedFolder, setSelectedFolder, setdataFolderStructure, setIdTestCase }) => {
    const { testPlanId } = useParams();
    const [selectedOption, setSelectedOption] = useState();
    const [idFolder, setIdFolder] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');
    const [contentVisible, setContentVisible] = useState(true);
    const [arrayIdFolder, setArrayIdFolder] = useState([]);
    const [shouldFetchChildFolders, setShouldFetchChildFolders] = useState(false);
    const [checkedFolders, setCheckedFolders] = useState([]);
    const [openFolders, setOpenFolders] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchString, setsearchString] = useState('');
    // Api danh sách thư mục cha
    const { data, refetch: refetchFolder } = useQuery(GET_ALL_FOLDERS_RUNNING_BY_TES_PLAN_ID, {
        client: clientRun,
        variables: {
            testPlanId,
            searchString: searchString?.trim() === '' ? undefined : searchString.trim(),
            sort: selectedOption ? `${selectedOption.anphabet}+${sortOrder}` : 'created_at+desc',
            page,
            size
        }
    });

    // Lấy một mảng id của folder Cha
    useEffect(() => {
        const arrayID = data?.getAllFoldersRunningByTesPlanId?.folders?.map((item) => parseInt(item.folderId)) || [];
        setArrayIdFolder(arrayID);
        if (arrayID.length > 0) {
            setShouldFetchChildFolders(true);
        } else {
            setShouldFetchChildFolders(false);
        }
    }, [data]);

    // Api danh sách thư mục con
    const { data: dataChild, refetch: refetchSubfolder } = useQuery(GET_ALL_CHILD_FOLDERS_BY_UPPERID, {
        client: clientRun,
        variables: {
            upperIds: arrayIdFolder
        },
        skip: !shouldFetchChildFolders
    });

    useEffect(() => {
        refetchFolder();
        refetchSubfolder();
    }, []);

    // Hàm xây dựng cây
    const buildTree = (folders, upperId = 0) => {
        return folders
            ?.filter((folder) => parseInt(folder.upperId) === upperId)
            ?.map((folder) => ({
                folderId: folder.folderId,
                folderName: folder.folderName,
                sortOrder: folder.sortOrder,
                upperId: folder.upperId,
                testPlan: folder.testPlan,
                status: folder.status,
                childrens: buildTree(folders, parseInt(folder?.folderId))
            }));
    };
    // Nối mảng từ folder cha với folder cha
    const dataFolder = data?.getAllFoldersRunningByTesPlanId?.folders?.concat(dataChild?.getAllChildFoldersByUpperId);
    const folderStructure = buildTree(dataChild ? dataFolder : data?.getAllFoldersByTesPlanId?.folders);

    useEffect(() => {
        setdataFolderStructure(folderStructure);
    }, [selectedFolder]);
    useEffect(() => {
        if (closeFolder) {
            setContentVisible(false);
            const timer = setTimeout(() => {
                setContentVisible(true);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setContentVisible(false);
        }
    }, [closeFolder]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const sortOptions1 = [
        { name: 'Folder name', anphabet: 'folder_name' },
        { name: 'Created at', anphabet: 'created_at' },
        { name: 'Updated at', anphabet: 'updated_at' }
    ];
    const handleReset = () => {
        setsearchString('');
        setSelectedOption(null);
    };
    return (
        <div className=" relative h-full w-[400px]">
            <div
                className={` px-6 py-4 transition-opacity duration-1000 ${
                    contentVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="relative flex justify-between border-b py-3">
                    <p className="text-lg font-bold">Folder</p>
                </div>
                <div className="mt-4 flex gap-2">
                    <div className="w-[50%]">
                        <SearchInput
                            placeholder="Filter by name"
                            setCurrentPage={setPage}
                            maxLength={50}
                            inputValue={searchString}
                            setSearch={setsearchString}
                            className="h-full"
                        />
                    </div>
                    <div className="w-[50%]">
                        <SortDropdown
                            options={sortOptions1}
                            selectedOption={selectedOption}
                            onOptionSelect={handleOptionSelect}
                            sortOrder={sortOrder}
                            onSortOrderChange={handleSortOrderChange}
                        />
                    </div>
                    <div onClick={() => handleReset()} className="cursor-pointer border border-[#B3B3B3] px-1 pt-1">
                        <Icon name="cached" />
                    </div>
                </div>
                {/* Folder */}

                <div className="custom-scroll-y  mt-4 h-[58vh]">
                    {data?.getAllFoldersRunningByTesPlanId?.folders?.length > 0 ? (
                        <SubFolder
                            structure={folderStructure}
                            level={0}
                            setIdFolder={setIdFolder}
                            idFolder={idFolder}
                            setOpenFolders={setOpenFolders}
                            openFolders={openFolders}
                            checkedFolders={checkedFolders}
                            setCheckedFolders={setCheckedFolders}
                            testPlanId={testPlanId}
                            page={page}
                            selectedFolder={selectedFolder}
                            setSelectedFolder={setSelectedFolder}
                            setIdTestCase={setIdTestCase}
                            refetchFolder={refetchFolder}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Empty notFoundMessage={`The folder is currently empty.`} />
                        </div>
                    )}
                </div>
            </div>
            {/* Phân trang */}
            {data?.getAllFoldersRunningByTesPlanId?.pageInfo?.totalElements > 10 && (
                <div className="absolute bottom-3 flex w-full justify-center">
                    <div>
                        <Pagination
                            setCurrentPage={setPage}
                            currentPage={page}
                            pagination={data?.getAllFoldersRunningByTesPlanId?.pageInfo}
                            itemNumber={size}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Folder;
