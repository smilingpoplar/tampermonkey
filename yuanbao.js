// ==UserScript==
// @name         给腾讯元宝网站的deepseek搜索添加q查询参数：https://yuanbao.tencent.com/chat/?q={query}
// @namespace    http://tampermonkey.net/
// @version      2025-3-2
// @description  从URL中提取q查询参数，填入对话框，选择DeepSeek，提交搜索
// @author       smilingpoplar
// @match        https://yuanbao.tencent.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuanbao.tencent.com
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';
    const query = new URLSearchParams(window.location.search).get('q');
    if (!query) return;

    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            const elem = document.querySelector(selector);
            if (elem) {
                return resolve(elem);
            }

            const observer = new MutationObserver(() => {
                const elem = document.querySelector(selector);
                if (elem) {
                    observer.disconnect();
                    resolve(elem);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    };
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const simulateInput = (elem, text) => {
        elem.value = text;
        if (elem.contentEditable === 'true') {
            elem.textContent = text;
            elem.innerHTML = text;
        }
        elem.dispatchEvent(new InputEvent('input', { data: text, bubbles: true }));
    };
    const simulateEnter = (elem, event = 'keydown') => {
        elem.dispatchEvent(new KeyboardEvent(event, { key: 'Enter', keyCode: 13, bubbles: true }));
    };


    const button = await waitForElement('button[dt-button-id="model_switch"]');
    button.setAttribute("dt-model-id", "deep_seek");
    button.setAttribute("dt-ext1", "deep_seek");
    button.querySelector('span').textContent = "DeepSeek";

    const chat = await waitForElement('.ql-editor');
    await delay(100);
    simulateInput(chat, query);
    await delay(100);
    simulateEnter(chat);
})();