import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { GET_TEST_PLAN_BY_ID } from 'apis/plan-information/query';
import { GET_ROLE_IN_TESST_PLAN } from 'apis/repository/folder';
import AttachFile from 'components/AttachFile/AttachFile';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { menuData } from '../../utils/Menu';
import MenuItem from './MenuItem';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const location = useLocation();
    const locationAct = location?.pathname.split('/');
    const basePath = `/${locationAct[1]}/${locationAct[2]}`;
    useEffect(() => {
        // Kiểm tra nếu không phải là trang issue
        if (!location.pathname.includes('/issue')) {
            const token = localStorage.getItem('token');
            localStorage.clear();
            if (token) {
                localStorage.setItem('token', token);
            }
        }
    }, [location.pathname]); // Chạy effect khi pathname thay đổi
    const { testPlanId } = useParams();
    const navigate = useNavigate();
    const { userInfo, setCheckStatus, setCheckRoleTestPland, setTestPlanName } = useGlobalContext();
    const { data: testPlanData } = useQuery(GET_TEST_PLAN_BY_ID, {
        client: clientRepo,
        variables: { testPlanId: testPlanId }
    });
    const { data: roleTestPlan } = useQuery(GET_ROLE_IN_TESST_PLAN, {
        client: clientRepo,
        variables: { testPlanId: testPlanId, userId: userInfo?.userID },
        skip: userInfo ? false : true
    });
    useEffect(() => {
        if (roleTestPlan?.getRoleInTestPlan === null) {
            navigate('/');
        }
    }, [roleTestPlan]);

    useEffect(() => {
        if (roleTestPlan?.getRoleInTestPlan !== null) {
            setCheckRoleTestPland(roleTestPlan?.getRoleInTestPlan);
        }
    }, [roleTestPlan]);

    useEffect(() => {
        if (testPlanData && userInfo) {
            setCheckStatus(testPlanData?.getTestPlanById?.status);
            setTestPlanName(testPlanData?.getTestPlanById?.testPlanName);
        }
    }, [testPlanData, userInfo]);

    return (
        <div
            className={`relative h-[calc(99vh-64px)]   bg-[#0066CC] ${
                isCollapsed ? 'w-[78px]' : 'w-[240px]'
            } transition-width duration-500`}
        >
            <div className={`bg-[#0066CC] p-4  duration-500`}>
                {menuData?.map((menu, index) => (
                    <div key={index} className=" mb-8">
                        <div className="tooltip mb-6 flex items-center gap-2  pb-1.5">
                            <div className={` ml-1 ${!isCollapsed ? 'w-[25%]' : 'w-[100%]'} `}>
                                <AttachFile
                                    attachType="TestPlanAvatar"
                                    entity="TestPlan"
                                    seq={testPlanData?.getTestPlanById?.testPlanId}
                                    register={null}
                                    viewMode={false}
                                    defaultImage={testPlanData?.getTestPlanById?.testPlanName}
                                    mode="member"
                                    className=" h-10 w-10 rounded-full  border object-cover"
                                />
                            </div>
                            {!isCollapsed && (
                                <h2 className="w-[80%] truncate text-base font-medium text-white">
                                    {' '}
                                    {testPlanData?.getTestPlanById?.testPlanName}
                                </h2>
                            )}
                            <span className="tooltip-text z-[300] text-[13px]">
                                {testPlanData?.getTestPlanById?.testPlanName}
                            </span>
                        </div>
                        {menu?.subItems?.map((subItem, subIndex) => (
                            <MenuItem
                                key={subIndex}
                                text={subItem.text}
                                icon={subItem.icon}
                                link={subItem.link}
                                isActive={basePath === subItem.link}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {/* <div className="absolute bottom-6 flex w-full justify-center px-2">
                <Link to="https://bzcom.vn/">
                    <img src={logBzcom} />
                </Link>
            </div> */}
            <button
                onClick={toggleSidebar}
                className={`hover:border-primary-100 hover:bg-neu-100 hover:stroke-primary-100 absolute -right-3  top-[50%] z-[999999] flex -translate-y-[50%] cursor-pointer items-center justify-center rounded-full bg-[#EDF3FF]  p-1 transition-all duration-150 ease-out hover:border active:scale-90 active:transform `}
            >
                {isCollapsed ? <Icon name="keyexpand" /> : <Icon name="keyexpand" className="rotate-180" />}
            </button>
        </div>
    );
};

export default Sidebar;
