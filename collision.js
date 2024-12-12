import { renderBoard } from "./render.js";
import { resetGame, gameState } from "./map.js";

/**
 * 一般化された衝突処理
 * @param {number} x - 衝突マスのX座標
 * @param {number} y - 衝突マスのY座標
 * @param {object} collider - 衝突しようとしているオブジェクト
 */
export function handleCollision(x, y, collider) {
    console.log(`Collision detected at (${x}, ${y}) by ${collider.type}.`);

    // 侵入者を衝突マスに移動
    collider.position = { x, y };

    // 衝突マス上のオブジェクトを取得
    const objectsAtCollision = gameState.characters.filter(
        (character) => character.position.x === x && character.position.y === y
    );

    if (!objectsAtCollision.length) {
        console.error(`No objects found at collision tile (${x}, ${y}).`);
        return;
    }

    // 衝突マス上のオブジェクトと侵入者を削除
    gameState.characters = gameState.characters.filter(
        (character) => !objectsAtCollision.includes(character) && character !== collider
    );

    // 描画を更新
    renderBoard();

    // 衝突マスを視覚的に変化
    const tileIndex = y * gameState.board[0].length + x;
    const tile = document.getElementById("game-board").children[tileIndex];
    if (tile) {
        tile.style.backgroundColor = "red";
        console.log(`Tile at (${x}, ${y}) color changed to red.`);
    } else {
        console.error(`Tile not found for collision at (${x}, ${y}).`);
    }
}