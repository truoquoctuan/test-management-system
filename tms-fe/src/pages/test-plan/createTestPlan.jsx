import { useMutation } from '@apollo/client';
import { CREATE_TEST_PLAN } from 'apis/apollo/test-plan/mutation';
import { toDateStringYear } from 'components/common/Time';
import Button from 'components/design-system/Button';
import Icon from 'components/icons/icons';
import CreateMember from 'components/test-plan/create-test-plan/CreateMember';
import GeneralInformation from 'components/test-plan/create-test-plan/GeneralInformation';
import { useGlobalContext } from 'context/Context';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Title from '../../components/common/Title';

const createTestPlan = () => {
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const { userInfo } = useGlobalContext();
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm();
    const startDate = watch('startDate');

    const [createTestPlan] = useMutation(CREATE_TEST_PLAN);
    const [isGeneralInfo, setOpenCloseFormPlan] = useState(true);

    const [isMembers, setIsMembers] = useState(false);
    const [members, setMembers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [listMember, setListMember] = useState([]);

    const userListMember = listMember.map((user) => {
        return {
            userId: user.userId,
            roleTestPlan: user.roleTestPlan,
            positions: user.positions?.map((item) => ({ positionId: item.positionId }))
        };
    });

    // Create test plan
    const onSubmit = async (data) => {
        setIsLoading(true);

        const newData = {
            description: data.description,
            createdBy: userInfo.userID,
            status: data.status.value,
            endDate: data?.endDate ? toDateStringYear(data?.endDate) + 'T00:00:00' : '',
            startDate: data?.startDate ? toDateStringYear(data?.startDate) + 'T00:00:00' : '',
            testPlanName: data.testPlanName,
            uploadKey: data.uploadKey,
            members: userListMember
        };
        try {
            await createTestPlan({ variables: newData });
            toast.success('Test Plan created successfully.');
            setIsLoading(false);
            navigate(`/test-plan?type=${data.status.value == 1 ? 'Active' : 'Archived'}`);
        } catch (error) {
            setTimeout(() => setIsLoading(false), 500);
            toast.error('An error has occurred');
        }
    };

    return (
        <div className="animate__animated animate__fadeIn h-[calc(100vh-72px)] w-full overflow-hidden bg-state-bg  text-sm font-normal text-neutral-1">
            <PerfectScrollbar>
                <div className="w-full px-10 py-4">
                    {/* Title */}
                    <Title name="Create new Test Plan" subtitle="Start a new Test Plan for your project." />

                    {/* Create form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 " action="">
                        {/* General Information */}
                        <div className="bg-white p-6">
                            {/* General title */}
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-lg font-bold">General Information</div>
                                    <div className="text-neutral-3">
                                        Provide the basic details of your new Test Plan.
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        className="flex min-w-24 cursor-pointer items-center justify-center border border-primary-1 px-4 py-1 font-bold text-primary-1"
                                        onClick={() => setOpenCloseFormPlan(!isGeneralInfo)}
                                    >
                                        {isGeneralInfo ? 'Collapse' : 'Expand'}
                                    </button>
                                </div>
                            </div>

                            <GeneralInformation
                                isGeneralInfo={isGeneralInfo}
                                register={register}
                                errors={errors}
                                Controller={Controller}
                                control={control}
                                startDate={startDate}
                            />
                        </div>

                        {/* Member List */}
                        <div className="z-10 mt-4 bg-white p-6">
                            <div className="z-10 flex justify-between gap-2">
                                <div>
                                    <div className="flex gap-3 text-lg font-semibold">
                                        <div>Member List</div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Manage team members involved in the Test Plan.
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        className="flex min-w-24 cursor-pointer items-center justify-center border border-primary-1 px-4 py-1 font-bold text-primary-1"
                                        onClick={() => setIsMembers(!isMembers)}
                                    >
                                        {isMembers ? 'Collapse' : 'Expand'}
                                    </button>
                                </div>
                            </div>

                            <CreateMember
                                isMembers={isMembers}
                                members={members}
                                setMembers={setMembers}
                                listMember={listMember}
                                setListMember={setListMember}
                            />
                        </div>

                        {/* Cancel / Submit */}
                        <div className="flex w-full items-center justify-center gap-3 pb-16 pt-6">
                            <button
                                type="button"
                                className="min-w-40 border border-neutral-3 px-3 py-2 text-center font-bold text-neutral-3"
                                onClick={() => navigate(`/test-plan`)}
                            >
                                Cancel
                            </button>

                            <Button
                                type="submit"
                                icon={
                                    isLoading ? (
                                        <Icon name="loading" className="h-5 w-5 animate-spin text-white" />
                                    ) : null
                                }
                                className="min-w-40 border border-primary-1 bg-primary-1 px-3 py-2 text-center font-bold text-white transition-all duration-150"
                            >
                                Create Test Plan
                            </Button>
                        </div>
                    </form>
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default createTestPlan;
