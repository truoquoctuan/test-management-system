import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TEST_CASE_PRIORITY_DASHBOARD } from 'apis/dashboard/dashboard';
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
// eslint-disable-next-line no-unused-vars
const TestCasePriority = ({ widget, deleteWidgetArr }) => {
    const { userInfo } = useGlobalContext();
    const [popupDelete, setPopupDelete] = useState(false);
    const { data: dataTestCasePriority } = useQuery(GET_TEST_CASE_PRIORITY_DASHBOARD, {
        client: clientStatistical,
        variables: { userId: String(userInfo?.userID) },
        fetchPolicy: 'cache-and-network'
        // skip: userInfo ? false : true
    });
    const testCasePriority = dataTestCasePriority?.getTestCasePriorityDashboard;
    const reversedData = testCasePriority ? [...testCasePriority].reverse() : [];

    const totalCount = testCasePriority?.reduce((acc, curr) => acc + curr.count, 0);

    const priorityData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                data: testCasePriority?.map((item) => (item.count / totalCount) * 100),
                backgroundColor: ['#DEDEDE ', '#F1AD00', '#FF6060']
            }
        ]
    };

    const total =
        testCasePriority?.map((item) => item?.count).lenght === 0
            ? [0, 0, 0]?.reduce((accumulator, currentValue) => accumulator + currentValue)
            : testCasePriority
                  ?.map((item) => item?.count)
                  ?.reduce((accumulator, currentValue) => accumulator + currentValue);

    const moreRef = useRef();
    useOutsideClick(moreRef, setPopupDelete);

    return (
        <div className="animate__animated animate__zoomIn w-full bg-white px-6 pt-4">
            <div className=" flex justify-between gap-2">
                <h4 className="mb-2 text-lg font-bold">Test Case Priority Distribution</h4>
                <div className="cursor-pointer" onClick={() => setPopupDelete(!popupDelete)} ref={moreRef}>
                    <div className=" relative">
                        <Icon name="vertical_dots" className="mt-2 h-4 w-4" />
                        {popupDelete && (
                            <div
                                className="absolute right-2 top-6 w-[80px] cursor-pointer border py-1 text-center text-sm hover:bg-slate-100"
                                onClick={() => deleteWidgetArr(widget?.widgetId)}
                            >
                                Close
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex  items-center justify-center gap-8">
                <div className=" mt-4  h-[calc(32vh-72px)] w-[200px]">
                    <TmsDoughnut data={priorityData} options={doughnutOptions} />
                </div>
                <div className="mr-10  flex items-center">
                    <div className=" ">
                        <div className="flex gap-2">
                            <p className="text-2xl font-bold text-[#121212]">{total}</p>
                            <p className="mt-1 text-sm font-normal text-[#787878]">Test Cases</p>
                        </div>
                        {reversedData?.map((item, index) => {
                            // Calculate percentage
                            const percentage = ((item.count / totalCount) * 100).toFixed(2) + '%';

                            return (
                                <div className="mt-3  flex justify-between gap-2" key={index}>
                                    <div className=" flex items-center gap-2 ">
                                        <div
                                            className={`h-3 w-10 rounded-full ${
                                                item.priority === 3 ? 'bg-[#FF6060]' : ''
                                            }${item.priority === 2 ? 'bg-[#F1AD00]' : ''}${
                                                item.priority === 1 ? 'bg-[#BDBDBD]' : ''
                                            }  `}
                                        ></div>
                                        <div className="">
                                            <p className="text-sm text-[#484848]">{item.priority === 3 && 'High'}</p>
                                            <p className="text-sm text-[#484848]">{item.priority === 2 && 'Medium'}</p>
                                            <p className="text-sm text-[#484848]">{item.priority === 1 && 'Low'}</p>
                                        </div>
                                    </div>
                                    <div className="flex ">
                                        <p className="h-4 w-6  text-[16px] text-sm font-semibold text-[#484848]">
                                            {item.count}
                                        </p>
                                        <p className="pl-2 text-sm text-[#484848]">
                                            {'('}
                                            {percentage}
                                            {')'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCasePriority;
