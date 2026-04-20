'use client';

import Image from 'next/image';
import mapImage from '@/app/map.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Define the type for a map hotspot
type Hotspot = {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
};

// Placeholder hotspots. You can adjust the x and y percentages to align 
// perfectly with the elements on your specific map.png
const HOTSPOTS: Hotspot[] = [
  {
    id: 'mid-boss',
    x: 50,
    y: 50,
    title: 'Mid Boss',
    description: 'Defeat the Mid Boss to gain the Rejuvenator, granting your team powerful buffs and respawn advantages.',
  },
  {
    id: 'bridge-buff-Y',
    x: 30.75,
    y: 49.4,
    title: 'Bridge Buff',
    description: 'Spawns periodically. Grants a temporary buff to the hero who collects it. Randomly selects from gun, spirit, vitality, and movement.',
  },
  {
    id: 'bridge-buff-G',
    x: 69.5,
    y: 50.5,
    title: 'Bridge Buff',
    description: 'Spawns periodically. Grants a temporary buff to the hero who collects it. Randomly selects from gun, spirit, vitality, and movement.',
  },
  {
    id: 'urn-spawn-G',
    x: 82.5,
    y: 50,
    title: 'Soul Urn Spawn/Drop (Even)',
    description: 'The Soul Urn spawns either here or the other half\'s point. Carry it to the opposing drop-off point for a team-wide soul reward.',
  },
  {
    id: 'urn-spawn-Y',
    x: 18.5,
    y: 50,
    title: 'Soul Urn Spawn/Drop (Even)',
    description: 'The Soul Urn spawns either here or the other half\'s point. Carry it to the opposing drop-off point for a team-wide soul reward.',
  },
  {
    id: 'guardian',
    x: 48.8,
    y: 41.3,
    title: 'Guardian',
    description: 'These icons indicate Guardians, basic towers that guard lanes. Taking these down is the goal of the laning phase.',
  },
  {
    id: 'walker',
    x: 58.15,
    y: 34.5,
    title: 'Walker',
    description: 'These icons mark Walkers, heavily defended towers that protect lanes deeper in. Defeating them unlocks an item slot for the team.',
  },
  {
    id: 'base-guardian',
    x: 50,
    y: 21,
    title: 'Base Guardians',
    description: 'These are a pair of guardians blocking the way into the base. Dropping them makes the lane faster for the attacking team.',
  },
  {
    id: 'shrine',
    x: 58.3,
    y: 11.7,
    title: 'Shrine',
    description: 'Each base has two shrines on either side that protect the Patron from being attacked. These must be destroyed to damage the Patron, and knocking down both of them buffs the team\'s minions.',
  }
];

export default function MinimapPage() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Interactive Minimap
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Hover over the highlighted areas on the map to learn more about key locations, objectives, and buffs.
        </p>
        
        <div className="w-full max-w-5xl border border-gray-800 rounded-lg p-4 bg-gray-900/50 shadow-2xl flex justify-center">
          {/* Container for the map and overlays - needs relative positioning */}
          <div className="relative w-full max-w-[800px] aspect-square bg-black/50 rounded-lg overflow-hidden">
            <Image 
              src={mapImage} 
              alt="Deadlock Minimap"
              fill
              className="object-contain"
              priority
            />
            
            {/* Hotspot overlays */}
            {HOTSPOTS.map((hotspot) => (
              <div
                key={hotspot.id}
                className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full cursor-pointer group ${activeHotspot === hotspot.id ? 'z-50' : 'z-10'}`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onMouseEnter={() => setActiveHotspot(hotspot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {/* Hotspot Marker (e.g., a pulsing dot) */}
                <div className="w-full h-full rounded-full bg-amber-500/50 border-2 border-amber-400 flex items-center justify-center relative shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                  <span className="absolute w-full h-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-white shadow-sm" />
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {activeHotspot === hotspot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: hotspot.y < 25 ? -10 : 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: hotspot.y < 25 ? -10 : 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      // The tooltip itself is absolutely positioned relative to the hotspot dot
                      className={`absolute left-1/2 -translate-x-1/2 ${hotspot.y < 25 ? 'top-full mt-4' : 'bottom-full mb-4'} w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 pointer-events-none z-50 text-left`}
                    >
                      {/* Tooltip Triangle pointer (outer border) */}
                      <div className={`absolute left-1/2 -translate-x-1/2 border-[8px] border-transparent ${hotspot.y < 25 ? 'bottom-full -mb-[1px] border-b-gray-700' : 'top-full -mt-[1px] border-t-gray-700'}`} />
                      {/* Tooltip Triangle pointer (inner background) */}
                      <div className={`absolute left-1/2 -translate-x-1/2 border-[7px] border-transparent ${hotspot.y < 25 ? 'bottom-full -mb-[2px] border-b-gray-900' : 'top-full -mt-[2px] border-t-gray-900'}`} />
                      
                      <h3 className="text-amber-400 font-bold text-lg mb-1">{hotspot.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{hotspot.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}