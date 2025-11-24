'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopDirectorsPage() {
  const [directors, setDirectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/directors/top-by-volume');
      const data = await res.json();
      setDirectors(data);
    } catch (err) {
      console.error('Failed to fetch directors');
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
          Top 5 Directors by Game Volume
        </h1>

        {loading ? (
          <div className="card text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {directors.map((director, index) => (
              <div key={director.director_id} className="card flex items-center gap-6">
                <div className="text-6xl font-bold" style={{ color: '#00ADB5', opacity: 0.3 }}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#00ADB5' }}>
                    {director.name}
                  </h2>
                  <p className="text-gray-300 mb-3">{director.overview}</p>
                  <div>
                    <p className="text-gray-500 text-sm">Total Games Directed</p>
                    <p className="text-3xl font-bold" style={{ color: '#00ADB5' }}>
                      {director.game_count}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {directors.length === 0 && (
              <div className="card text-center">
                <p className="text-gray-400">No directors found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
