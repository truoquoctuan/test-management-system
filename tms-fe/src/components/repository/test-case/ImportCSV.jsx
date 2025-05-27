import { useMutation } from '@apollo/client';
import { CREATE_TEST_CASETS } from 'apis/repository/test-case';
import { customStyles } from 'components/common/FormatModal';
import Loading from 'components/common/Loading';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import Papa from 'papaparse';
import { useState } from 'react';
import { toast } from 'sonner';
const ImportCSV = ({ folderId, isOpenCSV, setIsOpenCSV, refetch }) => {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const { userInfo } = useGlobalContext();
    const [isClosing, setIsClosing] = useState(false);
    const [percentCSV, setPercentCSV] = useState(0);
    const [createTestCase] = useMutation(CREATE_TEST_CASETS);
    const [loading, setLoading] = useState(false);

    const requiredFields = [
        'TestCaseName',
        'Expected',
        'Description',
        'Priority'
        // thêm các trường cần thiết khác ở đây
    ];

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        const maxSizeInBytes = 50 * 1024 * 1024; // 50MB in bytes
        if (selectedFile) {
            if (selectedFile.size > maxSizeInBytes) {
                toast.error('File size exceeds 50MB. Please choose a smaller file.');
                return;
            }
            setFile(selectedFile);
            Papa.parse(selectedFile, {
                header: true,
                complete: (results) => {
                    setData(results.data);
                }
            });
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpenCSV(false);
            setIsClosing(false);
            setFile(null); // Reset file khi đóng modal
            setData([]); // Reset lại dữ liệu sau khi đóng
        }, 500);
    };

    const validateFields = (row) => {
        const { TestCaseName, Expected, Description } = row;
        let isValid = true;

        // Kiểm tra các trường cần thiết
        if (!TestCaseName || TestCaseName.trim().length === 0 || TestCaseName.length > 255) {
            isValid = false;
        }
        if (!Expected || Expected.trim().length === 0 || Expected.length > 10000) {
            isValid = false;
        }
        if (Description && Description.length > 10000) {
            isValid = false;
        }

        return isValid;
    };

    const filterRequiredFields = (row) => {
        return requiredFields.reduce((acc, field) => {
            if (row[field] !== undefined) {
                acc[field] = row[field];
            }
            return acc;
        }, {});
    };

    const processBatch = async (batch) => {
        const formatContent = (content) => {
            if (!content) return '';
            return content.replace(/([+\-*]|(\d+(?:\.\d+)?(?:,\d+)?))/g, '<br />$1');
        };

        const arrTestCase = batch.map((item) => ({
            testCaseName: item.TestCaseName,
            description: formatContent(item.Description),
            expectResult: formatContent(item.Expected),
            createdBy: String(userInfo?.userID),
            fileSeqs: '',
            priority: item.Priority === 'High' ? 3 : item.Priority === 'Low' ? 1 : 2,
            labels: []
        }));

        return createTestCase({ variables: { folderId: folderId, testCases: arrTestCase } });
    };

    const createTestCases = async () => {
        setLoading(true);
        const batchSize = 100;

        // Phân loại dữ liệu hợp lệ và không hợp lệ chỉ với một lần duyệt
        const validData = [];
        const invalidData = [];
        data.forEach((row) => {
            if (validateFields(row)) {
                validData.push(filterRequiredFields(row));
            } else {
                invalidData.push(row);
            }
        });

        const totalCases = validData.length;

        // Kiểm tra dữ liệu hợp lệ
        if (totalCases === 0) {
            toast.error('The data is not formatted or the file is empty');
            setLoading(false);
            return;
        }
        let createdCount = 0;
        try {
            for (let i = 0; i < validData.length; i += batchSize) {
                const batch = validData.slice(i, i + batchSize);
                await processBatch(batch);
                createdCount += batch.length;
                const percent = Math.round((createdCount / totalCases) * 100);
                setPercentCSV(percent);
            }

            refetch();
            handleClose();
            toast.success('Test cases created successfully');
        } catch (error) {
            toast.error('An error occurred while creating test cases.');
        } finally {
            setLoading(false);
            setFile(null); // Reset lại file
            setData([]); // Reset lại dữ liệu
        }
    };

    return (
        <div>
            <ModalComponent
                isOpen={isOpenCSV}
                setIsOpen={setIsOpenCSV}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                style={customStyles}
            >
                <div className="h-[400px] w-[800px] p-4">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className=" text-center">
                                <div className="ml-3.5">
                                    <Loading />
                                </div>

                                <p className="mt-4 font-semibold">Import {percentCSV}%</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between">
                                <p className="text-base font-semibold">Import Test Case CSV</p>
                                <Icon name="close" className="h-3 w-3 cursor-pointer" onClick={() => handleClose()} />
                            </div>
                            <p className="text-sm text-[#787878]">Upload your file to import data into the system.</p>
                            <div className="mb-4 mt-6">
                                <p className="text-sm font-semibold">Upload CSV file</p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="fileUpload"
                                />
                                <label
                                    htmlFor="fileUpload"
                                    className="mt-2 inline-block cursor-pointer border border-[#787878] px-4 py-1 text-sm font-medium text-[#787878]"
                                >
                                    {file ? 'Change file' : 'Choose file'}
                                </label>
                                {file && (
                                    <div className="ml-2 inline-flex items-center">
                                        <span className="mr-2 text-sm text-[#1D79ED]">{file.name}</span>
                                    </div>
                                )}
                                {
                                    <p className="mt-4 text-sm">
                                        The file format must be CSV UTF-8 (Comma delimited)(*.csv) <br></br>
                                        When importing the CSV file, ensure it includes these fields:
                                        <br></br>
                                        The maximum file size allowed is 50MB.<br></br>
                                        <strong style={{ marginLeft: 10 + 'px' }}> ID </strong> (the field name must not
                                        contain whitespace) <br></br>
                                        <strong style={{ marginLeft: 10 + 'px' }}> TestCaseName </strong>
                                        (required, up to 255 characters, the field name must not contain whitespace)
                                        <br></br>
                                        <strong style={{ marginLeft: 10 + 'px' }}> Priority </strong> (required, with
                                        options High, Low, Medium, the field name must not contain whitespace)<br></br>
                                        <strong style={{ marginLeft: 10 + 'px' }}> Expected </strong> (required, up to
                                        10,000 characters, the field name must not contain whitespace)<br></br>
                                        <strong style={{ marginLeft: 10 + 'px' }}> Description </strong> (up to 10,000
                                        characters, the field name must not contain whitespace)
                                    </p>
                                }
                            </div>
                            <div className="mt-6 flex justify-center gap-2">
                                <div
                                    htmlFor="fileUpload"
                                    className="inline-block w-[133px] cursor-pointer border border-[#787878] px-4 py-1.5 text-center text-sm font-medium text-[#787878]"
                                    onClick={() => handleClose()}
                                >
                                    Cancel
                                </div>
                                <button
                                    onClick={createTestCases}
                                    className="inline-block w-[133px] cursor-pointer border bg-primary-1 px-4 py-1.5 text-center text-sm font-medium text-white"
                                >
                                    Import
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </ModalComponent>
        </div>
    );
};

export default ImportCSV;
