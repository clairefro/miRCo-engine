import { GameManager } from "./gameManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#gameContainer");
  if (!container) {
    throw new Error("Game container element not found");
  }

  const gameManager = new GameManager(container);
  gameManager.init();
});
