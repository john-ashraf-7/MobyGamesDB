'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FilterGamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    genre: '',
    platform: '',
    publisher: '',
    developer: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchGames();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [genresRes, platformsRes, publishersRes, developersRes] = await Promise.all([
        fetch('/api/metadata/genres'),
        fetch('/api/metadata/platforms'),
        fetch('/api/metadata/publishers'),
        fetch('/api/metadata/developers')
      ]);
      setGenres(await genresRes.json());
      setPlatforms(await platformsRes.json());
      setPublishers(await publishersRes.json());
      setDevelopers(await developersRes.json());
    } catch (err) {
      console.error('Failed to fetch metadata');
    }
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.publisher) params.append('publisher', filters.publisher);
      if (filters.developer) params.append('developer', filters.developer);

      const res = await fetch(`/api/games/filter?${params}`);
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
  }, [filters]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          Browse Games
        </h1>

        <div className="card mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Genre</label>
            <select
              className="select-field"
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
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
            <label className="block mb-2 font-semibold">Platform</label>
            <select
              className="select-field"
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            >
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform.platform_id} value={platform.name}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Publisher</label>
            <select
              className="select-field"
              value={filters.publisher}
              onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
            >
              <option value="">All Publishers</option>
              {publishers.map((publisher) => (
                <option key={publisher.publisher_id} value={publisher.name}>
                  {publisher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Developer</label>
            <select
              className="select-field"
              value={filters.developer}
              onChange={(e) => setFilters({ ...filters, developer: e.target.value })}
            >
              <option value="">All Developers</option>
              {developers.map((developer) => (
                <option key={developer.developer_id} value={developer.name}>
                  {developer.name}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <div key={game.game_id} className="card">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#00ADB5' }}>
                  {game.name}
                </h2>
                <div className="mb-3">
                  <span className="text-2xl font-bold" style={{ color: '#00ADB5' }}>
                    {game.moby_score || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">Moby Score</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Released:</span> {new Date(game.release_date).toLocaleDateString()}</p>
                  <p><span className="text-gray-500">Genres:</span> {game.genres}</p>
                  <p><span className="text-gray-500">Platforms:</span> {game.platforms}</p>
                  <p><span className="text-gray-500">Publishers:</span> {game.publishers}</p>
                  <p><span className="text-gray-500">Developers:</span> {game.developers}</p>
                </div>
              </div>
            ))}
            {games.length === 0 && (
              <div className="card text-center col-span-2">
                <p className="text-gray-400">No games found with the selected filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
