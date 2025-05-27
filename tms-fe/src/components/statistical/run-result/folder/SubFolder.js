import Icon from 'components/icons/icons';

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
    setIdTestCase
}) => {
    const handleToggle = (id) => {
        setOpenFolders((prevOpenFolders) =>
            prevOpenFolders.includes(id) ? prevOpenFolders.filter((openId) => openId !== id) : [...prevOpenFolders, id]
        );
        setIdFolder(id);
        setSelectedFolder(id);
        setIdTestCase(null);
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
                        <li key={index} className={`group relative `}>
                            <div
                                className={`flex max-h-[100px] min-h-[32px]  w-full cursor-pointer items-center gap-2 px-2 hover:bg-[#f0efef] ${
                                    selectedFolder === folder?.folderId ? 'bg-[#f0efef]' : ''
                                }`}
                                onClick={() => handleToggle(folder?.folderId)}
                            >
                                <div className="flex gap-2">
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
                                            className={`${effectiveStatus === 1 ? 'fill-[#0066CC]' : 'fill-[#2A9C58]'}`}
                                        />
                                    </div>
                                    <div className="ml-2 w-[85%] ">
                                        <p
                                            className={`  ${
                                                effectiveStatus === 1 ? 'text-[#0066CC]' : 'text-[#2A9C58]'
                                            }`}
                                        >
                                            {folder.folderName}
                                        </p>
                                    </div>
                                </div>
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
