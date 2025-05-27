import { useMutation, useQuery } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { GET_CAUSE_AND_SOLUTION, SAVE_CAUSE_SOLUTION } from 'apis/run-result/test-case';
import UploadImage from 'components/AttachFile/UploadImage';
import Empty from 'components/common/Empty';
import { modulesImage } from 'components/common/FormatQuill';
import Icon from 'components/icons/icons';
import ImageResize from 'quill-image-resize-module-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import { toast } from 'sonner';
import CommentSystem from './comment/CommentSystem';
Quill.register('modules/imageResize', ImageResize);
const Response = ({ issuesId }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const quillRef = useRef(null);
    const quillRef1 = useRef(null);

    const insertToEditor = (fileSeq) => {
        const range = quillRef.current.getEditor().getSelection(true) || 1;
        // eslint-disable-next-line no-undef
        const imageUrl = `${process.env.REACT_APP_SERVICE_IMAGE}/${fileSeq?.fileSeq}`;
        const quillEditor = quillRef.current.getEditor();
        quillEditor.insertEmbed(range.index, 'image', `${imageUrl}`);
        quillEditor.format('align', 'center', Quill.sources.USER);
        quillEditor.setSelection(range.index + 1, Quill.sources.SILENT);
    };
    const insertToEditor1 = (fileSeq) => {
        const range = quillRef1.current.getEditor().getSelection(true) || 1;
        // eslint-disable-next-line no-undef
        const imageUrl = `${process.env.REACT_APP_SERVICE_IMAGE}/${fileSeq?.fileSeq}`;
        const quillEditor = quillRef1.current.getEditor();
        quillEditor.insertEmbed(range.index, 'image', `${imageUrl}`);
        quillEditor.format('align', 'center', Quill.sources.USER);
        quillEditor.setSelection(range.index + 1, Quill.sources.SILENT);
    };

    const [isOpenEdit, setOpenEdit] = useState(false);

    const { data: getCauseAndSolution, refetch } = useQuery(GET_CAUSE_AND_SOLUTION, {
        client: clientRun,
        variables: { issuesId: issuesId },
        skip: issuesId ? false : true
    });

    useEffect(() => {
        if (getCauseAndSolution) {
            reset(getCauseAndSolution?.getCauseAndSolution);
        }
    }, [getCauseAndSolution]);

    // eslint-disable-next-line no-unused-vars
    const [saveCauseSolution] = useMutation(SAVE_CAUSE_SOLUTION, { client: clientRun });
    const onSubmit = async (data) => {
        try {
            await saveCauseSolution({ variables: { cause: data.cause, issuesId: issuesId, solution: data.solution } });
            toast.success('Create a successful solution cause.');
            await refetch();
            setOpenEdit(false);
        } catch (error) {
            toast.error('Error');
        }
    };
    const [openSections, setOpenSections] = useState({
        Cause: true,
        Solution: true
    });
    const handleToggle = (section) => {
        setOpenSections((prevSections) => ({
            ...prevSections,
            [section]: !prevSections[section]
        }));
    };

    return (
        <div className=" mb-4   w-full  bg-white px-3">
            <div className="flex justify-between border-t pt-4">
                <div className="mb-4  flex items-center gap-2">
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#EDF3FF]">
                        <Icon name="security_scan" />
                    </div>
                    <h1 className=" text-xl font-bold">Cause & Solution</h1>
                </div>
                {getCauseAndSolution?.getCauseAndSolution.cause !== null &&
                    getCauseAndSolution?.getCauseAndSolution.solution !== null && (
                        <div
                            onClick={() => {
                                setOpenEdit(!isOpenEdit);
                            }}
                            className="cursor-pointer text-sm font-normal text-[#787878]"
                        >
                            Edit
                        </div>
                    )}
            </div>
            {getCauseAndSolution?.getCauseAndSolution.cause == null &&
                getCauseAndSolution?.getCauseAndSolution.solution == null &&
                isOpenEdit === false && (
                    <div>
                        <Empty notFoundMessage="Cause & Solution information not yet provided!" />
                        <div
                            className="m-auto mt-2 flex w-[250px] cursor-pointer justify-center gap-3 border border-primary-1 py-1"
                            onClick={() => {
                                setOpenEdit(!isOpenEdit);
                            }}
                        >
                            <Icon name="plus_circle" className="fill-primary-1" />
                            <p className="text-sm text-primary-1">Add Cause & Solution</p>
                        </div>
                    </div>
                )}

            {isOpenEdit ? (
                <div className="border border-[#DEDEDE] px-4 py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative">
                            <p className="mb-2 text-sm font-semibold">
                                Cause <span className="text-red-500">*</span>
                            </p>
                            <Controller
                                name="cause"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'The Expected field is required.',
                                    maxLength: { value: 10000, message: 'Maximum 10000 characters.' },
                                    validate: (value) => {
                                        const cleanedValue = value.replace(/<\/?[^>]+(>|$)/g, '').trim();
                                        const isEmpty = cleanedValue === '';
                                        return !isEmpty || 'The Expected field is required.';
                                    }
                                }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <div className="absolute -top-1 left-2.5 z-[99] cursor-pointer">
                                            <UploadImage insertToEditor={insertToEditor1} />
                                        </div>

                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            className="react-quill react-quill-testplan relative w-full text-[#000000]  placeholder:text-sm"
                                            modules={modulesImage}
                                            ref={quillRef1}
                                            placeholder="Enter a brief description of the cause"
                                        />
                                    </div>
                                )}
                            />
                            <p className="absolute -bottom-6 text-[13px] font-normal text-[#787878]">
                                Provide execution details for this cause.{' '}
                            </p>
                            {errors.cause && (
                                <p className="absolute -bottom-11 flex gap-1 text-[13px] font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.cause.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Phần tương tự cho Solution */}
                        <div className="relative mt-10">
                            <p className="mb-2 text-sm font-semibold">
                                Solution <span className="text-red-500">*</span>
                            </p>
                            <Controller
                                name="solution"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'The Expected field is required.',
                                    maxLength: { value: 10000, message: 'Maximum 10000 characters.' },
                                    validate: (value) => {
                                        const cleanedValue = value.replace(/<\/?[^>]+(>|$)/g, '').trim();
                                        const isEmpty = cleanedValue === '';
                                        return !isEmpty || 'The Expected field is required.';
                                    }
                                }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <div className="absolute -top-1 left-2.5 z-[99] cursor-pointer">
                                            <UploadImage insertToEditor={insertToEditor} />
                                        </div>

                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            className="react-quill react-quill-testplan relative w-full text-[#000000] placeholder:text-sm"
                                            modules={modulesImage}
                                            ref={quillRef}
                                            placeholder="Enter a brief description of the solution"
                                        />
                                    </div>
                                )}
                            />
                            <p className="absolute -bottom-6 text-[13px] font-normal text-[#787878]">
                                Provide execution details for this solution.
                            </p>
                            {errors.solution && (
                                <p className="absolute -bottom-11 flex gap-1 text-[13px] font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.solution.message}</span>
                                </p>
                            )}
                        </div>

                        <div className="mt-10 flex justify-center gap-2">
                            <div
                                className="w-[120px] cursor-pointer border border-[#787878] py-1.5 text-center text-sm text-black"
                                onClick={() => {
                                    setOpenEdit(false);
                                }}
                            >
                                Cancel
                            </div>
                            <button className="w-[120px] bg-primary-1 py-1.5 text-sm text-white">Save</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    {getCauseAndSolution?.getCauseAndSolution.cause !== null &&
                        getCauseAndSolution?.getCauseAndSolution.solution !== null && (
                            <>
                                {/* Cause */}
                                <div className="mt-4">
                                    <div
                                        className="flex cursor-pointer justify-between border px-2 py-1.5"
                                        onClick={() => handleToggle('Cause')}
                                    >
                                        <p className="  text-[14px] font-semibold">Cause</p>

                                        {openSections.Cause ? <Icon name="caretDown" /> : <Icon name="caretRight" />}
                                    </div>
                                    <div
                                        className={`border-x border-b bg-[#FBFAFD] p-2 ${
                                            openSections.Cause ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            id="objective"
                                            className="react-quill-hidden-calendar text-[#000000]"
                                            value={getCauseAndSolution?.getCauseAndSolution.cause}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>

                                {/* Solution */}
                                <div className="mt-4">
                                    <div
                                        className="flex cursor-pointer justify-between border px-2 py-1.5"
                                        onClick={() => handleToggle('Solution')}
                                    >
                                        <p className="text-[14px] font-semibold">Solution</p>

                                        {openSections.Solution ? <Icon name="caretDown" /> : <Icon name="caretRight" />}
                                    </div>
                                    <div
                                        className={`border-x border-b bg-[#FBFAFD] p-2 ${
                                            openSections.Solution ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            id="objective"
                                            className="react-quill-hidden-calendar text-[#000000]"
                                            value={getCauseAndSolution?.getCauseAndSolution.solution}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                </div>
            )}
            {/* Comment */}

            <div className=" mt-6 border-t">
                <CommentSystem issuesId={issuesId} />
            </div>
        </div>
    );
};

export default Response;
