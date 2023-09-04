import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    SubTitle,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js/auto';
  import zoomPlugin from 'chartjs-plugin-zoom';
  import ChartDataLabels from 'chartjs-plugin-datalabels';


// Global register for both bar and pie chart we will be using
// zoomPlugin specific to bar chart
// ArcElement and ChartDataLabels specific to pie chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    SubTitle,
    Tooltip,
    zoomPlugin,
    Legend,
    ArcElement,
    ChartDataLabels
);
