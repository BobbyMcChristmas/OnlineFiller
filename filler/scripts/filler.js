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
    alert("attempt 2");

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

    board = new Board(canvas, 0.1, 0.6, 0.1, 0.1, 7, 8);
    controller = new Controller(canvas, 1.6, 0.2, 0.1, 0.1);

    render();
}


/**
 * Draw all components to canvas
 */
function render() {

    board.render();
    controller.render();
    
    requestAnimationFrame(render);
}
