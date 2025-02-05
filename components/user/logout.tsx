import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LogoutIcon } from "../icons";
import { Button, ButtonGroup } from "@heroui/button";
export default async function Page() {
  return (
    <form action={logout} className="flex items-center justify-center ">
      <Button isIconOnly size="sm" type="submit" color="success">
        <LogoutIcon className="text-white" />
      </Button>
    </form>
  );
}

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}

interface ActionResult {
  error: string | null;
}
