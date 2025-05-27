import AttachFile from 'components/AttachFile/AttachFile';
import { formats, modules } from 'components/common/FormatQuill';
import Invalid from 'components/form/Invalid';
import Icon from 'components/icons/icons';
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import ReactQuill from 'react-quill';

const GeneralInformation = ({ isGeneralInfo, register, errors, control, Controller, startDate }) => {
    const [isOpenStatus, setIsOpenStatus] = useState(false);
    const [dataStatus, setDataStatus] = useState({ name: 'Active', value: 1 });

    return (
        <div className={`grid transition-all duration-500 ${isGeneralInfo ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="flex flex-col gap-y-4 overflow-hidden">
                {/* Test Plan Name */}
                <div className="mt-4 flex flex-col justify-start gap-1">
                    <label className={`font-medium ${errors?.testPlanName ? 'text-state-error' : ''}`} htmlFor="">
                        <span>Test Plan Name</span>
                        <span className="text-state-error"> *</span>
                    </label>

                    <input
                        {...register('testPlanName', {
                            required: { value: true, message: 'The Test Plan Name fields is required.' },
                            maxLength: { value: 50, message: 'Maximum 50 characters.' },
                            validate: (value) => value.trim() !== '' || 'The Test Plan Name fields is required.'
                        })}
                        className={`max-w-96 border p-2 px-3 py-2 placeholder:text-neutral-4 focus:outline-0 ${
                            errors?.testPlanName ? 'border-state-error' : 'border-neutral-4 focus:border-neutral-1'
                        }`}
                        autoComplete="off"
                        placeholder="Enter a Test Plan name"
                        type="text"
                    />

                    <div className="mt-1 text-neutral-3">This name will help you and your team identify its.</div>

                    <Invalid isInvalid={errors?.testPlanName} message={errors?.testPlanName?.message} />
                </div>

                {/* Description (optional) */}
                <div className="relative">
                    <p className={`mb-2 font-medium`} htmlFor="">
                        Description (optional)
                    </p>

                    <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                            maxLength: { value: 1000, message: 'Maximum 1000 characters.' }
                        }}
                        render={({ field }) => (
                            <ReactQuill
                                {...field}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                className="react-quill react-quill-testplan relative   w-[860px] placeholder:text-sm"
                                placeholder="Enter a brief description of the Test Plan"
                            />
                        )}
                    />
                    <p className="mt-2 text-[13px] font-normal text-[#787878]">
                        Describe the expected outcome for this Test Case.
                    </p>
                    {errors.description && (
                        <p className="mt-2 flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                            <Icon name="input_form" />
                            <span className="text-sm text-red-500">{errors.description.message}</span>
                        </p>
                    )}
                </div>

                {/* Status */}
                <div className="">
                    <label className="flex items-center justify-start gap-1 font-medium" htmlFor="">
                        <span>Status</span>
                        <span className="text-state-error"> *</span>
                    </label>

                    <div className="relative mt-1">
                        <Controller
                            name="status"
                            control={control}
                            defaultValue={dataStatus}
                            render={({ field }) => (
                                <>
                                    <div
                                        className="flex w-[385px] cursor-pointer justify-between border p-2"
                                        onClick={() => setIsOpenStatus(true)}
                                    >
                                        <p
                                            className={`font-medium ${
                                                field.value.value === 1 ? 'text-[#0066cc]' : 'text-[#FF6060]'
                                            }`}
                                        >
                                            {field.value.value === 1 ? 'Active' : 'Archive'}
                                        </p>
                                        <Icon name="down" className="fill-neutral-1 p-0.5" />
                                    </div>
                                    {isOpenStatus && (
                                        <div className="absolute z-30 mt-1 w-[385px] border bg-white">
                                            <p
                                                className="cursor-pointer p-2 font-medium text-[#0066cc] hover:bg-[#F4F4F4]"
                                                onClick={() => {
                                                    field.onChange({ name: 'Active', value: 1 });
                                                    setDataStatus({ name: 'Active', value: 1 });
                                                    setIsOpenStatus(false);
                                                }}
                                            >
                                                Active
                                            </p>
                                            <p
                                                className="cursor-pointer p-2 font-medium text-[#FF6060] hover:bg-[#F4F4F4]"
                                                onClick={() => {
                                                    field.onChange({ name: 'Archive', value: 0 });
                                                    setDataStatus({ name: 'Archive', value: 0 });
                                                    setIsOpenStatus(false);
                                                }}
                                            >
                                                Archive
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>

                {/* Start Date / End Date */}
                <div className=" flex gap-3">
                    <div>
                        <div className="pb-2 text-sm font-medium">Start Date</div>

                        <div className="relative">
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue=""
                                rules={{ maxLength: { value: 1000, message: 'Maximum 1000 characters.' } }}
                                render={({ field }) => (
                                    <Flatpickr
                                        {...field}
                                        className=" min-w-96 border border-neutral-4 px-3 py-2 focus:border-neutral-1 focus:outline-none"
                                        placeholder="dd/mm/yyyy"
                                        options={{ dateFormat: 'd/m/Y', theme: 'material_blue' }}
                                        onChange={(date) => field.onChange(date[0])}
                                    />
                                )}
                            />
                            <p className="absolute -bottom-5 text-[13px] font-normal text-[#787878]">
                                This date marks the beginning of the Test Plan.
                            </p>
                            {errors.startDate && (
                                <p className="absolute -bottom-10 flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.startDate.message}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="pb-2 text-sm font-medium">End Date</div>

                        <div className="relative">
                            <Controller
                                name="endDate"
                                control={control}
                                defaultValue=""
                                rules={{
                                    maxLength: { value: 1000, message: 'Maximum 1000 characters.' }
                                }}
                                render={({ field }) => (
                                    <Flatpickr
                                        {...field}
                                        className="flatpickr-input min-w-96 border border-neutral-4 px-3 py-2 focus:border-neutral-1 focus:outline-none"
                                        placeholder="dd/mm/yyyy"
                                        options={{ dateFormat: 'd/m/Y', minDate: startDate, theme: 'material_blue' }}
                                        onChange={(date) => field.onChange(date[0])}
                                    />
                                )}
                            />
                            <p className="absolute -bottom-5 text-[13px] font-normal text-[#787878]">
                                This date marks the ending of the Test Plan.
                            </p>
                            {errors.endDate && (
                                <p className="absolute -bottom-10 flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.endDate.message}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Thêm ảnh đại diện test pland */}
                <div className="mt-4">
                    <AttachFile
                        attachType="TestPlanAvatar"
                        entity={null}
                        seq={null}
                        register={register}
                        setFileSeq={null}
                        viewMode={true}
                        mode="member"
                        className="h-20 w-20 rounded-full object-cover"
                        filters={{
                            max_file_size: '10mb',
                            mime_types: [
                                {
                                    title: 'Tệp đã được nhận: ',
                                    extensions: 'jpg,png'
                                }
                            ]
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralInformation;
