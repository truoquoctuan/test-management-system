import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TOTAL_TEST_PLAN_DASHBOARD } from 'apis/dashboard/dashboard';
import { TmsDoughnut } from 'components/common/Chart';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useRef, useState } from 'react';
const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Adjust this value to make the doughnut segments thinner
    plugins: {
        legend: {
            display: false // Hide the legend
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    const value = tooltipItem.raw; // Get the raw value from the data
                    return `${value.toFixed(2)}%`; // Format the value as a percentage with 2 decimal places
                }
            }
        }
    }
};

// (item.count / testCasePriority?.totalTestPlan) * 100
const TestPlanSummary = ({ widget, deleteWidgetArr }) => {
    const { userInfo } = useGlobalContext();
    const [popupDelete, setPopupDelete] = useState(false);
    const { data: dataTestPlan } = useQuery(GET_TOTAL_TEST_PLAN_DASHBOARD, {
        client: clientStatistical,
        variables: { userId: userInfo?.userID },
        fetchPolicy: 'cache-and-network'
    });
    const testCasePriority = dataTestPlan?.getToTalTestPlanDashboard;

    const priorityData = {
        labels: ['Active', 'Archived'],
        datasets: [
            {
                data: [
                    (testCasePriority?.totalActiveTestPlan / testCasePriority?.totalTestPlan) * 100,
                    (testCasePriority?.totalArchiveTestPlan / testCasePriority?.totalTestPlan) * 100
                ],
                backgroundColor: ['#1D79ED', '#FF6060']
            }
        ]
    };

    const moreRef = useRef();
    useOutsideClick(moreRef, setPopupDelete);

    return (
        <div>
            {' '}
            <div className="w-full bg-white px-6 pt-4">
                <div className="relative flex justify-between gap-2">
                    <h4 className="mb-2 text-lg font-bold">Test Plan Summary</h4>
                    <div className="cursor-pointer" onClick={() => setPopupDelete(!popupDelete)} ref={moreRef}>
                        <div className=" relative">
                            <Icon name="vertical_dots" className="mt-2 h-4 w-4" />
                            {popupDelete && (
                                <div
                                    className="absolute right-2 top-6 z-[30] w-[80px] cursor-pointer border bg-white py-1 text-center  text-sm  hover:bg-slate-100"
                                    onClick={() => deleteWidgetArr(widget?.widgetId)}
                                >
                                    Close
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex  items-center justify-center gap-8">
                    <div className="mt-4 h-[calc(34vh-72px)] w-[200px]">
                        <TmsDoughnut data={priorityData} options={doughnutOptions} />
                    </div>
                    <div className="flex  items-center">
                        <div className=" ">
                            <div className="flex gap-2">
                                <p className="text-2xl font-bold text-[#121212]">{testCasePriority?.totalTestPlan}</p>
                                <p className="mt-1 text-sm font-normal text-[#787878]">Test Plans</p>
                            </div>

                            <div className="mr-12 mt-3">
                                <div className="flex  items-center gap-2 ">
                                    <div className={`h-3 w-10 rounded-full bg-[#1D79ED]  `}></div>

                                    <div className=" flex gap-2">
                                        <p className="text-sm text-[#484848]">{'Active'}</p>
                                    </div>
                                    <div className="flex pl-3.5">
                                        <p className="h-4 w-6  text-[16px] text-sm font-semibold text-[#484848]">
                                            {testCasePriority?.totalActiveTestPlan}
                                        </p>

                                        <p className=" text-sm text-[#484848]">
                                            {'('}
                                            {(
                                                (testCasePriority?.totalActiveTestPlan /
                                                    testCasePriority?.totalTestPlan) *
                                                100
                                            ).toFixed(2) + '%'}
                                            {')'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4  flex items-center gap-2">
                                    <div className={`h-3 w-10 rounded-full bg-[#FF6060]  `}></div>

                                    <div className="flex gap-2">
                                        <p className="text-sm text-[#484848]">{'Archived'}</p>
                                    </div>
                                    <div className="flex ">
                                        <p className="h-4 w-6  text-[16px] text-sm font-semibold text-[#484848]">
                                            {testCasePriority?.totalArchiveTestPlan}
                                        </p>

                                        <p className=" text-sm text-[#484848]">
                                            {'('}
                                            {(
                                                (testCasePriority?.totalArchiveTestPlan /
                                                    testCasePriority?.totalTestPlan) *
                                                100
                                            ).toFixed(2) + '%'}
                                            {')'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPlanSummary;
