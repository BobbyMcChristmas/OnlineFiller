class Board extends Renderable {

    static colors = [vec3(0.2, 0.2, 0.2), // Black
                     vec3(1, 0.2, 0.3),   // Red
                     vec3(0.5, 0.8, 0.3), // Green
                     vec3(0.2, 0.6, 1),   // Blue
                     vec3(1, 0.9, 0.1),   // Yellow
                     vec3(0.4, 0.3, 0.5) // Purple
                    ]

    constructor(canvas, topMargin, bottomMargin, leftMargin, rightMargin, rows, cols) {
        super(canvas, topMargin, bottomMargin, leftMargin, rightMargin);

        // Build board layout
        this.tiles = [];
        let tileColors = [];
        for (let i = 0; i < rows; i++) {
            let row = [];
            let rowColors = [];

            for (let j = 0; j < cols; j++) {

                // Ensure no two adjacent tiles have the same color
                let colorAbove = i > 0 ? tileColors[i - 1][j] : -1;
                let colorLeft = j > 0 ? rowColors[j - 1] : -1;
                let color;
                do {
                    color = Math.floor(Math.random() * Board.colors.length);
                }
                while (color === colorAbove || color === colorLeft);

                rowColors.push(color);
                row.push(new Square(vec2(2,2), 0, Board.colors[color]));
            }

            this.tiles.push(row);
            tileColors.push(rowColors);
        }

        this.leftTurn = true;
        this.marker = [new Square(vec2(2,2), 0, vec3(1,1,1)), new Square(vec2(2,2), 0, vec3())];

        window.addEventListener("resize", () => this.sizeToCanvas());
        this.sizeToCanvas();
    }


    /**
     * Performs a BFS search beginning in the relevant corner,
     * changes the color of all connected same-color squares to the target color
     * 
     * @param {vec3} color Target color to change to
     * @returns {int} Total number of connected squares with the target color
     */
    colorBFS(color) {

        const directions = [
            vec2(1,0),  // Down
            vec2(0,1),  // Right
            vec2(-1,0), // Up
            vec2(0,-1)  // Left
        ];

        // Get relevant corner for turn
        let startRow, startCol;
        if (this.leftTurn) {
            startRow = this.tiles.length - 1;
            startCol = 0;
        }
        else {
            startRow = 0;
            startCol = this.tiles[0].length - 1;
        }

        // Initialize BFS
        let visited = Array.from({ length: this.tiles.length }, () => Array(this.tiles[0].length).fill(false));
        let queue = [];
        queue.push([startRow, startCol]);
        visited[startRow][startCol] = true;
        let startColor = this.tiles[startRow][startCol].color;
        let count = 1;

        // Run BFS
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            this.tiles[row][col].color = color;

            // Check all adjacent tiles
            for (const [dirRow, dirCol] of directions) {
                const newRow = row + dirRow;
                const newCol = col + dirCol;

                if (newRow >= 0 && newRow < this.tiles.length && 
                    newCol >= 0 && newCol < this.tiles[0].length && 
                    !visited[newRow][newCol]) {

                    // Update colors and count tiles connected
                    let tileColor = this.tiles[newRow][newCol].color;
                    if (tileColor === startColor) {
                        visited[newRow][newCol] = true;
                        queue.push([newRow, newCol]);
                        count++;
                    }
                    else if (tileColor === color) {
                        visited[newRow][newCol] = true;
                        count++;
                    }
                }
            }
        }

        this.leftTurn = !this.leftTurn;
        this.updateMarker();

        console.log(count);
        return count;
    }


    /**
     * Resizes the board based on canvas size
     */
    sizeToCanvas() {
        let dims = this.pixelDims();

        let rows = this.tiles.length;
        let centerRow = ((rows - 1) / 2);

        let cols = this.tiles[0].length;
        let centerCol = ((cols - 1) / 2);

        let size = Math.min(dims[0] / cols, dims[1] / rows);
        let pixCenter = this.canvas.glToPixelCoords(this.getCenter());

        for (let i = 0; i < this.tiles.length; i++) {
            let row = this.tiles[i];
            for (let j = 0; j < row.length; j++) {
                row[j].position = this.canvas.pixelToGLCoords(add(pixCenter, vec2((j - centerCol) * size, (i - centerRow) * size)));
                row[j].size = Math.min(size);
            }
        }

        this.updateMarker();
    }


    /**
     * Positions turn marker in the relevant corner of the board
     */
    updateMarker() {

        let corner = this.leftTurn ? this.tiles[this.tiles.length - 1][0] : this.tiles[0][this.tiles[0].length - 1];

        for (let i = 0; i < this.marker.length; i++) {
            this.marker[i].position = corner.position;
            this.marker[i].size = corner.size / (i + 1.5);
        }
    }


    /**
     * Draw board matrix and turn marker
     */
    render() {

        for (const row of this.tiles) {
            for (const tile of row) {
                tile.render();
            }
        }

        for (const tile of this.marker) {
            tile.render();
        } 
    }
}