// paramsForm.js

import { checkmarkIcon } from './icons.js';
import { arraysEqual } from './utils.js';

function reorderForm() {
    const form = document.getElementById("dynamicForm");

    const inputsArray = Array.from(form.getElementsByClassName("input-group"));

    inputsArray.sort((a, b) => {
        const labelA = a.querySelector("label").textContent.trim().toUpperCase();
        const labelB = b.querySelector("label").textContent.trim().toUpperCase();
        return labelA.localeCompare(labelB);
    });

    const fragment = document.createDocumentFragment();
    
    inputsArray.forEach(inputGroup => {
        fragment.appendChild(inputGroup);
    });

    form.innerHTML = "";
    form.appendChild(fragment);
}

export function addParamsForm() {
    let container = document.getElementById("dynamicFormContainer");
    let form = document.getElementById("dynamicForm");

    const buttons = {
        form: document.getElementById("form_btn"),
        replace: document.getElementById("replace_btn"),
        reset: document.getElementById("reset_btn"),
        clear: document.getElementById("clear_btn"),
    };

    if (form != null) {
        const regex = /&lt;([A-Z0-9_]+)&gt;/g;
        const matches = [...new Set(document.documentElement.innerHTML.match(regex))];

        if (matches.length === 0) {
            container.style.display = "none";
        } else {
            matches.forEach(match => {
                const div = document.createElement("div");
                div.setAttribute("class", "input-group");
                form.insertBefore(div, form.firstChild);

                const param = match.slice(4, match.length - 4);

                const label = document.createElement("label");
                label.setAttribute("for", param);
                label.innerText = param.replace(/_/g, " ") + ": ";
                div.appendChild(label);

                const input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("name", param);

                if (localStorage.getItem(param)) {
                    input.value = localStorage.getItem(param);
                }
                div.appendChild(input);
            });
        }

        reorderForm();

        const formElements = [...form.elements];
        const orig_codeblocks = [];

        document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
            if (matches != null) {
                matches.forEach(match => {
                    const regex = new RegExp(match, "g");
                    codeBlock.innerHTML = codeBlock.innerHTML.replace(regex, '<span class="o">' + match + '</span>');
                });
            }
            orig_codeblocks.push(codeBlock.innerHTML);
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
