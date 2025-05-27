import Loading from 'components/common/Loading';
import DetailTestCase from 'components/repository/test-case/DetailTestCase';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../components/common/Title';
import Folder from '../../components/repository/folder/Folder';
import TestCase from '../../components/repository/test-case/TestCase';

const Repository = () => {
    const [idTestCase, setIdTestCase] = useState(null);
    const [closeFolder, setCloseForder] = useState(true);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [dataFolderStructure, setdataFolderStructure] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenTest, setIsOpenTest] = useState(false);
    const [selectForm, setSelectForm] = useState('add');
    const [editTestCaseId, setEditTestCaseId] = useState(null);
    const [arrayTestCaseId, setArrayTestCaseId] = useState([]);
    const [openDeleteTestCase, setOpenDeleteTestCase] = useState(false);
    const { testPlanId } = useParams();
    const { testPlanName } = useGlobalContext();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

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

    const checKAddTestCase = hasChildFolders(dataFolderStructure, selectedFolder?.folderId);

    return (
        <div className="h-full w-full overflow-hidden">
            {/* Chi tiết test case */}
            <div className="absolute right-0 z-[9999] duration-700">
                <DetailTestCase
                    setIdTestCase={setIdTestCase}
                    idTestCase={idTestCase}
                    closeFolder={closeFolder}
                    isOpenTest={isOpenTest}
                    setIsOpenTest={setIsOpenTest}
                    setSelectForm={setSelectForm}
                    editTestCaseId={editTestCaseId}
                    setEditTestCaseId={setEditTestCaseId}
                    arrayTestCaseId={arrayTestCaseId}
                    setArrayTestCaseId={setArrayTestCaseId}
                    openDeleteTestCase={openDeleteTestCase}
                    setOpenDeleteTestCase={setOpenDeleteTestCase}
                />
            </div>
            <div className="flex gap-2 pb-1 pt-3 text-sm">
                <p
                    className="max-w-[150px] cursor-pointer truncate font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/plan-information/${testPlanId}`)}
                >
                    {testPlanName}
                </p>
                <p className="font-normal text-[#787878]">/</p>
                <p className="max-w-[250px] truncate font-semibold text-black">Repository</p>
            </div>
            {/* Tiêu đề */}
            <div>
                <Title name="Repository" subtitle="Manage all your test artifacts in one place." />
            </div>
            {isLoading ? (
                <div className=" absolute flex  h-[80%]  w-[80%]  items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="mt-4 flex h-[calc(87vh-64px)] gap-2">
                        <div
                            className={`${
                                closeFolder ? 'w-[470px]' : 'w-[0px]'
                            } h-full bg-white transition-all duration-700 ease-in-out ${
                                isLoading ? '' : 'animate__animated animate__fadeInLeft'
                            }`}
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

                        {/* Test Case Section */}
                        <div className="h-full w-full bg-white transition-all duration-700 ease-in-out">
                            <TestCase
                                selectedFolder={selectedFolder}
                                setIdTestCase={setIdTestCase}
                                idTestCase={idTestCase}
                                setCloseForder={setCloseForder}
                                closeFolder={closeFolder}
                                checKAddTestCase={checKAddTestCase}
                                isOpenTest={isOpenTest}
                                setIsOpenTest={setIsOpenTest}
                                selectForm={selectForm}
                                setSelectForm={setSelectForm}
                                editTestCaseId={editTestCaseId}
                                setEditTestCaseId={setEditTestCaseId}
                                arrayTestCaseId={arrayTestCaseId}
                                setArrayTestCaseId={setArrayTestCaseId}
                                openDeleteTestCase={openDeleteTestCase}
                                setOpenDeleteTestCase={setOpenDeleteTestCase}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Repository;
