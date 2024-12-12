import { renderBoard } from "./render.js";
import { gameState, resetGame } from "./map.js";

function playDisappearanceAnimation(tile, objectType) {
    const animationElement = document.createElement("div");
    animationElement.classList.add("disappearance-animation", objectType);
    tile.appendChild(animationElement);

    // アニメーションが発火しない場合のため、再描画を強制
    animationElement.offsetWidth; // 再描画

    animationElement.addEventListener("animationend", () => {
        console.log(`${objectType} animation ended.`);
        animationElement.remove(); // アニメーション要素を削除
    });

    console.log(`Animation element added for ${objectType}:`, animationElement);
}

function getTileAtPosition(position) {
    const tileIndex = position.y * gameState.board[0].length + position.x;
    return document.getElementById("game-board").children[tileIndex];
}
export function handleObjectDisappearance(object, position) {
    console.log(`Handling disappearance of ${object.type} at (${position.x}, ${position.y}).`);

    const tile = getTileAtPosition(position);
    if (!tile) {
        console.error("Tile not found for position:", position);
        return;
    }

    const objectElement = tile.querySelector(`.${object.type}`);
    if (objectElement) {
        objectElement.remove();
    } else {
        console.warn(`Object element of type '${object.type}' not found.`);
    }

    playDisappearanceAnimation(tile, object.type);

    gameState.characters = gameState.characters.filter((c) => c !== object);
    renderBoard();
}