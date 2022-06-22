/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/surface.js
class Surface {
    canvas = undefined;
    canvasContext = undefined;

    constructor(rectangle) {
        this.canvas = document.createElement('canvas');
        this.canvasContext = this.canvas.getContext('2d');

        this.setSurfaceStyle();
        this.setSurfaceSize(rectangle);
    }

    setSurfaceSize(rect) {
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.top = rect.top;
        this.canvas.style.left = rect.left;
    };

    setSurfaceStyle() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = 2;
    };
};
;// CONCATENATED MODULE: ./src/editor.js
const CONTAINER_ID = 'drawOnMapEditor';
const ACTIVATE_CHECKBOX_ID = 'activateCheckbox';
const SELECTED_DRAW_TOOL_NAME = 'selectedDrawTool';
const COLOR_INPUT_ID = 'color';
const LINE_WIDTH_INPUT_ID = 'lineWidth';
const TEXT_SIZE_INPUT_ID = 'textSize';

const DRAW_SELECTION_TOOL = 'selection';
const DRAW_TOOL_LINE = 'line';
const DRAW_TOOL_ARROW = 'arrow';
const DRAW_TOOL_TEXT = 'text';

const EDITOR_HTML = `
        <div id="${CONTAINER_ID}">
            <h3>Karten Editor</h3>
            <div style="margin-bottom: 16px;">
                <input type="checkbox" id="${ACTIVATE_CHECKBOX_ID}" name="${ACTIVATE_CHECKBOX_ID}">
                <label for="${ACTIVATE_CHECKBOX_ID}">Aktivieren</label>
            </div>
            <table style="width:100%;">
                <tbody>
                    <tr>
                        <td>
                            <h5>Werkzeuge</h5>
                            <div>
                                <input type="radio" id="selectElement" name="${SELECTED_DRAW_TOOL_NAME}" value="${DRAW_SELECTION_TOOL}" checked>
                                <label for="selectElement"> Selektion</label>
                                <input type="radio" id="drawLine" name="${SELECTED_DRAW_TOOL_NAME}" value="${DRAW_TOOL_LINE}" checked>
                                <label for="drawLine"> ⟋ Linie</label>
                                <input type="radio" id="drawArrow" name="${SELECTED_DRAW_TOOL_NAME}" value="${DRAW_TOOL_ARROW}">
                                <label for="drawArrow"> ↗ Pfeil</label>
                                <input type="radio" id="drawText" name="${SELECTED_DRAW_TOOL_NAME}" value="${DRAW_TOOL_TEXT}">
                                <label for="drawText"> Text</label>
                            </div>
                        </td>
                        <td>
                            <h5>Werkzeug-Einstellungen</h5>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Farbe</td>
                                        <td>
                                            <input value="#C899F5" id="${COLOR_INPUT_ID}" type="color">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Linienstärke</td>
                                        <td>
                                            <input value="4" id="${LINE_WIDTH_INPUT_ID}" type="number">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Textgröße</td>
                                        <td>
                                            <input id="${TEXT_SIZE_INPUT_ID}" type="number" value="12">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <h5>Teilen</h5>

                            <div>
                                <a href="javascript:void(0);">» Importieren</a>
                            </div>
                            <div><a href="javascript:void(0);">» Exportieren</a></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;

const EDITOR_CSS = `
        #${CONTAINER_ID} {
            margin-bottom: 15px;
            border: 1px solid #8c5f0d;
            padding: 5px;
            background-color: rgb(244, 228, 188);
        }

        #${CONTAINER_ID} input[type=color] {
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 40px;
            background: none;
        }

        #${CONTAINER_ID} input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
        }

        #${CONTAINER_ID} input[type="color"]::-webkit-color-swatch {
            border: solid 1px #000;
            /*change color of the swatch border here*/
            border-radius: 40px;
        }

        #${CONTAINER_ID} td {
            vertical-align: top;
        }`;

class MapEditorValues {
    constructor(selectedTool, color, lineWidth, textSize) {
        this.selectedTool = selectedTool;
        this.color = color;
        this.lineWidth = lineWidth;
        this.textSize = textSize;
    }
}

class MapEditor {
    constructor(anchorElement) {
        this.loadStyle();
        this.insertMapEditorElement(anchorElement);
    }

    static #getContainerElement() {
        return document.querySelector(`#${CONTAINER_ID}`);
    }

    static getSelectedTool() {
        return this.#getContainerElement().querySelector(`input[name="${SELECTED_DRAW_TOOL_NAME}"]:checked`).value
    }

    static getColor() {
        return this.#getContainerElement().querySelector(`#${COLOR_INPUT_ID}`).value;
    }

    static getLineWidth() {
        return this.#getContainerElement().querySelector(`#${LINE_WIDTH_INPUT_ID}`).value;
    }

    static getTextSize() {
        return this.#getContainerElement().querySelector(`#${TEXT_SIZE_INPUT_ID}`).value;
    }

    static getMapEditorPreferences() {
        return new MapEditorValues(
            this.getSelectedTool(),
            this.getColor(),
            this.getLineWidth(),
            this.getTextSize()
        )
    }

    onActivationStatusChanged(callback) {
        const element = document.querySelector(`#${ACTIVATE_CHECKBOX_ID}`);

        element.addEventListener('change', (event) => {
            callback(event.target.checked);
        });
    }

    insertMapEditorElement(anchorElement) {
        let template = document.createElement('template');
        template.innerHTML = EDITOR_HTML;

        anchorElement.after(template.content);
    }

    loadStyle() {
        const style = document.createElement('style');
        style.textContent = EDITOR_CSS;
        document.head.append(style);
    }
}
;// CONCATENATED MODULE: ./src/rendering/renderElement.js



