import { useMutation, useQuery } from '@apollo/client';
import { clientFile } from 'apis/apollo/apolloClient';
import { UPDATE_INFO_TEST_PLAN } from 'apis/apollo/test-plan/mutation';
import { DELETE_FILE_BY_SEQ } from 'apis/attachFile/attachFile';
import { GET_TEST_PLAN_BY_ID } from 'apis/plan-information/query';
import AttachFile from 'components/AttachFile/AttachFile';
import { formats, modules } from 'components/common/FormatQuill';
import Loading from 'components/common/Loading';
import { toDateStringYear } from 'components/common/Time';
import Button from 'components/design-system/Button';
import Invalid from 'components/form/Invalid';
import Icon from 'components/icons/icons';
import Header from 'components/plan-information/Header';
import { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Information = () => {
    const [isOpenStatus, setIsOpenStatus] = useState(false);
    const [dataStatus, setDataStatus] = useState({ name: 'Active', value: 1 });
    const [fileSeq, setFileSeq] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors }
    } = useForm();
    const startDate = watch('startDate');
    const { testPlanId } = useParams();
    const { data: testPlanData } = useQuery(GET_TEST_PLAN_BY_ID, {
        variables: { testPlanId: testPlanId }
    });

    useEffect(() => {
        if (testPlanData) {
            const newDataReset = {
                description: testPlanData?.getTestPlanById.description,
                status: testPlanData?.getTestPlanById.status,
                endDate: testPlanData?.getTestPlanById.endDate ? testPlanData?.getTestPlanById.endDate + 'Z' : null,
                startDate: testPlanData?.getTestPlanById.endDate ? testPlanData?.getTestPlanById.startDate + 'Z' : null,
                testPlanId: testPlanData?.getTestPlanById.testPlanId,
                testPlanName: testPlanData?.getTestPlanById.testPlanName
            };
            reset(newDataReset);
        }
    }, [testPlanData]);
    // eslint-disable-next-line no-unused-vars
    const [updateInfoTestPlae] = useMutation(UPDATE_INFO_TEST_PLAN);

    const onSubmit = async (data) => {
        const newData = {
            description: data.description,
            status: data.status.value,
            endDate: data?.endDate ? toDateStringYear(data?.endDate) + 'T00:00:00' : '',
            startDate: data?.startDate ? toDateStringYear(data?.startDate) + 'T00:00:00' : '',
            testPlanId: data.testPlanId,
            testPlanName: data.testPlanName,
            uploadKey: data.uploadKey
        };
        try {
            await updateInfoTestPlae({ variables: newData });
            toast.success('Update successful');
            navigate(`/test-plan/plan-information/${testPlanId}`);
            if (fileSeq.length > 1) {
                await handleDeleteSeq(fileSeq[0]?.fileSeq);
            }
        } catch (error) {
            toast.error('An error occurred. ');
        }
    };
    const [deleteSeq] = useMutation(DELETE_FILE_BY_SEQ, { client: clientFile });
    const handleDeleteSeq = async (seq) => {
        await deleteSeq({ variables: { id: seq } });
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    return (
        <div className={`mt-4 grid transition-all duration-500`}>
            {isLoading ? (
                <div className="absolute flex h-[70%]  w-[80%] items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden bg-white p-4  ">
                    <div className="mb-4 flex justify-between">
                        <Header
                            header={'Edit General Information'}
                            sub={'Update the core information of the selected Test Plan.'}
                        />
                    </div>
                    <hr />

                    <div className="flex flex-col gap-y-4 ">
                        {/* Test Plan Name */}
                        <div className="mt-4 flex flex-col justify-start gap-1">
                            <label
                                className={`font-semibold ${errors?.testPlanName ? 'text-state-error' : ''}`}
                                htmlFor=""
                            >
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
                                    errors?.testPlanName
                                        ? 'border-state-error'
                                        : 'border-neutral-4 focus:border-neutral-1'
                                }`}
                                autoComplete="off"
                                placeholder="Enter a Test Plan name"
                                type="text"
                            />

                            <div className=" text-[13px] text-neutral-3">
                                This name will help you and your team identify its.
                            </div>

                            <Invalid isInvalid={errors?.testPlanName} message={errors?.testPlanName?.message} />
                        </div>

                        {/* Description (optional) */}
                        <div className="relative">
                            <label className={` font-semibold`} htmlFor="">
                                Description (optional)
                            </label>

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
                                        className="react-quill react-quill-testplan2 relative  w-[814px] placeholder:text-sm"
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Enter a brief description of the Test Plan"
                                    />
                                )}
                            />
                            <p className=" mt-2 text-[13px] font-normal text-[#787878]">
                                Provide a detailed description of the Test Plan.
                            </p>
                            {errors.description && (
                                <p className="-bottom-20 flex gap-2 text-[13px]  text-sm font-normal text-red-500">
                                    <Icon name="input_form" />
                                    <span className="text-sm text-red-500">{errors.description.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="">
                            <label className="flex items-center justify-start gap-1 font-semibold" htmlFor="">
                                <span>Status</span>
                                <span className="text-state-error"> *</span>
                            </label>

                            <div className="relative mt-2">
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue={dataStatus}
                                    render={({ field }) => (
                                        <>
                                            <div
                                                className="flex w-[385px] cursor-pointer justify-between border p-2"
                                                onClick={() => setIsOpenStatus(!isOpenStatus)}
                                            >
                                                <p
                                                    className={`font-medium ${
                                                        field.value === 1 ? 'text-[#0066cc]' : 'text-[#FF6060]'
                                                    }`}
                                                >
                                                    {field.value === 1 ? 'Active' : 'Archive'}
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
                        <div className="mt-1 flex gap-3">
                            <div>
                                <div className="pb-2 text-sm font-semibold">Start Date</div>

                                <div className="relative">
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        defaultValue=""
                                        rules={{ maxLength: { value: 1000, message: 'Maximum 1000 characters.' } }}
                                        render={({ field }) => (
                                            <Flatpickr
                                                {...field}
                                                className="flatpickr-input min-w-96 border border-neutral-4 px-3 py-2 focus:border-neutral-1 focus:outline-none"
                                                placeholder="dd/mm/yyyy"
                                                options={{
                                                    dateFormat: 'd/m/Y',
                                                    theme: 'material_blue'
                                                }}
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
                                <div className="pb-2 text-sm font-semibold">End Date</div>

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
                                                options={{
                                                    dateFormat: 'd/m/Y',
                                                    minDate: startDate,
                                                    theme: 'material_blue'
                                                }}
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
                        <div className="mt-6">
                            <AttachFile
                                attachType="TestPlanAvatar"
                                entity={`TestPlan`}
                                seq={testPlanId}
                                setFileSeq={setFileSeq}
                                register={register}
                                viewMode={true}
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

                        <div className=" flex w-full justify-center gap-3 pt-6">
                            <Link to={`/test-plan/plan-information/${testPlanId}`}>
                                <div className="min-w-40 border border-primary-1 px-3  py-2 text-center font-bold text-primary-1  transition-all duration-150">
                                    Cancel
                                </div>
                            </Link>

                            <Button
                                type="submit"
                                icon={null}
                                className="min-w-40 border border-primary-1 bg-primary-1 px-3 py-2 text-center font-bold text-white transition-all duration-150"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Information;
