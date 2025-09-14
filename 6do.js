// ==UserScript==
// @name         关掉弹窗
// @namespace    http://tampermonkey.net/
// @version      2025.9.14
// @description  关掉弹窗
// @author       smilingpoplar
// @match        https://6do.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=6do.world
// @license      MIT
// ==/UserScript==

(async () => {
    'use strict';
    const isElementVisible = (elem) => {
        const style = window.getComputedStyle(elem);
        const rect = elem.getBoundingClientRect();
        return (
            elem.offsetParent !== null &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.width > 0 &&
            rect.height > 0
        );
    };

    const waitForElementVisible = (selector, timeout = 8000) => {
        return new Promise((resolve) => {
            const elem = document.querySelector(selector);
            if (elem && isElementVisible(elem)) return resolve(elem);

            const timer = setTimeout(() => {
                observer.disconnect();
                console.log(`元素 ${selector} 在 ${timeout}ms 内未变为可见状态，跳过操作`);
                resolve(null);
            }, timeout);

            const observer = new MutationObserver(() => {
                const elem = document.querySelector(selector);
                if (elem && isElementVisible(elem)) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(elem);
                }
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    };

    const elem = await waitForElementVisible("#closeModal");
    elem?.click();
})();
