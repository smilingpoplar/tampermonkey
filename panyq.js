// ==UserScript==
// @name         盘友圈
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  从URL中提取q参数填入输入框并提交搜索
// @author       You
// @match        https://panyq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panyq.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 获取 URL 中的参数值
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 获取 q 参数的值
    const queryValue = getQueryParam('q');

    if (!queryValue) {
        console.error('URL 中未找到 q 参数');
        return;
    }

    // 定位到页面中的输入框
    const input = document.querySelector('input[name="query"]');
    if (!input) {
        console.error('输入框未找到');
        return;
    }

    input.value = queryValue; // 填入值

    // 从多个单选按钮中选择 id 为 cat-ali 的选项
    const radioButton = document.querySelector('#cat-ali');
    if (!radioButton) {
        console.error('单选按钮 #cat-ali 未找到');
        return;
    }

    // 延迟一秒后点击单选按钮
    setTimeout(() => {
        radioButton.click(); // 选中
        console.log('已选中单选按钮 #cat-ali');

        // 模拟按下回车键
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });
        input.dispatchEvent(event); // 触发回车键事件
    }, 500); // 延迟 500 毫秒
})();