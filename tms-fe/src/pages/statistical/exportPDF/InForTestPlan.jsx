import ReactQuill from 'react-quill';
import formatDate from 'utils/formatDate';

const InForTestPlan = (props) => {
    const { testPlanData } = props;

    return (
        <div className=" mt-4 bg-white">
            <div className={` grid  `}>
                <div className=" overflow-hidden">
                    <div className="border-x border-t">
                        <div className=" bg-neutral-7 px-4 py-2 text-base font-semibold">Name</div>
                        <div className="custom-scroll-y  max-h-[150px] border-spacing-x-0.5 px-2  pb-3 pt-3">
                            <p className="text-lg font-bold text-primary-1">{testPlanData?.testPlanName}</p>
                        </div>
                    </div>
                    {testPlanData?.description ? (
                        <div className="border-spacing-x-0.5 border text-base">
                            <div className="border-b border-b-neutral-5 bg-neutral-7 px-4 py-2 font-semibold">
                                Description
                            </div>
                            <div className="custom-scroll-y  max-h-[150px] border-spacing-x-0.5 px-2  pb-6 pt-3">
                                <ReactQuill
                                    theme="snow"
                                    id="objective"
                                    className={` react-quill-hidden-calendar `}
                                    value={testPlanData?.description}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    ) : null}

                    <table className="-mt-4 w-full">
                        <thead>
                            <tr
                                className={`border border-neutral-5 bg-neutral-7 text-base ${
                                    testPlanData?.description ? 'border-t-0' : ''
                                }`}
                            >
                                <th className="w-1/2 border-r border-neutral-5 px-4 py-2 text-start font-semibold">
                                    Creator
                                </th>

                                <th className="w-1/2 px-4 py-2 text-start font-semibold">Status</th>
                            </tr>

                            <tr className="border border-neutral-5">
                                <td className="border-r px-4 py-2">
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-[calc(100%-32px)] break-all text-base">
                                            <div>{testPlanData?.userInfo?.fullName}</div>
                                            <div className="font-normal text-neutral-3">
                                                <span>@</span>
                                                <span>{testPlanData?.userInfo?.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-2 text-base">
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

                            <tr className={`border border-neutral-5 bg-neutral-7 text-base`}>
                                <th className="w-1/2 border-r border-neutral-5 px-4 py-2 text-start font-semibold">
                                    Start date
                                </th>

                                <th className="w-1/2 px-4 py-2 text-start text-base font-semibold">End date</th>
                            </tr>

                            <tr className="border border-neutral-5 text-base">
                                <td className="border-r px-4 py-2">
                                    <div className="font-normal text-neutral-3">
                                        {formatDate('dd/mm/yyyy', testPlanData?.startDate)}
                                    </div>
                                </td>

                                <td className="px-4 py-2">
                                    <div className="font-normal text-neutral-3">
                                        {formatDate('dd/mm/yyyy', testPlanData?.endDate)}
                                    </div>
                                </td>
                            </tr>

                            <tr className={`border border-neutral-5 bg-neutral-7 text-base`}>
                                <th className="w-1/2 border-r border-neutral-5 px-4 py-2 text-start font-semibold">
                                    Created at
                                </th>

                                <th className="w-1/2 px-4 py-2 text-start font-semibold">Updated at</th>
                            </tr>

                            <tr className="border border-neutral-5 text-base">
                                <td className="border-r px-4 py-2">
                                    <div className="font-normal text-neutral-3">
                                        {formatDate('dd-mm-yyyy', testPlanData?.createdAt)}
                                    </div>
                                </td>

                                <td className="px-4 py-2">
                                    <div className="font-normal text-neutral-3">
                                        {formatDate('hh:mm:ss', testPlanData?.updatedAt)}{' '}
                                        {formatDate('dd-mm-yyyy', testPlanData?.updatedAt)}
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

export default InForTestPlan;
