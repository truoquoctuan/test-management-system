import { useMutation, useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { toast } from 'sonner';
import { CREATE_FOLDER, GET_FOLDER_BY_ID, UPDATE_FOLDER_BY_ID } from '../../../apis/repository/folder';
import { useGlobalContext } from '../../../context/Context';
import ModalComponent from '../../common/Modal';
import Icon from '../../icons/icons';

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'image',
    'list',
    'bullet',
    'link',
    'color',
    'indent',
    'background',
    'align',
    'size',
    'font'
];

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: ['right', 'center', 'justify'] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image']
    ]
};

const FormFolder = ({ isOpen, setIsOpen, idFolder, setIdFolder, checkForm, refetchFolder, refetchSubfolder }) => {
    const { userInfo } = useGlobalContext();
    const [isClosing, setIsClosing] = useState(false);
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
        }, 500);
    };
    const { data: dataDetail } = useQuery(GET_FOLDER_BY_ID, { client: clientRun, variables: { id: idFolder } });

    useEffect(() => {
        if (dataDetail?.getFolderById && checkForm === 'edit') {
            reset(dataDetail.getFolderById);
        } else {
            reset({});
        }
    }, [dataDetail, reset, idFolder, checkForm]);

    // Thêm folder
    const [add_Folder] = useMutation(
        CREATE_FOLDER,
        { client: clientRun },
        {
            onCompleted: () => {
                handleClose();
                reset({});
                refetchFolder();
                refetchSubfolder();
                setIdFolder(0);
                toast.success('Folder added successfully.');
            },
            onError: (error) => {
                toast.error(`Error: ${error.message}`);
            }
        }
    );
    // Sửa folder
    const [update_Folder] = useMutation(
        UPDATE_FOLDER_BY_ID,
        { client: clientRun },
        {
            onCompleted: () => {
                handleClose();
                reset({});
                refetchFolder();
                refetchSubfolder();
                setIdFolder(0);
                toast.success('Folder updated successfully.');
            },
            onError: (error) => {
                toast.error(`Error: ${error.message}`);
            }
        }
    );
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
                        testPlanId: String(1),
                        upperId: Number(idFolder),
                        ...commonData
                    }
                });
            } else {
                update_Folder({
                    variables: {
                        folderId: Number(idFolder),
                        ...commonData
                    }
                });
            }
        },
        [add_Folder, update_Folder, checkForm, idFolder, userInfo]
    );

    // Close model
    const handleCloseForm = useCallback(() => {
        handleClose();
        setIdFolder(0);
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
                className=""
            >
                <div className="h-[539px] w-[800px] bg-white p-4 ">
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">
                            {checkForm === 'edit' ? 'Edit Sub Folder' : 'Add Sub Folder'}{' '}
                        </p>
                        <div onClick={handleCloseForm} className="cursor-pointer">
                            <Icon name="close" className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="mt-4">
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
                            <div className="mt-4">
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
                                            className="react-quill relative h-[200px] placeholder:text-sm "
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Enter a brief description of the folder"
                                        />
                                    )}
                                />
                                <p className="mt-11 text-sm font-normal text-[#787878]">
                                    Provide a detailed description of the folder.
                                </p>
                                {errors.description && (
                                    <div className="absolute flex gap-2">
                                        <Icon name="input_form" />
                                        <p className=" text-sm text-red-500">{errors.description.message}</p>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-3 flex w-[95%] justify-center gap-3">
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
