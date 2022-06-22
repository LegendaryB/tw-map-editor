import { RenderElement } from "./renderElement";


export class Line extends RenderElement {
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
