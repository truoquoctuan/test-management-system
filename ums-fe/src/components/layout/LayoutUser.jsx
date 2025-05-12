import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SidebarUser from './SidebarUser';

const LayoutUser = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Navbar */}
      <div>
        <Navbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        {/* Truyền hàm toggle xuống Navbar */}
      </div>
      {/* Main Layout */}
      <div className="flex    ">
        {/* Sidebar */}
        <div className={`transition-all  duration-500 ${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#172B4D]`}>
          <SidebarUser isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Content */}
        <div className="flex-1  ">
          <main className=" ">
            <Outlet /> {/* Hiển thị nội dung con */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LayoutUser;
