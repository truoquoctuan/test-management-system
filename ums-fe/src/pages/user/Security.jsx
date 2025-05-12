import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line no-unused-vars
import Icon from '../../icons/Icon';
// eslint-disable-next-line no-unused-vars
import ErrorForm from '../../components/common/ErrorForm';
import account from '../../services/apis/Account';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';
import { useGlobalContext } from '../../context/Context';

const Security = () => {
  const {
    // eslint-disable-next-line no-unused-vars
    register,
    handleSubmit,
    watch,
    reset,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm();
  const { userInfo } = useGlobalContext();
  // eslint-disable-next-line no-unused-vars
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const password = watch('password'); // Lấy giá trị password để so sánh
  const onSubmit = async (data) => {
    try {
      const dataPasword = {
        temporary: false,
        type: 'password',
        value: data.password,
      };
      await account.updatePassWord(userInfo?.subject, dataPasword);
      setShowConfirmPassword(false);
      reset();
      toast.custom((t) => <ToastCustom status={true} title="Password updated successfully" message="" t={t} />);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-[1248px] m-auto pt-10 px-10 animate__animated animate__fadeIn">
      <div>
        <p className="text-text-200 font-bold text-2xl">Security</p>
        <p className="font-normal text-sm text-text-100 ">Update your password to keep your account secure.</p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex">
          {/* <div className="w-[30%]">
            <p className="text-text-100 font-semibold text-base">Change Password</p>
          </div> */}
          <div className="w-[50%]">
            {/* Password */}
            {/* <div className="flex flex-col gap-2 relative">
              <label className="text-text-200 text-sm font-normal">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Please enter a password.',
                  validate: {
                    upperCase: (value) => /[A-Z]/.test(value) || 'At least 1 uppercase',
                    number: (value) => /[0-9]/.test(value) || 'At least 1 number',
                    specialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'At least 1 special character',
                  },
                })}
                className={`w-full ${errors.password ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                placeholder="e.g., P@ssw0rd123!"
              />
              <Icon
                name={showPassword ? 'Eyeoff' : 'Eye'}
                className="absolute top-10 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
              <p className="text-xs text-[#626F86] font-normal">
                Must include numbers, uppercase letters, lowercase letters, and special characters.
              </p>
              {errors.password && <ErrorForm error={errors.password.message} />}
            </div> */}

            {/* Confirm Password */}
            {/* <div className="flex flex-col gap-1 relative">
              <label className="text-text-200 text-sm font-normal">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm a password. It must match the password entered above.',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                className={` ${errors.confirmPassword ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4 `}
                placeholder="e.g., P@ssw0rd123!"
              />
              <Icon
                name={showConfirmPassword ? 'Eyeoff' : 'Eye'}
                className="absolute top-9 right-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <p className="text-xs text-[#626F86] font-normal">Must match the password entered above.</p>
              {errors.confirmPassword && <ErrorForm error={errors.confirmPassword.message} />}
            </div> */}

            <div className="mt-3 flex gap-4 items-center justify-end">
              {/* <button className="text-base text-white font-medium h-[36px] px-4 bg-primary-200 rounded">
                Save changes
              </button> */}
              {/* <Link to="/accounts">
            <p className="cursor-pointer">Cancel</p>
          </Link> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Security;
