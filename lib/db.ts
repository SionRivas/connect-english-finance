import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
  authToken: process.env.TURSO_AUTH_TOKEN ?? "",
});

export const createUser = async (
  id: string,
  username: string,
  email: string,
  github_id: string | null = null,
  google_id: string | null = null
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
  google_id: string | null = null
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
        GROUP BY c.id`,
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
  encargado: string;
  estado: boolean;
  numero_contacto_1: number;
  numero_contacto_2: number;
  numero_contacto_3: number;
  mensualidad: number;
  inscripcion: number;
  fecha_registro: number;
  id_curso: number;
  dia_corte: number;
}
