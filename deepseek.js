// ==UserScript==
// @name         给deepseek网站添加q查询参数：chat.deepseek.com/?q={query}
// @namespace    http://tampermonkey.net/
// @version      2025-2-9
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
    const getReactProps = el => el[Object.keys(el).find(k => k.startsWith('__reactProps$'))];
    const delay = (ms) => new Promise(res => setTimeout(res, ms));


    const input = await waitForElement("#chat-input");
    getReactProps(input)?.onChange?.({
        target: { value: query },
        currentTarget: { value: query },
        preventDefault: () => { },
        stopPropagation: () => { }
    });
    input.value = query;

    await delay(500);
    getReactProps(input)?.onKeyDown?.({
        key: 'Enter',
        keyCode: 13,
        shiftKey: false,
        target: input,
        currentTarget: input,
        preventDefault: () => { },
        stopPropagation: () => { },
    });
})();
