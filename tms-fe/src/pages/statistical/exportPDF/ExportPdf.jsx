import { useQuery } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { GET_TEST_CASE_IN_TEST_PLAN } from 'apis/statistical/statistical';
import { customStyles } from 'components/common/FormatModal';
import ModalComponent from 'components/common/Modal';
import Pagination from 'components/common/Pagination';
import Icon from 'components/icons/icons';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import PrintComponent from './PrintComponent';

const ExportPdf = ({ isOpen, setIsOpen }) => {
    const componentRef = useRef();
    const [isClosing, setIsClosing] = useState(false);
    const { testPlanId } = useParams();

    const [dataAllTestCase, setDataAllTesyCase] = useState(null);

    const [page, setPage] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500);
    };
    // Get all test case
    const { data: dataGetAllTestCase, loading } = useQuery(GET_TEST_CASE_IN_TEST_PLAN, {
        client: clientStatistical,
        variables: { testPlanId: testPlanId, page: page, size: 60 },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (dataGetAllTestCase) {
            setDataAllTesyCase(dataGetAllTestCase);
        }
    }, [dataGetAllTestCase]);

    return (
        <ModalComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isClosingv={isClosing}
            setIsClosing={setIsClosing}
            style={customStyles}
        >
            <div className=" m-auto  w-[1000px] p-4">
                <div className="mb-2 flex justify-between">
                    <ReactToPrint
                        trigger={() => <button className="bg-primary-1 p-2 text-white ">Print & PDF</button>}
                        content={() => componentRef.current}
                    />
                    <div className="mr-12">
                        <Pagination
                            setCurrentPage={setPage}
                            currentPage={page}
                            pagination={dataAllTestCase?.getTestCaseInTestPlan?.pageInfo}
                            itemNumber={60}
                        />
                    </div>
                    <div onClick={() => handleClose()} className="cursor-pointer">
                        <Icon name="close" />
                    </div>
                </div>
                <div className="custom-scroll-f h-[calc(98vh-64px)]">
                    <PrintComponent
                        ref={componentRef}
                        dataGetAllTestCase={dataAllTestCase}
                        loading={loading}
                        page={page}
                    />
                </div>
            </div>
        </ModalComponent>
    );
};

export default ExportPdf;
