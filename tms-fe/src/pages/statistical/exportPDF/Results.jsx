import { formatDateTime } from 'components/common/Time';
import ReactQuill from 'react-quill';

// eslint-disable-next-line no-unused-vars
const Results = ({ relatedRunResults }) => {
    return (
        <div>
            {relatedRunResults && (
                <div className="">
                    <div className={` p-2  transition-opacity duration-1000 `}>
                        <div
                            className={`mb-4 mt-4 w-full border-x  border-b border-t-4 ${
                                relatedRunResults?.status === 1 ? 'border-t-[#2A9C58] bg-[#FAFFFB]' : ''
                            } ${relatedRunResults?.status === 2 ? 'border-t-[#FF6060] bg-[#FFFAFA]' : ''}  ${
                                relatedRunResults?.status === 4 ? 'border-t-[#BDBDBD] bg-[#F4F4F4]' : ''
                            }  ${relatedRunResults?.status === 3 ? 'border-t-[#F1AD00] bg-[#FFFBF1]' : ''}  ${
                                relatedRunResults?.status === 5 ? 'border-t-[#1D79ED] bg-[#F6F8FF]' : ''
                            }   `}
                        >
                            <div className={`flex justify-between px-4 py-3`}>
                                <div className="flex">
                                    <div className=" relatedRunResultss-center">
                                        <div className="ml-3 flex gap-2 ">
                                            <p className="text-sm font-medium text-[#121212]">
                                                {relatedRunResults?.creator?.fullName}
                                            </p>
                                            <p className="text-sm">{formatDateTime(relatedRunResults?.updatedAt)}</p>
                                        </div>
                                        <p className=" ml-3 text-sm text-[#787878]">
                                            A {relatedRunResults?.status === 1 && 'Passed'}{' '}
                                            {relatedRunResults?.status === 2 && 'Failed'}{' '}
                                            {relatedRunResults?.status === 3 && 'Retest'}{' '}
                                            {relatedRunResults?.status === 4 && 'Untested'}{' '}
                                            {relatedRunResults?.status === 5 && 'Skipped'} result was added.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {relatedRunResults?.status === 1 && (
                                        <p className={` bg-[#2A9C58] px-4 py-1  text-sm text-white`}>Passed</p>
                                    )}
                                    {relatedRunResults?.status === 2 && (
                                        <p className={` bg-[#FF6060] px-4 py-1 text-sm text-white`}>Failed</p>
                                    )}
                                    {relatedRunResults?.status === 3 && (
                                        <p className={` bg-[#F1AD00] px-4 py-1 text-sm  text-white`}>Retest</p>
                                    )}
                                    {relatedRunResults?.status === 4 && (
                                        <p className={` bg-[#BDBDBD] px-4 py-1 text-sm text-white`}>Untested</p>
                                    )}
                                    {relatedRunResults?.status === 5 && (
                                        <p className={` bg-[#1D79ED] px-4 py-1 text-sm text-white`}>Skipped</p>
                                    )}
                                </div>
                            </div>
                            <div className={`p-2 transition-all duration-1000 `}>
                                <div className="m-auto w-full">
                                    <div className="border  ">
                                        <p className="border-b py-1.5 pl-4 text-sm font-semibold text-[#121212]">
                                            Assign To
                                        </p>
                                        <div className="relatedRunResultss-center flex p-4">
                                            {relatedRunResults?.assignUsers.map((assignUser, i) => (
                                                <div className="" key={i}>
                                                    <p className="text-sm font-semibold">{assignUser.fullName}</p>
                                                    <p className="text-sm text-[#787878]">@{assignUser.userName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-2 border ">
                                        <p className="border-b py-1.5 pl-4 text-sm font-semibold text-[#121212]">
                                            Execution Detail
                                        </p>
                                        <div className="py-2 pl-4 pr-3">
                                            <ReactQuill
                                                theme="snow"
                                                id="objective"
                                                className="react-quill-hidden-calendar relativ max-h-full"
                                                value={relatedRunResults?.content}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
