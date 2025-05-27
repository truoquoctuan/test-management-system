import { useMutation } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { RUN_FOLDER } from 'apis/repository/folder';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
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
    setIsOpenCancelFolder,
    checkedFolders,
    setCheckedFolders,
    testPlanId,
    page,
    parentStatus,
    selectedFolder,
    setSelectedFolder,
    setIdTestCase,
    refetchFolder,
    setSelectTab
}) => {
    const [hoveredFolder, setHoveredFolder] = useState(null);
    const [idSubFolder, setIdSubFolder] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const modalRef = useRef(null);
    useOutsideClick(modalRef, () => setShowContextMenu(false));

    const handleToggle = (id) => {
        setOpenFolders((prevOpenFolders) =>
            prevOpenFolders.includes(id) ? prevOpenFolders.filter((openId) => openId !== id) : [...prevOpenFolders, id]
        );
        setIdFolder(id);
        setSelectedFolder(id);
        setIdTestCase(null);
        setSelectTab('information');
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
    const [run_Folder] = useMutation(RUN_FOLDER, { client: clientRepo });

    const handleCancelRun = async (id) => {
        try {
            await run_Folder({
                variables: {
                    ids: [Number(id)],
                    status: 1
                }
            });
            await refetchFolder();
            toast.success('Cancel run successfully');
            setSelectedFolder(null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <ul
                className={`main-content animate__animated animate__fadeIn z-[99] ${
                    level === 0 ? 'ml-0 ' : level === 1 ? 'ml-7' : 'ml-4'
                }`}
            >
                {structure?.map((folder, index) => {
                    const effectiveStatus = parentStatus === 2 ? 2 : folder?.status;
                    return (
                        <li key={index} className="group relative">
                            <div
                                className={`flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-[#f0efef] ${
                                    selectedFolder === folder?.folderId ? 'bg-[#f0efef]' : ''
                                }`}
                                onClick={() => handleToggle(folder?.folderId)}
                                onMouseEnter={() => setHoveredFolder(folder?.folderId)}
                                onMouseLeave={handleMouseLeave}
                                onContextMenu={(e) => handleContextMenu(e, folder.folderId)}
                            >
                                <div className={`flex gap-2 ${folder.folderName.length > 30 ? '' : 'items-center'}`}>
                                    <div className="w-[20px] flex-shrink-0">
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

                                    <div className="w-[20px] flex-shrink-0">
                                        <Icon
                                            name="folder"
                                            className={`${effectiveStatus === 1 ? 'fill-[#0066CC]' : 'fill-[#2A9C58]'}`}
                                        />
                                    </div>

                                    <div className="ml-2 flex-1">
                                        <p
                                            className={`${effectiveStatus === 1 ? 'text-[#0066CC]' : 'text-[#2A9C58]'}`}
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                wordBreak: 'break-word',
                                                maxWidth: folder.folderName.length > 30 ? '90%' : '100%'
                                            }}
                                        >
                                            {folder.folderName}
                                        </p>
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
                                            className={`animate__animated animate__fadeIn absolute right-4 top-6 w-[117px] border border-gray-300 bg-white shadow-md`}
                                            style={{ top: isPartiallyHidden + 10, left: isPartiallyRight - 90 }}
                                            ref={modalRef}
                                        >
                                            <ul className="list-none p-2">
                                                <li
                                                    className="cursor-pointer bg-white p-2 text-sm font-medium hover:bg-gray-200"
                                                    onClick={() => handeOpenDetail(folder.folderId)}
                                                >
                                                    Detail
                                                </li>
                                                {level === 0 && checkStatus === 1 && checkRoleTestPland !== 3 && (
                                                    <li
                                                        className="w-full cursor-pointer bg-white p-2 text-sm font-medium text-red-500 hover:bg-gray-200"
                                                        onClick={() => handleCancelRun(folder.folderId)}
                                                    >
                                                        Stop
                                                    </li>
                                                )}
                                            </ul>
                                        </div>,
                                        document.body
                                    )}
                            </div>

                            {openFolders.includes(folder.folderId) && folder.childrens.length > 0 && (
                                <SubFolder
                                    structure={folder.childrens}
                                    level={level + 1}
                                    setIdFolder={setIdFolder}
                                    idFolder={idFolder}
                                    openFolders={openFolders}
                                    setOpenFolders={setOpenFolders}
                                    setIsOpenDetailFolder={setIsOpenDetailFolder}
                                    setIsOpenAdd={setIsOpenAdd}
                                    setCheckForm={setCheckForm}
                                    setIsOpenCancelFolder={setIsOpenCancelFolder}
                                    checkedFolders={checkedFolders}
                                    setCheckedFolders={setCheckedFolders}
                                    testPlanId={testPlanId}
                                    page={page}
                                    parentStatus={effectiveStatus}
                                    selectedFolder={selectedFolder}
                                    setSelectedFolder={setSelectedFolder}
                                    setIdTestCase={setIdTestCase}
                                    setSelectTab={setSelectTab}
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
