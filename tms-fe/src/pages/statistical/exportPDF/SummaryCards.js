import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TOTAL_ELEMENTBY_TEST_PLAN_ID } from 'apis/statistical/statistical';
import Icon from 'components/icons/icons';
import { useParams } from 'react-router-dom';

const SummaryCards = () => {
    const { testPlanId } = useParams();
    const { data } = useQuery(GET_TOTAL_ELEMENTBY_TEST_PLAN_ID, {
        client: clientStatistical,
        variables: { testPlanId: testPlanId }
    });

    const totalTestPlanId = data?.getTotalElementByTestPlanId;

    return (
        <div className="mt-4 ">
            <div className="mb-4 border-b pb-2">
                <p className="text-xl font-semibold text-primary-1">Summary</p>
            </div>
            <div className="flex gap-4">
                <div className="flex w-full items-center gap-6  border-gray-200 bg-white  px-6 py-4 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#d11e1e14] ">
                        <Icon name="folder_add" className="fill-[#FF6060]" />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Total Folders</p>
                        <h3 className="text-2xl font-bold text-[#121212]">{totalTestPlanId?.totalFolders}</h3>
                    </div>
                </div>
                <div className="flex w-full items-center gap-6  border-gray-200 bg-white px-6 py-4 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1D79ED14] ">
                        <Icon name="file_add" className=" " />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Total Test Cases</p>
                        <h3 className="text-2xl font-bold text-[#121212]">{totalTestPlanId?.totalTestCases}</h3>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex gap-4">
                <div className="flex w-full items-center gap-6  border-gray-200 bg-white px-6 py-4 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                    <div className=" flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2A9C5814] ">
                        <Icon name="file_text" className=" " />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Executed Test Cases</p>
                        <h3 className="text-2xl font-bold text-[#121212]">{totalTestPlanId?.testCasesWithResults}</h3>
                    </div>
                </div>
                <div className="flex w-full items-center gap-6  border-gray-200 bg-white px-6 py-4 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                    <div className="flex h-[40px] w-[40px] items-center justify-center  rounded-full bg-[#F1AD0014] ">
                        <Icon name="file_exclamation" className="" />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Pending Test Cases</p>
                        <h3 className="text-2xl font-bold text-[#121212]">
                            {totalTestPlanId?.testCasesWithoutResults}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
