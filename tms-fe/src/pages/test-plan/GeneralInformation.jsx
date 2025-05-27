import { useQuery } from '@apollo/client';
import { GET_TEST_PLAN_BY_ID } from 'apis/plan-information/query';
import Loading from 'components/common/Loading';
import GeneralInformation from 'components/plan-information/GeneralInformation';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GeneralInfor = () => {
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
        <div className=" ">
            {isLoading ? (
                <div className="absolute flex h-[70%]  w-[80%] items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <GeneralInformation testPlanData={testPlanData} />
            )}
        </div>
    );
};

export default GeneralInfor;