class RenderElement {
    color = 'black';
    lineWidth = 1;

    constructor() {
        this.color = MapEditor.getColor();
        this.lineWidth = MapEditor.getLineWidth();
    }

    render(ctx) {
    }

    calculateCanvasX(x) {
        return (x * TWMap.tileSize[0] - TWMap.map.pos[0]) + TWMap.tileSize[0] / 2;
    }

    calculateCanvasY(y) {
        return (y * TWMap.tileSize[1] - TWMap.map.pos[1]) + TWMap.tileSize[1] / 2;
    }
}

;// CONCATENATED MODULE: ./src/rendering/line.js



class Line extends RenderElement {
    fromX = 0;
    fromY = 0;
    toX = 0;
    toY = 0;

    constructor(fromX, fromY, toX, toY) {
        super();

        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
    }

    render(ctx) {
        console.log("Line.render(ctx) invoked");

        let points = this.calculateCanvasPoints();

        ctx.beginPath();
        ctx.moveTo(points.fromX, points.fromY);
        ctx.lineTo(points.toX, points.toY);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    calculateCanvasPoints() {
        return {
            fromX: this.calculateCanvasX(this.fromX),
            fromY: this.calculateCanvasY(this.fromY),
            toX: this.calculateCanvasX(this.toX),
            toY: this.calculateCanvasY(this.toY)
        };
    }
}

;// CONCATENATED MODULE: ./src/rendering/arrow.js



class Arrow extends Line {
    #arrowHeadLength = 10;

    render(ctx) {
        console.log("Arrow.render(ctx) invoked");

        let points = this.calculateCanvasPoints();

        var angle = Math.atan2(points.toY - points.fromY, points.toX - points.fromX);

        ctx.strokeStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(points.fromX, points.fromY);
        ctx.lineTo(points.toX, points.toY);
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points.toX, points.toY);

        ctx.lineTo(
            points.toX - this.#arrowHeadLength * Math.cos(angle - Math.PI / 7),
            points.toY - this.#arrowHeadLength * Math.sin(angle - Math.PI / 7)
        );

        ctx.lineTo(
            points.toX - this.#arrowHeadLength * Math.cos(angle + Math.PI / 7),
            points.toY - this.#arrowHeadLength * Math.sin(angle + Math.PI / 7)
        );

        ctx.lineTo(points.toX, points.toY);

        ctx.lineTo(
            points.toX - this.#arrowHeadLength * Math.cos(angle - Math.PI / 7),
            points.toY - this.#arrowHeadLength * Math.sin(angle - Math.PI / 7)
        );

        ctx.stroke();
    }
}

;// CONCATENATED MODULE: ./src/rendering/text.js



class Text extends RenderElement {
    text = '';
    textSize = 0;
    x = 0;
    y = 0;

    constructor(text, x, y) {
        super();

        this.text = text;
        this.textSize = MapEditor.getTextSize();
        this.x = x;
        this.y = y;
    }

    render(ctx) {
        console.log("Text.render(ctx) invoked");

        let canvasX = this.calculateCanvasX(this.x);
        let canvasY = this.calculateCanvasY(this.y);

        ctx.fillStyle = this.color;
        ctx.font = `${this.textSize}px serif`;
        ctx.fillText(this.text, canvasX, canvasY);
    }
}

;// CONCATENATED MODULE: ./src/rendering/renderer.js





class Renderer {
    surface = undefined;
    objectsToRender = [];

    constructor(element) {
        let rect = element.getBoundingClientRect();

        this.surface = new Surface(rect);

        element.before(this.surface.canvas);

        new ResizeObserver(entries => {
            for (const entry of entries) {
                this.surface.setSurfaceSize(entry.contentRect);
                this.requestRender();
            }
        }).observe(element);
    }

