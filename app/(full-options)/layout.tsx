import { Navbar } from '@/components/navbar';

import { validateRequest } from '@/lib/auth';
export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  return (
    <div className="relative">
      <div className="fixed z-[-1] h-screen w-full bg-gradient-to-b from-background to-default-50"></div>
      <Navbar username={user?.username?.toString() || 'Guest'} />
      <div className="w-full">
        <main className="container mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-5">
          {children}
        </main>
        <footer className="flex w-full items-center justify-center py-3"></footer>
      </div>
    </div>
  );
}
