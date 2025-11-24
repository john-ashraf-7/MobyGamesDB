// Database Types

export interface AppUser {
  user_id: number;
  email: string;
  username: string;
  gender?: string;
  age?: number;
  birthdate?: Date;
  country?: string;
  created_at: Date;
}

export interface Game {
  game_id: number;
  name: string;
  release_date?: Date;
  pacing_id?: number;
  business_model_id?: number;
  media_type_id?: number;
  maturity_rating_id?: number;
  perspective_id?: number;
  interface_type_id?: number;
  moby_score?: number;
  description?: string;
  created_at: Date;
}

export interface Genre {
  genre_id: number;
  name: string;
}

export interface Platform {
  platform_id: number;
  name: string;
}

export interface Publisher {
  publisher_id: number;
  name: string;
  overview?: string;
  website?: string;
}

export interface Developer {
  developer_id: number;
  name: string;
  overview?: string;
  website?: string;
}

export interface Director {
  director_id: number;
  name: string;
  overview?: string;
}

export interface Setting {
  setting_id: number;
  name: string;
}

export interface UserRating {
  user_id: number;
  game_id: number;
  rating: number;
  review_text?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface CriticRating {
  critic_rating_id: number;
  game_id: number;
  score: number;
  reviewer_name?: string;
  review_source?: string;
  review_url?: string;
  review_date?: Date;
  created_at: Date;
}

export interface PlayerRating {
  player_rating_id: number;
  game_id: number;
  source?: string;
  score: number;
  number_of_ratings: number;
  collected_at: Date;
}

// API Response Types

export interface TopRatedGame extends Game {
  year: number;
  genre_name: string;
  avg_critic_rating?: number;
  avg_player_rating?: number;
  critic_count: number;
  player_count: number;
}

export interface FilteredGame extends Game {
  genres: string;
  platforms: string;
  publishers: string;
  developers: string;
}

export interface TopMobyGame extends Game {
  genre_name?: string;
  setting_name?: string;
}

export interface TopDeveloper extends Developer {
  genre_name: string;
  avg_critic_rating: number;
  game_count: number;
}

export interface TopDirector extends Director {
  game_count: number;
}

export interface Collaboration {
  director_name: string;
  developer_name: string;
  collaboration_count: number;
  games: string;
}

export interface DreamGame {
  genres?: string;
  settings?: string;
  developers?: string;
  publishers?: string;
  avg_player_rating?: number;
  game_count: number;
}

export interface PlatformStats extends Platform {
  game_count: number;
  avg_critic_rating?: number;
  avg_player_rating?: number;
}

export interface UserRatingWithGame extends UserRating {
  game_name: string;
  moby_score?: number;
}
