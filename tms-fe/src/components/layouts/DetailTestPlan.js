import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Loading from '../common/Loading';
import Sidebar from './Sidebar';

const DetailTestPlan = ({ isLoading }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="w-full">
            <div className="flex">
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isSidebarCollapsed ? 'w-[88px]' : 'w-[240px]'
                    }`}
                >
                    <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                </div>
                <main
                    className={`  h-[calc(100vh-72px)] overflow-y-auto transition-all duration-300 ease-in-out ${
                        isSidebarCollapsed ? 'w-[calc(100vw-88px)]' : 'w-[calc(100vw-240px)]'
                    } bg-state-bg`}
                >
                    {/* <PerfectScrollbar> */}
                    {isLoading ? (
                        <div className="absolute flex h-full w-full items-center justify-center px-6">
                            <Loading />
                        </div>
                    ) : (
                        <div className="main-content animate__animated animate__fadeIn h-full w-full px-6">
                            <Outlet />
                        </div>
                    )}
                    {/* </PerfectScrollbar> */}
                </main>
            </div>
        </div>
    );
};

export default DetailTestPlan;
