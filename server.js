import express from "express";
import path from "path";
import fs from "fs/promises";

const app = express();
const PORT = 3001;

// TODO: make the game path dynamic
const MICROGAMES_DIR = path.resolve("./games");

// serve game assets
app.use("/games", express.static(MICROGAMES_DIR));

// app.use("/", express.static("./client"));

app.get("/api/games", async (req, res) => {
  try {
    const dirs = await fs.readdir(MICROGAMES_DIR, { withFileTypes: true });
    const gameModules = await Promise.all(
      dirs
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const manifestPath = path.join(
            MICROGAMES_DIR,
            dirent.name,
            "manifest.json"
          );
          try {
            const manifest = JSON.parse(
              await fs.readFile(manifestPath, "utf-8")
            );
            return {
              name: dirent.name,
              path: `/games/${dirent.name}/index.js`,
              assets: manifest.assets || [],
              instruction: manifest.instruction,
              author: manifest.author,
            };
          } catch (err) {
            console.error(`Error loading manifest for ${dirent.name}:`, err);
            return {
              name: dirent.name,
              path: `/games/${dirent.name}/index.js`,
              assets: [],
            };
          }
        })
    );
    res.json(gameModules);
  } catch (err) {
    res.status(500).json({ error: "Failed to list game modules" });
  }
});

app.listen(PORT, () => {
  console.log(`GameManager running at http://localhost:${PORT}`);
});

export { app };
