import { useMutation } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { DELETE_WIDGET } from 'apis/dashboard/dashboard';
import { customStyles } from 'components/common/FormatModal';
import ModalComponent from 'components/common/Modal';
import Icon from 'components/icons/icons';
import { useEffect, useState } from 'react';
const widgets = [
    {
        id: 1,
        title: 'Test Plan List',
        widgetCode: 1,
        content:
            'The Test Plan List displays all the test plans along with their key details such as name and status. This list helps you manage and navigate through your test plans efficiently.'
    },
    {
        id: 2,
        title: 'Test Plan Summary',
        widgetCode: 2,
        content:
            'The Test Plan Summary provides an overview of test plans categorized by their status. It answers the question: What is the distribution of test plan statuses within the selected scope? This includes the metrics for Active and Archived test plans.'
    },
    {
        id: 3,
        title: 'Folder Summary',
        widgetCode: 3,
        content:
            'The Folder Summary provides an overview of the number of folders categorized by their usage. It answers the question: What is the distribution of folder types within the selected scope? This includes the metrics for Total Folders and Total Run Folders.'
    },
    {
        id: 4,
        title: 'Test Case Summary',
        widgetCode: 4,
        content:
            'The Test Case Summary provides an overview of test cases categorized by their current status. It answers the question: What is the distribution of test case statuses within the selected scope? This includes the metrics for Executed and Pending test cases.'
    },
    {
        id: 5,
        title: 'Test Case Execution Status',
        widgetCode: 5,
        content:
            'A status chart shows the distribution of test cases by their current state. This chart type answers the following question: "What is the current status of each test case within the test plan?"'
    },
    {
        id: 6,
        title: 'Test Case Priority Distribution',
        widgetCode: 6,
        content:
            'A priority chart shows the distribution of test cases by their priority level. This chart type answers the following question: "What is the distribution of test cases based on their priority within the test plan?"'
    }
];
const WidgetPopup = ({ addWidget, modalIsOpen, setModalIsOpen, listWidget, refetch }) => {
    const arrIdWidget = listWidget?.getWidgetByUserId;
    const [selectedWidgetIds, setSelectedWidgetIds] = useState([]);
    const [deleteIdWidget, setDeleteIdWidget] = useState([]);
    const matchingWidgets = arrIdWidget?.filter((widget) => deleteIdWidget?.includes(widget.widgetCode));
    const matchingWidgetIds = matchingWidgets?.map((widget) => Number(widget.widgetId));

    // Xác nhận add widget , delete
    const handleConfirm = async () => {
        await deleteWidgetArr();
        await addWidget(selectedWidgetIds);
        await setModalIsOpen(false);
    };

    //Xóa widget
    const [deleteWidget] = useMutation(DELETE_WIDGET, { client: clientStatistical });
    const deleteWidgetArr = async () => {
        try {
            await deleteWidget({ variables: { widgetIds: matchingWidgetIds } });
            refetch();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setSelectedWidgetIds(listWidget ? arrIdWidget?.map((item) => item.widgetCode) : []);
    }, [listWidget, modalIsOpen]);

    const handleCheckboxChange = (widgetId) => {
        if (selectedWidgetIds.includes(widgetId)) {
            setSelectedWidgetIds(selectedWidgetIds.filter((id) => id !== widgetId));

            setDeleteIdWidget([...deleteIdWidget, widgetId]);
        } else {
            setSelectedWidgetIds([...selectedWidgetIds, widgetId]);
        }
    };

    const handleCheckAllRun = () => {
        const allFolderIds = widgets.map((item) => item.id);
        setSelectedWidgetIds(allFolderIds);
    };

    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModalIsOpen(false);
            setIsClosing(false);
        }, 500);
    };

    return (
        <div>
            <ModalComponent
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                contentLabel="Add Widget"
                style={customStyles}
            >
                <div className=" w-[700px]   p-6 ">
                    <div className="flex justify-between">
                        <h2 className="mb-4 text-xl font-bold">Add Widget</h2>
                        <div
                            onClick={() => {
                                handleClose();
                            }}
                            className="cursor-pointer"
                        >
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <p></p>
                        <p onClick={() => handleCheckAllRun()} className="cursor-pointer text-sm hover:text-primary-1">
                            Chọn tất cả{' '}
                        </p>
                    </div>

                    <div className="custom-scroll-y h-[620px] ">
                        {widgets.map((widget) => (
                            <div key={widget.id} className="mb-2 flex  border p-2">
                                <div>
                                    <label htmlFor={`widget-${widget.id}`} className="text-base font-medium">
                                        {widget.title}
                                    </label>
                                    <p className="text-[13px] font-normal text-[#787878]">{widget.content}</p>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id={`widget-${widget.widgetCode}`}
                                        className="h-5 w-5 cursor-pointer"
                                        checked={selectedWidgetIds?.includes(widget.widgetCode)}
                                        onChange={() => handleCheckboxChange(widget.widgetCode)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                handleClose();
                            }}
                            className="ml-2 mt-4 w-[160px] border border-[#787878] px-4 py-1.5 text-sm font-bold text-[#787878]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="mt-4  w-[160px] bg-primary-1 px-4 py-1.5 text-sm font-bold text-white"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default WidgetPopup;
