# MobyGames Database

A full-stack relational database application for exploring video game data, ratings, and industry insights. Built as an **individual project** for the **Fundamentals of Database Systems (CSCE 2501)** course at the American University in Cairo, this project demonstrates comprehensive expertise in database design, web scraping, SQL query optimization, and full-stack development.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?style=flat-square&logo=mysql)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)

## 🎯 Overview

This project is a comprehensive video game database system that scrapes data from the renowned [MobyGames website](https://www.mobygames.com) for video games released between 2020-2025, stores it in a normalized relational MySQL database, and provides an interactive web application for querying and analyzing the data.

The system was developed in three major milestones:
1. **Database Design** - ERD design, relational schema, and MySQL implementation
2. **Data Population** - Web crawling and data extraction from MobyGames
3. **Application Layer** - Full-stack web application with complex query capabilities

**Live Demo:** [Add your deployment URL here]

**Course:** Fundamentals of Database Systems (CSCE 2501) - American University in Cairo  
**Instructor:** Prof. Mohammed ElHalaby  
**Project Type:** Individual Project

## ✨ Key Features

#### User Management
- **User Registration** - Register with email, username, gender, age, birthdate, and country
- **User Rating System** - Add ratings and reviews for existing video games
- **Personal Rating Dashboard** - View and manage your game ratings

#### Game Discovery & Analytics
- **Top Rated Games** - Best games by critics and players filtered by genre and year
- **Advanced Game Filtering** - Browse games by genre, platform, publisher, or developer
- **Moby Score Rankings** - Top 5 video games in each genre/setting by official Moby score
- **Dream Game Builder** - Discover the perfect game specifications (developer, publisher, genre, setting) based on player ratings

#### Industry Insights
- **Top Developers by Critics** - Top 5 development companies by critic ratings in each genre
- **Director Rankings** - Best 5 game directors based on volume of games produced
- **Collaboration Analysis** - Top 5 collaborations between developers and publishers by number of games
- **Platform Statistics** - Number of games available on each platform with average critic and player ratings

## 🛠️ Technical Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features and server components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **MySQL 2** - Connection pooling and prepared statements
- **bcrypt** - Secure password hashing

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript** - Static type checking

### Database Design

The system implements a **fully normalized relational database** with the following key entities:

#### Core Entities
- **app_user** - User accounts with demographics (email, username, gender, age, birthdate, country)
- **game** - Comprehensive game information including:
  - Basic info: name, release_date, description, moby_score
  - Game attributes: pacing, business_model, media_type, maturity_rating, perspective, interface_type
- **developer** - Name, overview, website
- **publisher** - Name, overview, website
- **director** - Name, overview
- **genre** - Game genres (Action, Adventure, RPG, etc.)
- **platform** - Gaming platforms (PlayStation, Xbox, PC, etc.)
- **setting** - Game settings (Sci-Fi, Fantasy, Historical, etc.)

#### Rating System
- **user_rating** - User-submitted ratings and reviews
- **critic_rating** - Professional critic scores with reviewer details
- **player_rating** - Aggregated player ratings from various sources

#### Relationships (Many-to-Many Junction Tables)
- **game_genre** - Games can have multiple genres
- **game_platform** - Games released on multiple platforms
- **game_developer** - Games developed by multiple studios
- **game_publisher** - Games published by multiple companies
- **game_setting** - Games can have multiple settings
- **game_director** - Games can have multiple directors

### Data Scraping Details

The web crawler extracted the following information for each video game:
- **Game Details:** Name, release date, moby score, description
- **Platforms:** Release dates on different platforms
- **Publishers & Developers:** Company names, overviews, websites
- **Classification:** Genre, pacing, setting, business model, media type, maturity rating
- **Ratings:** Critic ratings (score, reviewer, source, URL, date), player ratings (score, count, source)
- **Technical:** Perspective, input devices, interface type
- **Credits:** Directors with overviews

**Data Scope:** All video games released between 2020-2025 from MobyGames

### API Structure
RESTful API endpoints organized by resource:
```
/api/games/          - Game queries and filtering
/api/developers/     - Developer analytics
/api/directors/      - Director information
/api/collaborations/ - Partnership analysis
/api/platforms/      - Platform statistics
/api/ratings/        - User rating operations
/api/metadata/       - Dropdown data for filters
/api/users/          - User registration
```

### Key Technical Highlights
- **Connection Pooling** - Efficient database connection management
- **Prepared Statements** - SQL injection prevention
- **Complex SQL Queries** - JOINs, aggregations, subqueries, and GROUP BY operations
- **Type Safety** - Comprehensive TypeScript interfaces for all data models
- **Server-Side Rendering** - Next.js SSR for optimal performance
- **Responsive Design** - Mobile-first UI with Tailwind CSS

## 📊 Sample Queries

The application implements complex SQL queries as required by the project specifications:

### 1. Top Rated Games by Critics and Players (Filtered by Genre/Year)
```sql
SELECT 
  g.game_id, g.name, g.release_date, g.moby_score,
  YEAR(g.release_date) as year,
  gen.name as genre_name,
  AVG(cr.score) as avg_critic_rating,
  AVG(pr.score) as avg_player_rating,
  COUNT(DISTINCT cr.critic_rating_id) as critic_count,
  COUNT(DISTINCT pr.player_rating_id) as player_count
FROM game g
LEFT JOIN game_genre gg ON g.game_id = gg.game_id
LEFT JOIN genre gen ON gg.genre_id = gen.genre_id
LEFT JOIN critic_rating cr ON g.game_id = cr.game_id
LEFT JOIN player_rating pr ON g.game_id = pr.game_id
WHERE gen.name = ? AND YEAR(g.release_date) = ?
GROUP BY g.game_id, g.name, g.release_date, g.moby_score, gen.name
HAVING avg_critic_rating IS NOT NULL OR avg_player_rating IS NOT NULL
ORDER BY avg_critic_rating DESC, avg_player_rating DESC
LIMIT 10
```

### 2. Top 5 Developers by Critic Ratings (Per Genre)
```sql
SELECT 
  dev.developer_id, dev.name, dev.overview,
  gen.name as genre_name,
  AVG(cr.score) as avg_critic_rating,
  COUNT(DISTINCT g.game_id) as game_count
FROM developer dev
JOIN game_developer gd ON dev.developer_id = gd.developer_id
JOIN game g ON gd.game_id = g.game_id
JOIN game_genre gg ON g.game_id = gg.game_id
JOIN genre gen ON gg.genre_id = gen.genre_id
JOIN critic_rating cr ON g.game_id = cr.game_id
WHERE gen.name = ?
GROUP BY dev.developer_id, dev.name, dev.overview, gen.name
ORDER BY avg_critic_rating DESC
LIMIT 5
```

### 3. Dream Game - Perfect Game Specs Based on Player Ratings
```sql
SELECT 
  GROUP_CONCAT(DISTINCT gen.name) as genres,
  GROUP_CONCAT(DISTINCT s.name) as settings,
  GROUP_CONCAT(DISTINCT dev.name) as developers,
  GROUP_CONCAT(DISTINCT pub.name) as publishers,
  AVG(pr.score) as avg_player_rating,
  COUNT(DISTINCT g.game_id) as game_count
FROM game g
JOIN game_genre gg ON g.game_id = gg.game_id
JOIN genre gen ON gg.genre_id = gen.genre_id
JOIN game_setting gs ON g.game_id = gs.game_id
JOIN setting s ON gs.setting_id = s.setting_id
JOIN game_developer gdev ON g.game_id = gdev.game_id
JOIN developer dev ON gdev.developer_id = dev.developer_id
JOIN game_publisher gpub ON g.game_id = gpub.game_id
JOIN publisher pub ON gpub.publisher_id = pub.publisher_id
LEFT JOIN player_rating pr ON g.game_id = pr.game_id
GROUP BY gen.genre_id, s.setting_id, dev.developer_id, pub.publisher_id
ORDER BY avg_player_rating DESC
LIMIT 1
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- MySQL 8.x
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/john-ashraf-7/MobyGamesDB.git
cd MobyGamesDB
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=mysql://username:password@localhost:3306/mobygames
```

4. **Import the database**
```bash
mysql -u username -p mobygames < original_dump/Dump20251120.sql
```
Or upload the dump file to your remote MySQL server (e.g., db4free.net)

5. **Run the development server**
```bash
npm run dev
```

6. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)


## 🎓 Learning Outcomes

This individual project demonstrates comprehensive proficiency in:

### Database Systems Fundamentals
- **Relational Database Design** - ERD modeling, normalization (1NF, 2NF, 3NF), and schema design
- **SQL Mastery** - Complex queries with JOINs, aggregations, subqueries, GROUP BY, and HAVING clauses
- **MySQL Administration** - Database creation, table design, constraints, indexes, and optimization
- **Data Integrity** - Primary keys, foreign keys, referential integrity, and constraint enforcement

### Data Engineering
- **Web Scraping** - HTML parsing and data extraction from real-world websites
- **Data Validation** - Ensuring data quality and consistency during population

### Full-Stack Development
- **Backend Development** - RESTful API design with Next.js API routes
- **Frontend Development** - Modern React with TypeScript and server components
- **Type Safety** - Comprehensive TypeScript interfaces for all data models

### Software Engineering
- **Project Planning** - Multi-milestone project execution, from ERD diagrams, to full implementation.
- **Code Organization** - Clean architecture and separation of concerns
- **Version Control** - Git workflow and repository management
- **Documentation** - Comprehensive code documentation and README

## 📝 Database Schema

The relational database includes the following tables (fully normalized):
