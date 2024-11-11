/**
 * The entry point for the game. Creates the game, kicks off any loading that's needed and then starts the game running.
 */

import "../css/game.css";
import { Game } from "./NewGame/Game";

document.addEventListener("DOMContentLoaded", async () => {
    const game = new Game();
    game.start();
});
