import { renderBoard } from "./render.js";
import { gameState, resetGame } from "./map.js";
import { reverseDirection, calculateNewPosition, moveObject } from "./utils.js";
import { handleObjectDisappearance } from "./hole.js";
import { handleCollision } from "./collision.js";

/**
 * 蛇が押された際の処理
 */
 
 export function handlePushedSnake(snake, direction) {
    console.log(`handlePushedSnake called for snake at (${snake.position.x}, ${snake.position.y}), direction: ${direction}`);

    // 押された向きに蛇の方向を変更
    snake.direction = direction;

    // 蛇が押されたことを記録
    snake.isPushed = true;

    const newPosition = calculateNewPosition(snake.position.x, snake.position.y, direction);
    const { x: newX, y: newY } = newPosition;

    // 障害物の確認（次の位置）
    const obstacle = gameState.characters.find(
        (c) => c.position.x === newX && c.position.y === newY && (c.type === "box" || c.type === "snake")
    );

    // 壁や他の荷物にぶつかった場合、蛇を消滅させる
    if (gameState.board[newY][newX] === "W" || obstacle) {
        console.log("Snake disappears after being pushed to", { x: newX, y: newY });
        gameState.characters = gameState.characters.filter((c) => c !== snake);
        renderBoard();
        return;
    }

    // 穴に落ちる場合
    if (gameState.board[newY][newX] === "H") {
        console.log(`Snake pushed into a hole at (${newX}, ${newY}).`);
        handleObjectDisappearance(snake, { x: newX, y: newY });
        return;
    }

    // 通常の移動処理
    console.log(`Snake moved from (${snake.position.x}, ${snake.position.y}) to (${newX}, ${newY})`);
    snake.position = { x: newX, y: newY }; // 蛇の位置を更新
    renderBoard();
}

/**
 * 蛇の移動処理
 */
 export function moveSnakes() {
    gameState.characters
        .filter((c) => c.type === "snake")
        .forEach((snake) => {
            if (snake.isPushed) {
               console.log("Snake is pushed and skips this turn:", snake.position);
                snake.isPushed = false;
                return;
            }

            const { x, y } = snake.position;
            const newPosition = calculateNewPosition(x, y, snake.direction);
            const { x: newX, y: newY } = newPosition;
			//console.log(`snake newX is ${newX}, newY is ${newY}`)

            // プレイヤーとの衝突をチェック
            const player = gameState.characters.find(
                (c) => c.type === "player" && c.position.x === newX && c.position.y === newY
            );

            if (player) {
                //console.log(`Snake at (${x}, ${y}) collides with player at (${newX}, ${newY}).`);
				//renderBoard();
                handleCollision(newX, newY, snake); // 衝突処理を呼び出し
                return;
            }

            const targetTile = gameState.board[newY][newX];

            // 他の障害物（壁、荷物、他の蛇）に対する処理
            const box = gameState.characters.find(
                (c) => c.type === "box" && c.position.x === newX && c.position.y === newY
            );

            if (targetTile === "W" || box) {
                //console.log(`Snake at (${x}, ${y}) is reversing direction due to obstacle.`);
                snake.direction = reverseDirection(snake.direction);
                return;
            }

            // 穴に落ちる場合の処理
			if (targetTile === "H") { 
            snake.position = { x: newX, y: newY }; // 蛇の位置を更新
			renderBoard();
			//ngameState.characters.find(c => c.type === "snake").position = { x: newX, y: newY };
                handleObjectDisappearance(snake, newPosition);
                return;
            } 
            // 通常の移動処理
            gameState.board[y][x] = " "; // 元の位置を空白に
            snake.position = { x: newX, y: newY }; // 新しい位置に更新
			//console.log(`Snake moved from (${x}, ${y}) to (${newX}, ${newY})`);
            //gameState.board[newY][newX] = "S"; // 新しい位置に蛇を配置
        });

    renderBoard(); // 描画を更新
}