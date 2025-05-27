import { useMutation } from '@apollo/client';
import { DELETE_TEST_CASE_BY_ID } from 'apis/repository/test-case';
import { customStyles } from 'components/common/FormatModal';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteTestCase = ({
    isOpen,
    setIsOpen,
    arrayTestCaseId,
    setArrayTestCaseId,
    refetch,
    setCheckAllTestCase,
    setIdTestCase
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setArrayTestCaseId([]);
        }, 500);
    };
    const [delete_TestCase] = useMutation(DELETE_TEST_CASE_BY_ID);
    const handleDeleteFolder = async () => {
        try {
            await delete_TestCase({ variables: { ids: arrayTestCaseId.map(Number) } });
            await refetch();
            setArrayTestCaseId([]);
            setCheckAllTestCase(false);
            setIsOpen(false);
            setIdTestCase(null);
            toast.success('Deleted test case successfully');
        } catch (error) {
            toast.error('Error');
        }
    };
    return (
        <div>
            <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen} isClosing={isClosing} style={customStyles}>
                <div className="h-[268px] w-[500px] p-3">
                    <div className="mt-5 text-center">
                        <div>
                            <Icon name="delete_outlined" />
                        </div>
                        <p className="text-base font-semibold">Delete Test Case? </p>
                        <p className="mt-2 text-sm font-normal text-[#787878]">
                            This action cannot be undone and all contents within the test case will be permanently
                            deleted.{' '}
                        </p>
                    </div>

                    <div className="  mt-6 flex w-full justify-center gap-3">
                        <div
                            className="w-[160px] cursor-pointer border border-red-500 py-1.5 text-center font-semibold text-red-500"
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </div>
                        <div
                            className="w-[160px] cursor-pointer border border-red-500 bg-red-500 py-1.5 text-center font-semibold text-white"
                            onClick={() => handleDeleteFolder()}
                        >
                            Confirm
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default DeleteTestCase;
