import pandas as pd
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",      
    password="", 
    database="mobygames_db"   
)
cursor = conn.cursor()

# Create Tables
schema = """
CREATE TABLE IF NOT EXISTS Publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Developers (
    developer_id INT AUTO_INCREMENT PRIMARY KEY,
    developer_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Platforms (
    platform_id INT AUTO_INCREMENT PRIMARY KEY,
    platform_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Games (
    game_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    esrb_rating VARCHAR(50),
    game_type VARCHAR(100),
    perspective VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Game_Platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT,
    platform_id INT,
    release_year YEAR,
    FOREIGN KEY (game_id) REFERENCES Games(game_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
"""
for stmt in schema.split(";"):
    if stmt.strip():
        cursor.execute(stmt)
conn.commit()

print(" Tables created successfully!")

# Populate Publishers
publishers = pd.read_csv("../crawler/cleaned_data/publishers.csv")
for name in publishers["publisher_name"].dropna().unique():
    cursor.execute("INSERT IGNORE INTO Publishers (publisher_name) VALUES (%s)", (name,))
conn.commit()
print(f" Inserted {len(publishers)} publishers")

# Populate Developers
developers = pd.read_csv("../crawler/cleaned_data/developers.csv")
for name in developers["developer_name"].dropna().unique():
    cursor.execute("INSERT IGNORE INTO Developers (developer_name) VALUES (%s)", (name,))
conn.commit()
print(f" Inserted {len(developers)} developers")

# Populate Platforms
platforms = pd.read_csv("../crawler/cleaned_data/platforms.csv")
for name in platforms["platform_name"].dropna().unique():
    cursor.execute("INSERT IGNORE INTO Platforms (platform_name) VALUES (%s)", (name,))
conn.commit()
print(f" Inserted {len(platforms)} platforms")

# Populate Games
games = pd.read_csv("../crawler/cleaned_data/games.csv")
for _, row in games.iterrows():
    cursor.execute("""
        INSERT IGNORE INTO Games (game_id, title, esrb_rating, game_type, perspective)
        VALUES (%s, %s, %s, %s, %s)
    """, (int(row["game_id"]), row["title"], row["esrb_rating"], row["game_type"], row["perspective"]))
conn.commit()
print(f"Inserted {len(games)} games")

# populate Game_Platforms
game_platforms = pd.read_csv("../crawler/cleaned_data/game_platforms.csv")
for _, row in game_platforms.iterrows():
    # Get platform_id
    cursor.execute("SELECT platform_id FROM Platforms WHERE platform_name = %s", (row["platform"],))
    result = cursor.fetchone()
    if result:
        platform_id = result[0]
        cursor.execute("""
            INSERT INTO Game_Platforms (game_id, platform_id, release_year)
            VALUES (%s, %s, %s)
        """, (int(row["game_id"]), platform_id, int(row["release_year"])))
conn.commit()
print(f"Inserted {len(game_platforms)} game-platform records")

# Close connection
cursor.close()
conn.close()
print("\n All CSVs successfully imported into MySQL!")
