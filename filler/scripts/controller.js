class Controller extends Renderable {

    constructor(canvas, topMargin, bottomMargin, leftMargin, rightMargin) {
        super(canvas, topMargin, bottomMargin, leftMargin, rightMargin);

        // Create button for each color
        this.tiles = [];
        for (const color of Board.colors) {
            this.tiles.push(new Square(vec2(2, 2), 0, color));
        }

        this.clicked = []
        this.canvas.canvas.addEventListener("click", (event) => {this.click(event.offsetX, event.offsetY)});

        window.addEventListener("resize", () => this.sizeToCanvas());
        this.sizeToCanvas();
    }


    /**
     * Determines if a square has been clicked and makes the appropriate move
     * @param {int} x 
     * @param {int} y 
     */
    click(x, y) {

        // Check if click happened on a tile
        for(const tile of this.tiles) {
            if (!this.clicked.includes(tile)) {
                let margin = tile.size / 2;
                let pos = this.canvas.glToPixelCoords(tile.position);
                if (Math.abs(x - pos[0]) <= margin && Math.abs(y - pos[1]) <= margin) {

                    // Update clicked tiles
                    tile.size /= 2;
                    this.clicked.push(tile);
                    if (this.clicked.length > 2) {
                        this.clicked.shift().size *= 2;
                    }
                    
                    board.colorBFS(tile.color);
                }
            }
        }
    }


    /**
     * Resizes the controller based on canvas size
     */
    sizeToCanvas() {
        let cols = this.tiles.length;
        if (cols > 0) {
            let dims = this.pixelDims();
            let centerCol = (cols - 1) / 2;

            let margin = 0.5;

            let size = Math.min(dims[0] / (cols + ((cols - 1) * margin)), dims[1]);
            let pixCenter = this.canvas.glToPixelCoords(this.getCenter());

            // Update all tile positions and sizes
            for (let i = 0; i < cols; i++) {
                let tile = this.tiles[i];
                tile.position = this.canvas.pixelToGLCoords(add(pixCenter, vec2((i - centerCol) * (size + (size * margin)), 0)));
                tile.size = Math.min(size);

                if (this.clicked.includes(tile)) {
                    tile.size /= 2;
                }
            }
        }
    }


    /**
     * Draw controller array
     */
    render() {

        for (const tile of this.tiles) {
            tile.render();
        }
    }
}