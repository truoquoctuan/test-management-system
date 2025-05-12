import React from 'react';

import LogoBZC from '../../assets/images/LogoBZC.png';
import Contact from '../../assets/images/contact.svg';
import Introduction from '../../components/login/Introduction.jsx';
import Icon from '../../icons/Icon.jsx';
import keycloak from '../../services/keycloak/Keycloak.js';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom.jsx';
const Login = () => {
  const handleLogin = async () => {
    try {
      // keycloak.login({ redirectUri: 'https://dev-bzc.bzcom.vn/' });
      keycloak.login({ redirectUri: 'http://localhost:5891' });
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={'Error during login'} message="" t={t} />);
    }
  };

  return (
    <div className="flex h-[100vh] ">
      {/* Logo */}
      <div className="absolute left-8 top-8">
        <img src={LogoBZC} alt="" />
      </div>
      {/* Khối bên trái */}
      <div className="flex w-[40%] items-center justify-center ">
        <div className="flex flex-col gap-4">
          <img src={Contact} alt="" className="w-[110px]" />
          <h2 className="text-4xl font-bold text-[#172B4D]">Welcome to User Management System!</h2>
          <p className="text-lg font-normal text-[#44546F]">
            Effortlessly manage users, roles, and access permissions <br /> with a streamlined system.
          </p>

          <button
            className="relative w-[266px] mt-6 h-[48px] font-semibold justify-center duration-300 hover:bg-primary-200 text-blue-500 border-2 border-primary-200 rounded-xl group overflow-hidden"
            onClick={() => handleLogin()}
          >
            {/* Hover Effect Background (scale and rotate) */}
            {/* <span className="absolute inset-0 bg-primary-200 transform scale-0 origin-bottom-right transition-transform duration-300 group-hover:scale-100 "></span> */}

            {/* Button Text and Icon */}
            <span className="relative gap-4 flex items-center justify-center  border-primary-200 group-hover:text-white transition-colors duration-300">
              Go to Sign in{' '}
              <Icon
                name="ArrowRight"
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1 stroke-[#0C66E4] group-hover:stroke-white"
              />
            </span>

            {/* Triangular bottom clip effect */}
            <p
              className="absolute -bottom-1 right-0 bg-primary-200 w-6 h-6"
              style={{
                clipPath: 'polygon(100% 100%, 0% 100%, 100% 0%)',
              }}
            ></p>
          </button>
        </div>
      </div>
      {/* Khối bên phải */}
      <div className="w-[60%]">
        <Introduction />
      </div>
    </div>
  );
};

export default Login;
