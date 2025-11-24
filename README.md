# MobyGames Database Application

A modern web application for exploring video games, ratings, and industry insights. Built with Next.js 16, TypeScript, and MySQL.

## Features Implemented

### User Management
- ✅ **Register a user** - Create new user accounts with email, username, and optional profile details
- ✅ **Add ratings** - Submit ratings and reviews for existing video games
- ✅ **View ratings** - View all ratings submitted by a specific user

### Game Discovery
- ✅ **Top rated games** - View top-rated games by critics and players, filterable by genre and year
- ✅ **Browse games** - Filter games by genre, platform, publisher, or developer
- ✅ **Top by Moby Score** - View top 5 games by Moby score, filterable by genre and setting

### Industry Insights
- ✅ **Top developers** - View top 5 development companies by critics rating in each genre
- ✅ **Top directors** - View best 5 game directors based on volume of games
- ✅ **Collaborations** - View top 5 director-developer collaborations by number of games

### Analytics
- ✅ **Dream Game** - View perfect game specifications based on highest player ratings
- ✅ **Platform Stats** - View number of games per platform with average ratings

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Database**: MySQL (hosted on Aiven)
- **API**: Next.js API Routes
- **Database Client**: mysql2

## Color Palette

- Primary: `#222831` - Dark background
- Secondary: `#393E46` - Card backgrounds
- Accent: `#00ADB5` - Cyan highlights
- Light: `#EEEEEE` - Text color

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to the Aiven MySQL database (credentials in `.env.local`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env.local`:
```
DATABASE_URL=mysql://avnadmin:AVNS_4eZWwoVd-DwQKrzO6-3@mysql-9bedf75-mysqlmobygamesdb.k.aivencloud.com:26245/defaultdb?ssl-mode=REQUIRED
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /api                    # API routes
    /users/register       # User registration
    /ratings/user         # Add/view user ratings
    /games/*              # Game queries
    /developers/*         # Developer queries
    /directors/*          # Director queries
    /collaborations/*     # Collaboration queries
    /platforms/*          # Platform statistics
    /metadata/*           # Dropdown data (genres, platforms, etc.)
  /register              # User registration page
  /ratings/add           # Add rating page
  /ratings/view          # View user ratings page
  /games/*               # Game browsing pages
  /developers/top        # Top developers page
  /directors/top         # Top directors page
  /collaborations        # Collaborations page
  /platforms/stats       # Platform statistics page
  page.tsx               # Homepage with navigation
  layout.tsx             # Root layout
  globals.css            # Global styles with color palette

/lib
  db.ts                  # Database connection utility

/Database
  Dump20251120.sql       # Database schema and sample data
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register a new user
- `POST /api/ratings/user` - Add a new rating
- `GET /api/ratings/user?userId={id}` - Get user's ratings

### Game Queries
- `GET /api/games/top-rated?genre={genre}&year={year}` - Top rated games
- `GET /api/games/filter?genre={genre}&platform={platform}&publisher={publisher}&developer={developer}` - Filter games
- `GET /api/games/top-moby-score?genre={genre}&setting={setting}` - Top 5 by Moby score
- `GET /api/games/dream-game` - Dream game specifications

### Industry Queries
- `GET /api/developers/top-by-critics?genre={genre}` - Top 5 developers by critics
- `GET /api/directors/top-by-volume` - Top 5 directors by game volume
- `GET /api/collaborations/top` - Top 5 director-developer collaborations
- `GET /api/platforms/stats` - Platform statistics

### Metadata
- `GET /api/metadata/genres` - All genres
- `GET /api/metadata/platforms` - All platforms
- `GET /api/metadata/publishers` - All publishers
- `GET /api/metadata/developers` - All developers
- `GET /api/metadata/settings` - All settings
- `GET /api/metadata/years` - All release years

## Usage Guide

### Registering a User
1. Navigate to the "Register" card on the homepage
2. Fill in email, username, and password (required)
3. Optionally add gender, age, birthdate, and country
4. Click "Register"

### Adding a Rating
1. Navigate to "Rate Games"
2. Enter your user ID (you'll get this after registration)
3. Select a game from the dropdown
4. Enter a rating (0-10)
5. Optionally add a review
6. Click "Submit Rating"

### Viewing Your Ratings
1. Navigate to "My Ratings"
2. Enter your user ID
3. Click "View Ratings"

### Exploring Games
- Use the various game browsing features to filter by different criteria
- All pages include navigation back to the homepage
- Filters update results in real-time

## Database Schema

The application connects to a MySQL database with the following main tables:
- `app_user` - User accounts
- `game` - Video game information
- `genre`, `platform`, `publisher`, `developer` - Game metadata
- `director` - Game directors
- `user_rating` - User-submitted ratings
- `critic_rating` - Professional critic ratings
- `player_rating` - Aggregated player ratings
- Junction tables for many-to-many relationships

## Notes

- The application uses server-side rendering for optimal performance
- All API routes include error handling
- The database connection uses connection pooling for efficiency
- Password hashing is implemented with bcrypt (though login is not implemented in this version)
- The color palette is consistently applied across all pages using CSS custom properties

## Development

To build for production:
```bash
npm run build
npm start
```

To run linting:
```bash
npm run lint
```

