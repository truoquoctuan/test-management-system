import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TOTAL_TEST_CASE_DASHBOARD } from 'apis/dashboard/dashboard';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useRef, useState } from 'react';

const TestCaseSummary = ({ widget, deleteWidgetArr }) => {
    const { userInfo } = useGlobalContext();
    const [popupDelete, setPopupDelete] = useState(false);
    const { data } = useQuery(GET_TOTAL_TEST_CASE_DASHBOARD, {
        client: clientStatistical,
        variables: { userId: userInfo?.userID },
        fetchPolicy: 'cache-and-network'
    });

    const totalTestPlanId = data?.getTotalTestCaseDashboard;

    const moreRef = useRef();
    useOutsideClick(moreRef, setPopupDelete);
    return (
        <div className="w-full bg-white px-6 pt-4">
            <div className="relative flex justify-between gap-2">
                <h4 className="mb-2 text-lg font-bold">Test Case Summary</h4>
                <div className="cursor-pointer" onClick={() => setPopupDelete(!popupDelete)} ref={moreRef}>
                    <div className=" relative">
                        <Icon name="vertical_dots" className="mt-2 h-4 w-4" />
                        {popupDelete && (
                            <div
                                className="absolute right-2 top-6 z-[30] w-[80px] cursor-pointer border bg-white py-1 text-center text-sm hover:bg-slate-100"
                                onClick={() => deleteWidgetArr(widget?.widgetId)}
                            >
                                Close
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-full   ">
                <div className="mt-2 flex h-[calc(17vh-72px)] w-full items-center gap-6  border border-gray-200 bg-white px-4 py-2">
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1D79ED14] ">
                        <Icon name="file_add" className=" " />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Total Test Cases</p>
                        <h3 className="text-2xl font-bold text-[#121212]">{totalTestPlanId?.totalTestCase}</h3>
                    </div>
                </div>
                <div className="mt-3 flex h-[calc(17vh-72px)] w-full items-center gap-6  border border-gray-200 bg-white px-4 py-2">
                    <div className=" flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2A9C5814] ">
                        <Icon name="file_text" className=" " />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Executed Test Cases</p>
                        <h3 className="text-2xl font-bold text-[#121212]">{totalTestPlanId?.totalExecuteTestCase}</h3>
                    </div>
                </div>
                <div className="mt-3 flex h-[calc(17vh-72px)] w-full items-center gap-6  border border-gray-200 bg-white px-4 py-2">
                    <div className="flex h-[40px] w-[40px] items-center justify-center  rounded-full bg-[#F1AD0014] ">
                        <Icon name="file_exclamation" className="" />
                    </div>
                    <div>
                        <p className="text-sm font-normal text-[#787878]">Pending Test Case</p>
                        <h3 className="text-2xl font-bold text-[#121212]">{totalTestPlanId?.totalPendTestCase}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCaseSummary;
