// ==UserScript==
// @name         关掉弹窗
// @namespace    http://tampermonkey.net/
// @version      2026.2.9
// @description  关掉弹窗
// @author       smilingpoplar
// @match        https://6do.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=6do.world
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';
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

    const elem = await waitForElement("#blokersDetectionModal", 10000);
    elem?.remove();
})();
