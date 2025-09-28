// ==UserScript==
// @name         给腾讯元宝网站添加q查询参数：yuanbao.tencent.com/?q={query}
// @namespace    http://tampermonkey.net/
// @version      2025.9.28
// @description  从URL中提取q查询参数，填入对话框，提交搜索
// @author       smilingpoplar
// @match        https://yuanbao.tencent.com/*
// @run-at       document-start // 在网址跳转前获取参数q
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuanbao.tencent.com
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';
    const query = new URLSearchParams(window.location.search).get('q');
    if (!query) return;

    const waitForElement = (selector, timeout) => {
        return new Promise((resolve, reject) => {
            const elem = document.querySelector(selector);
            if (elem) return resolve(elem);

            let timer;
            if (typeof timeout === 'number' && timeout > 0) {
                timer = setTimeout(() => {
                    observer.disconnect();
                    reject(`在${timeout}ms内，未找到元素：${selector}`);
                }, timeout);
            }
            const observer = new MutationObserver(() => {
                const elem = document.querySelector(selector);
                if (elem) {
                    if (timer) clearTimeout(timer);
                    observer.disconnect();
                    resolve(elem);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    };
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const simulateInput = (elem, value) => {
        elem.textContent = value;
        elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
    };
    const simulateEnter = (elem, event = 'keydown') => {
        elem.dispatchEvent(new KeyboardEvent(event, { key: 'Enter', keyCode: 13, bubbles: true }));
    };


    const chat = await waitForElement('div[contenteditable="true"]'); // ql-editor
    await waitForElement('.input-guide-v2', 3000); // 在.input-guide-v2出现前的对话会被清空，所以等它加载
    chat.focus();
    await delay(100);
    simulateInput(chat, query);
    await delay(100);
    simulateEnter(chat);
})();