import Loading from 'components/common/Loading';
import Title from 'components/common/Title';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

const Setting = () => {
    const link = useLocation();
    const arrLink = link.pathname.split('/');
    const { testPlanId } = useParams();
    const { testPlanName } = useGlobalContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    return (
        <div className="h-[calc(95vh-64px)]">
            <div className="flex gap-2 pb-1 pt-3 text-sm">
                <p
                    className="max-w-[150px] cursor-pointer truncate font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/plan-information/${testPlanId}`)}
                >
                    {testPlanName}
                </p>

                <p className="font-normal text-[#787878]">/</p>
                <p className="max-w-[250px] truncate font-semibold text-black">Issues</p>
            </div>
            <div className="">
                <Title name="Notification Settings" subtitle="Manage test plan notification preferences." />
            </div>

            {isLoading ? (
                <div className="absolute flex h-[80%]  w-[80%] items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <div className="mt-4 h-[calc(85vh-64px)] bg-white p-4">
                    <div className="flex border-b ">
                        <Link to="">
                            <div
                                className={`w-[180px] cursor-pointer pb-3 text-center hover:border-b-2 hover:border-primary-1  hover:text-primary-1 ${
                                    arrLink[arrLink.length - 1] === testPlanId
                                        ? 'border-b-2 border-primary-1 text-primary-1'
                                        : ''
                                }`}
                            >
                                <p className=" text-base font-medium">System Preferences</p>
                            </div>
                        </Link>
                        <Link to={`/test-plan/setting/${testPlanId}/email-preferences`}>
                            <div
                                className={`w-[180px] cursor-pointer  pb-3 text-center hover:border-b-2 hover:border-primary-1 hover:text-primary-1 ${
                                    arrLink[arrLink.length - 1] === 'email-preferences'
                                        ? 'border-b-2 border-primary-1 text-primary-1'
                                        : ''
                                }`}
                            >
                                <p className=" text-base font-medium">Email Preferences</p>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <Outlet />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Setting;
