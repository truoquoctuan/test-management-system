import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import account from '../../services/apis/Account';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../icons/Icon';
import workSpace from '../../services/apis/WorkSpace';
import { formatDateForm, formatDateFormUpdate, formatTime } from '../../components/common/FormatDate';
import FormUpdateUser from '../../components/user/FormUpdateUser';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';
import { useGlobalContext } from '../../context/Context';

const UpdateUser = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const { idUser } = useParams();
  const [selectedGender, setSelectedGender] = useState(''); // Trạng thái lưu giá trị được chọn
  const { tokenInformation, setCallback, callBack } = useGlobalContext();
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const { data } = await account.getUserDetail(idUser);
      reset(data.data)
      setSelectedGender(data.data.gender);

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };


  useEffect(() => {
    if (idUser) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUser]);

  const onSubmit = async (data) => {
    try {
      const newData = {
        userId: idUser,
        username: data.username,
        enabled: data.enabled,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        birthDate: formatTime(data.birthDate),
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        position: data.position,
        startDate: formatTime(data.startDate),
        userCode: data.userCode,

      };

      await workSpace.saveAvatarMember(data.uploadKey, 'user', idUser);
      await account.updateUserInfo(newData);
      setCallback(!callBack);
      const dataAcivity = {
        userId: idUser,
        authorId: tokenInformation?.sub,
        command: 'CMD_UPDATED_USER',
      };
      await account.createActivity(dataAcivity);
      navigate('/profile');
      toast.custom((t) => (
        <ToastCustom
          status={true}
          title="Member Updated!"
          message="The member is now ready to access the apps in the workspace."
          t={t}
        />
      ));
    } catch (error) {
      toast.custom((t) => (
        <ToastCustom status={false} title={`Failed to create account in Keycloak!`} message="" t={t} />
      ));
    }
  };
  return (
    <div className="w-full h-[90vh] overflow-y-auto animate__animated animate__fadeIn ">
      <div className=" w-[1248px] m-auto px-12 pt-6">
        <div className="mb-1">
          <Link to="/profile">
            <Icon name="ArrowNarrowLeft" className="bg-[#F1F2F4] rounded px-2.5 py-2.5 cursor-pointer" />
          </Link>
        </div>

        <div>
          <p className="text-text-200 font-bold text-2xl">Edit Information</p>
          <p className="font-normal text-sm text-text-100 ">Make changes to the member’s profile.</p>
        </div>

        <FormUpdateUser
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          setValue={setValue}
          watch={watch}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          idUser={idUser}
          setError={setError}
        />
      </div>
    </div>
  );
};

export default UpdateUser;
