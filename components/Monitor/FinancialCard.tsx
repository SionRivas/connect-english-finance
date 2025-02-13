'use client';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

import {
  Button,
  ButtonGroup,
  DateRangePicker,
  RangeCalendar,
} from '@heroui/react';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';

interface FinancialCardProps {
  ClassName?: string;
  ingresos: number;
  egresos: number;
}

const FinancialCard = ({
  ClassName,
  ingresos = 0,
  egresos = 0,
}: FinancialCardProps) => {
  const [ganancia, setGanancia] = useState(ingresos - egresos);
  const [porcentajeCrecimiento, setPorcentajeCrecimiento] = useState(
    ((ganancia / ingresos) * 100).toFixed(1),
  );
  const [series, setSeries] = useState([0, 0]);

  useEffect(() => {
    const newGanancia = ingresos - egresos;
    setGanancia(newGanancia);
    setPorcentajeCrecimiento(((newGanancia / ingresos) * 100).toFixed(1));
    setSeries([ingresos, egresos]);
  }, [ingresos, egresos]);

  const options = {
    chart: {
      type: 'donut' as const,
    },
    labels: ['Ingresos', 'Egresos'],
    colors: ['#17c964', '#f31260'],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
      y: {
        formatter: (val: { toLocaleString: () => any }) =>
          `$${val.toLocaleString()}`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
          },
        },
      },
    ],
  };

  return (
    <div className={ClassName}>
      <h3 className="text-lg font-semibold text-default-700">
        Resumen Financiero
      </h3>
      <div className="flex">
        <div className="flex w-full flex-col gap-2">
          <div>
            <p className="mt-2 text-2xl font-bold">
              ${ganancia.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center">
              <span className="text-sm font-medium text-green-500">
                +{porcentajeCrecimiento}%
              </span>
              <span className="ml-1 text-xs text-default-500">vs ingresos</span>
            </div>
          </div>

          <div className="mt-4 flex w-36 items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-default-500">Ingresos</span>
              <span className="font-semibold text-default-700">
                ${ingresos.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-default-500">Egresos</span>
              <span className="font-semibold text-default-700">
                ${egresos.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <Chart
            options={options}
            series={series}
            type="donut"
            height="100%"
            width="100%"
          />
        </div>
      </div>
      <style jsx>{`
        .chart-container {
          width: 100%;
          max-width: 150px;
          height: 150px;
          position: relative;
        }
        .chart-container > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default FinancialCard;
