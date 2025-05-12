import React from 'react';
import ServicesImage from '../../assets/images/commingsoon/Service.png';

const Services = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-[90vh]">
        <div>
          <div>
            <div className="flex justify-center">
              <img src={ServicesImage} alt="" />
            </div>

            <div className="text-center">
              <p className="text-[#172B4D] font-bold text-[24px]">Services Feature Coming Soon!</p>
              <p className="text-text-100">We are working hard to refine this feature and it will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
