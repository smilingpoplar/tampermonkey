// ==UserScript==
// @name         盘友圈
// @namespace    http://tampermonkey.net/
// @version      2024.12.05
// @description  从URL中提取q查询参数，填入对话框，提交搜索
// @author       smilingpoplar
// @match        https://panyq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panyq.com
// @license      MIT
// ==/UserScript==

(async function () {
    'use strict';
    const query = new URLSearchParams(window.location.search).get('q');
    if (!query) {
        console.error('URL中未找到q查询参数');
        return;
    }

    const input = document.querySelector('input[name="query"]');
    if (!input) {
        console.error('未找到输入框');
        return;
    }

    input.value = query;
    input.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        bubbles: true
    }));
})();
