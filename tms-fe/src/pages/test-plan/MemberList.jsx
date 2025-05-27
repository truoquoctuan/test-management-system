import { useQuery } from '@apollo/client';
import { GET_TEST_PLAN_BY_ID } from 'apis/plan-information/query';
import Loading from 'components/common/Loading';
import Members from 'components/plan-information/Members';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MemberList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [testPlanData, setTestPlanData] = useState({});
    const { testPlanId } = useParams();
    const {
        data: TestPlanData,
        refetch,
        loading
    } = useQuery(GET_TEST_PLAN_BY_ID, {
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

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [loading]);
    return (
        <div>
            {isLoading ? (
                <div className="absolute flex h-[70%]  w-[80%] items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <div className={`${isLoading == false ? '' : 'hidden'}`}>
                    <Members testPlanId={testPlanId} testPlanData={testPlanData} />
                </div>
            )}
        </div>
    );
};

export default MemberList;
