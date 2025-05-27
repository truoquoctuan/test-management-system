import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const MainLayout = () => {
    return (
        <div className="text-secondary-800 min-h-screen text-base font-normal">
            <div className={`h-[72px] duration-200`}>
                <Navigation />
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
