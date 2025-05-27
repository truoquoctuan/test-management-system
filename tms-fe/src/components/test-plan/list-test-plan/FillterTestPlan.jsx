import { useQuery } from '@apollo/client';
import { GET_CREATER } from 'apis/apollo/test-plan/query';
import FilterComponent from 'components/common/FilterComponent ';
import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';

const FillterTestPlan = ({ setDataFillter, setIsOpenFilter, setCurrentPage, resetFillter, isOpenFilter }) => {
    const [search, setSearch] = useState({});
    const [dataListMember, setDataListMember] = useState(null);
    const { userInfo } = useGlobalContext();

    const memberFilter = dataListMember?.getCreator?.users?.map((item) => ({
        text: item.fullName,
        value: item?.userID,
        avatar: item?.userID,
        userName: item.userName
    }));

    const { data: dataListMemberTestPlan, refetch } = useQuery(GET_CREATER, {
        variables: {
            userId: userInfo?.userID,
            page: 0,
            size: 100,
            name: search.creator
        },
        skip: isOpenFilter == true ? false : true
    });

    useEffect(() => {
        if (userInfo?.userID) {
            refetch();
        }
    }, [userInfo?.userID]);
    useEffect(() => {
        if (dataListMemberTestPlan) {
            setDataListMember(dataListMemberTestPlan);
        }
    }, [dataListMemberTestPlan]);

    const filterData = [
        {
            filter: true,
            type: 'radio',
            name: 'creator',
            title: 'Creator',
            options: memberFilter
        }
    ];

    const handleFilterConfirm = (filters) => {
        setDataFillter(filters);
        setCurrentPage(0);
    };
    return (
        <div>
            <FilterComponent
                filterData={filterData}
                onConfirm={handleFilterConfirm}
                setIsClose={setIsOpenFilter}
                setSearch={setSearch}
                search={search}
                resetFillter={resetFillter}
            />
        </div>
    );
};

export default FillterTestPlan;
