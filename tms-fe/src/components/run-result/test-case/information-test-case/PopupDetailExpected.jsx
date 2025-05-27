import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useState } from 'react';
import Comments from './Comments/Comments';
import Detail from './Detail';
import Results from './Results';

const PopupDetailExpected = ({
    selectTab,
    isOpen,
    setIsOpen,
    idTestCase,
    contentVisible,
    closeFolder,
    selectedFolder,
    callBack,
    setSelectTab,
    contentExpected
}) => {
    const [isClosing, setIsClosing] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [detailTestCase, setDetailTestCase] = useState(null);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };

    return (
        <div>
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setIsClosing={setIsClosing}
                isClosing={isClosing}
                chooseOut={true}
            >
                <div className="w-[1140px] p-1">
                    <div className="flex justify-between border-b px-3  pb-2 pt-3">
                        <p className="text-lg font-bold">Test Case Detail </p>
                        <div onClick={() => handleClose()} className="cursor-pointer">
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="px-3 pt-2">
                        <p className="text-lg font-bold">{contentExpected?.getTestCaseById?.testCaseName} </p>
                        <p className="text-sm text-[#787878]">ID: {contentExpected?.getTestCaseById?.testCaseId}</p>
                    </div>
                    <div className="px-3">
                        <div className="flex  border-b text-center">
                            <p
                                className={`w-[200px] cursor-pointer ${
                                    selectTab === 'information' ? 'border-b-2 border-primary-1 text-primary-1 ' : ' '
                                }  py-2.5 text-sm font-bold `}
                                onClick={() => setSelectTab('information')}
                            >
                                Information
                            </p>
                            <p
                                className={`w-[200px] cursor-pointer ${
                                    selectTab === 'results' ? 'border-b-2 border-primary-1 text-primary-1 ' : ''
                                }  py-2.5 text-sm font-bold `}
                                onClick={() => setSelectTab('results')}
                            >
                                Activities
                            </p>
                            <p
                                className={`w-[200px] cursor-pointer ${
                                    selectTab === 'comments' ? 'border-b-2 border-primary-1 text-primary-1 ' : ''
                                }  py-2.5 text-sm font-bold `}
                                onClick={() => setSelectTab('comments')}
                            >
                                Comments
                            </p>
                        </div>
                    </div>

                    <div>
                        {selectTab === 'information' && (
                            <Detail
                                idTestCase={idTestCase}
                                closeFolder={closeFolder}
                                setDetailTestCase={setDetailTestCase}
                                expand={true}
                            />
                        )}{' '}
                        {selectTab === 'results' && (
                            <Results
                                idTestCase={idTestCase}
                                contentVisible={contentVisible}
                                selectedFolder={selectedFolder}
                                callBack={callBack}
                                expand={true}
                            />
                        )}{' '}
                        {selectTab === 'comments' && (
                            <Comments idTestCase={idTestCase} contentVisible={contentVisible} expand={true} />
                        )}
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default PopupDetailExpected;
