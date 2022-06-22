import { MapEditor } from "../editor";
import { RenderElement } from "./renderElement";

export class Text extends RenderElement {
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
