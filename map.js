export const initialBoard = [
    ["W", "W", "W", "W", "W", "W", "W", "W"],
    ["W", " ", " ", " ", " ", " ", " ", "W"],
    ["W", " ", " ", " ", " ", " ", " ", "W"],
    ["W", " ", " ", " ", " ", " ", " ", "W"],
    ["W", " ", " ", " ", " ", " ", " ", "W"],
    ["W", " ", "H", " ", " ", " ", " ", "W"],
    ["W", " ", " ", " ", " ", " ", " ", "W"],
    ["W", "W", "W", "W", "W", "W", "W", "W"]
];

export function startGame() {
    renderBoard(); // ボード全体を描画

    // テスト用オブジェクトにアニメーションを適用
    const tileIndex = 2 * gameState.board[0].length + 2; // 位置 (2, 2)
    const tile = document.getElementById("game-board").children[tileIndex];
    const testObjectElement = tile.querySelector(".testObject");
    
    if (testObjectElement) {
        testObjectElement.classList.add("falling"); // アニメーションを適用
        testObjectElement.addEventListener("animationend", () => {
            console.log("Test object animation ended.");
            testObjectElement.remove(); // DOMから削除
        });
    }
}

export const gameState = {
    board: JSON.parse(JSON.stringify(initialBoard)), // 初期状態でコピー
    characters: [
        { type: "player", position: { x: 1, y: 1 }, direction: "down" },
        //{ type: "snake", position: { x: 3, y: 2 }, direction: "down", isPushed: false },
		{ type: "snake", position: { x: 6, y: 2 }, direction: "down", isPushed: false },
        { type: "box", position: { x: 3, y: 1 }, direction: "up" }, // 荷物にも向きを追加
        { type: "box", position: { x: 4, y: 5 }, direction: "left" },
		{ type: "testObject", position: { x: 4, y: 3 }, direction: "left", classList: ["falling"] }
		
    ]
};

export function resetGame() {
    gameState.board = JSON.parse(JSON.stringify(initialBoard));
    gameState.characters = [
        { type: "player", position: { x: 1, y: 1 }, direction: "down" },
        { type: "snake", position: { x: 3, y: 2 }, direction: "up", isPushed: false },
        { type: "box", position: { x: 3, y: 1 }, direction: "up" }, // 荷物にも向きを追加
        { type: "box", position: { x: 4, y: 5 }, direction: "left" }
    ];
}

