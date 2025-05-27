import { useMutation } from '@apollo/client';
import { UPDATE_TEST_PLAN_PIN } from 'apis/apollo/test-plan/mutation';
import AttachFile from 'components/AttachFile/AttachFile';
import { toDateStringHMS } from 'components/common/Time';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import formatDate from 'utils/formatDate';

const GridView = (props) => {
    const { userInfo, roleUser } = useGlobalContext();
    const { testPlans, testPlansId, setTestPlansId, refetch } = props;
    const [updateTestPlanPin] = useMutation(UPDATE_TEST_PLAN_PIN);
    const navigate = useNavigate();

    const handleChecked = ({ event, testPlanId, status }) => {
        if (event?.target?.checked) {
            setTestPlansId((prev) => [...prev, { testPlanId, status }]);
        } else {
            setTestPlansId((prev) => prev.filter((item) => item.testPlanId !== testPlanId));
        }
    };

    const handlePin = async ({ testPlanId, isPin }) => {
        try {
            await updateTestPlanPin({
                variables: {
                    testPlanId: +testPlanId,
                    isPin: !isPin,
                    userId: String(userInfo.userID)
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
        <div className="animate__animated animate__fadeIn min-h-[calc(100vh-333px)]">
            <div className="grid grid-cols-3 gap-5">
                {testPlans?.map((testPlan, index) => (
                    <div
                        key={index}
                        className={`px-6 py-4  shadow-[0px_2px_16px_0px_rgba(21,37,63,0.08)] ${
                            testPlan?.isPin ? 'border border-[#0066cc]' : ''
                        }`}
                        onClick={() => navigate(`/test-plan/plan-information/${testPlan?.testPlanId}`)}
                    >
                        <div className="flex items-center justify-between gap-x-6">
                            <div className="flex items-center gap-x-2">
                                {testPlan.createdBy === String(userInfo.userID) ||
                                roleUser === 'ROLE_ADMIN' ||
                                roleUser === 'ROLE_SUPER_ADMIN' ? (
                                    <div className="h-8 w-8 p-1.5" onClick={(event) => event.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={testPlansId?.some(
                                                (plan) => plan?.testPlanId === testPlan?.testPlanId
                                            )}
                                            className="h-full w-full"
                                            onChange={(event) => {
                                                handleChecked({
                                                    event: event,
                                                    testPlanId: testPlan?.testPlanId,
                                                    status: +testPlan?.status === 1 ? 0 : 1
                                                });
                                            }}
                                        />
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className="flex items-center gap-x-2">
                                    <AttachFile
                                        attachType="TestPlanAvatar"
                                        entity="TestPlan"
                                        seq={testPlan?.testPlanId}
                                        register={null}
                                        viewMode={false}
                                        defaultImage={testPlan?.testPlanName}
                                        mode="member"
                                        className="h-10 w-10  border bg-[#ececef] object-cover"
                                    />

                                    <div className="break-all text-base font-medium text-primary-1">
                                        {testPlan?.testPlanName}
                                    </div>
                                </div>
                            </div>
                            <Icon
                                name="push_pin"
                                className={`h-5 w-5 transition-all duration-150 hover:cursor-pointer hover:fill-primary-1 group-hover:block ${
                                    testPlan?.isPin ? 'fill-primary-1' : 'fill-neutral-4'
                                }`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handlePin({ testPlanId: testPlan?.testPlanId, isPin: testPlan?.isPin });
                                }}
                            />
                        </div>

                        <div className="my-4 w-full border-b border-b-neutral-5"></div>

                        <table>
                            <tbody>
                                <tr>
                                    <th className="flex w-24">
                                        <div className="flex items-start whitespace-nowrap text-start text-sm font-medium text-[#787878]">
                                            Creator
                                        </div>
                                    </th>

                                    <td className="w-full">
                                        <div className="flex items-start justify-end gap-x-2">
                                            <AttachFile
                                                attachType="UserAvatar"
                                                entity="user"
                                                seq={testPlan?.createdBy}
                                                className="h-8 w-8 rounded-full object-cover"
                                                keyProp={testPlan?.createdBy}
                                            />
                                            <div className="whitespace-break-spaces break-all pt-1 text-sm font-medium text-black ">
                                                <p> {testPlan?.userInfo?.fullName}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="pt-2">
                                    <th className="flex w-24">
                                        <div className="whitespace-nowrap pt-3  text-sm font-medium text-[#787878]">
                                            Created at
                                        </div>
                                    </th>

                                    <td className="w-full">
                                        <div className="flex items-center justify-end gap-x-2 pt-3">
                                            <div className="text-sm font-normal text-black">
                                                {formatDate('dd-mm-yyyy', testPlan?.createdAt)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="pt-3">
                                    <th className="flex w-24">
                                        <div className="whitespace-nowrap pt-3 text-sm font-medium text-[#787878]">
                                            Updated at
                                        </div>
                                    </th>

                                    <td className="w-full">
                                        <div className="flex items-center justify-end gap-x-2 pt-3">
                                            <div className="text-sm font-normal text-black">
                                                {toDateStringHMS(testPlan?.updatedAt)}{' '}
                                                {formatDate('dd-mm-yyyy', testPlan?.updatedAt)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridView;
