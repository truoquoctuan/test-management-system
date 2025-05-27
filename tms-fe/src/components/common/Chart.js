import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler,
    Tooltip,
    Legend
);

export const TmsPie = ({ options, data }) => {
    return data && <Pie options={options} data={data} />;
};

export const TmsLine = ({ data, options }) => {
    return data && options && <Line data={data} options={options} />;
};
export const TmsBar = ({ data, options }) => {
    return data && options && <Bar data={data} options={options} />;
};
export const TmsDoughnut = ({ data, options }) => {
    return data && options && <Doughnut data={data} options={options} />;
};
