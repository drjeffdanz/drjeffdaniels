import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import ZorkTerminal from './ZorkTerminal';

export const metadata: Metadata = {
  title: 'Executive Labyrinth',
  description:
    'An interactive text adventure set in the professional world of Dr. Jeff Daniels. Explore aerospace hangars, quantum labs, and cloud operations centers. Collect briefing documents. Win.',
  robots: { index: false },
};

export default function ZorkPage() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <Navigation />
      <main className="flex-1 pt-[73px] overflow-hidden">
        <ZorkTerminal />
      </main>
    </div>
  );
}
