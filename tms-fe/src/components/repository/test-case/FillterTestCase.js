import { useQuery } from '@apollo/client';
import { GET_ALL_LABEL_INTEST_PLAN, GET_ALL_MEMBER_CREATE_TEST_CASE } from 'apis/repository/test-case';
import FilterComponent from 'components/common/FilterComponent ';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FillterTestCase = ({
    selectedFolder,
    setDataFillter,
    setIsOpenFilter,
    setCurrentPage,
    resetFillter,
    isOpenFilter
}) => {
    const [search, setSearch] = useState({});
    const { testPlanId } = useParams();
    const [dataListLable, setDataListLable] = useState(null);
    const [dataListMember, setDataListMember] = useState(null);

    // Danh sách lable
    const { data: listLabel, refetch } = useQuery(GET_ALL_LABEL_INTEST_PLAN, {
        variables: { testPlanId: parseInt(testPlanId), labelTypes: [1], labelName: search.tag, page: 0, size: 100 }
    });

    useEffect(() => {
        refetch();
    }, [isOpenFilter]);
    // Danh sách thành viên tạo test case
    const { data: listMember } = useQuery(GET_ALL_MEMBER_CREATE_TEST_CASE, {
        variables: {
            folderId: selectedFolder?.folderId,
            page: 0,
            size: 10,
            name: search.creator ? search.creator : ''
        },
        fetchPolicy: 'cache-and-network'
    });

    const optionFilter = dataListLable?.getAllLabel?.labels?.map((item) => ({
        text: item.labelName,
        value: item?.labelId,
        color: item.labelColor
    }));
    const memberFilter = dataListMember?.getAllMemberCreatedTestCase?.users?.map((item) => ({
        text: item.fullName,
        value: item?.userID,
        avatar: item?.userID
    }));

    useEffect(() => {
        if (listLabel || listMember) {
            setDataListLable(listLabel);
            setDataListMember(listMember);
        }
    }, [listLabel, listMember]);

    const filterData = [
        {
            filter: true,
            type: 'checkbox',
            name: 'tag',
            title: 'Tag',
            options: optionFilter
        },
        {
            filter: true,
            type: 'checkbox',
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

export default FillterTestCase;
