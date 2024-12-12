import { renderBoard } from "./render.js";
import { addSwipeListeners } from "./swipe.js";
import { handlePlayerMovement } from "./player.js"
import { gameState } from "./map.js";

// TestObject 用のアニメーション処理
/*
function addTestObject() {
    gameState.characters.push({
        type: "testObject",
        position: { x: 2, y: 2 }, // 任意の初期位置
    });

    const tileIndex = 2 * gameState.board[0].length + 2; // 位置 (2, 2) のタイルインデックス
    const tile = document.getElementById("game-board").children[tileIndex];
    const testObjectElement = tile.querySelector(".testObject");

    if (testObjectElement) {
        testObjectElement.classList.add("falling"); // アニメーションを適用
        testObjectElement.addEventListener("animationstart", () => {
            console.log("Test object animation started.");
        });
        testObjectElement.addEventListener("animationend", () => {
            console.log("Test object animation ended.");
            testObjectElement.remove(); // DOMから削除
        });
    }
}
*/

// 仮想ボタンの操作をプレイヤー移動と結びつける
document.getElementById("up").addEventListener("click", () => {
    handlePlayerMovement(0, -1, "up");
});
document.getElementById("down").addEventListener("click", () => {
    handlePlayerMovement(0, 1, "down");
});
document.getElementById("left").addEventListener("click", () => {
    handlePlayerMovement(-1, 0, "left");
});
document.getElementById("right").addEventListener("click", () => {
    handlePlayerMovement(1, 0, "right");
});

// フリック操作のリスナーを追加
const gameBoard = document.getElementById("game-board");
addSwipeListeners(gameBoard);

// 初期描画と TestObject の追加
renderBoard();
//addTestObject();

// ダブルタップによるズームを防止
let lastTouchEnd = 0;

document.addEventListener("touchend", (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 200) {
        event.preventDefault(); // ダブルタップのデフォルト動作をキャンセル
    }
    lastTouchEnd = now;
});