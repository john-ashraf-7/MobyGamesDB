'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopMobyScorePage() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSetting, setSelectedSetting] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchGames();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [genresRes, settingsRes] = await Promise.all([
        fetch('/api/metadata/genres'),
        fetch('/api/metadata/settings')
      ]);
      setGenres(await genresRes.json());
      setSettings(await settingsRes.json());
    } catch (err) {
      console.error('Failed to fetch metadata');
    }
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedSetting) params.append('setting', selectedSetting);

      const res = await fetch(`/api/games/top-moby-score?${params}`);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error('Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [selectedGenre, selectedSetting]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          Top 5 Games by Moby Score
        </h1>

        <div className="card mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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

          <div>
            <label className="block mb-2 font-semibold">Filter by Setting</label>
            <select
              className="select-field"
              value={selectedSetting}
              onChange={(e) => setSelectedSetting(e.target.value)}
            >
              <option value="">All Settings</option>
              {settings.map((setting) => (
                <option key={setting.setting_id} value={setting.name}>
                  {setting.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="card text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((game, index) => (
              <div key={game.game_id} className="card flex items-center gap-6">
                <div className="text-6xl font-bold" style={{ color: '#00ADB5', opacity: 0.3 }}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#00ADB5' }}>
                    {game.name}
                  </h2>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500">Moby Score</p>
                      <p className="text-3xl font-bold">{game.moby_score}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Genre</p>
                      <p className="text-lg">{game.genre_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Setting</p>
                      <p className="text-lg">{game.setting_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Released</p>
                      <p className="text-lg">{new Date(game.release_date).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {games.length === 0 && (
              <div className="card text-center">
                <p className="text-gray-400">No games found with the selected filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
