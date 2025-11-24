'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collaborations/top');
      const data = await res.json();
      setCollaborations(data);
    } catch (err) {
      console.error('Failed to fetch collaborations');
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
          Top 5 Director-Developer Collaborations
        </h1>

        {loading ? (
          <div className="card text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collaborations.map((collab, index) => (
              <div key={index} className="card flex items-center gap-6">
                <div className="text-6xl font-bold" style={{ color: '#00ADB5', opacity: 0.3 }}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Director</p>
                      <h2 className="text-2xl font-bold" style={{ color: '#00ADB5' }}>
                        {collab.director_name}
                      </h2>
                    </div>
                    <div className="text-2xl text-gray-500">×</div>
                    <div>
                      <p className="text-sm text-gray-500">Developer</p>
                      <h2 className="text-2xl font-bold" style={{ color: '#00ADB5' }}>
                        {collab.developer_name}
                      </h2>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-500 text-sm">Games Worked Together</p>
                    <p className="text-3xl font-bold" style={{ color: '#00ADB5' }}>
                      {collab.collaboration_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Games:</p>
                    <p className="text-gray-300">{collab.games}</p>
                  </div>
                </div>
              </div>
            ))}
            {collaborations.length === 0 && (
              <div className="card text-center">
                <p className="text-gray-400">No collaborations found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
