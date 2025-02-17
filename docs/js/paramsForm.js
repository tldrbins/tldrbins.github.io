// paramsForm.js

import { checkmarkIcon } from './icons.js';
import { arraysEqual } from './utils.js';

export function addParamsFormListener() {
    let container = document.getElementById("dynamicFormContainer");
    let form = document.getElementById("dynamicForm");

    const buttons = {
        form: document.getElementById("form_btn"),
        replace: document.getElementById("replace_btn"),
        reset: document.getElementById("reset_btn"),
        clear: document.getElementById("clear_btn"),
    };

    if (form != null) {
        const formElements = [...form.elements];
        const orig_codeblocks = [];

        document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
            orig_codeblocks.push(codeBlock.innerHTML);
        });

        const inputs = form.querySelectorAll("input");

        inputs.forEach(input => {
            const cacheKey = input.name;
            const cachedValue = localStorage.getItem(cacheKey);

            if (cachedValue) {
                input.value = cachedValue;
            }
        });

        const onShowFormButtonClick = function() {
            if (form.classList.contains('active')) {
                form.classList.remove('active');
                form.style.display = "none";
                buttons.form.innerText = "Show Params Form";
                buttons.replace.style.display = "none";
                buttons.reset.style.display = "none";
                buttons.clear.style.display = "none";
            } else {
                form.classList.add('active');
                form.style.display = "grid";
                buttons.form.innerText = "Hide Params Form";
                buttons.replace.style.display = "inline-block";
                buttons.reset.style.display = "inline-block";
                buttons.clear.style.display = "inline-block";
            }
        };

        const onReplaceParamsButtonClick = function() {
            let curr_codeblocks = [];

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
                curr_codeblocks.push(codeBlock.innerHTML);
            });

            if (!arraysEqual(curr_codeblocks, orig_codeblocks)) {
                curr_codeblocks = [...orig_codeblocks];
            }

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock, i) {
                let temp_codeblock = curr_codeblocks[i];
                formElements.forEach(element => {
                    const input_value = element.value;
                    if (input_value) {
                        const escaped_input_value = input_value.replace(/\$/g, '$$$$');
                        const regex = new RegExp(`&lt;${element.name}&gt;`, "g");
                        temp_codeblock = temp_codeblock.replace(regex, escaped_input_value);
                        try {
                            localStorage.setItem(element.name, element.value);
                        } catch (e) {
                            console.error("LocalStorage error: ", e);
                        }
                    }
                });
                codeBlock.innerHTML = temp_codeblock;
            });

            const replaceButton = buttons.replace;
            const originalText = replaceButton.innerHTML;

            replaceButton.innerHTML = checkmarkIcon;

            setTimeout(() => {
                replaceButton.innerHTML = originalText;
            }, 1000);
        };

        const onResetButtonClick = function() {
            let curr_codeblocks = [];

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
                curr_codeblocks.push(codeBlock.innerHTML);
            });

            if (!arraysEqual(curr_codeblocks, orig_codeblocks)) {
                curr_codeblocks = [...orig_codeblocks];
            }

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock, i) {
                codeBlock.innerHTML = curr_codeblocks[i];
            });

            formElements.forEach(element => {
                element.value = "";
            });

            const resetButton = buttons.reset;
            const originalText = resetButton.innerHTML;

            resetButton.innerHTML = checkmarkIcon;

            setTimeout(() => {
                resetButton.innerHTML = originalText;
            }, 1000);
        };

        const onClearButtonClick = function() {
            formElements.forEach(element => {
                element.value = "";
            });

            const tempDarkMode = localStorage.getItem('darkMode');
            localStorage.clear();
            if (tempDarkMode) {
                localStorage.setItem('darkMode', tempDarkMode);
            }

            const clearButton = buttons.clear;
            const originalText = clearButton.innerHTML;

            clearButton.innerHTML = checkmarkIcon;

            setTimeout(() => {
                clearButton.innerHTML = originalText;
            }, 1000);
        };

        buttons.form?.addEventListener('click', onShowFormButtonClick);
        buttons.replace?.addEventListener('click', onReplaceParamsButtonClick);
        buttons.reset?.addEventListener('click', onResetButtonClick);
        buttons.clear?.addEventListener('click', onClearButtonClick);
    }
}
