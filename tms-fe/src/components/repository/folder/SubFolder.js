import { useMutation } from '@apollo/client';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RUN_FOLDER } from '../../../apis/repository/folder';
import useOutsideClick from '../../../hook/useOutsideClick';
import Icon from '../../icons/icons';

const SubFolder = ({
    structure,
    level = 0,
    setIdFolder,
    idFolder,
    openFolders,
    setOpenFolders,
    setIsOpenDetailFolder,
    setIsOpenAdd,
    setCheckForm,
    setIsOpenDeleteFolder,
    checkedFolders,
    setCheckedFolders,
    testPlanId,
    page,
    parentStatus,
    selectedFolder,
    setSelectedFolder,
    setCheckedFoldersStop,
    checkedFoldersStop,
    refetchFolder,
    refetchSubfolder,
    isCheckedAllStop,
    setIsCheckedAllStop,
    setIdTestCase
}) => {
    const navigate = useNavigate();
    const [hoveredFolder, setHoveredFolder] = useState(null);
    const [idSubFolder, setIdSubFolder] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const modalRef = useRef(null);
    useOutsideClick(modalRef, () => setShowContextMenu(false));

    const handleToggle = (folder) => {
        setOpenFolders((prevOpenFolders) =>
            prevOpenFolders.includes(folder?.folderId)
                ? prevOpenFolders.filter((openId) => openId !== folder?.folderId)
                : [...prevOpenFolders, folder?.folderId]
        );
        setIdFolder(folder?.folderId);
        setSelectedFolder(folder);
    };

    const handleMouseLeave = () => {
        setHoveredFolder(null);
    };

    const handleContextMenu = (event, id) => {
        event.preventDefault();
        setHoveredFolder(id);
        setShowContextMenu(true);
    };

    const handleEllipsisClick = (event, id) => {
        event.stopPropagation();
        setShowContextMenu(!showContextMenu);
        setIdSubFolder(id);
        refetchFolder();
        refetchSubfolder();
    };

    useEffect(() => {
        if (showContextMenu == false) {
            setIdSubFolder(null);
        }
    }, [showContextMenu]);

    const handeOpenDetail = (id) => {
        setIsOpenDetailFolder(true);
        setIdFolder(id);
    };

    const handleOpenEdit = (id) => {
        setIdFolder(id);
        setIsOpenAdd(true);
        setCheckForm('edit');
    };

    const handleSubFolder = (id) => {
        setIsOpenAdd(true);
        setIdFolder(id);
    };

    const handleDeleteFolder = (id) => {
        setIsOpenDeleteFolder(true);
        setIdFolder(id);
    };

    const handleCheckAllRun = (event) => {
        event.stopPropagation();
        const checked = event.target.checked;
        setIsCheckedAll(checked);
        if (checked) {
            const allFolderIds = structure?.filter((item) => item.status === 1).map((folder) => folder.folderId);
            setCheckedFolders(allFolderIds);
        } else {
            setCheckedFolders([]);
        }
    };

    const handleCheckboxChange = (event, folderId) => {
        event.stopPropagation();
        if (event.target.checked) {
            setCheckedFolders([...checkedFolders, folderId]);
        } else {
            setCheckedFolders(checkedFolders.filter((id) => id !== folderId));
        }
    };
    const handleCheckAllStop = (event) => {
        event.stopPropagation();
        const checked = event.target.checked;
        setIsCheckedAllStop(checked);
        if (checked) {
            const allFolderIds = structure?.filter((item) => item.status === 2).map((folder) => folder.folderId);
            setCheckedFoldersStop(allFolderIds);
        } else {
            setCheckedFoldersStop([]);
        }
    };

    const handleCheckboxStop = (event, folderId) => {
        event.stopPropagation();
        if (event.target.checked) {
            setCheckedFoldersStop([...checkedFoldersStop, folderId]);
        } else {
            setCheckedFoldersStop(checkedFoldersStop.filter((id) => id !== folderId));
        }
    };
    const divRef = useRef(null);
    const [isPartiallyHidden, setIsPartiallyHidden] = useState();
    const [isPartiallyRight, setIsPartiallyRight] = useState();
    useEffect(() => {
        const divElement = divRef?.current;
        const rect = divElement?.getBoundingClientRect();
        setIsPartiallyHidden(rect?.top);
        setIsPartiallyRight(rect?.left);
    }, [idSubFolder]);

    // Run folder
    const [run_Folder] = useMutation(RUN_FOLDER);

    // Run Folder
    const handleRunFolder = async (id, status) => {
        try {
            await run_Folder({
                variables: {
                    ids: [id],
                    status: status
                }
            });
            await refetchFolder();
            await refetchSubfolder();
            setCheckedFolders([]);
            setIsCheckedAllStop(false);
            setShowContextMenu(false);
            if (status == 2) {
                toast.success('Run successfully');
                navigate(`/test-plan/run-result/${testPlanId}`);
            } else {
                toast.success('Stop successfully');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {level === 0 && checkStatus === 1 && checkRoleTestPland !== 3 && (
                <div className="flex justify-between px-2">
                    <div className="mb-2 flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4"
                            onChange={handleCheckAllRun}
                            checked={isCheckedAll}
                        />
                        <span className="text-[15px] font-medium text-[#787878]">
                            Select All Run{' '}
                            {checkedFolders?.length > 0 ? (
                                <span>
                                    {'('}
                                    {checkedFolders?.length}
                                    {')'}
                                </span>
                            ) : (
                                <span></span>
                            )}
                        </span>
                    </div>
                    <div className="mb-2 flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4"
                            onChange={handleCheckAllStop}
                            checked={isCheckedAllStop}
                        />
                        <span className="text-[15px] font-medium text-[#787878]">
                            Select All Stop{' '}
                            {checkedFoldersStop?.length > 0 ? (
                                <span>
                                    {'('}
                                    {checkedFoldersStop?.length}
                                    {')'}
                                </span>
                            ) : (
                                <span></span>
                            )}
                        </span>
                    </div>
                </div>
            )}
            <ul
                className={`main-content animate__animated animate__fadeIn z-[99] ${
                    level === 0 ? 'ml-0 ' : level === 1 ? 'ml-7' : 'ml-4'
                }`}
            >
                {structure?.map((folder, index) => {
                    const effectiveStatus = parentStatus === 2 ? 2 : folder?.status;
                    return (
                        <li key={index} className={`group relative`}>
                            <div
                                className={`flex max-h-[100px] min-h-[32px] w-full cursor-pointer gap-2 px-2 pt-1 hover:bg-[#f0efef] ${
                                    selectedFolder?.folderId === folder?.folderId ? 'bg-[#f0efef]' : ''
                                }`}
                                onClick={() => {
                                    handleToggle(folder), setIdTestCase(null);
                                }}
                                onMouseEnter={() => setHoveredFolder(folder?.folderId)}
                                onMouseLeave={handleMouseLeave}
                                onContextMenu={(e) => handleContextMenu(e, folder.folderId)}
                            >
                                <div className="flex w-full ">
                                    <div className="w-[8%] flex-shrink-0">
                                        {level === 0 &&
                                            effectiveStatus === 2 &&
                                            checkStatus === 1 &&
                                            checkRoleTestPland !== 3 && (
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 h-4 w-4"
                                                    onChange={(e) => handleCheckboxStop(e, folder.folderId)}
                                                    checked={checkedFoldersStop.includes(folder.folderId)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            )}
                                        {level === 0 &&
                                            effectiveStatus === 1 &&
                                            checkStatus === 1 &&
                                            checkRoleTestPland !== 3 && (
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 h-4 w-4"
                                                    onChange={(e) => handleCheckboxChange(e, folder.folderId)}
                                                    checked={checkedFolders.includes(folder.folderId)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            )}
                                    </div>

                                    <div className="flex w-full gap-2">
                                        <div className="w-[10px]">
                                            {folder.childrens.length > 0 ? (
                                                <Icon
                                                    name="caret_right"
                                                    className={`${
                                                        openFolders.includes(folder.folderId) ? 'rotate-90' : ''
                                                    } ${effectiveStatus === 1 ? 'fill-black' : 'fill-[#2A9C58]'}`}
                                                />
                                            ) : (
                                                <p className="ml-2"></p>
                                            )}
                                        </div>

                                        <div className="w-[10px]">
                                            <Icon
                                                name="folder"
                                                className={`${
                                                    effectiveStatus === 1 ? 'fill-[#0066CC]' : 'fill-[#2A9C58]'
                                                }`}
                                            />
                                        </div>

                                        <div className="ml-2 flex-1">
                                            <p
                                                className={`${
                                                    effectiveStatus === 1 ? 'text-[#0066CC] ' : 'text-[#2A9C58]'
                                                }`}
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    wordBreak: 'break-word',
                                                    maxWidth: '90%'
                                                }}
                                            >
                                                {folder.folderName}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {hoveredFolder === folder.folderId && (
                                    <p
                                        ref={divRef}
                                        className="absolute right-0 top-0 z-[50] flex h-[32px] w-[50px] cursor-pointer items-center justify-end text-center font-bold text-gray-500"
                                        onClick={(e) => handleEllipsisClick(e, folder.folderId)}
                                    >
                                        <Icon name="vertical_dots" className="w-full" />
                                    </p>
                                )}
                                {showContextMenu &&
                                    folder.folderId === idSubFolder &&
                                    createPortal(
                                        <div
                                            className={`animate__animated animate__fadeIn absolute right-4 top-6 w-[200px] rounded border border-gray-300 bg-white shadow-md`}
                                            style={{ top: isPartiallyHidden + 10, left: isPartiallyRight - 160 }}
                                            ref={modalRef}
                                        >
                                            <ul className={`list-none p-2`}>
                                                {level === 0 &&
                                                    effectiveStatus === 1 &&
                                                    checkStatus === 1 &&
                                                    checkRoleTestPland !== 3 && (
                                                        <li
                                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                                            onClick={() => handleRunFolder(folder.folderId, 2)}
                                                        >
                                                            Run
                                                        </li>
                                                    )}
                                                {level === 0 &&
                                                    effectiveStatus === 2 &&
                                                    checkStatus === 1 &&
                                                    checkRoleTestPland !== 3 && (
                                                        <li
                                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                                            onClick={() => handleRunFolder(folder.folderId, 1)}
                                                        >
                                                            Stop
                                                        </li>
                                                    )}

                                                {level < 2 &&
                                                    effectiveStatus === 1 &&
                                                    folder.hasTestCase === false &&
                                                    checkStatus === 1 &&
                                                    checkRoleTestPland !== 3 && (
                                                        <li
                                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                                            onClick={() => handleSubFolder(folder.folderId)}
                                                        >
                                                            Add Sub Folder
                                                        </li>
                                                    )}
                                                <li
                                                    className="cursor-pointer bg-white p-2 hover:bg-gray-200"
                                                    onClick={() => handeOpenDetail(folder.folderId)}
                                                >
                                                    Detail Information
                                                </li>
                                                {effectiveStatus === 1 &&
                                                    checkStatus === 1 &&
                                                    checkRoleTestPland !== 3 && (
                                                        <>
                                                            <li
                                                                className="z-[1000] w-full cursor-pointer bg-white p-2 hover:bg-gray-200"
                                                                onClick={() => handleOpenEdit(folder.folderId)}
                                                            >
                                                                Edit
                                                            </li>
                                                            <li
                                                                className="w-full cursor-pointer bg-white p-2 text-red-500 hover:bg-gray-200"
                                                                onClick={() => handleDeleteFolder(folder.folderId)}
                                                            >
                                                                Delete
                                                            </li>
                                                        </>
                                                    )}
                                            </ul>
                                        </div>,
                                        document.body
                                    )}
                            </div>

                            {openFolders.includes(folder.folderId) && folder.childrens.length > 0 && (
                                <SubFolder
                                    refetchSubfolder={refetchSubfolder}
                                    refetchFolder={refetchFolder}
                                    structure={folder.childrens}
                                    level={level + 1}
                                    setIdFolder={setIdFolder}
                                    idFolder={idFolder}
                                    openFolders={openFolders}
                                    setOpenFolders={setOpenFolders}
                                    setIsOpenDetailFolder={setIsOpenDetailFolder}
                                    setIsOpenAdd={setIsOpenAdd}
                                    setCheckForm={setCheckForm}
                                    setIsOpenDeleteFolder={setIsOpenDeleteFolder}
                                    checkedFolders={checkedFolders}
                                    setCheckedFolders={setCheckedFolders}
                                    testPlanId={testPlanId}
                                    page={page}
                                    parentStatus={effectiveStatus}
                                    selectedFolder={selectedFolder}
                                    setSelectedFolder={setSelectedFolder}
                                    setIdTestCase={setIdTestCase}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SubFolder;
