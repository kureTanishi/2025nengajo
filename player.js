import { handlePushedSnake } from "./snake.js";
import { gameState, resetGame } from "./map.js";
import { calculateNewPosition, moveObject } from "./utils.js";
import { renderBoard, handleBoxDisappearance } from "./render.js";
import { moveSnakes } from "./snake.js";
import { handleObjectDisappearance } from "./hole.js";
import { handleCollision } from "./collision.js";

export function getObjectsAtPosition(x, y) {
    return gameState.characters.filter((character) => character.position.x === x && character.position.y === y);
}


export function getTileInfo(x, y) {
    // ゲームボードから指定位置のタイル要素を取得
    const tileType = gameState.board[y][x];

    // 指定位置のキャラクターを取得
    const objectsOnTile = gameState.characters.filter(
        (character) => character.position.x === x && character.position.y === y
    );

    // タイル情報をオブジェクトで返す
    return {
        position: { x, y },
        tileType, // タイルのタイプ (H, W, etc.)
        objects: objectsOnTile, // タイル上のオブジェクト
    };
}
/**
 * プレイヤーの移動処理
 * @param {number} dx - X方向の移動量
 * @param {number} dy - Y方向の移動量
 * @param {string} direction - プレイヤーの向き ("up", "down", "left", "right")
 */
export function handlePlayerMovement(dx, dy, direction) {
    const player = gameState.characters.find((c) => c.type === "player");

    if (!player) {
        // console.error("Player object not found in gameState.characters");
        return;
    }

    const { x, y } = player.position;
    const newX = x + dx;
    const newY = y + dy; 

    player.direction = direction;

    // 移動先に蛇がいる場合、衝突処理を優先
    const snake = gameState.characters.find(
        (c) => c.type === "snake" && c.position.x === newX && c.position.y === newY
    );
    if (snake) {
    console.log("Player is moving to a tile with a snake:", { x: newX, y: newY }); 
    handleCollision(newX, newY, player); // 引数をx, y座標のみに変更
    return;
}
	// 荷物オブジェクトを判定
const box = gameState.characters.find(
    (c) => c.type === "box" && c.position.x === newX && c.position.y === newY
);

if (box) {
    const boxNewPosition = calculateNewPosition(newX, newY, direction);

    // 荷物の方向を設定
    box.direction = direction;

    // 荷物を移動または蛇の処理を実行
    const snake = gameState.characters.find(
        (c) => c.type === "snake" && c.position.x === boxNewPosition.x && c.position.y === boxNewPosition.y
    );

    if (snake) {
        console.log(`Pushing snake with box at (${boxNewPosition.x}, ${boxNewPosition.y})`);
        handlePushedSnake(snake, direction); // 蛇を押す処理を実行

        // 荷物を蛇が移動した位置に進める
        box.position = { x: boxNewPosition.x, y: boxNewPosition.y };
        renderBoard();
        moveSnakes(); // 蛇の通常ターンを実行
        return; // 荷物の移動処理を再度行わないよう終了
    }

    // 蛇がいない場合は通常の荷物移動
    if (moveObject(box, boxNewPosition, "B")) {
        //console.log(`Box moved from (${box.position.x}, ${box.position.y}) to (${boxNewPosition.x}, ${boxNewPosition.y})`);
        renderBoard();
        moveSnakes();
        return;
    }
}

    // 移動先のタイルを取得
    const targetTile = gameState.board[newY][newX];
    // console.log("Player is moving to:", { x: newX, y: newY, targetTile }); 

    if (targetTile === "W") {
        // console.log("Player hit a wall at:", { x: newX, y: newY }); 
        return; // 壁は進めない
    }
    if (targetTile === "H") {
    gameState.characters.find(c => c.type === "player").position = { x: newX, y: newY }; // プレイヤーの位置を更新
    renderBoard(); // 描画を最新に更新
    handleObjectDisappearance(newX, newY); // 移動後の位置で消滅処理
    return;
}

if (targetTile === " ") {
    // 通常の移動処理
    player.position = { x: newX, y: newY };
    renderBoard();
    moveSnakes();
	
	// moveSnakes や他の関数内の最後に追加
const objectsAtTile = getObjectsAtPosition(4, 3);
//console.log(`Objects at tile (4, 3):`, objectsAtTile);

// タイル情報を取得してログに出力
const tileInfo = getTileInfo(4, 3);
//console.log(`Tile info at (${tileInfo.position.x}, ${tileInfo.position.y}):`, tileInfo);
    return;
	

}
}