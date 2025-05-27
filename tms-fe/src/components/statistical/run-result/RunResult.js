import { useState } from 'react';
import Folder from './folder/Folder';
import TestCase from './test-case/TestCase';

const RunResult = ({ isLoading }) => {
    const [idTestCase, setIdTestCase] = useState(null);
    const [closeFolder, setCloseForder] = useState(true);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [dataFolderStructure, setdataFolderStructure] = useState(null);

    function hasChildFolders(folders, targetFolderId) {
        if (folders) {
            for (const folder of folders) {
                if (folder.folderId === targetFolderId) {
                    return folder.childrens && folder.childrens.length > 0;
                } else if (folder.childrens) {
                    const result = hasChildFolders(folder.childrens, targetFolderId);
                    if (result) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // const targetFolderId = 1;
    const checKAddTestCase = hasChildFolders(dataFolderStructure, selectedFolder);
    return (
        <div className="w-full overflow-hidden">
            {/* Tiêu đề */}
            <div className="mt-4 flex h-full max-h-[calc(99vh-64px)] min-h-[calc(89vh-64px)]  gap-2">
                <div
                    className={`${isLoading ? '' : 'animate__animated animate__fadeInLeft'} ${
                        closeFolder ? ' w-[400px]' : 'w-[0px] '
                    } bg-white duration-700`}
                >
                    <Folder
                        setSelectedFolder={setSelectedFolder}
                        selectedFolder={selectedFolder}
                        setCloseForder={setCloseForder}
                        closeFolder={closeFolder}
                        setdataFolderStructure={setdataFolderStructure}
                        setIdTestCase={setIdTestCase}
                    />
                </div>

                <div className="z-[999] w-full  duration-700">
                    <TestCase
                        selectedFolder={selectedFolder}
                        setIdTestCase={setIdTestCase}
                        idTestCase={idTestCase}
                        setCloseForder={setCloseForder}
                        closeFolder={closeFolder}
                        checKAddTestCase={checKAddTestCase}
                    />
                </div>
            </div>
        </div>
    );
};

export default RunResult;
