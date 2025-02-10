// ==UserScript==
// @name         给kimi网站添加q查询参数：kimi.moonshot.cn/?q={query}
// @namespace    http://tampermonkey.net/
// @version      2025-2-9
// @description  从URL中提取q查询参数，填入对话框，提交搜索
// @author       smilingpoplar
// @match        https://kimi.moonshot.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonshot.cn
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


    const chat = await waitForElement('.chat-input-editor');
    chat.value = query;
    chat.dispatchEvent(new InputEvent('input', { data: query, bubbles: true }));

    await delay(500);
    chat.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
})();