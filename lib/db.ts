import { createClient } from '@libsql/client';

export const getUsersWithIdAndUsername = async () => {
  try {
    const users = await db.execute({
      sql: `SELECT id, username FROM user`,
      args: {},
    });
    return users.rows as any as { id: string; username: string }[];
  } catch (e) {
    return e;
  }
};

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN ?? '',
});

export const createUser = async (
  id: string,
  username: string,
  email: string,
  github_id: string | null = null,
  google_id: string | null = null,
) => {
  try {
    await db.execute({
      sql: `INSERT INTO user 
        (id, username, email, github_id, google_id)
        VALUES
        (:userId, :username, :email, :github_id, :google_id)`,
      args: {
        userId: id,
        username: username,
        email: email,
        github_id: github_id,
        google_id: google_id,
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const verifyExistingUser = async (
  username: string | null = null,
  github_id: string | null = null,
  google_id: string | null = null,
) => {
  try {
    const user = (
      await db.execute({
        sql: `SELECT * FROM user WHERE username = :username OR github_id = :github_id OR google_id = :google_id`,
        args: {
          username: username,
          github_id: github_id,
          google_id: google_id,
        },
      })
    ).rows[0] as unknown as DatabaseUser | undefined;
    return user;
  } catch (e) {
    return undefined;
  }
};

export const createCurso = async (nombre: string, fechaDeInicio: number) => {
  try {
    let resp = await db.execute({
      sql: `INSERT INTO Curso 
        (nombre, fechaDeInicio)
        VALUES
        (:nombre, :fechaDeInicio)`,
      args: {
        nombre: nombre,
        fechaDeInicio: fechaDeInicio,
      },
    });
    return Number(resp.lastInsertRowid);
  } catch (e) {
    return e;
  }
};

export const updateCurso = async (curso: Curso) => {
  try {
    await db.execute({
      sql: `UPDATE Curso 
        SET nombre = :nombre, fechaDeInicio = :fechaDeInicio, estado = :estado
        WHERE id = :id`,
      args: {
        id: curso.id,
        nombre: curso.nombre,
        fechaDeInicio: curso.fechaDeInicio,
        estado: curso.estado,
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const deleteCurso = async (id: number) => {
  try {
    await db.execute({
      sql: `DELETE FROM Curso WHERE id = :id`,
      args: {
        id: id,
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const getActiveCursos = async () => {
  try {
    const cursos = await db.execute({
      sql: `
        SELECT c.*, COUNT(a.id) as cantidadAlumnos 
        FROM Curso c 
        LEFT JOIN Alumno a ON c.id = a.id_curso 
        WHERE c.estado = 1 
        GROUP BY c.id
        ORDER BY c.id DESC`,
      args: {},
    });
    return cursos.rows as any as Curso[];
  } catch (e) {
    return e;
  }
};
export const getAllCursos = async () => {
  try {
    const cursos = await db.execute({
      sql: `
        SELECT c.*, COUNT(a.id) as cantidadAlumnos 
        FROM Curso c 
        LEFT JOIN Alumno a ON c.id = a.id_curso
        GROUP BY c.id
        ORDER BY c.id DESC`,
      args: {},
    });
    return cursos.rows as any as Curso[];
  } catch (e) {
    return e;
  }
};
export const getCursosPaginated = async (page: number, limit: number) => {
  try {
    const cursos = await db.execute({
      sql: `
        SELECT c.*, COUNT(a.id) as cantidadAlumnos 
        FROM Curso c 
        LEFT JOIN Alumno a ON c.id = a.id_curso
        GROUP BY c.id
        ORDER BY c.id DESC
        LIMIT :limit OFFSET :offset`,
      args: {
        limit: limit,
        offset: (page - 1) * limit,
      },
    });
    return cursos.rows as any as Curso[];
  } catch (e) {
    return e;
  }
};

export const getCursosCount = async () => {
  try {
    const cursos = await db.execute({
      sql: `SELECT COUNT(*) as count FROM Curso`,
      args: {},
    });
    return cursos.rows[0].count as number;
  } catch (e) {
    return e;
  }
};

export const CreateAlumno = async (alumno: Alumno) => {
  try {
    let resp = await db.execute({
      sql: `INSERT INTO Alumno 
        (nombre, encargado, estado, numero_contacto_1, numero_contacto_2, mensualidad, inscripcion, fecha_registro, id_curso, dia_corte)
        VALUES
        (:nombre, :encargado, :estado, :numero_contacto_1, :numero_contacto_2, :mensualidad, :inscripcion, :fecha_registro, :id_curso, :dia_corte)`,
      args: {
        nombre: alumno.nombre,
        encargado: alumno.encargado,
        estado: alumno.estado,
        numero_contacto_1: alumno.numero_contacto_1,
        numero_contacto_2: alumno.numero_contacto_2,
        mensualidad: alumno.mensualidad,
        inscripcion: alumno.inscripcion,
        fecha_registro: alumno.fecha_registro,
        id_curso: alumno.id_curso,
        dia_corte: alumno.dia_corte,
      },
    });
    return Number(resp.lastInsertRowid);
  } catch (e) {
    return e;
  }
};

export const updateAlumno = async (alumno: Alumno) => {
  try {
    await db.execute({
      sql: `UPDATE Alumno 
        SET nombre = :nombre, encargado = :encargado, estado = :estado, numero_contacto_1 = :numero_contacto_1, numero_contacto_2 = :numero_contacto_2, mensualidad = :mensualidad, inscripcion = :inscripcion, fecha_registro = :fecha_registro, id_curso = :id_curso, dia_corte = :dia_corte
        WHERE id = :id`,
      args: {
        id: alumno.id,
        nombre: alumno.nombre,
        encargado: alumno.encargado,
        estado: alumno.estado,
        numero_contacto_1: alumno.numero_contacto_1,
        numero_contacto_2: alumno.numero_contacto_2,
        mensualidad: alumno.mensualidad,
        inscripcion: alumno.inscripcion,
        fecha_registro: alumno.fecha_registro,
        id_curso: alumno.id_curso,
        dia_corte: alumno.dia_corte,
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const deleteAlumno = async (id: number) => {
  try {
    await db.execute({
      sql: `DELETE FROM Alumno WHERE id = :id`,
      args: {
        id: id,
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const getAllAlumnos = async () => {
  try {
    const alumnos = await db.execute({
      sql: `SELECT * FROM Alumno`,
      args: {},
    });
    return alumnos;
  } catch (e) {
    return e;
  }
};

export const getAlumnosByCurso = async (cursoId: number) => {
  try {
    const alumnos = (
      await db.execute({
        sql: `SELECT * FROM Alumno WHERE id_curso = :cursoId ORDER BY id DESC`,
        args: {
          cursoId: cursoId,
        },
      })
    ).rows as any as Alumno[];
    await Promise.all(
      alumnos.map(async (alumno) => {
        const ingresos = await db.execute({
          sql: `SELECT * FROM Transaccion WHERE id_alumno = :id`,
          args: {
            id: alumno.id.toString(),
          },
        });
        alumno.transacciones = ingresos.rows as any as Transaccion[];
      }),
    );
    return alumnos;
  } catch (e) {
    return e;
  }
};

export const getActiveAlumnosByCurso = async (cursoId: number) => {
  try {
    const alumnos = (
      await db.execute({
        sql: `SELECT * FROM Alumno WHERE id_curso = :cursoId AND estado = 1 ORDER BY id DESC`,
        args: {
          cursoId: cursoId,
        },
      })
    ).rows as any as Alumno[];

    return alumnos;
  } catch (e) {
    return e;
  }
};

export const createTransaccion = async (transaccion: Transaccion) => {
  try {
    let resp = await db.execute({
      sql: `INSERT INTO Transaccion 
        (id_alumno, id_user, tipo, categoria, monto, fecha, comentario)
        VALUES
        (:id_alumno, :id_user, :tipo, :categoria, :monto, :fecha, :comentario)`,
      args: {
        id_alumno: transaccion.id_alumno,
        id_user: transaccion.id_user,
        tipo: transaccion.tipo,
        categoria: transaccion.categoria,
        monto: transaccion.monto,
        fecha: transaccion.fecha,
        comentario: transaccion.comentario,
      },
    });
    return Number(resp.lastInsertRowid);
  } catch (e) {
    return e;
  }
};

export const deleteTransaccion = async (id: number) => {
  try {
    await db.execute({
      sql: `DELETE FROM Transaccion WHERE id = :id`,
      args: {
        id: id,
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const getAllTransacciones = async () => {
  try {
    const transacciones = await db.execute({
      sql: `SELECT t.*, a.nombre as nombre_alumno 
        FROM Transaccion t 
        LEFT JOIN Alumno a ON t.id_alumno = a.id 
        ORDER BY t.id DESC`,
      args: {},
    });
    return transacciones.rows as any as Transaccion[];
  } catch (e) {
    return e;
  }
};

export const getTransaccionesByDateRange = async (
  startDate: number,
  endDate: number,
) => {
  try {
    const transacciones = await db.execute({
      sql: `SELECT t.*, a.nombre as nombre_alumno 
        FROM Transaccion t 
        LEFT JOIN Alumno a ON t.id_alumno = a.id 
        WHERE t.fecha BETWEEN :startDate AND :endDate 
        ORDER BY t.id DESC`,
      args: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    return transacciones.rows as any as Transaccion[];
  } catch (e) {
    return e;
  }
};

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  github_id: string;
  google_id: string;
}

export interface Curso {
  id: number;
  nombre: string;
  fechaDeInicio: number;
  estado: boolean;
  cantidadAlumnos: number;
}

export interface Alumno {
  id: number;
  nombre: string;
  encargado: string | null;
  estado: boolean;
  numero_contacto_1: number;
  numero_contacto_2: number | null;
  mensualidad: number;
  inscripcion: number;
  fecha_registro: number;
  id_curso: number;
  dia_corte: number;
  transacciones: Transaccion[];
}

export interface Transaccion {
  id: number;
  id_alumno: string | null;
  nombre_alumno: string | null;
  id_user: string;
  user_name: string;
  tipo: number;
  categoria: string;
  monto: number;
  fecha: number; // UNIX timestamp
  comentario: string | null;
}
