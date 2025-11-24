'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlatformStatsPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/platforms/stats');
      const data = await res.json();
      setPlatforms(data);
    } catch (err) {
      console.error('Failed to fetch platform stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          Platform Statistics
        </h1>

        {loading ? (
          <div className="card text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.platform_id} className="card">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#00ADB5' }}>
                  {platform.platform_name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#222831' }}>
                    <p className="text-gray-500 text-sm mb-2">Total Games</p>
                    <p className="text-4xl font-bold" style={{ color: '#00ADB5' }}>
                      {platform.game_count}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#222831' }}>
                    <p className="text-gray-500 text-sm mb-2">Avg Critics Rating</p>
                    <p className="text-4xl font-bold" style={{ color: '#00ADB5' }}>
                      {platform.avg_critic_rating ? parseFloat(platform.avg_critic_rating).toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#222831' }}>
                    <p className="text-gray-500 text-sm mb-2">Avg Player Rating</p>
                    <p className="text-4xl font-bold" style={{ color: '#00ADB5' }}>
                      {platform.avg_player_rating ? parseFloat(platform.avg_player_rating).toFixed(2) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {platforms.length === 0 && (
              <div className="card text-center">
                <p className="text-gray-400">No platform data available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
