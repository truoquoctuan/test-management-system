import { useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GET_ALL_CHILD_FOLDERS_BY_UPPERID, GET_ALL_FOLDERS_RUNNING_BY_TES_PLAN_ID } from 'apis/run-result/folder';
import Empty from 'components/common/Empty';
import Icon from 'components/icons/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../../common/Pagination';
import SearchInput from '../../common/SearchInput';
import SortDropdown from '../../common/SortDropdown ';
import CancelRun from './CancelRun';
import DetailInformation from './DetailInformation';
import FormFolder from './FormFolder';
import SubFolder from './SubFolder';

// eslint-disable-next-line no-unused-vars
const Folder = ({
    closeFolder,
    selectedFolder,
    setSelectedFolder,
    setdataFolderStructure,
    setIdTestCase,
    setSelectTab
}) => {
    const { testPlanId } = useParams();
    const [selectedOption, setSelectedOption] = useState();
    const [checkForm, setCheckForm] = useState('add');
    const [idFolder, setIdFolder] = useState(0);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isOpenCancelRun, setIsOpenCancelFolder] = useState(false);
    const [isOpenDetailFolder, setIsOpenDetailFolder] = useState(false);
    const [contentVisible, setContentVisible] = useState(true);
    const [arrayIdFolder, setArrayIdFolder] = useState([]);
    const [shouldFetchChildFolders, setShouldFetchChildFolders] = useState(false);
    const [checkedFolders, setCheckedFolders] = useState([]);
    const [page, setPage] = useState(0);
    const [openFolders, setOpenFolders] = useState([]);
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
        },
        fetchPolicy: 'network-only'
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
    const { data: dataChild, refetch: refetchSubfolder } = useQuery(
        GET_ALL_CHILD_FOLDERS_BY_UPPERID,

        {
            client: clientRun,
            variables: {
                upperIds: arrayIdFolder
            },
            skip: !shouldFetchChildFolders,
            fetchPolicy: 'network-only'
        }
    );

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
                    <div className="w-[52%]">
                        <SearchInput
                            placeholder="Filter by name"
                            setCurrentPage={setPage}
                            maxLength={50}
                            inputValue={searchString}
                            setSearch={setsearchString}
                            className="h-full"
                        />
                    </div>
                    <div className="w-[48%]">
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

                <div className="custom-scroll-y  mt-4 h-[calc(63vh-64px)]">
                    {data?.getAllFoldersRunningByTesPlanId?.folders?.length > 0 ? (
                        <SubFolder
                            structure={folderStructure}
                            level={0}
                            setIdFolder={setIdFolder}
                            idFolder={idFolder}
                            setOpenFolders={setOpenFolders}
                            openFolders={openFolders}
                            setIsOpenDetailFolder={setIsOpenDetailFolder}
                            setIsOpenAdd={setIsOpenAdd}
                            setCheckForm={setCheckForm}
                            setIsOpenCancelFolder={setIsOpenCancelFolder}
                            checkedFolders={checkedFolders}
                            setCheckedFolders={setCheckedFolders}
                            testPlanId={testPlanId}
                            page={page}
                            selectedFolder={selectedFolder}
                            setSelectedFolder={setSelectedFolder}
                            setIdTestCase={setIdTestCase}
                            setSelectTab={setSelectTab}
                            refetchFolder={refetchFolder}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Empty notFoundMessage={`The folder is currently empty.`} />
                        </div>
                    )}
                </div>
                {/* Thêm folder */}
                <div>
                    <FormFolder
                        isOpen={isOpenAdd}
                        setIsOpen={setIsOpenAdd}
                        idFolder={idFolder}
                        setIdFolder={setIdFolder}
                        checkForm={checkForm}
                        refetchFolder={refetchFolder}
                        refetchSubfolder={refetchSubfolder}
                    />
                </div>
                {/* Xóa folder */}
                <CancelRun
                    setIsOpen={setIsOpenCancelFolder}
                    isOpen={isOpenCancelRun}
                    idFolder={idFolder}
                    refetchFolder={refetchFolder}
                    refetchSubfolder={refetchSubfolder}
                />
                {/* Chi tiết folder */}

                <DetailInformation setIsOpen={setIsOpenDetailFolder} isOpen={isOpenDetailFolder} idFolder={idFolder} />
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
