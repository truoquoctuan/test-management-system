import { customStyles } from 'components/common/FormatModal';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useState } from 'react';

// eslint-disable-next-line no-unused-vars
const DeleteMember = ({ isOpen, setIsOpen, handleDeletMember, listMember, checkedMember }) => {
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };

    return (
        <div>
            <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen} isClosing={isClosing} style={customStyles}>
                <div className="h-[268px] w-[500px] p-3">
                    <div className="mt-5 text-center">
                        <div>
                            <Icon name="delete_outlined" />
                        </div>
                        <p className="text-base font-semibold">
                            Remove {checkedMember?.length} Members from the Test Plan?{' '}
                        </p>
                        <p className="mt-2 text-sm font-normal text-[#787878]">This action cannot be undone.</p>
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
                            onClick={() => handleDeletMember()}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default DeleteMember;
