// ==UserScript==
// @name         给deepseek网站添加q查询参数：chat.deepseek.com/?q={query}
// @namespace    http://tampermonkey.net/
// @version      2025.9.28
// @description  从URL中提取q查询参数，填入对话框，提交搜索
// @author       smilingpoplar
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';
    const query = new URLSearchParams(window.location.search).get('q');
    if (!query) return;

    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            const elem = document.querySelector(selector);
            if (elem) return resolve(elem);

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

    const simulateInput = (elem, value) => {
        elem.textContent = value;
        elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
    const simulateEnter = (elem, event = 'keydown') => {
        elem.dispatchEvent(new KeyboardEvent(event, { key: 'Enter', keyCode: 13, bubbles: true }));
    };


    const chat = await waitForElement("textarea.ds-scroll-area");
    chat.focus();
    await delay(100);
    simulateInput(chat, query);
    await delay(100);
    simulateEnter(chat);
})();