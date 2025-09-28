// ==UserScript==
// @name         给阿里qwen网站添加q查询参数（用#伪?）：chat.qwen.ai/#q={query}
// @namespace    http://tampermonkey.net/
// @version      2025.9.28
// @description  从URL中提取q查询参数（用#伪?以避免触发访问验证），填入对话框，提交搜索
// @author       smilingpoplar
// @match        https://chat.qwen.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwen.ai
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';

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
        elem.value = value;
        elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
    const simulateEnter = (elem, event = 'keydown') => {
        elem.dispatchEvent(new KeyboardEvent(event, { key: 'Enter', keyCode: 13, bubbles: true }));
    };


    const queryString = location.hash.substring(1)
    const query = new URLSearchParams(queryString).get('q');
    if (!query) return;

    const chat = await waitForElement("#chat-input");
    document.querySelectorAll('button.chat-input-feature-btn').forEach(btn => btn.click()); // 开启所有特性

    chat.focus();
    await delay(100);
    simulateInput(chat, query);
    await delay(100);
    simulateEnter(chat, 'keypress');
})();