import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

const SafetyPage: NextPage = () => {
  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <header className="bg-gray-800 p-4 text-lg font-bold">
        <div>
          <Link href="/home" legacyBehavior>
            <a className="text-white">← Safety</a>
          </Link>
        </div>
      </header>
      
      <nav className="bg-gray-700 p-4 flex justify-around">
        <Link href="#evacuation" legacyBehavior>
          <a className="text-white">Evacuation</a>
        </Link>
        <Link href="#identify" legacyBehavior>
          <a className="text-white">Identify Surroundings</a>
        </Link>
        <Link href="#emergency" legacyBehavior>
          <a className="text-white">Emergency Guide</a>
        </Link>
        <Link href="#preparation" legacyBehavior>
          <a className="text-white">Preparation Guides</a>
        </Link>
      </nav>

      <main className="p-8 flex-1">
        <div className="bg-gray-800 p-4 rounded">
          <h1 className="text-3xl mb-4">Article Title</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
          </p>
        </div>
      </main>
      
      <footer className="bg-gray-800 p-4 flex justify-around">
        <Link href="/home" legacyBehavior>
          <a className="text-white" aria-label="Home">🏠</a>
        </Link>
        <Link href="/articles" legacyBehavior>
          <a className="text-white" aria-label="Articles">📃</a>
        </Link>
        <Link href="/weather" legacyBehavior>
          <a className="text-white" aria-label="Weather">☀️</a>
        </Link>
        <Link href="/safety" legacyBehavior>
          <a className="text-white" aria-label="Safety">🛡️</a>
        </Link>
        <Link href="/settings" legacyBehavior>
          <a className="text-white" aria-label="Settings">⚙️</a>
        </Link>
      </footer>
    </div>
  );
};

export default SafetyPage;

// Add the route in the Next.js pages directory as 'pages/safety.tsx'
