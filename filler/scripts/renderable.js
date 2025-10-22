class Renderable {
    
    constructor(canvas, topMargin, bottomMargin, leftMargin, rightMargin) {
        this.canvas = canvas;

        this.top = 1 - topMargin;
        this.bottom = -1 + bottomMargin;
        this.left = -1 + leftMargin;
        this.right = 1 - rightMargin;
    }


    /**
     * @returns {vec2} gl coordinates of center
     */
    getCenter() {
        return vec2((this.left + this.right) / 2, (this.top + this.bottom) / 2);
    }


    /**
     * @returns {vec2} width and height in pixels
     */
    pixelDims() {
        return subtract(this.canvas.glToPixelCoords(vec2(this.right, this.bottom)),
                        this.canvas.glToPixelCoords(vec2(this.left, this.top)));
    }
}