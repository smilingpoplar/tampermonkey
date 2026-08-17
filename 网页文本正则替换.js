// ==UserScript==
// @name         网页文本正则替换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  完全基于网站域名的纯净配置版本
// @author       smilingpoplar
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const siteRulesMap = {
        '__global__': [
            ['法学硕士', 'LLM']
        ],
        'news.ycombinator.com': [
            ['https?://[^\\s]+', ''],
        ]
    };

    // =============================================================
    // 获取当前网站适用的规则，并在底层自动转化为 RegExp 对象
    function getActiveCompiledRules() {
        const currentHost = window.location.hostname;
        const rawRules = [...siteRulesMap.__global__];

        // 遍历配置，只有当前域名包含对应的 Key 时才加载规则
        for (const key in siteRulesMap) {
            if (currentHost.includes(key)) {
                rawRules.push(...siteRulesMap[key]);
            }
        }

        // 自动编译：在后台自动加上 'g' (全局替换)
        return rawRules.map(([pattern, replacement]) => {
            try {
                return [new RegExp(pattern, 'g'), replacement];
            } catch (e) {
                console.error(`[替换脚本] 规则解析错误: ${pattern}`, e);
                return null;
            }
        }).filter(rule => rule !== null);
    }

    const compiledRules = getActiveCompiledRules();

    // 如果当前网站没有配置任何规则，直接完全退出，不占用内存
    if (compiledRules.length === 0) return;

    // 核心替换函数
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let changed = false;

            for (const [regex, replacement] of compiledRules) {
                const newText = text.replace(regex, replacement);
                if (newText !== text) {
                    text = newText;
                    changed = true;
                }
            }

            if (changed) {
                node.nodeValue = text;
            }
        } else {
            const ignoreTags = ['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'];
            if (ignoreTags.includes(node.nodeName)) return;

            for (const child of node.childNodes) {
                replaceText(child);
            }
        }
    }

    // 监听动态加载
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                replaceText(addedNode);
            }
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        replaceText(document.body);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

})();