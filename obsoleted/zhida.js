// ==UserScript==
// @name         给知乎直答网站添加q查询参数：zhida.zhihu.com/?q={query}
// @namespace    http://tampermonkey.net/
// @version      2025.9.28
// @description  从URL中提取q查询参数，填入对话框，提交搜索
// @author       smilingpoplar
// @match        https://zhida.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhida.zhihu.com
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
        document.execCommand('insertText', false, value);
        elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
    };

    const getReactProps = el => el[Object.keys(el).find(k => k.startsWith('__reactProps$'))];
    const simulateEnter = (elem) => {
        getReactProps(chat)?.onKeyDown?.({
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            preventDefault: () => { },
            stopPropagation: () => { },
        });
    };

    const query = new URLSearchParams(window.location.search).get('q');
    if (!query) return;

    const chat = await waitForElement('div[contenteditable="true"]'); // draft.js editor
    chat.focus();
    await delay(100);
    simulateInput(chat, query);
    await delay(100);
    simulateEnter(chat);
})();