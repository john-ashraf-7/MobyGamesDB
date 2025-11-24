'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ViewRatingsPage() {
  const [userId, setUserId] = useState('');
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRatings = async () => {
    if (!userId) return;
    
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/ratings/user?userId=${userId}`);
      const data = await res.json();

      if (res.ok) {
        setRatings(data);
      } else {
        setError(data.error || 'Failed to fetch ratings');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
        
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#00ADB5' }}>
          My Ratings
        </h1>

        <div className="card mb-6">
          <div className="flex gap-4">
            <input
              type="number"
              className="input-field flex-1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
            />
            <button
              onClick={fetchRatings}
              disabled={loading || !userId}
              className="btn-primary"
            >
              {loading ? 'Loading...' : 'View Ratings'}
            </button>
          </div>
        </div>

        {error && (
          <div className="card mb-6 border-2 border-red-500">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {ratings.length > 0 && (
          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: '#00ADB5' }}>
                      {rating.game_name}
                    </h3>
                    <p className="text-sm text-gray-400">Moby Score: {rating.moby_score}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: '#00ADB5' }}>
                      {rating.rating}
                    </div>
                    <div className="text-sm text-gray-400">Your Rating</div>
                  </div>
                </div>
                {rating.review_text && (
                  <p className="text-gray-300 mb-3">{rating.review_text}</p>
                )}
                <p className="text-sm text-gray-500">
                  Rated on {new Date(rating.created_at).toLocaleDateString()}
                  {rating.updated_at && ` (Updated: ${new Date(rating.updated_at).toLocaleDateString()})`}
                </p>
              </div>
            ))}
          </div>
        )}

        {ratings.length === 0 && !loading && !error && userId && (
          <div className="card text-center">
            <p className="text-gray-400">No ratings found for this user.</p>
          </div>
        )}
      </div>
    </div>
  );
}
