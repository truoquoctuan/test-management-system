import { useMutation } from '@apollo/client';
import { UPDATE_TEST_PLAN_PIN } from 'apis/apollo/test-plan/mutation';
import AttachFile from 'components/AttachFile/AttachFile';
import { toDateStringHMS } from 'components/common/Time';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import formatDate from 'utils/formatDate';

const ListView = (props) => {
    const { testPlans, testPlansId, setTestPlansId, setArchiveConfirm, refetch, allChecked, setAllChecked } = props;
    const { userInfo, roleUser } = useGlobalContext();

    const navigate = useNavigate();
    const [updateTestPlanPin] = useMutation(UPDATE_TEST_PLAN_PIN);

    // testPlan.createdBy === String(userInfo.userID)

    const handleCheckedAll = (event) => {
        if (event.target.checked) {
            const updatedTestPlansId = testPlans
                ?.filter((item) =>
                    roleUser === 'ROLE_ADMIN' || roleUser === 'ROLE_SUPER_ADMIN'
                        ? item.createdBy
                        : item.createdBy === String(userInfo.userID)
                )
                .map((plan) => ({
                    testPlanId: plan?.testPlanId,
                    status: +plan?.status === 1 ? 0 : 1
                }));
            setAllChecked(true);
            setTestPlansId(updatedTestPlansId);
        } else {
            setAllChecked(false);
            setTestPlansId([]);
        }
    };

    const handleChecked = ({ event, testPlanId, status }) => {
        if (event?.target?.checked) {
            setTestPlansId((prev) => [...prev, { testPlanId, status }]);
        } else {
            setTestPlansId((prev) => prev.filter((item) => item.testPlanId !== testPlanId));
        }
    };

    const handleAct = ({ testPlanId, status }) => {
        setTestPlansId([{ testPlanId: +testPlanId, status: status === 1 ? 0 : 1 }]);
        setArchiveConfirm({ isOpen: true, animate: 'animate__fadeInDown__2' });
    };

    const handlePin = async ({ testPlanId, isPin }) => {
        try {
            await updateTestPlanPin({
                variables: {
                    userId: userInfo?.userID,
                    testPlanId: +testPlanId,
                    isPin: !isPin
                }
            });
            await refetch();
            if (isPin) {
                toast.success('Unpinned successfully');
            } else {
                toast.success('Pin successful');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="animate__animated animate__fadeIn h-full min-h-[calc(100vh-333px)] w-full text-neutral-1">
            <table className="w-full">
                <thead>
                    <tr className="[&>th]:bg-neutral-7 [&>th]:px-4 [&>th]:py-3 [&>th]:text-start [&>th]:font-medium">
                        <th className="w-16">
                            <div className="flex w-full justify-end">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    className="h-4 w-4"
                                    onChange={handleCheckedAll}
                                />
                            </div>
                        </th>

                        <th>Name</th>
                        <th>Creator</th>
                        <th>Created at</th>
                        <th>Update at</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {testPlans?.map((testPlan, index) => {
                        return (
                            <tr
                                key={index}
                                className="group cursor-pointer border-b-[0.5px] border-b-neutral-5 transition-all duration-300 hover:bg-[#F4F4F4] [&>td]:px-4 [&>td]:py-2 [&>td]:text-start [&>td]:font-medium"
                            >
                                <td className="w-16">
                                    <div className="flex w-full justify-end">
                                        {testPlan.createdBy === String(userInfo.userID) ||
                                        roleUser === 'ROLE_ADMIN' ||
                                        roleUser === 'ROLE_SUPER_ADMIN' ? (
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={testPlansId?.some(
                                                    (plan) => plan?.testPlanId === testPlan?.testPlanId
                                                )}
                                                onChange={(event) =>
                                                    handleChecked({
                                                        event: event,
                                                        testPlanId: testPlan?.testPlanId,
                                                        status: +testPlan?.status === 1 ? 0 : 1
                                                    })
                                                }
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </td>

                                <td
                                    className="min-w-24 max-w-96"
                                    onClick={() => navigate(`/test-plan/plan-information/${testPlan?.testPlanId}`)}
                                >
                                    <div className="flex items-center gap-x-2">
                                        <AttachFile
                                            attachType="TestPlanAvatar"
                                            entity="TestPlan"
                                            seq={testPlan?.testPlanId}
                                            register={null}
                                            viewMode={false}
                                            defaultImage={testPlan?.testPlanName}
                                            mode="member"
                                            className="h-10 w-10  border bg-[#ececef]"
                                        />
                                        <div className="w-[calc(100%-32px)] break-all text-sm text-[#0066CC]">
                                            {testPlan?.testPlanName}
                                        </div>
                                    </div>
                                </td>

                                <td
                                    className="min-w-24 max-w-72"
                                    onClick={() => navigate(`/test-plan/plan-information/${testPlan?.testPlanId}`)}
                                >
                                    <div className="flex items-center gap-x-2">
                                        <AttachFile
                                            attachType="UserAvatar"
                                            entity="user"
                                            seq={testPlan?.createdBy}
                                            className="h-10 w-10 rounded-full object-cover"
                                            keyProp={testPlan?.createdBy}
                                        />
                                        <div className="w-[calc(100%-32px)] break-all">
                                            <div className="text-sm">{testPlan?.userInfo?.fullName}</div>
                                            <div className="font-normal text-neutral-3">
                                                <span className="text-sm">@</span>
                                                <span className="text-sm">{testPlan?.userInfo?.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td
                                    className="min-w-40 text-sm font-normal text-[#121212]"
                                    onClick={() => navigate(`/test-plan/plan-information/${testPlan?.testPlanId}`)}
                                >
                                    <div className="font-normal">{formatDate('dd-mm-yyyy', testPlan?.createdAt)}</div>
                                </td>
                                <td
                                    className="min-w-40 text-sm font-normal text-[#121212]"
                                    onClick={() => navigate(`/test-plan/plan-information/${testPlan?.testPlanId}`)}
                                >
                                    <div className="font-normal">
                                        {toDateStringHMS(testPlan?.updatedAt)}{' '}
                                        {formatDate('dd/mm/yyyy', testPlan?.updatedAt)}
                                    </div>
                                </td>

                                <td className="w-16">
                                    <Icon
                                        name="push_pin"
                                        className={` h-5 w-5 fill-neutral-4 transition-all duration-150 hover:cursor-pointer hover:fill-primary-1 group-hover:block ${
                                            testPlan?.isPin ? 'fill-primary-1' : 'hidden'
                                        }`}
                                        onClick={() =>
                                            handlePin({ testPlanId: testPlan?.testPlanId, isPin: testPlan?.isPin })
                                        }
                                    />
                                </td>
                                {testPlan.createdBy === String(userInfo.userID) ||
                                roleUser === 'ROLE_ADMIN' ||
                                roleUser === 'ROLE_SUPER_ADMIN' ? (
                                    <td className="relative w-16">
                                        <div className="group/item">
                                            <Icon
                                                name="more_2"
                                                className="hidden h-5 w-5 fill-neutral-4 transition-all duration-150 hover:cursor-pointer hover:fill-primary-1 group-hover:block"
                                            />

                                            <>
                                                {+testPlan?.status === 1 && (
                                                    <div
                                                        className="absolute right-12 top-3 z-20 hidden min-w-32 cursor-pointer bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:bg-state-error hover:text-white group-hover/item:block"
                                                        onClick={() =>
                                                            handleAct({
                                                                testPlanId: testPlan?.testPlanId,
                                                                status: testPlan?.status
                                                            })
                                                        }
                                                    >
                                                        Archive
                                                    </div>
                                                )}
                                            </>

                                            <>
                                                {+testPlan?.status === 0 && (
                                                    <div
                                                        className="absolute right-12 top-3 z-20 hidden min-w-32 cursor-pointer bg-white px-4 py-3 shadow-lg hover:bg-primary-1 hover:text-white group-hover/item:block"
                                                        onClick={() =>
                                                            handleAct({
                                                                testPlanId: testPlan?.testPlanId,
                                                                status: testPlan?.status
                                                            })
                                                        }
                                                    >
                                                        Restore
                                                    </div>
                                                )}
                                            </>
                                        </div>
                                    </td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ListView;
