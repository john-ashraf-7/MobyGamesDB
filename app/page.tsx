import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#00ADB5' }}>
          MobyGames Database
        </h1>
        <p className="text-xl mb-12 text-gray-300">
          Explore video games, ratings, and industry insights
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Features */}
          <Link href="/register" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Register
            </h2>
            <p className="text-gray-300">Create a new user account</p>
          </Link>

          <Link href="/ratings/add" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Rate Games
            </h2>
            <p className="text-gray-300">Add your ratings for video games</p>
          </Link>

          <Link href="/ratings/view" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              My Ratings
            </h2>
            <p className="text-gray-300">View your existing ratings</p>
          </Link>

          {/* Game Discovery */}
          <Link href="/games/top-rated" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Top Rated Games
            </h2>
            <p className="text-gray-300">Best games by critics and players</p>
          </Link>

          <Link href="/games/filter" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Browse Games
            </h2>
            <p className="text-gray-300">Filter by genre, platform, publisher</p>
          </Link>

          <Link href="/games/top-moby" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Top by Moby Score
            </h2>
            <p className="text-gray-300">Top 5 games by Moby score</p>
          </Link>

          {/* Industry Insights */}
          <Link href="/developers/top" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Top Developers
            </h2>
            <p className="text-gray-300">Best developers by critic ratings</p>
          </Link>

          <Link href="/directors/top" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Top Directors
            </h2>
            <p className="text-gray-300">Directors by game volume</p>
          </Link>

          <Link href="/collaborations" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Collaborations
            </h2>
            <p className="text-gray-300">Top director-developer partnerships</p>
          </Link>

          {/* Analytics */}
          <Link href="/games/dream-game" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Dream Game
            </h2>
            <p className="text-gray-300">Perfect game based on player ratings</p>
          </Link>

          <Link href="/platforms/stats" className="card hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#00ADB5' }}>
              Platform Stats
            </h2>
            <p className="text-gray-300">Games per platform with ratings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
