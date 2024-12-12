import { handlePlayerMovement } from "./player.js";

export function addSwipeListeners(gameBoard) {
    let startX, startY;

    // スワイプ開始位置を記録
    gameBoard.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    // スワイプ終了位置を記録し方向を判定
    gameBoard.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const dx = endX - startX;
        const dy = endY - startY;

        // スワイプがほとんどない場合は無視
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            // 左右のスワイプ
            if (dx > 0) {
                //console.log("Swiped right");
                handlePlayerMovement(1, 0, "right");
            } else {
                //console.log("Swiped left");
                handlePlayerMovement(-1, 0, "left");
            }
        } else {
            // 上下のスワイプ
            if (dy > 0) {
                //console.log("Swiped down");
                handlePlayerMovement(0, 1, "down");
            } else {
                //console.log("Swiped up");
                handlePlayerMovement(0, -1, "up");
            }
        }
    });
}