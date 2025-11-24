'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AddRatingPage() {
  const [userId, setUserId] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/games/filter');
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error('Failed to fetch games');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/ratings/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          gameId: parseInt(selectedGame),
          rating: parseFloat(rating),
          reviewText
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setRating('');
        setReviewText('');
        setSelectedGame('');
      } else {
        setError(data.error || 'Failed to add rating');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm mb-4 inline-block" style={{ color: '#00ADB5' }}>
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          Add Game Rating
        </h1>

        {error && (
          <div className="card mb-6 border-2 border-red-500">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="card mb-6 border-2" style={{ borderColor: '#00ADB5' }}>
            <p style={{ color: '#00ADB5' }}>Rating added successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block mb-2 font-semibold">User ID *</label>
            <input
              type="number"
              required
              className="input-field"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Select Game *</label>
            <select
              required
              className="select-field"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <option value="">Choose a game</option>
              {games.map((game) => (
                <option key={game.game_id} value={game.game_id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Rating (0-10) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              required
              className="input-field"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g., 8.5"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Review (Optional)</label>
            <textarea
              className="input-field"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about the game..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>
    </div>
  );
}
