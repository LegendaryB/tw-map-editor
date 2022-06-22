import { Line } from "./line";


export class Arrow extends Line {
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
