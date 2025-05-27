import { useMutation } from '@apollo/client';
import { customStyles } from 'components/common/FormatModal';
import { useState } from 'react';
import { toast } from 'sonner';
import { DELETE_FOLDER_BY_ID } from '../../../apis/repository/folder';
import ModalComponent from '../../common/Modal';
import Icon from '../../icons/icons';

// eslint-disable-next-line no-unused-vars
const DeleteFolder = ({ isOpen, setIsOpen, idFolder, refetchSubfolder, refetchFolder }) => {
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };
    // Api xóa folder
    const [delete_Folder] = useMutation(DELETE_FOLDER_BY_ID);
    // Xóa folder
    const handleDeleteFolder = async () => {
        try {
            await delete_Folder({ variables: { id: Number(idFolder) } });
            await refetchFolder();
            await refetchSubfolder();
            handleClose();
            toast.success('Successfully deleted the folder');
        } catch (error) {
            toast.success('Error');
        }
    };
    return (
        <div>
            <ModalComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                style={customStyles}
            >
                <div className="h-[268px] w-[500px] p-3">
                    <div className="mt-5 text-center">
                        <div>
                            <Icon name="delete_outlined" />
                        </div>
                        <p className="text-base font-semibold">Delete Folder? </p>
                        <p className="mt-2 text-sm font-normal text-[#787878]">
                            This action cannot be undone and all contents within the folder will be permanently deleted.
                        </p>
                    </div>

                    <div className="  mt-6 flex w-full justify-center gap-3">
                        <div
                            className="w-[160px] cursor-pointer border border-red-500 py-1.5 text-center font-semibold text-red-500"
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </div>
                        <button
                            className="w-[160px] border border-red-500 bg-red-500 py-1.5 text-center font-semibold text-white"
                            onClick={() => handleDeleteFolder()}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default DeleteFolder;
