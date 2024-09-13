function arraysEqual(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
}

function debounce(func, wait, immediate = false) {
    let timeout;
    return function(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function addCopyButtons(clipboard) {
    document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
        const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>`;

        const checkmarkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6L20.6 7.8l-1.4-1.4z"/>
        </svg>`;

        let button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerHTML = copyIcon;

        const showDelay = 100, hideDelay = 100;
        let codeBlockEnterTimer, codeBlockLeaveTimer;

        const copyCode = () => {
            const lines = codeBlock.innerText.replace(/\r\n/, "\n").split("\n");
            const cmds = lines.filter(line => !(/^#\s/.test(line)));
            const result = cmds.join('\n');

            clipboard.writeText(result.trim().replace(/\n\n/g, '\n')).then(() => {
                button.blur();
                button.innerHTML = checkmarkIcon;
                setTimeout(() => {
                    button.innerHTML = copyIcon;
                }, 1500);
            }).catch(() => {
                button.innerText = 'Error';
            });
        };

        const handleClick = () => copyCode();
        button.addEventListener('click', handleClick);
        codeBlock.parentNode.insertBefore(button, codeBlock);
        codeBlock.parentNode.addEventListener('click', handleClick);

        codeBlock.parentNode.addEventListener('mouseenter', debounce(function () {
            button.setAttribute("style", "opacity: 0.9;");
        }, showDelay));

        codeBlock.parentNode.addEventListener('mouseleave', debounce(function () {
            button.setAttribute("style", "opacity: 0.0;");
        }, hideDelay));
    });
}

if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard);
} else {
    let script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js';
    script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=';
    script.crossOrigin = 'anonymous';
    script.onload = function() {
        addCopyButtons(clipboard);
    };
    document.body.appendChild(script);
}

(function() {
    const tabs = document.querySelectorAll('button[data-tabset]');
    if (tabs != null) {
        const clear = (nodeList) => nodeList.forEach(node => node.classList.remove('active'));

        const onTabClick = function() {
            const tabset = event.target.dataset.tabset;
            const tabcontent = event.target.dataset.tabcontent;
            const tabSetList = document.querySelectorAll(`button[data-tabset="${tabset}"]`);
            const tabContentList = document.querySelectorAll(`.tabcontent[data-tabset="${tabset}"]`);

            clear(tabSetList);
            event.target.classList.add('active');
            clear(tabContentList);

            let el = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);
            if (el != null) {
                el.classList.add('active');
            }
        };

        tabs.forEach(tab => {
            const tabset = tab.dataset.tabset;
            const tabcontent = tab.dataset.tabcontent;

            if (!tab.parentElement.classList.contains('tabs')) {
                tab.parentElement.classList.add('tabs');
            }

            if (tab.classList.contains('active')) {
                const el = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);
                if (el != null) {
                    el.classList.add('active');
                }
            }
        });

        tabs.forEach(tabElement => {
            tabElement.addEventListener('click', onTabClick);
        });
    }
})();

(function() {
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
                        const regex = new RegExp(`&lt;${element.name}&gt;`, "g");
                        temp_codeblock = temp_codeblock.replace(regex, input_value);
                        try {
                            localStorage.setItem(element.name, element.value);
                        } catch (e) {
                            console.error("LocalStorage error: ", e);
                        }
                    }
                });
                codeBlock.innerHTML = temp_codeblock;
            });
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

        };

        buttons.form?.addEventListener('click', onShowFormButtonClick);
        buttons.replace?.addEventListener('click', onReplaceParamsButtonClick);
        buttons.reset?.addEventListener('click', onResetButtonClick);
        buttons.clear?.addEventListener('click', onClearButtonClick);
    }
})();
