// PrintComponent.js
import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import Icon from 'components/icons/icons';

import { GET_TEST_PLAN_BY_ID } from 'apis/plan-information/query';
import Loading from 'components/common/Loading';
import { forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChartSection from './ChartSection';
import DetailTestCase from './DetailTestCase';
import InForTestPlan from './InForTestPlan';
import SummaryCards from './SummaryCards';

const PrintComponent = forwardRef((props, ref) => {
    const { testPlanId } = useParams();

    const [testPlanData, setTestPlanData] = useState({});

    const { data: TestPlanData, refetch } = useQuery(GET_TEST_PLAN_BY_ID, {
        client: clientRepo,
        variables: { testPlanId: testPlanId }
    });

    useEffect(() => {
        refetch();
    }, []);

    const updateTestPlanData = () => {
        setTestPlanData(TestPlanData?.getTestPlanById);
    };

    useEffect(() => {
        updateTestPlanData();
    }, [TestPlanData]);
    function formatDate(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    }

    const [loadingPdf, setLoadingPdf] = useState(true);

    useEffect(() => {
        setLoadingPdf(true);
        if (props.loading === false) {
            setTimeout(() => {
                setLoadingPdf(false);
            }, 100);
        }
    }, [props.loading]);

    return (
        <div ref={ref}>
            {loadingPdf ? (
                <div className="flex h-[calc(90vh-64px)]  items-center justify-center">
                    {' '}
                    <Loading />
                </div>
            ) : (
                <div>
                    {props?.page === 0 && (
                        <>
                            <div className="h-[147px] bg-[#1857C8] bg-gradient-to-t p-4">
                                <div className="flex gap-2">
                                    <Icon name="logo" className="h-8 w-8 fill-white" />
                                    <p className="pt-1 text-base font-bold text-white">Quality Assurance </p>
                                </div>
                                <h1 className="flex h-[60%] items-center justify-center text-[24px] font-bold text-white">
                                    Test Results Report
                                </h1>
                            </div>
                            <div>
                                <InForTestPlan testPlanData={testPlanData} />
                            </div>
                            <div>
                                <SummaryCards />
                            </div>
                            <div>
                                <ChartSection />
                            </div>
                        </>
                    )}

                    <DetailTestCase dataGetAllTestCase={props.dataGetAllTestCase} />
                    <div className="mt-10  flex items-center justify-between border-t pt-5">
                        <p className="text-[13px] text-[#787878]">{formatDate(new Date())}</p>
                        <div>
                            <p className="text-[#0066CC]">Quality Assurance</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

PrintComponent.displayName = 'PrintComponent';

export default PrintComponent;
