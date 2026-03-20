import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Road Rage',
  description:
    'A pseudo-3D motorcycle combat racer. Choose Dirty Deeds or Skeeter and tear through traffic at breakneck speed.',
  robots: { index: false },
};

export default function RoadRagePage() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <Navigation />
      <main className="flex-1 pt-[73px] overflow-hidden">
        <iframe
          src="/road-rage/index.html"
          className="w-full h-full border-0"
          title="Road Rage"
          allow="autoplay"
        />
      </main>
    </div>
  );
}
