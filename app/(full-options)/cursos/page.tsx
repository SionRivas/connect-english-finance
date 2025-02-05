import { title } from "@/components/primitives";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { Button } from "@heroui/button";
import { CrearCursoModal } from "@/components/Cursos/CrearCursoModal";
import { TableExport } from "@/components/icons";
import { Card, CardBody } from "@heroui/card";

import { getCursosCount } from "@/lib/db";

import TableCursos from "@/components/Cursos/TableCursos";

export default async function AboutPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const cursosCount = (await getCursosCount()) as number;
  return (
    <div className="flex flex-col gap-5 max-w-5xl w-full">
      <div>
        <h1 className={title({ color: "green" })}>Cursos</h1>
        <p className="text-default-800">
          En esta sección podrás ver los cursos creados y administrarlos.
        </p>
      </div>
      <div className="flex gap-3 w-full flex-wrap">
        <CrearCursoModal />
        <Button startContent={<TableExport />} color="primary" variant="shadow">
          Exportar a Excel
        </Button>
      </div>
      <div>
        <TableCursos pageSize={8} totalItems={cursosCount} />
      </div>
    </div>
  );
}
