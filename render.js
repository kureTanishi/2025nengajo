const gameBoard = document.getElementById("game-board");
import { gameState } from "./map.js";

export function renderMap() {
    // タイルをクリア。ただし、既存のアニメーション要素は保持する
    Array.from(gameBoard.children).forEach((tile) => {
        if (!tile.querySelector(".explosion")) {
            tile.innerHTML = "";
        }
    });

    for (let y = 0; y < gameState.board.length; y++) {
        for (let x = 0; x < gameState.board[y].length; x++) {
            const tileIndex = y * gameState.board[0].length + x;
            const tile = gameBoard.children[tileIndex] || document.createElement("div");

            if (!tile.classList.contains("tile")) tile.classList.add("tile");

            // タイルのクラスを設定
            tile.className = "tile";
            if (gameState.board[y][x] === "W") tile.classList.add("wall");
            else if (gameState.board[y][x] === "B") tile.classList.add("box");
            else if (gameState.board[y][x] === "G") tile.classList.add("goal");
            else if (gameState.board[y][x] === "H") tile.classList.add("hole");

            if (!gameBoard.children[tileIndex]) {
                gameBoard.appendChild(tile);
            }
        }
    }
}

export function renderCharacters() {
    gameState.characters.forEach(({ type, position, direction }) => {
        const { x, y } = position;

        const tile = document.getElementById("game-board").children[y * gameState.board[0].length + x];
        if (!tile) {
            console.error(`Tile not found for position: (${x}, ${y})`);
            return;
        }

        const charElement = document.createElement("div");
        charElement.classList.add(type); // プレイヤー、蛇、荷物のクラス
        if (direction) charElement.classList.add(direction); // 方向を追加
        tile.appendChild(charElement);
    });
}

export function renderBoard() {
    const gameBoard = document.getElementById("game-board");
    if (!gameBoard) {
        //console.error("Game board not found in DOM.");
        return;
    }

    if (!gameState.board || !gameState.board[0]) {
        //console.error("Game board is not properly initialized.");
        return;
    }

    gameBoard.innerHTML = ""; // 既存の内容をクリア

    // タイルを描画
    for (let y = 0; y < gameState.board.length; y++) {
        for (let x = 0; x < gameState.board[y].length; x++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");

            if (gameState.board[y][x] === "W") tile.classList.add("wall");
            if (gameState.board[y][x] === "H") tile.classList.add("hole");
            if (gameState.board[y][x] === "G") tile.classList.add("goal");

            gameBoard.appendChild(tile);
        }
    }

    // キャラクターを描画（荷物を含む）
    gameState.characters.forEach(({ type, position, direction }) => {
        const { x, y } = position;
        //console.log(`Rendering ${type} at (${x}, ${y})`); // デバッグログ

        const tile = gameBoard.children[y * gameState.board[0].length + x];
		
		if (!tile.classList.contains("collision-highlight")) {
    tile.style.backgroundColor = ""; // 背景色をリセット
} else {
    tile.style.backgroundColor = "red"; // 衝突時の背景色を維持
}

        if (tile) {
            const charElement = document.createElement("div");
            charElement.classList.add(type); // プレイヤー、蛇、荷物のクラス
            if (direction) charElement.classList.add(direction);
            tile.appendChild(charElement);
        } else {
            //console.error(`Tile not found for character at (${x}, ${y})`);
        }
    });
}

export function handleBoxDisappearance(position) {
    const { x, y } = position;

    const tileIndex = y * gameState.board[0].length + x;
    const tile = document.getElementById("game-board").children[tileIndex];
	//console.log(tile);

    if (tile) {
        const boxElement = tile.querySelector(".box");
        if (boxElement) {
            boxElement.classList.add("falling");
	//console.log("爆発アニメーションが始まってるはずだよ");

            // アニメーション終了後に削除
            boxElement.addEventListener("animationend", () => {
                gameState.board[y][x] = "B"; // 穴の位置を空白に
                renderBoard();
            });
			//console.log("この荷物消滅アニメーションを完了したよ")
        }
    }
}
