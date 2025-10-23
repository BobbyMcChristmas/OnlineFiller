"use strict";

let gl;
let pointSizeLoc;
let colorLoc;

let board;
let controller;



/**
 * Initialize WebGL and simulation
 */
function main() {

    const canvas = new Canvas2D("webgl");
    gl = WebGLUtils.setupWebGL(canvas.canvas, null);
    if (!gl) { alert("WebGL isn't available"); return; }

    canvas.resizeCanvasToWindow(gl);
    window.addEventListener("resize", () => canvas.resizeCanvasToWindow(gl));

    const program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    // Allocate buffer for one particle position
    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vec2(0, 0)), gl.DYNAMIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    pointSizeLoc = gl.getUniformLocation(program, "pointSize");
    colorLoc = gl.getUniformLocation(program, "uColor");

    // Set up game
    board = new Board(canvas, 0.1, 0.6, 0.2, 0.2, 7, 8);
    controller = new Controller(canvas, 1.6, 0.2, 0.1, 0.1);
    document.getElementById("leftScore").style.backgroundColor = vec3toRGBString(board.tiles[board.tiles.length - 1][0].color);
    document.getElementById("rightScore").style.backgroundColor = vec3toRGBString(board.tiles[0][board.tiles[0].length - 1].color);

    render();
}


/**
 * Converts between GL color values to HTML RGB
 * @param {vec3} color 
 * @returns String representation of RGB
 */
function vec3toRGBString(color) {

    let r = Math.round(color[0] * 255);
    let g = Math.round(color[1] * 255);
    let b = Math.round(color[2] * 255);

    return `rgb(${r}, ${g}, ${b})`;
}


/**
 * Draw all components to canvas
 */
function render() {

    board.render();
    controller.render();
    
    requestAnimationFrame(render);
}
