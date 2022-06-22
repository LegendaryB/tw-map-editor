import { MapEditor } from "../editor";


export class RenderElement {
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
