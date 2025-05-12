import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// import Frame171276079 from '../../assets/images/Login/Frame171276079.svg';
import Frame1000004604 from '../../assets/images/Login/Frame1000004604.svg';
import Frame1171276079 from '../../assets/images/Login/Frame1171276079.svg';
import Frame1171276088 from '../../assets/images/Login/Frame1171276088.svg';

// Import required modules
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

const Introduction = () => {
  return (
    <div className="m-4 relative">
      <div className={`bg-gradient-to-tr from-[#0D3670] to-[#0055CC] rounded-3xl h-[96.5vh]`}>
        <Swiper
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true, // Làm mờ mượt mà, ẩn slide không hoạt động
          }}
          modules={[Pagination, Autoplay, EffectFade]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="h-[95vh] flex justify-center items-center w-full">
              <div className=" absolute top-10  ">
                <div className=" flex justify-center">
                  <div className="text-center text-white mb-5 w-full ">
                    <h2 className="#FFFFFF font-bold text-[28px]">Connect All Applications</h2>
                    <p className="text-[#CCE0FF] font-normal text-[16px]">
                      One login for easy and seamless access to all ecosystem software.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-16">
                <img src={Frame1000004604} alt="" className="md:w-[70%] lg:w-[90%]" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[95vh] flex justify-center items-center">
              <div className="flex justify-center absolute top-10  ">
                <div className="text-center text-white mb-5  ">
                  <h2 className="#FFFFFF font-bold text-[28px]">Control Your Workspace with Ease</h2>
                  <p className="text-[#CCE0FF] font-normal text-[16px]">
                    Simplify user management and access control in one unified platform.
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-16">
                <img src={Frame1171276079} alt="" className="md:w-[70%] lg:w-[90%]" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[95vh] flex justify-center items-center">
              <div className="flex justify-center absolute top-10  ">
                <div className="text-center text-white mb-5  ">
                  <h2 className="#FFFFFF font-bold text-[28px]">Centralized Dashboard for All Your Needs</h2>
                  <p className="text-[#CCE0FF] font-normal text-[16px]">
                    Access everything you need with a centralized and intuitive dashboard.
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-16">
                <img src={Frame1171276088} alt="" className="md:w-[70%] lg:w-[90%]" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="custom-shape absolute top-0 right-0"></div>
      <div className="custom-shape2 absolute bottom-0 left-0"></div>
    </div>
  );
};

export default Introduction;
