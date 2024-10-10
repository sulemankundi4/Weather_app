
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TemperatureGraph = ({ data }) => {
  const temperatures = data.list.map(item => item.main.temp - 273.15); // Convert from Kelvin to Celsius
  const times = data.list.map(item => item.dt_txt );
   console.log(times)




  const chartData = {
   labels: times,

   datasets: [
     {
       label: 'Temerature C',
       data: temperatures,
       borderColor: 'rgb(75, 192, 192)',
       fill: false,
       stepped: true,
     }
   ]
 };

 const config = {
   type: 'line',
   data: data,
   options: {
     responsive: true,
     interaction: {
       intersect: false,
       axis: 'x'
     },
     plugins: {
       title: {
         display: true,
         text: (ctx) => 'Step ' + ctx.chart.data.datasets[0].stepped + ' Interpolation',
       }
     }
   }
 };

  return <Line data={chartData} options={config} />;
};

export default TemperatureGraph;