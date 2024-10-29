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
    <>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" 
        />
        <script 
          src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js" 
          defer
        />
      </head>
      <main className="min-h-screen p-4 sm:p-8">
        {children}
      </main>
    </>
  );
}