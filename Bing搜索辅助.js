// ==UserScript==
// @name         Bing搜索辅助
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Add search parameters to Bing search box with instant apply on button click
// @author       sikuai
// @match        https://cn.bing.com/*
// @grant        none
// ==/UserScript==

// 此脚本将上传GitHub的仓库，仓库名为自用油猴脚本仓库。仓库英文为tampermonkey-scripts。
(function () {
    'use strict';

    function addSearchOptions() {
        const searchForm = document.querySelector('.b_searchboxForm');
        if (!searchForm) return;

        // 创建一个容器来存放按钮和输入框
        const optionContainer = document.createElement('div');
        optionContainer.style.marginTop = '10px';
        optionContainer.style.display = 'flex';
        optionContainer.style.flexDirection = 'column';
        optionContainer.style.gap = '5px';

        // 定义搜索参数及其标签
        const searchParams = {
            'list:': '网站列表',
            'inurl:': '网址中包含',
            'site:': '指定网站',
            'intitle:': '标题中包含',
            '+': '必须包含',
            '-': '不包含'
        };

        // 创建按钮和输入框并添加到容器中
        for (const [param, label] of Object.entries(searchParams)) {
            const optionWrapper = document.createElement('div');
            optionWrapper.style.display = 'flex';
            optionWrapper.style.alignItems = 'center';
            optionWrapper.style.gap = '5px';
            // 美化一下按钮，拟态风格，去除按钮边框
            optionWrapper.style.border = 'none';
            optionWrapper.style.borderRadius = '5px';
            optionWrapper.style.padding = '5px';
            optionWrapper.style.backgroundColor = '#f5f5f5';
            optionWrapper.style.boxShadow = '0 0 5px #ccc';
            optionWrapper.style.marginBottom = '5px';
            optionWrapper.style.fontFamily = 'Arial, sans-serif';
            optionWrapper.style.fontSize = '14px';

            if (param === '+' || param === '-') {
                // 对于+和-，创建按钮，使他们两个在一行显示
                const button = document.createElement('button');
                button.textContent = label;
                button.style.cursor = 'pointer';
                button.style.flex = '1'; // 按钮占满剩余空间

                // 点击按钮时添加参数到搜索框
                button.addEventListener('click', function (event) {
                    event.preventDefault(); // 防止按钮点击后自动提交表单
                    const searchBox = document.getElementById('sb_form_q');
                    if (!searchBox) return;
                    // 检查搜索框中是否已经有内容
                    if (searchBox.value.trim()) {
                        searchBox.value += param; // 如果没有内容，则直接添加参数
                    }
                    searchBox.focus();
                });

                optionWrapper.appendChild(button);
            } else if (param === 'list:') {
                // 对于site参数，创建复选框和输入框，使其在一行显示
                // 输入框用于输入网站域名，复选框包含了常用的网站域名
                const checkboxContainer = document.createElement('div');
                checkboxContainer.style.display = 'flex';
                checkboxContainer.style.flexWrap = 'wrap';
                checkboxContainer.style.gap = '5px';
                // 放上常用的网站域名 csdn.net zhihu.com gov.cn baidu.com
                const commonSites = ['csdn.net', 'zhihu.com', 'gov.cn', 'baidu.com'];
                for (const site of commonSites) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = site;
                    checkbox.style.marginRight = '5px';
                    checkbox.addEventListener('change', function (event) {
                        const searchBox = document.getElementById('sb_form_q');
                        if (!searchBox) return;
                        if (event.target.checked) {
                            // 如果复选框被选中，则添加参数到搜索框
                            if (searchBox.value.trim()) {
                                searchBox.value += 'site:' + event.target.value;
                            } else {
                                searchBox.value = 'site:' + event.target.value;
                            }
                        } else {
                            // 如果复选框被取消选中，则从搜索框中删除参数
                            searchBox.value = searchBox.value.replace('site:' + event.target.value, '').trim();
                        }
                        searchBox.focus();
                    });
                    const label = document.createElement('label');
                    label.textContent = site;
                    label.style.cursor = 'pointer';
                    label.style.userSelect = 'none';
                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(label);
                }
                optionWrapper.appendChild(checkboxContainer);
            }
            else {
                // 对于其他参数，创建按钮和输入框
                const button = document.createElement('button');
                button.textContent = label;
                button.style.cursor = 'pointer';

                const inputBox = document.createElement('input');
                inputBox.type = 'text';
                inputBox.style.flex = '1'; // 输入框占满剩余空间
                inputBox.style.marginLeft = '5px';

                // 点击按钮时添加参数到输入框
                button.addEventListener('click', function (event) {
                    event.preventDefault(); // 防止按钮点击后自动提交表单
                    const searchBox = document.getElementById('sb_form_q');
                    if (!searchBox) return;
                    // 检查搜索框中是否已经有内容
                    if (searchBox.value.trim()) {
                        searchBox.value += param; // 如果没有内容，则直接添加参数
                    }
                    // 如果输入框有内容，则将输入框的内容添加到搜索框
                    if (inputBox && inputBox.value.trim()) {
                        searchBox.value += inputBox.value.trim();
                    }
                    // 清空输入框
                    if (inputBox) {
                        inputBox.value = '';
                    }
                    searchBox.focus();
                });



                optionWrapper.appendChild(button);
                optionWrapper.appendChild(inputBox);
            }

            optionContainer.appendChild(optionWrapper);
        }

        // 将选项容器添加到搜索表单中
        searchForm.appendChild(optionContainer);
    }

    // 等待搜索表单加载
    window.addEventListener('load', addSearchOptions);
})();
