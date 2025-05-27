import { useQuery } from '@apollo/client';
import { clientFile, clientStatistical } from 'apis/apollo/apolloClient';
import { GENERATE_CSV_ISSUES, GENERATE_KEY } from 'apis/attachFile/attachFile';
import Loading from 'components/common/Loading';
import Icon from 'components/icons/icons';
import Issues from 'components/issues/Issues';
import { useGlobalContext } from 'context/Context';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../components/common/Title';
const issue = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true);
    const { testPlanId } = useParams();
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    const { checkStatus, checkRoleTestPland, testPlanName } = useGlobalContext();

    const getCurrentDateFormatted = () => {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = String(today.getFullYear()).slice(-2); // Lấy 2 chữ số cuối của năm

        return `${day}/${month}/${year}`; // Định dạng dd/mm/yy
    };

    // Sử dụng hàm để tạo tên file
    const name = `TMSBZCOM[${testPlanName}]_ISSUE_${getCurrentDateFormatted()}.csv`;
    // eslint-disable-next-line no-undef
    const url = process.env.REACT_APP_SERVICE_CSV;
    const [uploadKey, setUploadKey] = useState('');
    const { data: keyData } = useQuery(GENERATE_KEY, { client: clientFile });

    const [sunmitCsv, setSunbmitCsv] = useState(true);
    const { data: dataCSV, loading } = useQuery(GENERATE_CSV_ISSUES, {
        client: clientStatistical,
        variables: { testPlanId, uploadKey, name },
        skip: sunmitCsv
    });

    // Hàm download file csv
    const onSubmitExportCSV = async (dataCSVs) => {
        const link = document.createElement('a');
        // eslint-disable-next-line prettier/prettier
        link.href = url + `/${dataCSVs?.generateCSVIssues?.fileSeq}`;
        link.setAttribute('download', true);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSunbmitCsv(true);
    };

    useEffect(() => {
        if (keyData) {
            setUploadKey(keyData.generateKey.key);
        }
    }, [keyData]);

    useEffect(() => {
        if (sunmitCsv === false && dataCSV) {
            onSubmitExportCSV(dataCSV);
        }
    }, [sunmitCsv, dataCSV]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    const topRef = useRef(null);

    return (
        <di ref={topRef} className=" h-[calc(90vh-72px)]  w-full ">
            <div className="flex gap-2 pb-1 pt-3 text-sm">
                <p
                    className="max-w-[150px] cursor-pointer truncate font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/plan-information/${testPlanId}`)}
                >
                    {testPlanName}
                </p>

                <p className="font-normal text-[#787878]">/</p>
                <p className="max-w-[250px] truncate font-semibold text-black">Issues</p>
            </div>

            <div className="flex justify-between">
                {/* Tiêu đề */}
                <div className="">
                    <Title name="Issues" subtitle="Track and manage all reported issues within the Test Plan." />
                </div>
                <div className="flex gap-2">
                    <div
                        onClick={() => setSunbmitCsv(false)}
                        className="flex h-[40px] w-[142px] cursor-pointer items-center justify-center gap-2 border border-primary-1 text-sm text-primary-1"
                    >
                        <Icon name="export" className="fill-primary-1" />
                        <p className="font-medium">Export to CSV</p>
                    </div>
                    {checkStatus === 1 && checkRoleTestPland !== 3 && (
                        <div
                            onClick={() => navigate(`/test-plan/issues/${testPlanId}/create-issues`)}
                            className="flex h-[40px] cursor-pointer items-center justify-center gap-2 bg-[#0066CC] px-3 font-semibold text-white"
                        >
                            <Icon name="plus_Circle_line" />
                            <div> Add Issue</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="z-50 mt-4 h-[calc(90vh-72px)] bg-white">
                <Issues topRef={topRef} testPlanId={testPlanId} setIsLoading={setIsLoading} />
            </div>
            {loading && (
                <div className="absolute top-0 mt-80 flex w-[80%] justify-center">
                    <Loading />
                </div>
            )}
        </di>
    );
};
export default issue;
