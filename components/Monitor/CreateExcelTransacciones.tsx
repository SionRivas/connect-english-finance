'use client';
import React, { useRef, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Checkbox,
  CalendarDate,
} from '@heroui/react';
import { DownloadIcon, TableExportIcon } from '../icons';

interface CreateExcelTransaccionesProps {
  startDate: CalendarDate;
  endDate: CalendarDate;
}

export const CreateExcelTransacciones: React.FC<
  CreateExcelTransaccionesProps
> = ({ startDate, endDate }) => {
  // Se almacenan los valores seleccionados de forma mutable
  const [isLoading, setIsLoading] = useState(false);

  // Definición de las opciones de exportación
  const checkboxOptions = [
    { label: 'Id', value: 'id' },
    { label: 'Tipo', value: 'tipo' },
    { label: 'Categoría', value: 'categoria' },
    { label: 'Monto', value: 'monto' },
    { label: 'Fecha', value: 'fecha' },
    { label: 'Asociado', value: 'asociado' },
    { label: 'Comentario', value: 'comentario' },
    { label: 'Metodo de Pago', value: 'metodo_pago' },
    { label: 'Recibo', value: 'n_recibo' },
  ];

  const selectedValues = useRef<string[]>(
    checkboxOptions.map((option) => option.value),
  );
  // Maneja el cambio de estado de cada checkbox
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      selectedValues.current.push(value);
    } else {
      selectedValues.current = selectedValues.current.filter(
        (v) => v !== value,
      );
    }
  };

  // Simula el proceso de exportación
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate.toString());
      params.append('endDate', endDate.toString());
      selectedValues.current.forEach((value) => params.append('fields', value));

      const response = await fetch(`/api/export?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transacciones.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error during export:', error);
    }
    setIsLoading(false);
  };

  return (
    <Popover showArrow offset={10} placement="bottom" backdrop="opaque">
      <PopoverTrigger>
        <Button
          startContent={<TableExportIcon />}
          isIconOnly
          color="primary"
          variant="shadow"
        />
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {(titleProps) => (
          <div className="w-full px-2 py-2">
            <p
              className="text-small font-bold text-default-600"
              {...titleProps}
            >
              Selecciona los campos
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {checkboxOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  defaultSelected
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              color="primary"
              variant="shadow"
              isLoading={isLoading}
              onClick={handleExport}
            >
              {!isLoading ? <DownloadIcon /> : ''}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
