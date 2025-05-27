import { useMutation } from '@apollo/client';
import { clientRun } from 'apis/apollo/apolloClient';
import { MODIFY_ISSUE } from 'apis/issues/issues';
import AttachFile from 'components/AttachFile/AttachFile';
import UploadImage from 'components/AttachFile/UploadImage';
import { modulesImage } from 'components/common/FormatQuill';
import Button from 'components/design-system/Button';
import Icon from 'components/icons/icons';
import ImageResize from 'quill-image-resize-module-react';
import { useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
Quill.register('modules/imageResize', ImageResize);
const UpdateIssuse = ({ dataIssueById, setIsOpenEdit, refetch }) => {
    const [updateIssue] = useMutation(MODIFY_ISSUE, { client: clientRun });
    const [fileSeq, setFileSeq] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const { testPlanId, id } = useParams();
    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        reset(dataIssueById);
    }, [dataIssueById]);
    const SubmitForm = async (data) => {
        const newdata = {
            description: data?.description,
            issuesId: id,
            issuesName: data?.issuesName,
            note: data?.note,
            scope: data?.scope,
            status: data.status,
            uploadKey: data.uploadKey
        };
        try {
            await updateIssue({ variables: newdata });
            toast.success('Issue updated successfully');
            setIsOpenEdit(false);
            refetch();
        } catch (error) {
            toast.error('An error occurred.');
        }
    };
    const quillRef = useRef(null);

    const insertToEditor = (fileSeq) => {
        const range = quillRef.current.getEditor().getSelection(true) || 1;
        // eslint-disable-next-line no-undef
        const imageUrl = `${process.env.REACT_APP_SERVICE_IMAGE}/${fileSeq?.fileSeq}`;
        const quillEditor = quillRef.current.getEditor();
        quillEditor.insertEmbed(range.index, 'image', `${imageUrl}`);
        quillEditor.format('align', 'center', Quill.sources.USER);
        quillEditor.setSelection(range.index + 1, Quill.sources.SILENT);
    };
    return (
        <div className="flex  w-full flex-col gap-2  ">
            <form onSubmit={handleSubmit(SubmitForm)} className="flex h-full w-full flex-col ">
                <div className={`flex flex-col ${errors ? 'gap-2' : 'gap-2'}  `}>
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-start gap-1 text-sm font-semibold">
                            <div>Name</div>
                            <div className="text-red-500">*</div>
                        </div>
                        <input
                            {...register('issuesName', {
                                required: 'This field is required.',
                                maxLength: { value: 255, message: 'Maximum 255 characters' },
                                validate: (value) => value.trim() !== '' || 'This field is required.'
                            })}
                            placeholder="Enter a name for issue"
                            className="flex h-[40px] w-full items-center justify-start border border-[#B3B3B3] p-3  placeholder:text-[14px] focus:border-primary-1 focus:outline-none"
                        />
                        <div className="text-[13px] text-[#787878]">Enter a name to identify the Issue.</div>
                        {errors?.issuesName && (
                            <p className="  flex gap-1 text-[13px]  font-normal text-red-500">
                                <Icon name="input_form" />
                                <span className="text-sm text-red-500">{errors?.issuesName?.message}</span>
                            </p>
                        )}
                    </div>
                    {/* Scope of Impact */}
                    <div className="flex flex-col gap-1 pt-2">
                        <div className="flex items-center justify-start gap-1 pb-2 font-semibold">
                            <div className="text-sm">Scope of Impact</div>
                        </div>
                        <input
                            {...register('scope', { maxLength: 255 })}
                            placeholder="Enter a scope of impact"
                            className="flex h-[40px] w-full items-center justify-start border border-[#B3B3B3] p-3   placeholder:text-[14px] focus:border-primary-1 focus:outline-none"
                        />
                        <div className="text-[13px] text-[#787878]">Describe the extent of the Issues impact.</div>
                        {errors?.scope && (
                            <p className="flex gap-1 text-[13px] font-normal text-red-500">
                                <Icon name="input_form" />
                                <span className="text-sm text-red-500">Maximum 255 characters</span>
                            </p>
                        )}
                    </div>

                    {/* Description (optional) */}
                    <div className=" relative">
                        <p className={`mb-2 text-sm font-medium`} htmlFor="">
                            Description
                        </p>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            rules={{
                                maxLength: { value: 10000, message: 'Maximum 10000 characters.' }
                            }}
                            render={({ field }) => (
                                <div className="relative">
                                    <div className="absolute -top-1 left-2  z-[99] cursor-pointer">
                                        <UploadImage insertToEditor={insertToEditor} />
                                    </div>

                                    <ReactQuill
                                        {...field}
                                        theme="snow"
                                        className="react-quill react-quill-testplan relative  w-full placeholder:text-sm"
                                        modules={modulesImage}
                                        ref={quillRef}
                                        placeholder="Enter a brief description of the cause"
                                    />
                                </div>
                            )}
                        />
                        {errors.description && (
                            <p className="absolute -bottom-[18px] flex gap-1 text-sm font-normal text-red-500">
                                <Icon name="input_form" />
                                <span className="text-sm text-red-500">{errors?.description?.message}</span>
                            </p>
                        )}
                    </div>
                    {/* Note */}
                    <div className="flex flex-col gap-1 pt-2">
                        <div className="flex items-center justify-start gap-1 text-sm font-semibold">
                            <div>Note</div>
                        </div>
                        <input
                            {...register('note', { maxLength: 255 })}
                            placeholder="Enter a note"
                            className="flex h-[40px] w-full items-center justify-start border border-[#B3B3B3] p-3  placeholder:text-[14px]  focus:border-primary-1 focus:outline-none"
                        />
                        <div className="text-[13px] text-[#787878]">Additional information or comments.</div>
                        {errors?.note && (
                            <p className="  flex gap-1 text-[13px]  font-normal text-red-500">
                                <Icon name="input_form" />
                                <span className="text-sm text-red-500">Maximum 255 characters</span>
                            </p>
                        )}
                    </div>
                    {/*Attachments */}
                    <div className="relative ">
                        <p className="mb-2  text-sm font-semibold">Attachments</p>
                        <AttachFile
                            attachType="UploadIssuse"
                            fileSeq={fileSeq}
                            seq={dataIssueById?.issuesId}
                            setFileSeq={setFileSeq}
                            register={register}
                            entity={`Issues`}
                            viewMode={true}
                            mode="member"
                            className="h-20 w-20 rounded-full object-cover"
                            filters={{
                                max_file_size: '10mb',
                                mime_types: [
                                    {
                                        title: 'Tệp đã được nhận: ',
                                        extensions: 'xlsx,pptx,txt,csv,docx,pdf,png,jpg,jpeg,zip,doc,ppt'
                                    }
                                ]
                            }}
                        />
                    </div>
                </div>
                <div>
                    {/* Cancel / Submit */}
                    <div className="mt-10 flex w-full items-center justify-center gap-3 pl-4">
                        <Button
                            type="submit"
                            className="min-w-40 border border-primary-1 bg-primary-1 px-3 py-2 text-center text-sm font-bold text-white transition-all duration-150"
                        >
                            Save Changes
                        </Button>
                        <button
                            onClick={() => setIsOpenEdit(false)}
                            type="button"
                            className="min-w-40 border border-neutral-3 px-3 py-2 text-center text-sm font-bold text-neutral-3"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default UpdateIssuse;
