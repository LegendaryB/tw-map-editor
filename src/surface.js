export class Surface {
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