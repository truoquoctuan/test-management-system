import Deatail from './Deatail';
import Results from './Results';

const DetailTestCase = ({ dataGetAllTestCase }) => {
    return (
        <div className="mt-10">
            <p className="mt-6 border-b pb-3 text-[18px] font-bold text-primary-1">Test case</p>
            {dataGetAllTestCase?.getTestCaseInTestPlan?.testCases?.map((item, index) => {
                return (
                    <div key={index} className="mt-4  shadow-[0px_0px_8px_0px_rgba(0,0,0,0.15)]">
                        <Deatail testcase={item} />
                        <Results relatedRunResults={item.lastTestResult} />
                    </div>
                );
            })}
        </div>
    );
};

export default DetailTestCase;