    createTextElement(text, x, y) {
        console.log("createTextElement invoked");

        this.objectsToRender.push(
            new Text(
                text,
                x,
                y
            )
        )
    }

    createLineElement(fromX, fromY, toX, toY) {
        console.log("createLineElement invoked");

        this.objectsToRender.push(
            new Line(
                fromX,
                fromY,
                toX,
                toY
            )
        );
    }

    createArrowElement(fromX, fromY, toX, toY) {
        console.log("createArrowElement invoked");

        this.objectsToRender.push(
            new Arrow(
                fromX,
                fromY,
                toX,
                toY
            )
        );
    }

    #render() {
        console.log("render invoked");

        for (const object of this.objectsToRender) {
            object.render(this.surface.canvasContext);
        }
    }

    requestRender() {
        console.log("requestRender invoked");

        this.#render();
    }

    clearSurface() {
        console.log("clearSurface invoked");
        this.surface.canvasContext.clearRect(0, 0, this.surface.canvas.width, this.surface.canvas.height);
    }
};
;// CONCATENATED MODULE: ./src/index.js
// ==UserScript==
// @name         tw-map-extension
// @namespace    https://github.com/LegendaryB/tw-framework
// @version      0.1
// @author       LegendaryB
// @match        https://*.die-staemme.de/game.php?*screen=map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==




(async () => {
    'use strict';

    const win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

    const MAP_ELEMENT = document.getElementById('map');
    const EDITOR_ANCHOR_ELEMENT = document.getElementById('map_whole').nextElementSibling;

    const MAP_EDITOR = new MapEditor(EDITOR_ANCHOR_ELEMENT);
    const RENDERER = new Renderer(MAP_ELEMENT);

    let onClickFn = win.TWMap.mapHandler.onClick;
    let onResizeBeginFn = win.TWMap.mapHandler.onResizeBegin;
    let onResizeEndFn = win.TWMap.mapHandler.onResizeEnd;
    let onDragBeginFn = win.TWMap.mapHandler.onDragBegin;
    let onDragEndFn = win.TWMap.mapHandler.onDragEnd;

    let villageArray = [];

    const onResizeBeginHook = () => {
        onResizeEndFn();

        RENDERER.clearSurface();
    };

    const onResizeEndHook = () => {
        onResizeEndFn();

        RENDERER.requestRender();
    };

    const onDragBeginHook = () => {
        onDragBeginFn();

        RENDERER.clearSurface();
    };

    const onDragEndHook = () => {
        onDragEndFn();

        RENDERER.requestRender();
    };

    const onClickHook = (x, y, e) => {
        handleTileClick(x, y);
        return false;
    }

    const handleTileClick = async (x, y) => {
        let selectedTool = MapEditor.getSelectedTool();

        let village = {
            x: x,
            y: y
        }

        if (selectedTool === DRAW_TOOL_TEXT) {
            let text = prompt('Text eingeben');

            RENDERER.createTextElement(
                text,
                x,
                y
            );

            RENDERER.requestRender();
            return;
        }

        if (villageArray.length === 2) {
            villageArray = [];
        }

        let index = villageArray.findIndex(v => v.x === village.x && v.y === village.y);
        let alreadySelected = index !== -1;

        if (alreadySelected) {
            villageArray[index] = null;
        }
        else {
            villageArray.push(village);
        }

        if (villageArray.length == 2) {
            switch (selectedTool) {
                case DRAW_TOOL_LINE:
                    RENDERER.createLineElement(villageArray[0].x, villageArray[0].y, villageArray[1].x, villageArray[1].y);
                    break;
                case DRAW_TOOL_ARROW:
                    RENDERER.createArrowElement(villageArray[0].x, villageArray[0].y, villageArray[1].x, villageArray[1].y);
                    break;
            }

            RENDERER.requestRender();
        }
    };

    const hook = () => {
        win.TWMap.mapHandler.onClick = onClickHook;
        win.TWMap.mapHandler.onResizeBegin = onResizeBeginHook;
        win.TWMap.mapHandler.onResizeEnd = onResizeEndHook;

        win.TWMap.mapHandler.onDragBegin = onDragBeginHook;
        win.TWMap.mapHandler.onDragEnd = onDragEndHook;
    };

    const unhook = () => {
        win.TWMap.mapHandler.onClick = onClickFn;
        win.TWMap.mapHandler.onResizeBegin = onResizeBeginFn;
        win.TWMap.mapHandler.onResizeEnd = onResizeEndFn;

        win.TWMap.mapHandler.onDragBegin = onDragBeginFn;
        win.TWMap.mapHandler.onDragEnd = onDragEndFn;
    };

    const enable = () => {
        hook();
    }

    const disable = () => {

        unhook();
    }

    MAP_EDITOR.onActivationStatusChanged((activated) => {
        activated === true ? enable() : disable();
    });
})();

/******/ })()
;