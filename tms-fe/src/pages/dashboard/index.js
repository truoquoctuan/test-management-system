import { useMutation, useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { ADD_WIDGET, GET_WIDGET_BY_USERID } from 'apis/dashboard/dashboard';
import WidgetList from 'components/dashboard/WidgetList';
import WidgetPopup from 'components/dashboard/WidgetPopup';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import NotData from '../..//assets/images/Search.svg';

const Dashboard = () => {
    const { userInfo } = useGlobalContext();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [addWidgets] = useMutation(ADD_WIDGET, { client: clientStatistical });
    const addWidget = async (widgetIds) => {
        try {
            await addWidgets({ variables: { userId: userInfo?.userID, widgetCodes: widgetIds } });
            await refetch();
            toast.success(' Widget has been added successfully.');
        } catch (error) {
            console.log('error', error);
        }
    };

    const { data: listWidget, refetch } = useQuery(GET_WIDGET_BY_USERID, {
        client: clientStatistical,
        variables: { userId: userInfo?.userID }
    });

    useEffect(() => {
        if (userInfo) {
            refetch();
        }
    }, [userInfo]);
    return (
        <div className="mx-auto h-[calc(100vh-72px)] bg-[#F8F8F8] px-10 py-4">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-xl font-bold text-primary-1">Welcome back, {userInfo?.fullName}!</h1>
                    <p className="text-sm text-[#787878]">
                        We’re glad to see you again. Your dashboard is ready to help you track progress and achieve your
                        goals. Let’s make today productive!
                    </p>
                </div>
                <div>
                    <div
                        className=" flex cursor-pointer  gap-2 bg-primary-1 px-4 py-1.5   text-white"
                        onClick={() => setModalIsOpen(true)}
                    >
                        <Icon name="plus_circle" className="fill-white" />
                        <p className="text-sm font-bold">Add Widget</p>
                    </div>
                </div>
            </div>
            {listWidget?.getWidgetByUserId?.length === 0 && (
                <div className="mt-36  flex items-center justify-center">
                    <div className="text-center">
                        <div>
                            <img src={NotData} className="m-auto" />
                            <p className="mt-2 text-base font-medium text-[#121212]">No data found!</p>
                            <p className="w-[468px] text-sm font-normal text-[#787878]">
                                It looks like your dashboard is currently empty. Start by adding some widgets to track
                                your progress and manage your test plan.
                            </p>
                        </div>
                        <div
                            className="m-auto mt-3 flex  w-[146px] cursor-pointer gap-2 border border-primary-1 px-4  py-1.5 text-primary-1"
                            onClick={() => setModalIsOpen(true)}
                        >
                            <Icon name="plus_circle" className="fill-primary-1" />
                            <p className="text-sm font-bold">Add Widget</p>
                        </div>
                    </div>
                </div>
            )}

            <WidgetPopup
                addWidget={addWidget}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                listWidget={listWidget}
                refetch={refetch}
            />
            <WidgetList listWidget={listWidget} refetch={refetch} />
        </div>
    );
};

export default Dashboard;
