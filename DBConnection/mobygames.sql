CREATE TABLE Publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_name VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE Developers (
    developer_id INT AUTO_INCREMENT PRIMARY KEY,
    developer_name VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE Platforms (
    platform_id INT AUTO_INCREMENT PRIMARY KEY,
    platform_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Games (
    game_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    esrb_rating VARCHAR(50),
    game_type VARCHAR(100),
    perspective VARCHAR(100)
);


CREATE TABLE Game_Platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT,
    platform_id INT,
    release_year YEAR,
    FOREIGN KEY (game_id) REFERENCES Games(game_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
