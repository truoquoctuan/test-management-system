import { useMutation, useQuery } from '@apollo/client';
import Empty from 'components/common/Empty';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
    GET_ALL_CHILD_FOLDERS_BY_UPPERID,
    GET_ALL_FOLDERS_BY_TESPLANDID,
    RUN_FOLDER
} from '../../../apis/repository/folder';
import Pagination from '../../common/Pagination';
import SearchInput from '../../common/SearchInput';
import SortDropdown from '../../common/SortDropdown ';
import Icon from '../../icons/icons';
import DeleteFolder from './DeleteFolder';
import DetailInformation from './DetailInformation';
import FormFolder from './FormFolder';
import SubFolder from './SubFolder';

// eslint-disable-next-line no-unused-vars
const Folder = ({ closeFolder, selectedFolder, setSelectedFolder, setdataFolderStructure, setIdTestCase }) => {
    const navigate = useNavigate();
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const { testPlanId } = useParams();
    const [selectedOption, setSelectedOption] = useState();
    const [checkForm, setCheckForm] = useState('add');
    const [idFolder, setIdFolder] = useState(0);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [isOpenDeleteFolder, setIsOpenDeleteFolder] = useState(false);
    const [isOpenDetailFolder, setIsOpenDetailFolder] = useState(false);
    const [contentVisible, setContentVisible] = useState(true);
    const [arrayIdFolder, setArrayIdFolder] = useState([]);
    const [shouldFetchChildFolders, setShouldFetchChildFolders] = useState(false);
    const [checkedFolders, setCheckedFolders] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchString, setsearchString] = useState('');
    const [checkedFoldersStop, setCheckedFoldersStop] = useState([]);
    // Api danh sách thư mục cha
    const { data, refetch: refetchFolder } = useQuery(GET_ALL_FOLDERS_BY_TESPLANDID, {
        variables: {
            testPlanId,
            searchString: searchString?.trim() === '' ? undefined : searchString.trim(),
            sort: selectedOption ? selectedOption?.anphabet + '+' + sortOrder : 'created_at+desc',
            page: page,
            size
        },
        fetchPolicy: 'cache-and-network'
    });

    // Lấy một mảng id của folder Cha
    useEffect(() => {
        const arrayID = data?.getAllFoldersByTesPlanId?.folders?.map((item) => parseInt(item.folderId)) || [];
        setArrayIdFolder(arrayID);
        if (arrayID.length > 0) {
            setShouldFetchChildFolders(true);
        } else {
            setShouldFetchChildFolders(false);
        }
    }, [data]);

    // Api danh sách thư mục con
    const { data: dataChild, refetch: refetchSubfolder } = useQuery(GET_ALL_CHILD_FOLDERS_BY_UPPERID, {
        variables: {
            upperIds: arrayIdFolder
        },
        skip: !shouldFetchChildFolders,
        fetchPolicy: 'cache-and-network'
    });

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
                hasTestCase: folder.hasTestCase,
                childrens: buildTree(folders, parseInt(folder?.folderId))
            }));
    };
    // Nối mảng từ folder cha với folder cha
    const dataFolder = data?.getAllFoldersByTesPlanId?.folders?.concat(dataChild?.getAllChildFoldersByUpperId);
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

    // Run folder
    const [run_Folder] = useMutation(RUN_FOLDER);

    const sortOptions1 = [
        { name: 'Folder name', anphabet: 'folder_name' },
        { name: 'Created at', anphabet: 'created_at' },
        { name: 'Updated at', anphabet: 'updated_at' }
    ];
    const [openFolders, setOpenFolders] = useState([]);

    // Run Folder
    const handleRunFolder = async (status) => {
        try {
            await run_Folder({
                variables: {
                    ids: checkedFolders?.map(Number),
                    status: status
                }
            });
            setCheckedFolders([]);
            await refetchFolder();
            await refetchSubfolder();
            navigate(`/test-plan/run-result/${testPlanId}`);

            toast.success('Run successfully');
        } catch (error) {
            console.log(error);
        }
    };
    const [isCheckedAllStop, setIsCheckedAllStop] = useState(false);

    const handleStopFolder = async (status) => {
        try {
            await run_Folder({
                variables: {
                    ids: checkedFoldersStop?.map(Number),
                    status: status
                }
            });
            setCheckedFoldersStop([]);
            await refetchFolder();
            await refetchSubfolder();
            setIsCheckedAllStop(false);
            toast.success('Stop successfully');
        } catch (error) {
            console.log('error', error);
        }
    };
    const handleReset = () => {
        setsearchString('');
        setSelectedOption(null);
    };

    return (
        <div className=" relative h-full w-[456px]">
            <div
                className={` px-6 py-4 transition-opacity duration-1000 ${
                    contentVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="relative flex justify-between border-b py-3">
                    <p className="text-lg font-bold">Folder</p>
                    {checkStatus === 1 && checkRoleTestPland !== 3 && (
                        <div className="flex gap-2">
                            <div
                                className={`flex h-[32px] w-[77px] cursor-pointer items-center justify-center gap-2 border ${
                                    checkedFolders.length > 0
                                        ? 'border-[#2A9C58] text-[#2A9C58]'
                                        : '  border-[#B3B3B3] text-[#B3B3B3]'
                                }`}
                                onClick={() => (checkedFolders.length > 0 ? handleRunFolder(2) : null)}
                            >
                                <Icon
                                    name="play_circle"
                                    className={`${checkedFolders.length > 0 ? 'fill-[#2A9C58]' : ' fill-[#B3B3B3]'} `}
                                />
                                <p className="text-sm font-semibold ">Run</p>
                            </div>
                            <div
                                className={`flex h-[32px] w-[77px] cursor-pointer items-center justify-center gap-2 border ${
                                    checkedFoldersStop.length > 0
                                        ? 'border-[#FF6060] text-[#FF6060]'
                                        : '  border-[#B3B3B3] text-[#B3B3B3]'
                                }`}
                                onClick={() => (checkedFoldersStop.length > 0 ? handleStopFolder(1) : null)}
                            >
                                <Icon
                                    name="play_circle"
                                    className={`${
                                        checkedFoldersStop.length > 0 ? 'fill-[#FF6060]' : ' fill-[#B3B3B3]'
                                    } `}
                                />
                                <p className="text-sm font-semibold ">Stop</p>
                            </div>

                            <div
                                className="flex h-[32px] w-[124px] cursor-pointer items-center justify-center gap-2 border border-[#0066CC]"
                                onClick={() => {
                                    setIsOpenAdd(true), setIdFolder(0), setCheckForm('add');
                                }}
                            >
                                <Icon name="plus_circle" className="fill-[#0066cc]" />
                                <p className="text-sm font-semibold text-[#0066CC]">Add Folder</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex gap-2">
                    <div className="w-[55%]">
                        <SearchInput
                            placeholder="Filter by name"
                            setCurrentPage={setPage}
                            maxLength={50}
                            setSearch={setsearchString}
                            inputValue={searchString}
                            className="h-full"
                        />
                    </div>
                    <div className="w-[45%]">
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
                <div className="custom-scroll-y mt-4 h-[calc(63vh-64px)] flex-1">
                    {data?.getAllFoldersByTesPlanId?.folders?.length > 0 ? (
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
                            setIsOpenDeleteFolder={setIsOpenDeleteFolder}
                            checkedFolders={checkedFolders}
                            setCheckedFolders={setCheckedFolders}
                            testPlanId={testPlanId}
                            page={page}
                            selectedFolder={selectedFolder}
                            setSelectedFolder={setSelectedFolder}
                            setCheckedFoldersStop={setCheckedFoldersStop}
                            checkedFoldersStop={checkedFoldersStop}
                            refetchFolder={refetchFolder}
                            refetchSubfolder={refetchSubfolder}
                            isCheckedAllStop={isCheckedAllStop}
                            setIsCheckedAllStop={setIsCheckedAllStop}
                            setIdTestCase={setIdTestCase}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Empty notFoundMessage={`The folder is currently empty.`} />
                        </div>
                    )}
                </div>
                {/* Pagination */}
                {data?.getAllFoldersByTesPlanId?.pageInfo.totalElements > 10 && (
                    <div className="absolute bottom-10   flex w-[90%]  justify-center">
                        <Pagination
                            setCurrentPage={setPage}
                            currentPage={page}
                            pagination={data?.getAllFoldersByTesPlanId?.pageInfo}
                            itemNumber={size}
                        />
                    </div>
                )}

                {/* Thêm folder */}
                <div>
                    <FormFolder
                        isOpen={isOpenAdd}
                        setIsOpen={setIsOpenAdd}
                        setSelectedFolder={setSelectedFolder}
                        idFolder={idFolder}
                        setIdFolder={setIdFolder}
                        checkForm={checkForm}
                        setCheckForm={setCheckForm}
                        refetchFolder={refetchFolder}
                        refetchSubfolder={refetchSubfolder}
                    />
                </div>
                {/* Xóa folder */}
                <DeleteFolder
                    setIsOpen={setIsOpenDeleteFolder}
                    isOpen={isOpenDeleteFolder}
                    idFolder={idFolder}
                    refetchFolder={refetchFolder}
                    refetchSubfolder={refetchSubfolder}
                />
                {/* Chi tiết folder */}
                <DetailInformation setIsOpen={setIsOpenDetailFolder} isOpen={isOpenDetailFolder} idFolder={idFolder} />
            </div>
        </div>
    );
};

export default Folder;
