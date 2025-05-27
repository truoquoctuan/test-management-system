import AttachFile from 'components/AttachFile/AttachFile';
import { toDateStringHMS } from 'components/common/Time';
import Button from 'components/design-system/Button';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import formatDate from 'utils/formatDate';
import Header from './Header';
const GeneralInformation = (props) => {
    const { testPlanData } = props;

    const { testPlanId } = useParams();
    const navigate = useNavigate();
    let callBack = false;

    const { checkStatus, checkRoleTestPland, roleUser } = useGlobalContext();
    const quillRef = useRef(null);
    return (
        <div className="mt-4 w-full bg-white p-6">
            <div className="flex justify-between">
                <Header header={'General Information'} sub={'View the core information of the selected Test Plan.'} />

                {(checkRoleTestPland === 1 || roleUser === 'ROLE_ADMIN' || roleUser === 'ROLE_SUPER_ADMIN') &&
                    checkStatus === 1 && (
                        <div>
                            <Button
                                icon={<Icon name="edit" className="h-5 w-5 fill-white" />}
                                className="min-w-24 bg-primary-1 px-3 py-2 font-bold text-white"
                                onClick={() => navigate(`/test-plan/plan-information/${testPlanId}/update/info`)}
                            >
                                Edit
                            </Button>
                        </div>
                    )}
            </div>

            <div className={`grid text-[15px] transition-all duration-500`}>
                <div className="flex flex-col gap-y-4 overflow-hidden">
                    <div className="mt-4 border-b border-b-neutral-5"></div>

                    <div className="mb-3 flex gap-3">
                        <div>
                            <AttachFile
                                attachType="TestPlanAvatar"
                                entity="TestPlan"
                                seq={testPlanData?.testPlanId}
                                register={null}
                                viewMode={false}
                                callBack={!callBack}
                                defaultImage={testPlanData?.testPlanName}
                                mode="member"
                                className="h-[96px] w-[96px] bg-[#ececef] object-cover text-4xl"
                            />
                        </div>
                        <div className="mt-8 ">
                            <p className="text-lg font-bold text-primary-1">{testPlanData?.testPlanName}</p>
                        </div>
                    </div>

                    {testPlanData?.description ? (
                        <div className="">
                            <div className=" font-semibold">Description</div>
                            <div className="custom-scroll-y max-h-[150px] border-spacing-x-0.5  py-1.5">
                                <ReactQuill
                                    theme="snow"
                                    id="objective"
                                    className={` react-quill-hidden-calendar `}
                                    value={testPlanData?.description}
                                    readOnly={true}
                                    ref={quillRef}
                                />
                            </div>
                        </div>
                    ) : null}

                    <table className="-mt-4 w-full">
                        <thead>
                            <tr className={``}>
                                <th className=" py-1.5 text-start font-semibold">Creator</th>
                            </tr>
                            <tr className="">
                                <td className="py-1.5">
                                    <div className="flex items-center gap-x-2">
                                        <AttachFile
                                            attachType="UserAvatar"
                                            entity="user"
                                            seq={testPlanData?.userInfo?.userID}
                                            className="h-10 w-10 rounded-full object-cover"
                                            keyProp={testPlanData?.userInfo?.userID}
                                        />
                                        <div className="w-[calc(100%-32px)] break-all">
                                            <div>{testPlanData?.userInfo?.fullName}</div>
                                            <div className="font-normal text-neutral-3">
                                                <span>@</span>
                                                <span>{testPlanData?.userInfo?.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr className={``}>
                                <th className=" py-1.5 text-start font-semibold">Status</th>
                            </tr>
                            <tr>
                                <td className=" py-1">
                                    <div>
                                        {+testPlanData?.status === 1 ? (
                                            <div className="inline-block min-w-20 bg-primary-2 px-4 py-1 font-medium text-state-information">
                                                Active
                                            </div>
                                        ) : null}

                                        {+testPlanData?.status === 0 ? (
                                            <div className="inline-block min-w-20 bg-[#FFEDED] px-4 py-1 font-medium text-state-error">
                                                Archived
                                            </div>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>

                            <tr className={``}>
                                <th className="w-1/2  py-1.5 text-start font-semibold">Start date</th>

                                <th className="w-1/2  py-1.5 text-start font-semibold">End date</th>
                            </tr>

                            <tr className="">
                                <td className="py-1.5">
                                    <div className="font-normal text-[#484848]">
                                        {formatDate('dd/mm/yyyy', testPlanData?.startDate)}
                                    </div>
                                </td>

                                <td className="py-1.5">
                                    <div className="font-normal text-[#484848]">
                                        {formatDate('dd/mm/yyyy', testPlanData?.endDate)}
                                    </div>
                                </td>
                            </tr>

                            <tr className={``}>
                                <th className="w-1/2 py-1.5 text-start font-semibold">Created at</th>

                                <th className="4 w-1/2 py-1.5 text-start font-semibold">Updated at</th>
                            </tr>

                            <tr className="">
                                <td className="py-1.5">
                                    <div className="font-normal text-[#484848]">
                                        {formatDate('dd/mm/yyyy', testPlanData?.createdAt)}
                                    </div>
                                </td>

                                <td className="py-1.5">
                                    <div className="font-normal text-[#484848]">
                                        {toDateStringHMS(testPlanData?.updatedAt)}{' '}
                                        {formatDate('dd/mm/yyyy', testPlanData?.updatedAt)}
                                    </div>
                                </td>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GeneralInformation;
