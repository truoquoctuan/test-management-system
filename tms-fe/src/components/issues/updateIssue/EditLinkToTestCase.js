import { useMutation } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { MODIFY_TEST_CASES } from 'apis/issues/issues';
import ModalIssuesSelectTestcase from 'components/issues/ModalIssuesSelectTestcase';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const EditLinkToTestCase = ({ dataIssueById, idIssue, refetch }) => {
    const [selectedIdTestCases, setSelectedIdTestCases] = useState([]);
    const [modalSelectTestcase, setModalSelectTestcase] = useState(false);
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const [dataTestcase, setDataTestcase] = useState(
        dataIssueById
            ? dataIssueById?.testCases?.map((item) => ({
                  testCaseId: item.testCaseId,
                  testCaseName: item.testCaseName
              }))
            : []
    );

    useEffect(() => {
        if (dataIssueById) {
            setDataTestcase(
                dataIssueById?.testCases?.map((item) => ({
                    testCaseId: item.testCaseId,
                    testCaseName: item.testCaseName
                }))
            );
            setSelectedIdTestCases(
                dataIssueById?.testCases?.map((item) => ({
                    id: item.testCaseId,
                    title: item.testCaseName
                }))
            );
        }
    }, [dataIssueById, modalSelectTestcase]);

    const { testPlanId } = useParams();
    const closeModal = () => {
        setModalSelectTestcase(false);
    };
    const handleSelectTestCasesClick = () => {
        setModalSelectTestcase(true);
    };
    // eslint-disable-next-line no-unused-vars
    const [updateIssue] = useMutation(MODIFY_TEST_CASES, { client: clientRun });

    const handleSubmit = async () => {
        const newdata = {
            issuesId: idIssue,
            testCaseIds: selectedIdTestCases?.map((item) => item.id).join(',')
        };
        await updateIssue({
            variables: newdata
        });
        refetch();
    };
    const [loadingTag, setLoadingTag] = useState(false);

    useEffect(() => {
        if (modalSelectTestcase == false) {
            setLoadingTag(true);
            setTimeout(() => {
                setLoadingTag(false);
            }, 1000);
        }
    }, [modalSelectTestcase]);
    return (
        <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-2 ">
            <div className="flex justify-between ">
                <div className="text-[14px] font-semibold">Link to Test Cases</div>
                {checkStatus === 1 && checkRoleTestPland !== 3 && (
                    <button className="text-sm text-[#1D79ED]" onClick={() => handleSelectTestCasesClick()}>
                        Edit
                    </button>
                )}
            </div>
            {loadingTag ? (
                <div className="loader h-7 w-7"></div>
            ) : (
                <ul className="flex flex-wrap gap-2 text-sm ">
                    {dataIssueById?.testCases?.map((item, index) => (
                        <li key={index}>#{item?.testCaseId}</li>
                    ))}
                    {dataIssueById?.testCases.length == 0 && <p className="text-[14px] text-[#484848]">None</p>}
                </ul>
            )}

            {modalSelectTestcase && (
                <ModalIssuesSelectTestcase
                    handleSubmit={handleSubmit}
                    onClose={closeModal}
                    dataTestcase={dataTestcase}
                    setDataTestcase={setDataTestcase}
                    testPlanId={testPlanId}
                    selectedIdTestCases={selectedIdTestCases}
                    setSelectedIdTestCases={setSelectedIdTestCases}
                    keyEdit={true}
                />
            )}
        </div>
    );
};

export default EditLinkToTestCase;
