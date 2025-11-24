'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DreamGamePage() {
  const [dreamGame, setDreamGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDreamGame();
  }, []);

  const fetchDreamGame = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/games/dream-game');
      const data = await res.json();
      setDreamGame(data);
    } catch (err) {
      console.error('Failed to fetch dream game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#00ADB5' }}>
          Dream Game
        </h1>
        <p className="text-gray-300 mb-8">
          Perfect game specifications based on highest player ratings
        </p>

        {loading ? (
          <div className="card text-center">
            <p>Loading...</p>
          </div>
        ) : dreamGame && Object.keys(dreamGame).length > 0 ? (
          <div className="card">
            <div className="text-center mb-8">
              <div className="text-7xl font-bold mb-2" style={{ color: '#00ADB5' }}>
                {dreamGame.avg_player_rating ? parseFloat(dreamGame.avg_player_rating).toFixed(2) : 'N/A'}
              </div>
              <p className="text-gray-500">Average Player Rating</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#222831' }}>
                <h3 className="text-sm text-gray-500 mb-2">Genres</h3>
                <p className="text-xl font-semibold">{dreamGame.genres || 'Not specified'}</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#222831' }}>
                <h3 className="text-sm text-gray-500 mb-2">Settings</h3>
                <p className="text-xl font-semibold">{dreamGame.settings || 'Not specified'}</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#222831' }}>
                <h3 className="text-sm text-gray-500 mb-2">Developers</h3>
                <p className="text-xl font-semibold">{dreamGame.developers || 'Not specified'}</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#222831' }}>
                <h3 className="text-sm text-gray-500 mb-2">Publishers</h3>
                <p className="text-xl font-semibold">{dreamGame.publishers || 'Not specified'}</p>
              </div>

              <div className="p-4 rounded-lg md:col-span-2" style={{ backgroundColor: '#222831' }}>
                <h3 className="text-sm text-gray-500 mb-2">Based on Analysis</h3>
                <p className="text-xl font-semibold">{dreamGame.game_count || 0} games analyzed</p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg border-2" style={{ borderColor: '#00ADB5', backgroundColor: '#222831' }}>
              <p className="text-center text-gray-300">
                This combination represents the most successful formula based on player preferences and ratings.
              </p>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-gray-400">No data available for dream game analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
