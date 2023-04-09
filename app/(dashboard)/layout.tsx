import { Header, Navbar } from '@/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 z-20 w-full bg-base-200 bg-opacity-50 shadow-lg shadow-black backdrop-blur-lg">
        <Header />

        <Navbar />
      </header>

      <main className="flex justify-center pt-32">
        <div className="flex w-full max-w-screen-xl justify-center">
          <section className="flex w-full flex-col gap-4 px-4 py-4 max-w-screen-md">
            {children}
          </section>
        </div>
      </main>
    </>
  );
}
