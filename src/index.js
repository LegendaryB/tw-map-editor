// ==UserScript==
// @name         tw-map-editor
// @namespace    https://github.com/LegendaryB/tw-map-editor
// @version      0.1
// @author       LegendaryB
// @match        https://*.die-staemme.de/game.php?*screen=map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

import { Renderer } from "./rendering/renderer";
import { DRAW_TOOL_ARROW, DRAW_TOOL_LINE, DRAW_TOOL_TEXT, MapEditor } from "./editor";

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
