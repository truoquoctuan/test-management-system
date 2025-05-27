import { useMutation } from '@apollo/client';
import { clientStatistical } from 'apis/apollo/apolloClient';
import { DELETE_WIDGET } from 'apis/dashboard/dashboard';
import FolderSummary from './Widget/FolderSummary';
import TestCaseExecutionStatus from './Widget/TestCaseExecutionStatus';
import TestCasePriority from './Widget/TestCasePriority';
import TestCaseSummary from './Widget/TestCaseSummary';
import TestPlanList from './Widget/TestplanList';
import TestPlanSummary from './Widget/TestPlanSummary';

const WidgetList = ({ listWidget, refetch }) => {
    //Xóa widget
    const [deleteWidget] = useMutation(DELETE_WIDGET, { client: clientStatistical });
    const deleteWidgetArr = async (widgetId) => {
        try {
            await deleteWidget({ variables: { widgetIds: [widgetId] } });
            refetch();
        } catch (error) {
            console.log(error);
        }
    };
    const renderWidget = (widget) => {
        switch (widget.widgetCode) {
            case 1:
                return <TestPlanList widget={widget} deleteWidgetArr={deleteWidgetArr} />;
            case 2:
                return <TestCasePriority widget={widget} deleteWidgetArr={deleteWidgetArr} />;
            case 3:
                return <FolderSummary widget={widget} deleteWidgetArr={deleteWidgetArr} />;
            case 4:
                return <TestCaseSummary widget={widget} deleteWidgetArr={deleteWidgetArr} />;
            case 5:
                return <TestCaseExecutionStatus widget={widget} deleteWidgetArr={deleteWidgetArr} />;
            case 6:
                return <TestPlanSummary widget={widget} deleteWidgetArr={deleteWidgetArr} />;
            default:
                return <div>Unknown widget type</div>;
        }
    };

    return (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listWidget?.getWidgetByUserId?.map((widget, index) => {
                return (
                    <div key={index} className="animate__animated animate__zoomIn h-[calc(47vh-72px)]  bg-white">
                        {renderWidget(widget)}
                    </div>
                );
            })}
        </div>
    );
};

export default WidgetList;
