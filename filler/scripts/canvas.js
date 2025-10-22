class Canvas2D {
    
    constructor(elementID) {
        this.canvas = document.getElementById(elementID);
    }


    /**
     * Resizes the canvas based on window size
     * @param gl
     */
    resizeCanvasToWindow(gl) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }


    /**
     * Converts a point from pixel to GL coords
     * @param {vec2} coords Pixel coords
     * @returns {vec2} GL coords
     */
    pixelToGLCoords(coords) {
        return vec2((coords[0] / this.canvas.width)  * 2 - 1, 
                    (this.canvas.height - coords[1]) / this.canvas.height * 2 - 1);
    }


    /**
     * Converts a point from GL to pixel coords
     * @param {vec2} coords GL coords
     * @returns {vec2} Pixel coords
     */
    glToPixelCoords(coords) {
        return vec2(Math.round((coords[0] + 1) / 2 * this.canvas.width), 
                    Math.round(this.canvas.height - ((coords[1] + 1) / 2 * this.canvas.height)));
    }
}