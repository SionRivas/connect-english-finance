'use client';
import React from 'react';
import Chart from 'react-apexcharts';

interface RevenueChartProps {
  categories: string[];
  ingresos: number[];
  egresos: number[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  categories,
  ingresos,
  egresos,
}) => {
  const options = {
    chart: {
      type: 'bar' as 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    colors: ['#f31260', '#17c964'], // Verde para Ingresos, rosado para Egresos
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'Revenue',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const series = [
    {
      name: 'Egresos',
      data: egresos, // Egresos (negativos)
    },
    {
      name: 'Ingresos',
      data: ingresos, // Ingresos
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={200} />
    </div>
  );
};

export default RevenueChart;
