import { useMutation } from '@apollo/client';
import { UPDATE_TEST_PLANS_STT } from 'apis/apollo/test-plan/mutation';
import Popup from 'components/common/Popup';
import Icon from 'components/icons/icons';
import { toast } from 'sonner';

const RestoreConfirmPopup = (props) => {
    const {
        testPlanCount = 0,
        archiveConfirm,
        setArchiveConfirm,
        testPlansId,
        setTestPlansId,
        refetch,
        refetchActiveCount,
        refetchArchivedCount,
        setCurrentPage,
        setAllChecked
    } = props;

    const [archiveTestPlans] = useMutation(UPDATE_TEST_PLANS_STT);

    const handleClose = () => {
        setArchiveConfirm({ isOpen: true, animate: 'animate__fadeOutDown__2' });

        setTimeout(() => {
            setArchiveConfirm({ isOpen: false, animate: '' });
            setTestPlansId([]);
        }, 350);
    };

    const handleConfirm = async () => {
        try {
            await archiveTestPlans({
                variables: {
                    testPlans: testPlansId
                }
            });
            await setCurrentPage(0);
            await refetch();
            await refetchActiveCount();
            await refetchArchivedCount();
            setAllChecked(false);
            handleClose();
            setTestPlansId([]);
            toast.success('Archived successfully');
        } catch (err) {
            console.error('Error disabling test plans:', err);
        }
    };

    return (
        <Popup isOpen={archiveConfirm?.isOpen} animate={archiveConfirm?.animate} handleClose={handleClose}>
            <div className="flex h-full w-full max-w-[500px] flex-col items-center gap-4 p-6 text-neutral-1">
                <div className="relative flex w-full justify-center">
                    <Icon
                        name="close_2"
                        className="absolute -right-3 -top-3 h-5 w-5 cursor-pointer fill-neutral-3 transition-all duration-300 hover:fill-neutral-1"
                        onClick={handleClose}
                    />

                    <Icon name="sync" className="h-12 w-12 fill-primary-1" />
                </div>

                <div className="text-base font-medium">{`Restore ${testPlanCount} Test Plans?`}</div>

                <div className="text-center font-normal text-neutral-3">
                    Are you sure you want to restore test plan? Restoring this project will move it back to the active
                    test plan list.
                </div>

                <div className="flex gap-x-3">
                    <button
                        className="min-w-36 border border-neutral-3 px-3 py-2 font-bold text-neutral-3"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="min-w-36 border border-primary-1 bg-primary-1 px-3 py-2 font-bold text-white"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default RestoreConfirmPopup;
