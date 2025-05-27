import { toDateStrings, toDateTimeString } from 'components/common/ConvertTime';
import Icon from 'components/icons/icons';
import ReactQuill from 'react-quill';

// eslint-disable-next-line no-unused-vars
const Deatail = ({ testcase }) => {
    return (
        <div>
            <div className=" bg-primary-1 px-4 py-1 text-white">
                <p className="text-xl font-bold">{testcase?.testCaseName}</p>
                <p className="pl-1 text-base">ID: {testcase?.testCaseId}</p>
            </div>
            <div className="mt-2 flex justify-between gap-3 p-2">
                <p className="mb-3 w-full border-b"></p>
                <p className="text-lg font-semibold text-[#B3B3B3]">Detail</p>
                <p className="mb-3 w-full border-b"></p>
            </div>
            <div className=" p-2 ">
                {/* Expected */}
                <div className="mt-2 border">
                    <p className="bg-[#F4F4F4] px-2 py-2 text-[15px]  font-semibold">Expected</p>
                    {testcase?.expectResult ? (
                        <div className="  p-2">
                            <ReactQuill
                                theme="snow"
                                id="objective"
                                className="react-quill-hidden-calendar text-[#484848] "
                                value={testcase?.expectResult}
                                readOnly={true}
                            />
                        </div>
                    ) : (
                        <div className="max-h-[150px] bg-[#F4F4F4] p-2 text-sm text-[#787878]">
                            No expected available
                        </div>
                    )}
                </div>
                {/* Description */}
                <div className=" border-x border-b">
                    <p className="bg-[#F4F4F4] px-2 py-2 text-[15px]  font-semibold">Description</p>
                    {testcase?.description ? (
                        <div className="  p-2">
                            <ReactQuill
                                theme="snow"
                                id="objective"
                                className="react-quill-hidden-calendar react-quill-hidden text-[#484848]"
                                value={testcase?.description}
                                readOnly={true}
                            />
                        </div>
                    ) : (
                        <div className="max-h-[150px]  p-2 text-sm text-[#787878]">No description available</div>
                    )}
                </div>
                <div className="flex justify-between border-x border-b">
                    {/* Priority */}
                    <div className=" w-1/2 border-r">
                        <p className="bg-[#F4F4F4] px-2 py-2 text-[15px]  font-semibold">Priority</p>
                        {testcase?.priority === 1 && (
                            <p className="mx-2 mt-2.5 w-[80px] bg-[#F0F0F0] py-1.5 text-center text-sm font-medium text-[#787878]">
                                Low
                            </p>
                        )}
                        {testcase?.priority === 2 && (
                            <p className="mx-2 mt-2.5 w-[80px] bg-[#FFF6D7] py-1.5 text-center text-sm font-medium text-[#F1AD00]">
                                Medium
                            </p>
                        )}
                        {testcase?.priority === 3 && (
                            <p className="mx-2 mt-2.5 w-[80px] bg-[#FFDEDE] py-1.5 text-center text-sm font-medium text-[#B41B1B]">
                                High
                            </p>
                        )}
                    </div>
                    <div className=" w-1/2">
                        <p className=" bg-[#F4F4F4] px-2 py-2  text-[15px] font-semibold">Creator</p>
                        <div className=" flex gap-2  px-2 py-2">
                            <div>
                                <p className="text-sm font-medium">{testcase?.users?.fullName}</p>
                                <p className="text-sm text-[#787878]">@{testcase?.users?.userName}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-2 flex border-x border-b ">
                    {/* Tags */}
                    <div className=" w-1/2 border-r ">
                        <p className="bg-[#F4F4F4] px-2 py-2  text-[15px] font-semibold">Tags</p>
                        <div className={`flex flex-wrap gap-2  `}>
                            {testcase?.labelsInfo?.map((item, index) => (
                                <div
                                    className="mt-1 flex gap-2 px-2 py-1 text-center text-sm"
                                    key={index}
                                    style={{ backgroundColor: item.labelColor }}
                                >
                                    <Icon name="tag" className="mt-1" />
                                    <p>{item?.labelName}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Last Modified */}
                    <div className={` flex w-1/2`}>
                        <div className="w-[50%]">
                            <p className=" bg-[#F4F4F4] px-2 py-2  text-[15px] font-semibold">Created at</p>
                            <div className="flex gap-2  py-2 pl-2">
                                <p className="text-sm text-[#787878]">{toDateStrings(testcase?.createdAt)}</p>
                            </div>
                        </div>
                        {/* Updated at */}
                        <div className=" w-[50%]">
                            <p className="border-l bg-[#F4F4F4] px-2 py-2  text-[15px] font-semibold">Updated at</p>
                            <div className="flex gap-2 border-l py-2 pl-2">
                                <p className="text-sm text-[#787878]">{toDateTimeString(testcase?.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deatail;
