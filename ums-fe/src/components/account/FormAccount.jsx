import React, { useState } from 'react';
import Icon from '../../icons/Icon';
import AttachFile from '../../components/files/File';
import ErrorForm from '../common/ErrorForm';
import DatePicker from '../common/DatePicker';

const FormAccount = ({
  register,
  errors,
  setValue,
  watch,
  selectedGender,
  setSelectedGender,
  idUser,
  setError,
  setFileSeq,
}) => {
  const validateEmail = /^(?!.*\.\.)^(?!.*-)[a-zA-Z0-9._-]+@(?![.-])[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\.[a-zA-Z]{2,4})?$/;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password'); // Lấy giá trị password để so sánh
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng dropdown

  const handleSelect = (value) => {
    setSelectedGender(value);
    setValue('gender', value, { shouldValidate: true }); // Cập nhật giá trị trong React Hook Form
    setIsOpen(false); // Đóng dropdown
  };

  return (
    <div className="">
      <div className="my-6 ">
        <div className="flex flex-col gap-6 w-[1000px]">
          {/* Basic Information */}
          <div className="flex ">
            <div className="w-[30%]">
              <p className="text-text-100 font-semibold text-base">Basic Information </p>
            </div>
            <div className="w-[70%] flex flex-col gap-3">
              <div>
                <AttachFile
                  attachType="WorkspaceAvatar"
                  entity={'user'}
                  seq={idUser ? idUser : null}
                  register={register}
                  setFileSeq={setFileSeq}
                  viewMode={true}
                  mode="member"
                  className="h-8 w-8 rounded-full object-cover"
                  filters={{
                    max_file_size: '10mb',
                    mime_types: [
                      {
                        title: 'Tệp đã được nhận: ',
                        extensions: 'jpg,png,jpeg,svg,webp',
                      },
                    ],
                  }}
                />
              </div>

              {/*  Full name */}
              <div className="flex gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-text-200 text-sm font-normal">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="text"
                    {...register('firstName', {
                      required: 'Please enter the full first name.',
                      maxLength: {
                        value: 50,
                        message: 'The first name should not exceed 50 characters.',
                      },
                      validate: (value) => {
                        // Trim khoảng trắng và kiểm tra độ dài
                        if (!value.trim()) {
                          return 'Please enter the full first name.';
                        }
                        return true;
                      },
                    })}
                    className={`${errors.firstName ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                    placeholder="e.g., John Doe"
                  />
                  {errors.firstName && <ErrorForm error={errors.firstName.message} />}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-text-200 text-sm font-normal">
                    Last name<span className="text-red-500">*</span>
                  </label>
                  <input
                    name="text"
                    {...register('lastName', {
                      required: 'Please enter the full last name.',
                      maxLength: {
                        value: 50,
                        message: 'The name should not exceed 50 characters.',
                      },
                      validate: (value) => {
                        // Trim khoảng trắng và kiểm tra độ dài
                        if (!value.trim()) {
                          return 'Please enter the full last name.';
                        }
                        return true;
                      },
                    })}
                    className={`${errors.lastname ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                    placeholder="e.g., John Doe"
                  />
                  {errors.lastname && <ErrorForm error={errors.lastname.message} />}
                </div>
              </div>

              {/* Gender */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-text-200 text-sm font-normal">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`h-[36px] border px-4 flex items-center justify-between rounded cursor-pointer ${
                      errors.gender
                        ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]'
                        : 'border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '
                    }`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className={`text-sm  ${!selectedGender ? 'text-[#626F86] ' : ''}`}>
                      {selectedGender || 'Select Gender'}
                    </span>
                    <Icon name="ChevronSelectorVertical" />
                  </div>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md w-full top-[70px] z-10">
                      <div
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect('Male')}
                      >
                        Male
                      </div>
                      <div
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect('Female')}
                      >
                        Female
                      </div>
                      <div
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect('Other')}
                      >
                        Other
                      </div>
                    </div>
                  )}
                  <input type="hidden" {...register('gender', { required: `Please specify the user'${'s'}gender.` })} />
                  {errors.gender && <ErrorForm error={errors.gender.message} />}
                </div>
                {/* Date of Birth */}
                <DatePicker
                  label=" Date of Birth"
                  name="birthDate"
                  placeholder="yyyy/mm/dd"
                  required="Please select the user's date of birth."
                  setValue={setValue}
                  errors={errors}
                  setError={setError}
                  register={register}
                  watch={watch}
                />
              </div>
            </div>
          </div>
          <hr />
          {/*  Contact Information*/}
          <div className="flex ">
            <div className="w-[30%]">
              <p className="text-text-100 font-semibold text-base"> Contact Information</p>
            </div>
            <div className="w-[70%] flex flex-col gap-3 ">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-text-200 text-sm font-normal">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="number"
                    {...register('phoneNumber', {
                      required: 'Please enter a valid phone number.',
                      minLength: {
                        value: 10,
                        message: 'The phone number should not exceed 10 characters.',
                      },
                      validate: (value) => {
                        // Trim khoảng trắng và kiểm tra độ dài
                        if (!value.trim()) {
                          return 'Please enter a valid phone number.';
                        }
                        return true;
                      },
                    })}
                    className={`${errors.phoneNumber ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                    placeholder="e.g., 0123456789"
                  />
                  {errors.phoneNumber && <ErrorForm error={errors.phoneNumber.message} />}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-text-200 text-sm font-normal">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="text"
                    {...register('email', {
                      required: 'Email is required',
                      maxLength: {
                        value: 50,
                        message: 'The email address should not exceed 50 characters.',
                      },
                      pattern: {
                        value: validateEmail,
                        message: 'Invalid email address.',
                      },
                    })}
                    className={`${errors.email ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                    placeholder="e.g., john.doe@example.com"
                  />
                  {errors.email && <ErrorForm error={errors.email.message} />}
                </div>
              </div>
              {/* Address */}
              <div className="flex flex-col gap-2">
                <label className="text-text-200 text-sm font-normal">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="text"
                  {...register('address', {
                    required: 'Please enter the address.',
                    maxLength: {
                      value: 50,
                      message: 'The address should not exceed 50 characters.',
                    },
                    validate: (value) => {
                      if (!value.trim()) {
                        return 'Please enter the address.';
                      }
                      return true;
                    },
                  })}
                  className={`${errors.address ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                  placeholder="e.g., 123 Main St, City, Country"
                />
                {errors.address && <ErrorForm error={errors.address.message} />}
              </div>
            </div>
          </div>
          <hr />
          {/*  Member Details*/}
          <div className="flex ">
            <div className="w-[30%]">
              <p className="text-text-100 font-semibold text-base">Member Details</p>
            </div>
            <div className="w-[70%] flex flex-col gap-3 ">
              {/* Staff ID  */}
              <div className="flex flex-col gap-2">
                <label className="text-text-200 text-sm font-normal">
                  Staff ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="text"
                  {...register('userCode', {
                    required: 'Please enter the  Staff ID.',
                    maxLength: {
                      value: 50,
                      message: 'The staff ID should not exceed 50 characters.',
                    },
                    validate: (value) => {
                      if (!value.trim()) {
                        return 'Please enter the  Staff ID.';
                      }
                      return true;
                    },
                  })}
                  className={`${errors.userCode ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                  placeholder="e.g., NV01"
                />
                {errors.userCode && <ErrorForm error={errors.userCode.message} />}
              </div>

              {idUser ? (
                ''
              ) : (
                <>
                  {/*Username  */}
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-text-200 text-sm font-normal">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="text"
                      {...register('username', {
                        required: 'Username is required',
                        maxLength: {
                          value: 50,
                          message: 'Username must be less than 50 characters',
                        },

                        pattern: {
                          value: /^[a-zA-Z0-9]+$/,
                          message: 'Please do not enter special characters',
                        },
                        validate: (value) => {
                          // Trim khoảng trắng và kiểm tra độ dài
                          if (!value.trim()) {
                            return 'Username is required';
                          }
                          return true;
                        },
                      })}
                      className={`${errors.username ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                      placeholder="e.g., john_doe123"
                    />
                    {errors.username && <ErrorForm error={errors.username.message} />}
                  </div>
                  {/* Password */}
                  <div className="flex flex-col gap-2 relative">
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
                          specialChar: (value) =>
                            /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'At least 1 special character',
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
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1 relative">
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
                  </div>
                </>
              )}
            </div>
          </div>
          <hr />
          {/*Work Details*/}
          <div className="flex ">
            <div className="w-[30%]">
              <p className="text-text-100 font-semibold text-base">Work Details</p>
            </div>
            <div className="w-[70%] flex flex-col gap-3 ">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-text-200 text-sm font-normal">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="text"
                    {...register('position', { required: 'Please enter a position.' })}
                    className={`${errors.position ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]' : ' border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4] '} w-full h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
                    placeholder="e.g., 123 Main St, City, Country"
                  />
                  {errors.position && <ErrorForm error={errors.position.message} />}
                </div>
                <DatePicker
                  label="Join Date"
                  name="startDate"
                  placeholder="yyyy/mm/dd"
                  required="Please select the date the user joined."
                  setValue={setValue}
                  errors={errors}
                  setError={setError}
                  register={register}
                  watch={watch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAccount;
