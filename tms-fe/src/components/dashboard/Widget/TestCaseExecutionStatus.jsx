import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TEST_CASE_STATUS_DASHBOARD } from 'apis/dashboard/dashboard';
import { TmsBar } from 'components/common/Chart';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useRef, useState } from 'react';

const TestCaseExecutionStatus = ({ widget, deleteWidgetArr }) => {
    const { userInfo } = useGlobalContext();
    const [popupDelete, setPopupDelete] = useState(false);
    const { data: dataTestCaseStatus } = useQuery(GET_TEST_CASE_STATUS_DASHBOARD, {
        client: clientStatistical,
        variables: { userId: userInfo?.userID },
        fetchPolicy: 'cache-and-network'
    });
    const testCaseStatus = dataTestCaseStatus?.getTestCaseStatusDashboard;

    const statusData = {
        labels: ['Passed', 'Failed', 'Retest', 'Skipped', 'Untested'],
        datasets: [
            {
                label: 'Total',
                data: testCaseStatus?.map((item) => item?.count),
                backgroundColor: ['#4caf50', '#f44336', '#ffeb3b', '#2196f3', '#9e9e9e'],
                barThickness: 50
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 9 // Adjust the font size to make it smaller
                    }
                }
            }
        },

        plugins: {
            legend: {
                display: false // Hide the legend
            },

            title: {
                display: false
            }
            // maintainAspectRatio: false
        }
    };

    const moreRef = useRef();
    useOutsideClick(moreRef, setPopupDelete);
    return (
        <div>
            {' '}
            <div className="w-full bg-white px-6 pt-4">
                <div className="relative flex justify-between gap-2">
                    <h4 className="mb-2 text-lg font-bold">Test Case Execution Status</h4>
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

                <div className="  h-[calc(39vh-72px)] w-full">
                    <TmsBar data={statusData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default TestCaseExecutionStatus;
