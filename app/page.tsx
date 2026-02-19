"use client";
import QrGenerator from '../components/QrGenerator';

export default function Home() {

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
          <QrGenerator />
      </div>
    </main>
  );
}