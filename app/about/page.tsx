import { title } from "@/components/primitives";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function AboutPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div>
      <h1>Hi, {user.username}!</h1>;<h1 className={title()}>About</h1>
    </div>
  );
}
