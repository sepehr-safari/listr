import { Header } from '@/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

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
