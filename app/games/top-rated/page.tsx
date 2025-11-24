'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopRatedGamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchGames();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [genresRes, yearsRes] = await Promise.all([
        fetch('/api/metadata/genres'),
        fetch('/api/metadata/years')
      ]);
      setGenres(await genresRes.json());
      setYears(await yearsRes.json());
    } catch (err) {
      console.error('Failed to fetch metadata');
    }
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedYear) params.append('year', selectedYear);

      const res = await fetch(`/api/games/top-rated?${params}`);
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
  }, [selectedGenre, selectedYear]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          Top Rated Games
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
            <label className="block mb-2 font-semibold">Filter by Year</label>
            <select
              className="select-field"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year.year} value={year.year}>
                  {year.year}
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
            {games.map((game) => (
              <div key={game.game_id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#00ADB5' }}>
                      {game.name}
                    </h2>
                    <p className="text-gray-400 mb-2">
                      {game.genre_name} • Released: {new Date(game.release_date).getFullYear()}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Moby Score</p>
                        <p className="text-xl font-bold">{game.moby_score || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Critics Rating</p>
                        <p className="text-xl font-bold">
                          {game.avg_critic_rating ? parseFloat(game.avg_critic_rating).toFixed(2) : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">({game.critic_count} reviews)</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Players Rating</p>
                        <p className="text-xl font-bold">
                          {game.avg_player_rating ? parseFloat(game.avg_player_rating).toFixed(2) : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">({game.player_count} ratings)</p>
                      </div>
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
