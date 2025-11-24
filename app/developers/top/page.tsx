'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopDevelopersPage() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchDevelopers();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await fetch('/api/metadata/genres');
      setGenres(await res.json());
    } catch (err) {
      console.error('Failed to fetch genres');
    }
  };

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGenre) params.append('genre', selectedGenre);

      const res = await fetch(`/api/developers/top-by-critics?${params}`);
      const data = await res.json();
      setDevelopers(data);
    } catch (err) {
      console.error('Failed to fetch developers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [selectedGenre]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          Top 5 Developers by Critics Rating
        </h1>

        <div className="card mb-6">
          <label className="block mb-2 font-semibold">Filter by Genre</label>
          <select
            className="select-field"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.genre_id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="card text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {developers.map((dev, index) => (
              <div key={dev.developer_id} className="card flex items-center gap-6">
                <div className="text-6xl font-bold" style={{ color: '#00ADB5', opacity: 0.3 }}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#00ADB5' }}>
                    {dev.name}
                  </h2>
                  <p className="text-gray-300 mb-3">{dev.overview}</p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-gray-500 text-sm">Average Critics Rating</p>
                      <p className="text-3xl font-bold" style={{ color: '#00ADB5' }}>
                        {parseFloat(dev.avg_critic_rating).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Genre</p>
                      <p className="text-lg">{dev.genre_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Games</p>
                      <p className="text-lg">{dev.game_count}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {developers.length === 0 && (
              <div className="card text-center">
                <p className="text-gray-400">No developers found with the selected filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
