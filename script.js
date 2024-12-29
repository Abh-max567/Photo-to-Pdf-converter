document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const blockContainer = document.getElementById("block-container");
    const resetBtn = document.getElementById("reset-btn");
    const scoreDisplay = document.getElementById("score");
    const levelDisplay = document.getElementById("level");

    let level = 1;
    let score = 0;
    let activeBlock = null;
    let currentBlockPosition = { x: 4, y: 0 };

    // Block shapes and colors
    const blockShapes = [
        { shape: [1, 1, 1], color: '#ff6347' }, // Line
        { shape: [1, 1, 0, 1], color: '#f08080' }, // L-Shape
        { shape: [1, 1, 1, 1], color: '#ffd700' }, // Square
        { shape: [1, 1, 1, 0], color: '#98fb98' }, // T-Shape
    ];

    // Create grid (10x10)
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        grid.appendChild(cell);
    }

    // Create draggable blocks
    blockShapes.forEach((block, index) => {
        const blockDiv = document.createElement("div");
        blockDiv.classList.add("block");
        block.shape.forEach((val) => {
            const blockCell = document.createElement("div");
            blockCell.classList.add("block-cell");
            blockCell.style.backgroundColor = val ? block.color : "transparent";
            blockDiv.appendChild(blockCell);
        });
        blockDiv.addEventListener("click", () => startGame(block));
        blockContainer.appendChild(blockDiv);
    });

    // Start the game with a selected block
    function startGame(block) {
        activeBlock = block;
        currentBlockPosition = { x: 4, y: 0 };
        renderBlock();
        dropBlock();
    }

    // Render the block on the grid
    function renderBlock() {
        const cells = document.querySelectorAll(".grid-cell");
        cells.forEach((cell) => cell.classList.remove("filled"));

        const { x, y } = currentBlockPosition;
        const shape = activeBlock.shape;

        for (let i = 0; i < shape.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const targetCell = cells[(y + row) * 10 + (x + col)];
            if (shape[i] === 1 && targetCell) {
                targetCell.classList.add("filled");
                targetCell.style.backgroundColor = activeBlock.color;
            }
        }
    }

    // Make the block drop down every second
    function dropBlock() {
        const cells = document.querySelectorAll(".grid-cell");
        const { x, y } = currentBlockPosition;

        const shape = activeBlock.shape;
        let canDrop = true;

        for (let i = 0; i < shape.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const targetCell = cells[((y + row + 1) * 10) + (x + col)];
            if (shape[i] === 1 && targetCell && targetCell.classList.contains("filled")) {
                canDrop = false;
                break;
            }
        }

        if (canDrop) {
            currentBlockPosition.y++;
            renderBlock();
            setTimeout(dropBlock, 1000); // Keep dropping every second
        } else {
            placeBlock();
        }
    }

    // Place the block and check for completed lines
    function placeBlock() {
        const cells = document.querySelectorAll(".grid-cell");
        const { x, y } = currentBlockPosition;

        const shape = activeBlock.shape;

        for (let i = 0; i < shape.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const targetCell = cells[(y + row) * 10 + (x + col)];
            if (shape[i] === 1 && targetCell) {
                targetCell.classList.add("filled");
            }
        }

        checkForLines();
        score += 10; // Add points for placing a block
        scoreDisplay.textContent = score;
        level = Math.floor(score / 100) + 1;
        levelDisplay.textContent = level;

        activeBlock = null; // Reset the active block
    }

    // Check for completed lines
    function checkForLines() {
        const cells = document.querySelectorAll(".grid-cell");
        for (let row = 0; row < 10; row++) {
            let fullLine = true;
            for (let col = 0; col < 10; col++) {
                if (!cells[row * 10 + col].classList.contains("filled")) {
                    fullLine = false;
                    break;
                }
            }
            if (fullLine) {
                clearLine(row);
                shiftCellsDown(row);
            }
        }
    }

    // Clear completed line
    function clearLine(row) {
        const cells = document.querySelectorAll(".grid-cell");
        for (let col = 0; col < 10; col++) {
            cells[row * 10 + col].classList.remove("filled");
        }
    }

    // Shift cells down after clearing a line
    function shiftCellsDown(row) {
        const cells = document.querySelectorAll(".grid-cell");
        for (let i = row; i >= 1; i--) {
            for (let col = 0; col < 10; col++) {
                const currentCell = cells[i * 10 + col];
                const aboveCell = cells[(i - 1) * 10 + col];
                if (currentCell.classList.contains("filled")) {
                    currentCell.classList.remove("filled");
                    aboveCell.classList.add("filled");
                }
            }
        }
    }

    // Reset the game
    resetBtn.addEventListener("click", () => {
        const cells = document.querySelectorAll(".grid-cell");
        cells.forEach(cell => cell.classList.remove("filled"));
        score = 0;
        level = 1;
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        activeBlock = null;
    });
});
