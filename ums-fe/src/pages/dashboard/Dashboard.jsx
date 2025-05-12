import React from 'react';
import DashboardImage from '../../assets/images/commingsoon/Dashboard.png';
const Dashboard = () => {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div>
        <div>
          <div className="flex justify-center">
            <img src={DashboardImage} alt="" />
          </div>

          <div className="text-center">
            <p className="text-[#172B4D] font-bold text-[24px]">Dashboard Feature Coming Soon!</p>
            <p className="text-text-100">We are working hard to refine this feature and it will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
