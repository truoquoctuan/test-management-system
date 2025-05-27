import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TEST_CASE_PRIORITY, GET_TEST_CASE_STATUS } from 'apis/statistical/statistical';
import { TmsBar, TmsDoughnut } from 'components/common/Chart';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const ChartSection = () => {
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // Adjust this value to make the doughnut segments thinner
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
    // Config dạng biểu đồ
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
    // eslint-disable-next-line no-unused-vars

    const { testPlanId } = useParams();
    const { data: dataTestCaseStatus, refetch: refetchStatus } = useQuery(GET_TEST_CASE_STATUS, {
        client: clientStatistical,
        variables: { testPlanId: testPlanId }
    });

    const testCaseStatus = dataTestCaseStatus?.getTestCaseStatus;

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

    const { data: dataTestCasePriority, refetch: refetchPriority } = useQuery(GET_TEST_CASE_PRIORITY, {
        client: clientStatistical,
        variables: { testPlanId: testPlanId }
    });
    const testCasePriority = dataTestCasePriority?.getTestCasePriority;
    const reversedData = testCasePriority ? [...testCasePriority].reverse() : [];

    useEffect(() => {
        refetchStatus();
        refetchPriority();
    }, []);
    const totalCount = testCasePriority?.reduce((acc, curr) => acc + curr.count, 0);

    const priorityData = {
        labels: ['Low', 'Medium', ' High'],
        datasets: [
            {
                data: testCasePriority?.map((item) => (item.count / totalCount) * 100),
                backgroundColor: ['#DEDEDE', '#F1AD00', '#FF6060 ']
            }
        ]
    };

    const total =
        testCasePriority?.map((item) => item?.count).lenght === 0
            ? [0, 0, 0]?.reduce((accumulator, currentValue) => accumulator + currentValue)
            : testCasePriority
                  ?.map((item) => item?.count)
                  ?.reduce((accumulator, currentValue) => accumulator + currentValue);

    return (
        <div className="mt-4  ">
            <div className="w-full bg-white p-3 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                <div className="relative flex gap-2">
                    <h4 className="mb-2 text-lg font-bold">Test Case Status</h4>
                </div>

                <div className="  mt-6 h-[265px] w-full">
                    <TmsBar data={statusData} options={options} />
                </div>
            </div>
            <div className="mt-4 w-full bg-white p-3 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                <div className="relative flex gap-2">
                    <h4 className="mb-2 text-lg font-bold">Test Case Priority Distribution</h4>
                </div>
                <div className="mt-10 flex justify-center gap-2">
                    <div className=" h-[200px] w-[1/2]">
                        <TmsDoughnut data={priorityData} options={doughnutOptions} />
                    </div>
                    <div className="flex w-[1/2] items-center">
                        <div className=" w-[250px]">
                            <div className="flex gap-2">
                                <p className="text-2xl font-bold text-[#121212]">{total}</p>
                                <p className="mt-1 text-sm font-normal text-[#787878]">Test Cases</p>
                            </div>
                            {reversedData?.map((item, index) => {
                                // Calculate percentage
                                const percentage = ((item.count / totalCount) * 100).toFixed(2) + '%';

                                return (
                                    <div className="mt-3  flex" key={index}>
                                        <div className="flex w-[40%] items-center gap-2 ">
                                            <div
                                                className={`h-3 w-10 rounded-full ${
                                                    item.priority === 3 ? 'bg-[#FF6060]' : ''
                                                }${item.priority === 2 ? 'bg-[#F1AD00]' : ''}${
                                                    item.priority === 1 ? 'bg-[#BDBDBD]' : ''
                                                }  `}
                                            ></div>
                                            <div className="">
                                                <p className="text-sm text-[#484848]">
                                                    {item.priority === 3 && 'High'}
                                                </p>
                                                <p className="text-sm text-[#484848]">
                                                    {item.priority === 2 && 'Medium'}
                                                </p>
                                                <p className="text-sm text-[#484848]">{item.priority === 1 && 'Low'}</p>
                                            </div>
                                        </div>
                                        <div className="flex ">
                                            <p className="h-4 w-6 pl-4 text-[16px] text-sm font-semibold text-[#484848]">
                                                {item.count}
                                            </p>
                                            <p className="pl-6 text-sm text-[#484848]">
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
        </div>
    );
};

export default ChartSection;
