const CONTAINER_ID = 'drawOnMapEditor';
const ACTIVATE_CHECKBOX_ID = 'activateCheckbox';
const SELECTED_DRAW_TOOL_NAME = 'selectedDrawTool';
const COLOR_INPUT_ID = 'color';
const LINE_WIDTH_INPUT_ID = 'lineWidth';
const TEXT_SIZE_INPUT_ID = 'textSize';

export const DRAW_SELECTION_TOOL = 'selection';
export const DRAW_TOOL_LINE = 'line';
export const DRAW_TOOL_ARROW = 'arrow';
export const DRAW_TOOL_TEXT = 'text';

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

export class MapEditor {
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