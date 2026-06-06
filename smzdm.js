// ==UserScript==
// @name         SMZDM值率过滤器
// @namespace    https://www.smzdm.com/
// @version      1.0
// @description  屏蔽低值率的结果
// @author       smilingpoplar
// @match        https://www.smzdm.com/*
// @match        https://search.smzdm.com/*
// @icon         https://www.smzdm.com/favicon.ico
// ==/UserScript==

; (() => {
  'use strict'

  const THRESHOLD = 0.7

  const parseNum = (el) => parseInt(el?.textContent, 10) || 0

  const shouldHide = (item) => {
    const upEl = item.querySelector('.price-btn-up span')
    const downEl = item.querySelector('.price-btn-down span')
    if (!upEl || !downEl) return true
    const up = parseNum(upEl)
    const down = parseNum(downEl)
    const total = up + down
    return total > 0 && up / total < THRESHOLD
  }

  new MutationObserver(() => {
    document.querySelectorAll('li.feed-row-wide').forEach((item) => {
      if (item._smzdmFiltered) return
      item._smzdmFiltered = true
      if (shouldHide(item)) item.style.display = 'none'
    })
  }).observe(document, { childList: true, subtree: true })
})()
