import { useMutation } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { MODIFI_START_DATE } from 'apis/issues/issues';
import { toDateStringYear } from 'components/common/Time';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { toast } from 'sonner';

// eslint-disable-next-line no-unused-vars
const EditStartDate = ({ dataIssueById, startDate, idIssue, refetch }) => {
    const [isOpenEdit, setIdOpenEdit] = useState(true);
    const [updateIssue] = useMutation(MODIFI_START_DATE, { client: clientRun });
    const { checkStatus, checkRoleTestPland } = useGlobalContext();
    const flatpickrRef = useRef(null);

    const submitFormDate = async (data) => {
        const newdata = {
            issuesId: idIssue,
            startDate: data ? toDateStringYear(data[0]) + 'T00:00:00' : ''
        };
        try {
            await updateIssue({ variables: newdata });
            setIdOpenEdit(true);
            refetch();
        } catch (error) {
            toast.error('An error occurred.');
        }
    };
    const [loadingTag, setLoadingTag] = useState(false);

    useEffect(() => {
        if (isOpenEdit) {
            setLoadingTag(true);
            setTimeout(() => {
                setLoadingTag(false);
            }, 1000);
        }
    }, [isOpenEdit]);
    return (
        <div>
            {' '}
            <div className="flex flex-col gap-2 border-b-[1px] border-b-[#DEDEDE] pb-1">
                <div className="flex justify-between">
                    <div className="text-[14px] font-semibold">Start Date</div>
                    {checkStatus === 1 && checkRoleTestPland !== 3 && (
                        <button className="text-sm text-[#1D79ED]" onClick={() => setIdOpenEdit(!isOpenEdit)}>
                            Edit
                        </button>
                    )}
                </div>
                {isOpenEdit ? (
                    <>
                        {loadingTag ? (
                            <div className="loader h-7 w-7"></div>
                        ) : (
                            <div className="text-[14px] text-[#484848]">{startDate ? startDate : 'None'}</div>
                        )}
                    </>
                ) : (
                    <div className="relative">
                        <Flatpickr
                            className="w-full border border-neutral-4 px-3 py-1 text-[14px] placeholder:text-sm focus:border-neutral-1 focus:outline-none"
                            placeholder="dd/mm/yyyy"
                            value={startDate}
                            options={{
                                dateFormat: 'd/m/Y',
                                maxDate: dataIssueById.endDate ? new Date(dataIssueById.endDate) : null,
                                theme: 'material_blue'
                            }}
                            onChange={(date) => submitFormDate(date)}
                            ref={flatpickrRef} // Save the Flatpickr instance
                        />

                        <div
                            className="absolute right-4 top-1.5 h-5 w-5 cursor-pointer"
                            onClick={() => flatpickrRef.current.flatpickr.open()} // Open the Flatpickr date picker
                        >
                            <Icon name="calendar" className="fill-[#B3B3B3]" />
                        </div>

                        <div
                            className="absolute right-12 top-1.5 z-[30] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#E8E8E8]"
                            onClick={() => submitFormDate('')}
                        >
                            <Icon name="close" className="h-[12px] w-[12px] fill-black" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditStartDate;
