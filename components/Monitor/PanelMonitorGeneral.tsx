'use client';
import React, { useState } from 'react';
import RevenueChart from './RevenueChart';
import {
  Button,
  ButtonGroup,
  Card,
  DateRangePicker,
  Tooltip,
} from '@heroui/react';
import { TableExportIcon, TrendingDownIcon, TrendingUpIcon } from '../icons';
import FinancialCard from './FinancialCard';
import { CrearIngresoModal } from './CrearIngresoModal';
import { CrearEgresoModal } from './CrearEgresoModal';
import { InspeccionarTransaccionModal } from './InspeccionarTransaccionModal';
import { DeleteTransaccionModal } from './DeleteTransaccionModal';
import TableTransacciones from './TableTransacciones';
import {
  today,
  getLocalTimeZone,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { Transaccion } from '@/lib/db';

import { showToast } from '@/scripts/utilities';
import { CreateExcelTransacciones } from './CreateExcelTransacciones';

interface PanelMonitorProps {
  userId: string;
  users: string;
}

export default function PanelMonitorGeneral({
  userId,
  users,
}: PanelMonitorProps) {
  const [isIngresoModalOpen, setIsIngresoModalOpen] = useState(false);
  const [isEgresoModalOpen, setIsEgresoModalOpen] = useState(false);
  const [isInspeccionarModalOpen, setIsInspeccionarModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedTransaccion, setSelectedTransaccion] =
    useState<Transaccion | null>(null);

  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setRefreshKey((oldKey) => oldKey + 1);
  }

  let { locale } = useLocale();
  let now = today(getLocalTimeZone());
  let thisWeek = {
    start: startOfWeek(now, locale),
    end: endOfWeek(now, locale),
  };
  let thisMonth = {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
  let last3Months = {
    start: startOfMonth(now.subtract({ months: 2 })),
    end: endOfMonth(now),
  };

  let [value, setValue] = React.useState(thisWeek);

  function handleDelete(transaccionId: Number) {
    // Lógica para eliminar la transacción de la lista
    handleRefresh();
  }

  return (
    <>
      <div className="flex w-full flex-col place-items-center gap-5">
        <div className="flex w-full max-w-5xl flex-wrap place-content-between place-items-center gap-2">
          <div className="flex gap-2">
            <Button
              color="success"
              className="text-white"
              variant="shadow"
              startContent={<TrendingUpIcon />}
              onPress={() => setIsIngresoModalOpen(true)}
            >
              Ingreso
            </Button>
            <Button
              color="danger"
              className="text-white"
              variant="shadow"
              startContent={<TrendingDownIcon />}
              onPress={() => setIsEgresoModalOpen(true)}
            >
              Egreso
            </Button>

            <CreateExcelTransacciones
              startDate={value.start}
              endDate={value.end}
            />
          </div>

          <div className="flex flex-wrap place-items-end gap-1 md:flex-nowrap md:gap-4">
            <DateRangePicker
              isRequired
              className="max-w-xs"
              variant="underlined"
              value={value}
              onChange={(date) => {
                date && setValue(date);
              }}
              label="Rango de fechas"
            />
            <ButtonGroup
              fullWidth
              className="max-w-full"
              radius="full"
              size="sm"
              color="success"
              variant="flat"
            >
              <Button onPress={() => setValue(thisWeek)}>Esta semana</Button>
              <Button onPress={() => setValue(thisMonth)}>Este mes</Button>
              <Button onPress={() => setValue(last3Months)}>
                Ultimos 3 meses
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="w-full lg:col-span-2">
            <TableTransacciones
              key={refreshKey}
              startDate={value.start}
              endDate={value.end}
              onUpdated={(ingreso, egreso) => {
                setIngresos(ingreso);
                setEgresos(egreso);
              }}
              onDelete={(transaccion: Transaccion) => {
                setSelectedTransaccion(transaccion);
                setIsDeleteModalOpen(true);
              }}
              onEdit={() => {}}
              onInspection={(transaccion: Transaccion) => {
                setSelectedTransaccion(transaccion);
                setIsInspeccionarModalOpen(true);
              }}
            />
          </div>
          <div className="order-first w-full max-w-md lg:order-none">
            <Card className="flex flex-col gap-5 p-7">
              <FinancialCard ingresos={ingresos} egresos={egresos} />
            </Card>
          </div>
        </div>
      </div>
      <CrearIngresoModal
        userId={userId}
        isOpen={isIngresoModalOpen}
        onClose={() => setIsIngresoModalOpen(false)}
        onCreate={() => {
          setIsIngresoModalOpen(false);
          handleRefresh();
          showToast(
            'Ingreso creado',
            'success',
            'Se ha registrado la transacción',
          );
        }}
      />
      <CrearEgresoModal
        userId={userId}
        isOpen={isEgresoModalOpen}
        onClose={() => setIsEgresoModalOpen(false)}
        onCreate={() => {
          setIsEgresoModalOpen(false);
          handleRefresh();
          showToast(
            'Egreso creado',
            'success',
            'Se ha registrado la transacción',
          );
        }}
      />
      <InspeccionarTransaccionModal
        users={users}
        transaccion={selectedTransaccion}
        isOpen={isInspeccionarModalOpen}
        onClose={() => setIsInspeccionarModalOpen(false)}
      />
      <DeleteTransaccionModal
        transaccion={selectedTransaccion}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          setIsDeleteModalOpen(false);
          handleDelete(selectedTransaccion?.id as Number);
          showToast('Transacción eliminada', 'danger');
        }}
      />
    </>
  );
}
