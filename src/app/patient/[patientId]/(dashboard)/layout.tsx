import PatientNavigation from '@/components/patientnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <PatientNavigation />
      <main className="flex-1 ml-64 p-8 bg-gray-1100">
        {children}
      </main>
    </div>
  );
}   
