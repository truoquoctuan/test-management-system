import { useEffect, useState } from 'react';
import Icon from '../../../icons/icons';
import Comments from './Comments/Comments';
import Detail from './Detail';
import PopupDetailExpected from './PopupDetailExpected';
import Results from './Results';

const InformationTestCase = ({
    setIdTestCase,
    idTestCase,
    closeFolder,
    selectedFolder,
    callBack,
    selectTab,
    setSelectTab
}) => {
    const [contentVisible, setContentVisible] = useState(false);
    const [detailTestCase, setDetailTestCase] = useState(null);
    const [isOpenPopupExpected, setIsOpenPopupExpected] = useState(false);

    useEffect(() => {
        if (idTestCase !== null) {
            setContentVisible(false);
            const timer = setTimeout(() => {
                setContentVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setContentVisible(false);
        }
    }, [idTestCase]);

    return (
        <div>
            <div
                className={`h-[calc(100vh-72px)] border duration-700 ${
                    idTestCase == null ? 'w-0' : ` w-[500px] bg-white shadow-xl `
                }`}
                style={{ whiteSpace: 'nowrap' }}
            >
                <div className="flex justify-between border-b p-3">
                    <p className={`w-[450px] text-lg font-bold`}>Test Case Detail</p>
                    <div className="flex gap-4 pr-3">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setIsOpenPopupExpected(true);
                            }}
                        >
                            <Icon name="expand" />
                        </div>
                        <div
                            className="flex cursor-pointer justify-end"
                            onClick={() => {
                                setIdTestCase(null), setSelectTab('information');
                            }}
                        >
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                    </div>
                </div>
                <div className="p-3 pb-4">
                    <p className="w-[450px] max-w-[450px] overflow-hidden whitespace-normal  text-lg font-bold leading-tight text-black">
                        {detailTestCase?.getTestCaseById?.testCaseName}
                    </p>
                    <p className="text-sm text-[#787878]">ID: {detailTestCase?.getTestCaseById?.testCaseId}</p>
                </div>

                <div>
                    <div className="flex justify-between text-center">
                        <p
                            className={`w-full cursor-pointer ${
                                selectTab === 'information'
                                    ? 'border-b-2 border-primary-1 text-primary-1'
                                    : 'border-b text-[#B3B3B3]'
                            } py-2.5 text-sm font-bold`}
                            onClick={() => setSelectTab('information')}
                        >
                            Information
                        </p>
                        <p
                            className={`w-full cursor-pointer ${
                                selectTab === 'results'
                                    ? 'border-b-2 border-primary-1 text-primary-1'
                                    : 'border-b text-[#B3B3B3]'
                            } py-2.5 text-sm font-bold`}
                            onClick={() => setSelectTab('results')}
                        >
                            Activities
                        </p>
                        <p
                            className={`w-full cursor-pointer ${
                                selectTab === 'comments'
                                    ? 'border-b-2 border-primary-1 text-primary-1'
                                    : 'border-b text-[#B3B3B3]'
                            } py-2.5 text-sm font-bold`}
                            onClick={() => setSelectTab('comments')}
                        >
                            Comments
                        </p>
                    </div>
                </div>

                {/* {idTestCase && ( */}
                <div className="w-[500px] bg-white">
                    {selectTab === 'information' && (
                        <Detail
                            idTestCase={idTestCase}
                            closeFolder={closeFolder}
                            setDetailTestCase={setDetailTestCase}
                            expand={false}
                        />
                    )}
                    {selectTab === 'results' && (
                        <Results
                            idTestCase={idTestCase}
                            contentVisible={contentVisible}
                            selectedFolder={selectedFolder}
                            callBack={callBack}
                            expand={false}
                        />
                    )}
                    {selectTab === 'comments' && (
                        <Comments idTestCase={idTestCase} contentVisible={contentVisible} expand={false} />
                    )}
                </div>
                {/* )} */}
            </div>
            <PopupDetailExpected
                isOpen={isOpenPopupExpected}
                setIsOpen={setIsOpenPopupExpected}
                contentExpected={detailTestCase}
                selectTab={selectTab}
                idTestCase={idTestCase}
                contentVisible={contentVisible}
                closeFolder={closeFolder}
                setDetailTestCase={setDetailTestCase}
                selectedFolder={selectedFolder}
                callBack={callBack}
                setSelectTab={setSelectTab}
            />
        </div>
    );
};

export default InformationTestCase;
