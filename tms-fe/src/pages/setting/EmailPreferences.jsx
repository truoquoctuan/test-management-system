import { useMutation, useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { GET_EMAIL_SETTING, SET_EMAIL_SETTING } from 'apis/notification/notification';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const SystemPreferences = () => {
    const { testPlanId } = useParams();
    const { userInfo } = useGlobalContext();
    const [checkStatus, setCheckStatus] = useState(false);
    const { data: getDataSettingEmail } = useQuery(GET_EMAIL_SETTING, {
        client: clientRepo,
        variables: { testPlanId: testPlanId, userId: userInfo?.userID },
        fetchPolicy: 'cache-and-network'
    });
    const initialCheckedValues = getDataSettingEmail?.getMailSetting?.split(', ');
    const [checkedValues, setCheckedValues] = useState([]);

    useEffect(() => {
        setCheckedValues(initialCheckedValues ? initialCheckedValues : []);
    }, [getDataSettingEmail]);

    // eslint-disable-next-line no-unused-vars
    const handleCheckboxChange = (value) => {
        setCheckedValues((prevValues) => {
            if (prevValues.includes(value)) {
                return prevValues.filter((val) => val !== value);
            } else {
                return [...prevValues, value];
            }
        });
    };

    // API cài đặt setting
    useEffect(() => {
        if (checkStatus === true) {
            handleSubmitSetting();
        }
    }, [checkedValues]);
    const [setEmailSetting] = useMutation(SET_EMAIL_SETTING, { client: clientRepo });
    const handleSubmitSetting = async () => {
        try {
            await setEmailSetting({
                variables: {
                    testPlanId: testPlanId,
                    userId: String(userInfo.userID),
                    mailSetting: checkedValues.join(', ')
                }
            });
        } catch (error) {
            toast.error('Error');
        }
    };

    // Kiểm tra xem checkbox có được chọn hay không
    const isChecked = (value) => {
        return checkedValues?.includes(value);
    };

    return (
        <div className="ml-4 mt-4">
            {/* Test Plan Status Update */}
            <label className="bordrer-b flex h-[64px] cursor-pointer items-center gap-3 border-b pb-2">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked('1')}
                        className="peer sr-only"
                        onChange={() => {
                            setCheckStatus(true), handleCheckboxChange('1');
                        }}
                    />
                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </div>
                <div>
                    <p className="text-base font-semibold text-[#121212]">Test Plan Status Update</p>
                    <p className="pt-1 text-sm font-normal text-[#787878]">
                        Real-Time Insights into Test Plan Adjustments.
                    </p>
                </div>
            </label>

            {/* Assigned to Test Case */}
            <label className="bordrer-b mt-[22px] flex h-[64px] cursor-pointer items-center gap-3 border-b pb-2">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked('3')}
                        className="peer sr-only"
                        onChange={() => {
                            setCheckStatus(true), handleCheckboxChange('3');
                        }}
                    />
                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </div>

                <div>
                    <p className="text-base font-semibold text-[#121212]">Assigned to Test Case</p>
                    <p className=" pt-1 text-sm font-normal text-[#787878]">
                        Receive a notification when you{`'`}re assigned to a Test Case.
                    </p>
                </div>
            </label>
            {/* Tagged in Comment */}
            <label className="bordrer-b mt-[22px] flex h-[64px] cursor-pointer items-center gap-3 border-b pb-2">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked('4')}
                        className="peer sr-only"
                        onChange={() => {
                            setCheckStatus(true), handleCheckboxChange('4');
                        }}
                    />
                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </div>

                <div>
                    <p className="text-base font-semibold text-[#121212]">Tagged in Comment</p>
                    <p className=" pt-1 text-sm font-normal text-[#787878]">
                        Receive a notification when you{`'`}re tagged in a comment.
                    </p>
                </div>
            </label>
            {/* Assigned to Issue */}
            <label className="bordrer-b mt-[22px] flex h-[64px] cursor-pointer items-center gap-3 border-b pb-2">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked('5')}
                        className="peer sr-only"
                        onChange={() => {
                            setCheckStatus(true), handleCheckboxChange('5');
                        }}
                    />
                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </div>

                <div>
                    <p className="text-base font-semibold text-[#121212]">Assigned to Issue</p>
                    <p className=" pt-1 text-sm font-normal text-[#787878]">
                        Receive a notification when you{`'`}re assigned to a Issue.
                    </p>
                </div>
            </label>
            {/* Issue Status Update */}
            <label className="bordrer-b mt-[22px] flex h-[64px] cursor-pointer items-center gap-3 border-b pb-2">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked('6')}
                        className="peer sr-only"
                        onChange={() => {
                            setCheckStatus(true), handleCheckboxChange('6');
                        }}
                    />
                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </div>

                <div>
                    <p className="text-base font-semibold text-[#121212]">Issue Status Update</p>
                    <p className=" pt-1 text-sm font-normal text-[#787878]">
                        Receive updates when the status of an issue changes.
                    </p>
                </div>
            </label>

            <label className="bordrer-b mt-[22px] flex h-[64px] cursor-pointer items-center gap-3 border-b pb-2">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked('7')}
                        className="peer sr-only"
                        onChange={() => {
                            setCheckStatus(true), handleCheckboxChange('7');
                        }}
                    />
                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </div>

                <div>
                    <p className="text-base font-semibold text-[#121212]">Cause & Solution</p>
                    <p className=" pt-1 text-sm font-normal text-[#787878]">
                        Get notified when a new item is created or updated in test plan.
                    </p>
                </div>
            </label>
        </div>
    );
};

export default SystemPreferences;
