import { useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { GET_TEST_PLANS_DASHBOARD } from 'apis/dashboard/dashboard';
import AttachFile from 'components/AttachFile/AttachFile';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';

const TestPlanList = ({ widget, deleteWidgetArr }) => {
    // eslint-disable-next-line no-unused-vars
    const [idStatus, setIdStatus] = useState();
    const { userInfo } = useGlobalContext();
    const [page, setSize] = useState(6);
    const [listTestPland, setListTestPland] = useState(null);

    const { data } = useQuery(GET_TEST_PLANS_DASHBOARD, {
        client: clientRepo,
        variables: { page: 0, size: page, userId: userInfo?.userID, sorted: 'updatedAt+desc', status: idStatus },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (data) {
            setListTestPland(data?.getAllTestPlan?.testPlans);
        }
    }, [data]);
    const [popupDelete, setPopupDelete] = useState(false);
    const moreRef = useRef();
    useOutsideClick(moreRef, setPopupDelete);

    const tableContainerRef = useRef(null);

    const handleScroll = () => {
        const container = tableContainerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setSize((prevSize) => prevSize + 5);
        }
    };

    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return (
        <div className="animate__animated animate__zoomIn rounded bg-white px-4  pt-4">
            {' '}
            <div className="relative flex justify-between gap-2">
                <h4 className="mb-2 text-lg font-bold">Test Plan List</h4>

                <div className="flex cursor-pointer gap-2">
                    <div className=" relative" onClick={() => setPopupDelete(!popupDelete)} ref={moreRef}>
                        <Icon name="vertical_dots" className="mt-2 h-4 w-4" />
                        {popupDelete && (
                            <div className="absolute right-2 top-6 z-[30] w-[120px] cursor-pointer border bg-white   text-sm ">
                                <p
                                    className="cursor-pointer px-2 py-2   text-sm hover:bg-slate-100 "
                                    onClick={() => {
                                        setIdStatus(), setPopupDelete(false);
                                    }}
                                >
                                    All
                                </p>
                                <p
                                    className="cursor-pointer px-2 py-2  text-sm hover:bg-slate-100"
                                    onClick={() => {
                                        setIdStatus(1), setPopupDelete(false);
                                    }}
                                >
                                    Active
                                </p>
                                <p
                                    className="cursor-pointer px-2 py-2   text-sm hover:bg-slate-100"
                                    onClick={() => {
                                        setIdStatus(0), setPopupDelete(false);
                                    }}
                                >
                                    Archived
                                </p>
                                <p
                                    onClick={() => deleteWidgetArr(widget?.widgetId)}
                                    className="cursor-pointer px-2 py-2   text-sm hover:bg-slate-100"
                                >
                                    Close
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="custom-scroll-y h-[calc(39vh-72px)]  w-full" ref={tableContainerRef}>
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#DEDEDE] ">
                            <th className="w-[70%] py-2 pl-4 text-start">Name</th>
                            <th className="w-[25%] py-2 pl-4 text-start">Status</th>
                        </tr>
                    </thead>
                    <tbody className=" ">
                        {listTestPland?.map((item, index) => {
                            return (
                                <tr className="cursor-pointer border-b hover:bg-[#F4F4F4]" key={index}>
                                    <td className="py-2 pl-4 ">
                                        {' '}
                                        <div className="flex items-center gap-2">
                                            <AttachFile
                                                attachType="TestPlanAvatar"
                                                entity="TestPlan"
                                                seq={item?.testPlanId}
                                                register={null}
                                                viewMode={false}
                                                defaultImage={item?.testPlanName}
                                                mode="member"
                                                className="h-10 w-10 truncate bg-[#ececef] object-cover"
                                            />
                                            <p className="w-[350px] truncate text-sm font-medium">
                                                {item?.testPlanName}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-2">
                                        {item?.status === 1 && (
                                            <p className=" ml-4 w-[73px] bg-[#EDF3FF] py-1 text-center text-sm font-medium text-primary-1 ">
                                                Active
                                            </p>
                                        )}{' '}
                                        {item?.status === 0 && (
                                            <p className="ml-4 w-[73px] bg-[#FFEDED] py-1 text-center text-sm font-medium text-[#FF6060]">
                                                Archived
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TestPlanList;
