import { useMutation, useQuery } from '@apollo/client';
import { modules } from 'components/common/FormatQuill';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CREATE_FOLDER, GET_FOLDER_BY_ID, UPDATE_FOLDER_BY_ID } from '../../../apis/repository/folder';
import { useGlobalContext } from '../../../context/Context';
import ModalComponent from '../../common/Modal';
import Icon from '../../icons/icons';

const FormFolder = ({
    isOpen,
    setIsOpen,
    idFolder,
    setIdFolder,
    checkForm,
    refetchFolder,
    refetchSubfolder,
    setSelectedFolder,
    setCheckForm
}) => {
    const { userInfo } = useGlobalContext();
    const [isClosing, setIsClosing] = useState(false);
    const { testPlanId } = useParams();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setCheckForm('add');
        }, 500);
    };
    const { data: dataDetail } = useQuery(GET_FOLDER_BY_ID, {
        variables: { id: idFolder },
        skip: checkForm == 'edit' ? false : true
    });

    useEffect(() => {
        if (dataDetail?.getFolderById && checkForm === 'edit') {
            reset(dataDetail.getFolderById);
        } else {
            reset({});
        }
    }, [dataDetail, reset, idFolder, checkForm]);

    // Thêm folder
    const [add_Folder] = useMutation(CREATE_FOLDER, {
        onCompleted: () => {
            handleClose();
            reset({});
            refetchFolder();
            refetchSubfolder();
            setIdFolder(0);
            setSelectedFolder(null);
            toast.success('Folder added successfully.');
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });
    // Sửa folder
    const [update_Folder] = useMutation(UPDATE_FOLDER_BY_ID, {
        onCompleted: () => {
            handleClose();
            reset({});
            refetchFolder();
            refetchSubfolder();
            setIdFolder(0);
            setCheckForm('add');
            toast.success('Folder updated successfully.');
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    // Lấy dữ liệu form
    const onSubmit = useCallback(
        (data) => {
            const commonData = {
                ...data,
                createdBy: String(userInfo?.userID)
            };

            if (checkForm === 'add') {
                add_Folder({
                    variables: {
                        testPlanId: String(testPlanId),
                        upperId: Number(idFolder),
                        ...commonData
                    }
                });
                setIdFolder(0);
                reset({});
            } else {
                update_Folder({
                    variables: {
                        folderId: Number(idFolder),
                        ...commonData
                    }
                });
                setIdFolder(0);
                reset({});
            }
        },
        [add_Folder, update_Folder, checkForm, idFolder, userInfo]
    );

    // Close model
    const handleCloseForm = useCallback(() => {
        handleClose();
        setIdFolder(0);
        setCheckForm('add');
        reset({});
    }, [setIsOpen, setIdFolder, reset]);

    return (
        <div className="">
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                reset={reset}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                chooseOut={false}
                className="animate__animated animate__fadeInDown animate__faster"
            >
                <div className=" w-[900px] bg-white p-4 ">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">
                            {checkForm === 'edit'
                                ? `${idFolder === 0 ? 'Edit Folder' : 'Edit Sub Folder'} `
                                : `${idFolder === 0 ? 'Add Folder' : 'Add Sub Folder'} `}{' '}
                        </p>
                        <div onClick={handleCloseForm} className="cursor-pointer">
                            <Icon name="close" className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="z-[9999] mt-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="relative">
                                <p className="mb-2 text-sm font-semibold">
                                    Folder Name <span className="text-red-500">*</span>
                                </p>
                                <Controller
                                    name="folderName"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'The Folder Name fields is required.',
                                        maxLength: { value: 50, message: 'Maximum 50 characters.' },
                                        validate: (value) =>
                                            value.trim() !== '' || 'The Folder Name fields is required.'
                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="h-[40px] w-full border border-[#B3B3B3] px-2 placeholder:text-sm focus:border-blue-600 focus:outline-none"
                                            placeholder="Enter a name for folder"
                                        />
                                    )}
                                />
                                <p className="text-sm font-normal text-[#787878]">
                                    Enter a name for the folder to organize your test cases.
                                </p>
                                {errors.folderName && (
                                    <div className="absolute flex gap-2">
                                        <Icon name="input_form" />
                                        <p className=" text-sm text-red-500">{errors.folderName.message}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 ">
                                <p className="mb-2 text-sm font-semibold">Description (optional)</p>
                                <Controller
                                    name="description"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        maxLength: { value: 1000, message: 'Maximum 1000 characters.' }
                                    }}
                                    render={({ field }) => (
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            className="react-quill react-quill-testplan2 relative  w-full placeholder:text-sm"
                                            modules={modules}
                                            placeholder="Enter a brief description of the folder"
                                        />
                                    )}
                                />
                                <p className="mt-2 text-sm font-normal text-[#787878]">
                                    Provide a detailed description of the folder.
                                </p>
                                {errors.description && (
                                    <div className="absolute flex gap-2">
                                        <Icon name="input_form" />
                                        <p className=" text-sm text-red-500">{errors.description.message}</p>
                                    </div>
                                )}
                            </div>
                            <div className=" mt-10 flex w-[95%] justify-center gap-3">
                                <div
                                    className="w-[160px] cursor-pointer border border-[#0066CC] py-1.5 text-center font-semibold text-[#0066CC]"
                                    onClick={handleCloseForm}
                                >
                                    Cancel
                                </div>
                                <button className="w-[160px] border border-[#0066CC] bg-[#0066CC] py-1.5 text-center font-semibold text-white">
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default FormFolder;
