import Loading from 'components/common/Loading';
import Folder from 'components/run-result/folder/Folder';
import InformationTestCase from 'components/run-result/test-case/information-test-case/InformationTestCase';
import TestCase from 'components/run-result/test-case/TestCase';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../components/common/Title';

const RunResult = () => {
    const [idTestCase, setIdTestCase] = useState(null);
    const [closeFolder, setCloseForder] = useState(true);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [dataFolderStructure, setdataFolderStructure] = useState(null);
    const { testPlanId } = useParams();
    const { testPlanName } = useGlobalContext();
    const [callBack, setCallBack] = useState(false);
    const [selectTab, setSelectTab] = useState('information');

    const navigate = useNavigate();

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

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    return (
        <div className="w-full overflow-hidden">
            <div className={`absolute  right-0 z-[9999]   duration-700`}>
                <InformationTestCase
                    selectedFolder={selectedFolder}
                    setIdTestCase={setIdTestCase}
                    idTestCase={idTestCase}
                    closeFolder={closeFolder}
                    callBack={callBack}
                    selectTab={selectTab}
                    setSelectTab={setSelectTab}
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
                <p className="max-w-[250px] truncate font-semibold text-black">Run & Result</p>
            </div>
            {/* Tiêu đề */}
            <div className="">
                <Title name="Run & Result" subtitle="Analyze and review test outcomes." />
            </div>
            {isLoading ? (
                <div className="absolute flex h-[80%]  w-[80%]  items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <>
                    {' '}
                    <div className="mt-4 flex h-[calc(87vh-64px)]   gap-2">
                        <div
                            className={`h-[calc(86vh-64px)] ${
                                isLoading ? '' : 'animate__animated animate__fadeInLeft'
                            } ${closeFolder ? ' w-[400px]' : 'w-[0px] '} bg-white duration-700`}
                        >
                            <Folder
                                setSelectedFolder={setSelectedFolder}
                                selectedFolder={selectedFolder}
                                setCloseForder={setCloseForder}
                                closeFolder={closeFolder}
                                setdataFolderStructure={setdataFolderStructure}
                                setIdTestCase={setIdTestCase}
                                setSelectTab={setSelectTab}
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
                                callBack={callBack}
                                setCallBack={setCallBack}
                                selectTab={selectTab}
                                setSelectTab={setSelectTab}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RunResult;
