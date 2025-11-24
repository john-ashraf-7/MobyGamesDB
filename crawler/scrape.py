from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import csv
import time
import re
import os

# ---------- SCRAPING FUNCTION ----------
def scrape_mobygames():
    games_data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        for page_num in range(1, 11):  # first 10 pages
            print(f"\n=== Processing Page {page_num} ===")
            url = f"https://www.mobygames.com/game/from:2020/until:2025/page:{page_num}/"
            print(f"Navigating to: {url}")
            
            try:
                page.goto(url, timeout=20000)
                page.wait_for_load_state("networkidle")
                time.sleep(2)
                page.wait_for_selector("table tbody tr")
            except Exception as e:
                print(f"✗ Failed to load page {page_num}: {str(e)}")
                continue

            rows = page.query_selector_all("table tbody tr")
            print(f"Found {len(rows)} rows on page {page_num}")

            for idx in range(len(rows)):
                try:
                    rows = page.query_selector_all("table tbody tr")
                    row = rows[idx]

                    print(f"\n  Processing row {idx+1}/{len(rows)}...")
                    link = row.query_selector("a")
                    if link:
                        link.click()
                    else:
                        row.click()

                    # Wait until game page fully loads
                    page.wait_for_load_state("networkidle", timeout=20000)
                    page.wait_for_selector("#infoBlock", timeout=15000)
                    time.sleep(1.5)

                    # Extract title
                    title = None
                    for selector in ["h1", "#main h1", "h1.mb-0", "main h1"]:
                        el = page.query_selector(selector)
                        if el:
                            title = el.inner_text().strip()
                            break
                    if not title:
                        print("✗ No title found, skipping.")
                        page.go_back()
                        continue

                    # Parse info
                    soup = BeautifulSoup(page.content(), "html.parser")
                    info_block = soup.select_one("#infoBlock")
                    if not info_block:
                        print("✗ No infoBlock found.")
                        continue

                    game_info = {"title": title}

                    # Extract label-value pairs
                    for dt, dd in zip(info_block.select("dt"), info_block.select("dd")):
                        key = dt.get_text(strip=True).lower().replace(" ", "_")
                        value = " ".join(dd.stripped_strings)
                        game_info[key] = value

                    # Developers
                    devs = [a.get_text(strip=True) for a in info_block.select("#developerLinks a")]
                    if devs:
                        game_info["developers"] = ", ".join(devs)

                    # Publishers
                    pubs = [a.get_text(strip=True) for a in info_block.select("#publisherLinks a")]
                    if pubs:
                        game_info["publishers"] = ", ".join(pubs)

                    # Genres
                    genres = [a.get_text(strip=True) for a in info_block.select("#genreLinks a")]
                    if genres:
                        game_info["genres"] = ", ".join(genres)

                    # Platforms and release years
                    releases = []
                    for li in info_block.select("#platformLinks li"):
                        platform = li.select_one("span.text-muted a")
                        year = li.select_one("a[id^=t]")
                        if platform and year:
                            releases.append(f"{platform.get_text(strip=True)} ({year.get_text(strip=True)})")
                    if releases:
                        game_info["releases"] = ", ".join(releases)

                    games_data.append(game_info)
                    print(f"  ✓ Extracted: {title}")

                    # Go back to table
                    page.go_back()
                    page.wait_for_load_state("networkidle")
                    page.wait_for_selector("table tbody tr", timeout=10000)
                    time.sleep(1.5)

                except Exception as e:
                    print(f"  ✗ Error processing row {idx+1}: {str(e)}")
                    try:
                        page.go_back()
                        page.wait_for_load_state("networkidle")
                        page.wait_for_selector("table tbody tr", timeout=10000)
                    except:
                        pass

        browser.close()
    return games_data

# ---------- CLEANING & NORMALIZATION ----------

def clean_text(text):
    if not text or text == "N/A":
        return None
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def clean_data(games):
    cleaned = []
    for g in games:
        cleaned.append({
            "title": clean_text(g.get("title")),
            "release_info": clean_text(g.get("releases")),
            "developers": clean_text(g.get("developers")),
            "publishers": clean_text(g.get("publishers")),
            "genres": clean_text(g.get("genres")),
            "esrb_rating": clean_text(g.get("esrb_rating")),
            "game_type": clean_text(g.get("game_type")),
            "perspective": clean_text(g.get("perspective")),
        })
    return cleaned

# ---------- SPLIT INTO TABLE CSVs ----------

def split_and_save(cleaned, output_dir="cleaned_data"):
    os.makedirs(output_dir, exist_ok=True)

    games, devs, pubs, genres, plats = [], set(), set(), set(), set()
    game_genres, game_platforms = [], []

    for i, g in enumerate(cleaned, start=1):
        game_id = i
        title = g["title"]
        games.append({
            "game_id": game_id,
            "title": title,
            "esrb_rating": g["esrb_rating"],
            "game_type": g["game_type"],
            "perspective": g["perspective"],
        })

        if g["developers"]:
            for d in [x.strip() for x in g["developers"].split(",")]:
                devs.add(d)

        if g["publishers"]:
            for p in [x.strip() for x in g["publishers"].split(",")]:
                pubs.add(p)

        if g["genres"]:
            for genre in [x.strip() for x in g["genres"].split(",")]:
                genres.add(genre)
                game_genres.append({"game_id": game_id, "genre": genre})

        if g["release_info"]:
            for rel in re.findall(r"([\w\s]+)\s*\((\d{4})\)", g["release_info"]):
                platform, year = rel
                plats.add(platform.strip())
                game_platforms.append({
                    "game_id": game_id,
                    "platform": platform.strip(),
                    "release_year": year.strip()
                })

    # Save CSVs
    save_csv(games, os.path.join(output_dir, "games.csv"))
    save_csv([{"developer_name": d} for d in sorted(devs)], os.path.join(output_dir, "developers.csv"))
    save_csv([{"publisher_name": p} for p in sorted(pubs)], os.path.join(output_dir, "publishers.csv"))
    save_csv([{"genre_name": g} for g in sorted(genres)], os.path.join(output_dir, "genres.csv"))
    save_csv([{"platform_name": p} for p in sorted(plats)], os.path.join(output_dir, "platforms.csv"))
    save_csv(game_genres, os.path.join(output_dir, "game_genres.csv"))
    save_csv(game_platforms, os.path.join(output_dir, "game_platforms.csv"))

    print(f"\n Cleaned and normalized data saved to '{output_dir}'.")


def save_csv(data, path):
    if not data:
        print(f" Skipping empty file: {os.path.basename(path)}")
        return
    keys = sorted(data[0].keys())
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)
    print(f"  ✓ Saved {len(data)} rows → {os.path.basename(path)}")


# ---------- MAIN EXECUTION ----------

if __name__ == "__main__":
    data = scrape_mobygames()
    cleaned = clean_data(data)
    split_and_save(cleaned)
