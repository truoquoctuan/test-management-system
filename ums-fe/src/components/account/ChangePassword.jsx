import React, { useState } from 'react';
import ModalComponent from '../common/Modal';
import Icon from '../../icons/Icon';
import { useForm } from 'react-hook-form';
import ErrorForm from '../common/ErrorForm';
import account from '../../services/apis/Account';
import { toast } from 'sonner';
import ToastCustom from '../common/ToastCustom';

const ChangePassword = ({ isOpenChangePassword, setIsOpenChangePassword, selectIdMember }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password'); // Lấy giá trị password để so sánh
  const onSubmit = async (data) => {
    try {
      const dataPasword = {
        temporary: false,
        type: 'password',
        value: data.password,
      };
      await account.updatePassWord(selectIdMember, dataPasword);
      setShowConfirmPassword(false);
      reset();
      toast.custom((t) => (
        <ToastCustom
          status={true}
          title="Password updated successfully"
          message="Everything’s set and ready for you."
          t={t}
        />
      ));
      setIsOpenChangePassword(false);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  return (
    <div>
      <ModalComponent isOpen={isOpenChangePassword} setIsOpen={setIsOpenChangePassword}>
        <div className="flex justify-between px-6 pt-3">
          <p className="font-semibold  text-lg">Change Password</p>
          <Icon
            name="Close"
            className="cursor-pointer"
            onClick={() => {
              setIsOpenChangePassword(false);
              reset();
            }}
          />
        </div>
        <form className=" p-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="">
              {/* Password */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-text-200 text-sm font-normal">
                  New password <span className="text-red-500">*</span>
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
                  className={`w-full ${errors.password ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-3`}
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
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1 relative mt-2">
                <label className="text-text-200 text-sm font-normal">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm a password. It must match the password entered above.',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className={` ${errors.confirmPassword ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-3 `}
                  placeholder="e.g., P@ssw0rd123!"
                />
                <Icon
                  name={showConfirmPassword ? 'Eyeoff' : 'Eye'}
                  className="absolute top-9 right-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                <p className="text-xs text-[#626F86] font-normal">Must match the password entered above.</p>
                {errors.confirmPassword && <ErrorForm error={errors.confirmPassword.message} />}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-4 items-center justify-end">
            <button className="text-base text-white font-medium h-[36px] px-4 bg-primary-200 rounded">
              Save changes
            </button>
            <p
              className="cursor-pointer"
              onClick={() => {
                setIsOpenChangePassword(false);
                reset();
              }}
            >
              Cancel
            </p>
          </div>
        </form>
      </ModalComponent>
    </div>
  );
};

export default ChangePassword;
