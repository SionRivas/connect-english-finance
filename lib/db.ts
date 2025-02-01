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

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  github_id: string;
  google_id: string;
}
