import React, { useState } from 'react';
import LogoBzw from '../../assets/images/home/LogoBZWsvg.svg';
import LogoBzt from '../../assets/images/home/LogoBzt.svg';

import LogoBzq from '../../assets/images/home/LogoBzq.svg';
import Icon from '../../icons/Icon';
import Sunkenlogobzw from '../../assets/images/home/Sunkenlogobzw.svg';
import Sunkenlogobzt from '../../assets/images/home/Sunkenlogobzt.svg';
import Sunkenlogobzq from '../../assets/images/home/Sunkenlogobzq.svg';
const Service = ({ countService }) => {
  const [openServiceIds, setOpenServiceIds] = useState([]); // Lưu trữ các serviceId đang mở

  const data = [
    {
      id: 1,
      name: 'BZWare',
      role: 'bzw-service',
      logo: LogoBzw,
      sunkenlogo: Sunkenlogobzw,
      introduce: 'All-in-one internal management software',
      featured: [
        { content: 'Managing and optimizing workflows' },
        { content: 'Detailed employee information management' },
        { content: 'Customizable and flexible features' },
      ],
    },
    {
      id: 2,
      name: 'BZTalk',
      role: 'bzt-service',
      logo: LogoBzt,
      sunkenlogo: Sunkenlogobzt,
      introduce: 'Streamline communication within your workspace',
      featured: [
        { content: 'Effective communication and connection' },
        { content: 'Flexible chat management' },
        { content: 'Integrated document sharing' },
      ],
    },
    {
      id: 3,
      name: 'BZQuality',
      logo: LogoBzq,
      role: 'bzq-service',
      sunkenlogo: Sunkenlogobzq,
      introduce: 'Software for managing QA processes',
      featured: [
        { content: 'Efficient QA management' },
        { content: 'Test resource management' },
        { content: 'Reporting and result analysis ' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* <div>
        <h2 className="font-semibold text-[20px] text-text-100">Your apps ({countService?.length})</h2>
        <p className="text-text-100 font-normal text-sm">Explore the featured apps in your workspace.</p>
      </div> */}

      <div className="flex gap-3 hidden">
        <div className="">
          <p className="text-sm border px-3 py-1 rounded-full border-[#0C66E4] text-[#0C66E4] font-medium">All (2)</p>
        </div>
        <div>
          <p className="text-sm border px-3 py-1 rounded-full">Communication & Collaboration (2)</p>
        </div>
      </div>

      {/* <div className="grid grid-cols-3 gap-6 ">
        {data
          ?.filter((item) => countService?.includes(item.role))
          ?.map((item, index) => {
            const isOpen = openServiceIds.includes(item.id); // Kiểm tra xem serviceId có đang mở không

            return (
              <div className=" relative   rounded-lg " key={index}>
                <div className="px-4 p-6 border rounded-t-md ">
                  <img src={item.logo} alt="" className="w-8" />
                  <div className="absolute right-0 top-0">
                    <img src={item?.sunkenlogo} alt="" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-200 text-base">{item.name}</p>
                    <p className="text-sm text-text-100">{item.introduce}</p>
                  </div>
                </div>

                <div className="border-x border-b px-4  py-3  rounded-b-md">
                  <h2
                    className="text-xs text-text-100 font-semibold flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      setOpenServiceIds(
                        (prev) =>
                          isOpen
                            ? prev.filter((id) => id !== item.id) // Nếu đang mở, loại bỏ khỏi danh sách
                            : [...prev, item.id] // Nếu chưa mở, thêm vào danh sách
                      );
                    }}
                  >
                    <span>
                      <Icon name={'ChevronDown2'} className={isOpen ? '' : '-rotate-90'} />
                    </span>
                    <span>FEATURED</span>
                  </h2>

                  <div
                    className={` ${
                      isOpen
                        ? 'pt-4 min-h-[140px] opacity-100 transition-all duration-500 flex flex-col gap-4'
                        : 'h-0 opacity-0 transition-all duration-500 overflow-hidden'
                    }`}
                  >
                    {item.featured.map((feature, index) => {
                      return (
                        <div key={index} className="flex  gap-2">
                          <Icon name="Featured" />
                          <p className="text-sm text-text-100">{feature.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div> */}
      {/* <div>
        <h2 className="font-semibold text-[20px] text-text-100">Explore More Apps</h2>
        <p className="text-text-100 font-normal text-sm">Explore a wider selection of apps for better collaboration.</p>
      </div>
      <div className="grid grid-cols-3 gap-6 ">
        {data
          ?.filter((item) => !countService?.includes(item.role))
          ?.map((item, index) => {
            const isOpen = !openServiceIds.includes(item.id); // Kiểm tra xem serviceId có đang mở không

            return (
              <div className=" relative   rounded-lg " key={index}>
                <div className="px-4 p-6 border rounded-t-md ">
                  <img src={item.logo} alt="" className="w-8" />
                  <div className="absolute right-0 top-0">
                    <img src={item?.sunkenlogo} alt="" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-200 text-base">{item.name}</p>
                    <p className="text-sm text-text-100">{item.introduce}</p>
                  </div>
                </div>

                <div className="border-x border-b px-4  py-3  rounded-b-md">
                  <h2
                    className="text-xs text-text-100 font-semibold flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      setOpenServiceIds(
                        (prev) =>
                          isOpen
                            ? prev.filter((id) => id !== item.id) // Nếu đang mở, loại bỏ khỏi danh sách
                            : [...prev, item.id] // Nếu chưa mở, thêm vào danh sách
                      );
                    }}
                  >
                    <span>
                      <Icon name={'ChevronDown2'} className={isOpen ? '' : '-rotate-90'} />
                    </span>
                    <span>FEATURED</span>
                  </h2>

                  <div
                    className={` ${
                      isOpen
                        ? 'pt-4 min-h-[140px] opacity-100 transition-all duration-500 flex flex-col gap-4'
                        : 'h-0 opacity-0 transition-all duration-500 overflow-hidden'
                    }`}
                  >
                    {item.featured.map((feature, index) => {
                      return (
                        <div key={index} className="flex  gap-2">
                          <Icon name="Featured" />
                          <p className="text-sm text-text-100">{feature.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div> */}
    </div>
  );
};

export default Service;
