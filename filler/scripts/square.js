// Creates a square centered on the position given
class Square {
    
    constructor(position, size, color) {
        this.position = position;
        this.size = size;
        this.color = color;
    }


    /**
     * Draw point as a square
     */
    render() {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(this.position));
        gl.uniform1f(pointSizeLoc, this.size);
        gl.uniform3fv(colorLoc, flatten(this.color));
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}