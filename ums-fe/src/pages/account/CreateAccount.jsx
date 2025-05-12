import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../icons/Icon';
import { useGlobalContext } from '../../context/Context';
import account from '../../services/apis/Account';
import { Link, useNavigate } from 'react-router-dom';
import FormAccount from '../../components/account/FormAccount';
import workSpace from '../../services/apis/WorkSpace';
import { formatDateForm } from '../../components/common/FormatDate';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';

const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const { infoWorkSpace, tokenInformation } = useGlobalContext();
  const [selectedGender, setSelectedGender] = useState(''); // Trạng thái lưu giá trị được chọn
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newData = {
      username: data.username,
      enabled: true,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      credentials: [
        {
          type: 'password',
          value: data.password,
          temporary: false,
        },
      ],
      attributes: {
        locale: '',
        address: data.address,
        birthDate: formatDateForm(data.birthDate),
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        position: data.position,
        startDate: formatDateForm(data.startDate),
        userCode: data.userCode,
      },
      groups: [`/${infoWorkSpace.name}`],
    };

    try {
      // Api tạo tài khoản Keycloak
      const keycloakResponse = await account.createUser(newData);
      if (keycloakResponse.status === 201) {
        // Api lấy chi tiết tài
        const accountDetailsResponse = await account.getDetailUser(data.username, data.email);
        if (accountDetailsResponse.status === 200 && accountDetailsResponse.data.length > 0) {
          const accountDetails = accountDetailsResponse.data[0];
          // Api lưu file ảnh user
          await workSpace.saveAvatarMember(data.uploadKey, 'user', accountDetails.id);
          const dataAcivity = {
            userId: accountDetails?.id,
            authorId: tokenInformation?.sub,
            command: 'CMD_CREATED_USER',
          };
          await account.createActivity(dataAcivity);
          toast.custom((t) => (
            <ToastCustom
              status={true}
              title="Member Created!"
              message="The member is now ready to access the apps in the workspace."
              t={t}
            />
          ));
          navigate('/accounts');
        }
      }
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={`An error occurred!`} message="" t={t} />);
    }
  };

  return (
    <div className="w-full animate__animated animate__fadeIn ">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full relative">
        <div className="h-[calc(93vh-64px)] relative overflow-y-auto">
          <div className="w-[1248px] m-auto px-24 pt-6 ">
            <div className="mb-1">
              <Link to="/accounts">
                <Icon name="ArrowNarrowLeft" className="bg-[#F1F2F4] rounded px-2.5 py-2.5 cursor-pointer" />
              </Link>
            </div>

            <div>
              <p className="text-text-200 font-bold text-2xl">Create Member</p>
              <p className="font-normal text-sm text-text-100">
                Set up a new member to unlock access to all workspace apps.
              </p>
            </div>
            <FormAccount
              register={register}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              setValue={setValue}
              watch={watch}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              setError={setError}
            />
          </div>
        </div>

        <div className="absolute -bottom-14 right-0 w-full shadow-top">
          <div className="flex justify-end gap-4 items-center my-3 mr-10">
            <Link to="/accounts">
              <p className="cursor-pointer">Cancel</p>
            </Link>
            <button className="text-base text-white font-medium h-[36px] px-4 bg-primary-200 rounded">Create</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
