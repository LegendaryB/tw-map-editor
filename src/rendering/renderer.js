import { Surface } from "../surface";
import { Arrow } from "./arrow";
import { Line } from "./line";
import { Text } from "./text";

export class Renderer {
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

    #createRenderElemenr(element) {
        
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