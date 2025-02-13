import { Navbar } from "@/components/navbar";

import { validateRequest } from "@/lib/auth";
export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  return (
    <div className="">
      <Navbar username={user?.username?.toString() || "Guest"} />
      <div className="w-full">
        <main className="container mx-auto max-w-7xl pt-5 px-6 flex flex-col items-center justify-center ">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3"></footer>
      </div>
    </div>
  );
}
