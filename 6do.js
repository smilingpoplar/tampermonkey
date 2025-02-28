// ==UserScript==
// @name         关掉弹窗
// @namespace    http://tampermonkey.net/
// @version      2025-2-28
// @description  关掉弹窗
// @author       smilingpoplar
// @match        https://6do.world/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=6do.world
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';
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

    const elem = await waitForElement("#closeModal");
    await delay(10);
    elem.click();
})();
