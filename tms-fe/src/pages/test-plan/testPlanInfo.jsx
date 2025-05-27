import Title from 'components/common/Title';
import { useGlobalContext } from 'context/Context';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

const PlanInformation = () => {
    const { testPlanId } = useParams();
    const link = useLocation();
    const navigate = useNavigate();
    const { testPlanName } = useGlobalContext();
    return (
        <div className="  text-sm">
            <div className="flex gap-2 pb-1 pt-3 text-sm">
                <p
                    className="max-w-[150px] cursor-pointer truncate font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/plan-information/${testPlanId}`)}
                >
                    {testPlanName}
                </p>

                <p className="font-normal text-[#787878]">/</p>
                <p className="max-w-[250px] truncate font-semibold text-black">Detail Information</p>
            </div>
            {/* Tiêu đề */}
            <div className="">
                <Title
                    name={'Detail Information'}
                    subtitle={'View and manage detailed information about the Test Plan.'}
                />
            </div>

            <div className="mt-6 flex border-b">
                <Link to={`/test-plan/plan-information/${testPlanId}`}>
                    <p
                        className={`w-[200px]  pb-2 text-center text-[17px]   hover:border-b-2 hover:border-primary-1 hover:text-primary-1  ${
                            link?.pathname?.split('/')[4] === undefined || link?.pathname?.split('/')[5] === 'info'
                                ? ' border-b-2 border-primary-1 font-bold text-primary-1'
                                : 'text-[#B3B3B3]'
                        } `}
                    >
                        General Information
                    </p>
                </Link>
                <Link to={`/test-plan/plan-information/${testPlanId}/member`}>
                    <p
                        className={`hovder:border-primary-1  hober:font-bold  w-[200px] pb-2   text-center text-[17px] hover:border-b-2 hover:border-primary-1 hover:text-primary-1  ${
                            link?.pathname?.split('/')[4] === 'member' || link?.pathname?.split('/')[5] === 'member'
                                ? ' border-b-2 border-primary-1 font-bold text-primary-1'
                                : 'text-[#B3B3B3]'
                        } `}
                    >
                        Member List
                    </p>
                </Link>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default PlanInformation;
