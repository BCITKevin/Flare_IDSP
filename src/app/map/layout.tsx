import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vancouver Weather Map',
  description: 'Fire weather index and weather conditions map for Vancouver',
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen sm:p-8">
      {children}
    </main>
  );
}