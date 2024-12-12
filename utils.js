import { gameState } from "./map.js";
import { handleObjectDisappearance } from "./hole.js";
import { handlePushedSnake } from "./snake.js";
import { renderBoard } from "./render.js";
// 方向を反転する関数
export function reverseDirection(direction) {
    return {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
    }[direction];
}

// 新しい位置を計算する関数
export function calculateNewPosition(x, y, direction) {
    switch (direction) {
        case "up": return { x, y: y - 1 };
        case "down": return { x, y: y + 1 };
        case "left": return { x: x - 1, y };
        case "right": return { x: x + 1, y };
      		default: return { x, y };
    }
}

/**
 * オブジェクトの移動を処理する共通関数
 * @param {Object} object - 移動対象のオブジェクト（荷物や蛇など）
 * @param {Object} newPosition - 新しい位置 { x, y }
 * @param {string} type - オブジェクトのタイプ ("B" - 荷物, "S" - 蛇)
 * @returns {boolean} - 移動が成功した場合は true、それ以外は false
 */
 
 export function moveObject(object, newPosition, type) {
    const { x: newX, y: newY } = newPosition;

    // 障害物の確認
    const obstacle = gameState.characters.find(
        (c) => c.position.x === newX && c.position.y === newY && (c.type === "box" || c.type === "snake")
    );

    console.log(`Object (${type}) is attempting to move to (${newX}, ${newY}). Obstacle:`, obstacle);

    // 壁の場合は移動失敗
    if (gameState.board[newY][newX] === "W") {
        return false;
    }

    // 蛇の場合は handlePushedSnake を呼び出し
    if (obstacle && obstacle.type === "snake") {
        console.log(`Pushing snake at (${newX}, ${newY}) with direction ${object.direction}`);
        
        // 蛇を押す処理
        handlePushedSnake(obstacle, object.direction);

        // 荷物を1マス進める
        const nextPosition = calculateNewPosition(newX, newY, object.direction);
        object.position = { x: nextPosition.x, y: nextPosition.y }; // 荷物を新しい位置に移動
        renderBoard();
        return true;
    }

    // 穴に落ちる場合
    if (gameState.board[newY][newX] === "H") {
		object.direction = calculateDirection(object.position, { x: newX, y: newY }); // 向きを更新
        object.position = { x: newX, y: newY };
		renderBoard();
        handleObjectDisappearance(object, { x: newX, y: newY });
        return true;
    }

    // 通常の移動処理
    object.direction = calculateDirection(object.position, { x: newX, y: newY }); // 向きを更新
    object.position = { x: newX, y: newY };
    renderBoard();

    return true;
}

export function calculateDirection(oldPosition, newPosition) {
    const dx = newPosition.x - oldPosition.x;
    const dy = newPosition.y - oldPosition.y;

    if (dx === 1) return "right";
    if (dx === -1) return "left";
    if (dy === 1) return "down";
    if (dy === -1) return "up";
    return "up"; // デフォルト値
}