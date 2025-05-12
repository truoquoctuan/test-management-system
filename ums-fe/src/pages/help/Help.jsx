import React from 'react';
import HelpImage from '../../assets/images/commingsoon/help.png';

const Help = () => {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div>
        <div>
          <div className="flex justify-center">
            <img src={HelpImage} alt="" />
          </div>

          <div className="text-center">
            <p className="text-[#172B4D] font-bold text-[24px]">Help Feature Coming Soon!</p>
            <p className="text-text-100">We are working hard to refine this feature and it will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
