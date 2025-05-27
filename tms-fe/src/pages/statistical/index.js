import { useQuery } from '@apollo/client';
import { clientFile, clientStatistical } from 'apis/apollo/apolloClient';
import { GENERATE_CSV, GENERATE_KEY } from 'apis/attachFile/attachFile';
import Loading from 'components/common/Loading';
import Title from 'components/common/Title';
import Icon from 'components/icons/icons';
import ChartSection from 'components/statistical/ChartSection';
import RunResult from 'components/statistical/run-result/RunResult';
import SummaryCards from 'components/statistical/SummaryCards';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExportPdf from './exportPDF/ExportPdf';
const Statistical = () => {
    // eslint-disable-next-line no-undef
    const url = process.env.REACT_APP_SERVICE_CSV;
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenExport, setIsOpenExport] = useState(false);
    const { testPlanId } = useParams();
    const [isOpenPDF, setIsOpenPdf] = useState(false);
    const exportRef = useRef();
    useOutsideClick(exportRef, setIsOpenExport);
    const [uploadKey, setUploadKey] = useState('');
    const { testPlanName } = useGlobalContext();
    const navigate = useNavigate();
    const { data: keyData } = useQuery(GENERATE_KEY, { client: clientFile });

    const [sunmitCsv, setSunbmitCsv] = useState(true);
    const getCurrentDateFormatted = () => {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = String(today.getFullYear()).slice(-2); // Lấy 2 chữ số cuối của năm

        return `${day}/${month}/${year}`; // Định dạng dd/mm/yy
    };

    // Sử dụng hàm để tạo tên file
    const name = `TMSBZCOM[${testPlanName}]_STATISTICAL_${getCurrentDateFormatted()}.csv`;
    const { data: dataCSV, loading } = useQuery(GENERATE_CSV, {
        client: clientStatistical,
        variables: { testPlanId, uploadKey, name },
        skip: sunmitCsv
    });
    // Hàm download file csv
    const onSubmitExportCSV = async (dataCSVs) => {
        const link = document.createElement('a');
        // eslint-disable-next-line prettier/prettier
        link.href = url + `/${dataCSVs?.generateCSV?.fileSeq}`;
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
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="  mx-auto">
            <div className="flex gap-2 pb-1 pt-3 text-sm">
                <p
                    className="max-w-[150px] cursor-pointer truncate font-normal text-[#787878]"
                    onClick={() => navigate(`/test-plan/plan-information/${testPlanId}`)}
                >
                    {testPlanName}
                </p>

                <p className="font-normal text-[#787878]">/</p>
                <p className="max-w-[250px] truncate font-semibold text-black">Statistics</p>
            </div>

            <div className=" flex justify-between">
                {/* Tiêu đề */}
                <div className="">
                    <Title name="Statistics" subtitle="Comprehensive test data analysis." />
                </div>
                <div className="w-[135px] " ref={exportRef}>
                    <div
                        className="flex h-[32px] cursor-pointer items-center justify-between bg-[#0066CC] px-3 text-white"
                        onClick={() => setIsOpenExport(!isOpenExport)}
                    >
                        <Icon name="export" className="fill-white" />
                        <p className="text-sm  font-bold">Export</p>
                        <Icon name="caret_right" className="rotate-90 fill-white" />
                    </div>

                    {isOpenExport && (
                        <div className="absolute top-14 w-[138px] bg-white p-2 drop-shadow-md">
                            <p
                                className="cursor-pointer px-2 py-1.5 text-sm font-medium hover:bg-[#F4F4F4]"
                                onClick={() => setIsOpenPdf(true)}
                            >
                                Export to PDF
                            </p>
                            <p
                                className="cursor-pointer px-2  py-1.5 text-sm font-medium hover:bg-[#F4F4F4]"
                                // eslint-disable-next-line no-undef
                                onClick={() => setSunbmitCsv(false)}
                            >
                                Export to CSV
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="absolute flex h-[80%]  w-[80%] items-center justify-center px-6">
                    <Loading />
                </div>
            ) : (
                <div className={`${loading ? 'opacity-50' : ''}`}>
                    <div>
                        <SummaryCards />
                    </div>
                    <div>
                        <ChartSection />
                    </div>

                    <div>
                        <RunResult />
                    </div>

                    <ExportPdf isOpen={isOpenPDF} setIsOpen={setIsOpenPdf} />
                    {/* <div id="app">
                    
                </div> */}
                </div>
            )}

            {loading && (
                <div className="absolute top-0 mt-80 flex w-full justify-center">
                    <Loading />
                </div>
            )}
        </div>
    );
};

export default Statistical;
