function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function addCopyButtons(clipboard) {
    document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = '  Copy  ';

        let showDelay = 100, hideDelay = 100;
        let codeBlockEnterTimer, codeBlockLeaveTimer;

        button.addEventListener('click', function () {
            const lines = codeBlock.innerText.replace(/\r\n/, "\n").split("\n");
            const cmds = lines.filter(line => !(/^#\s/.test(line)));
            result = cmds.join('\n');

            clipboard.writeText(result.trim().replace(/\n\n/g, '\n')).then(function () {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                button.blur();

                button.innerText = 'Copied';

                setTimeout(function () {
                    button.innerText = '  Copy  ';
                }, 1500);
            }, function (error) {
                button.innerText = 'Error';
            });
        });

        codeBlock.parentNode.insertBefore(button, codeBlock);

        codeBlock.parentNode.addEventListener('click', function () {
            const lines = codeBlock.innerText.replace(/\r\n/, "\n").split("\n");
            const cmds = lines.filter(line => !(/^#\s/.test(line)));
            result = cmds.join('\n');

            clipboard.writeText(result.trim().replace(/\n\n/g, '\n')).then(function () {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                button.blur();

                button.innerText = 'Copied';

                setTimeout(function () {
                    button.innerText = '  Copy  ';
                }, 1500);
            }, function (error) {
                button.innerText = 'Error';
            });
        });

        codeBlock.parentNode.addEventListener('mouseenter', function () {
            clearTimeout(codeBlockLeaveTimer);
            codeBlockEnterTimer = setTimeout(function () {
                button.setAttribute("style", "opacity: 0.9;");
            }, showDelay);
        });

        codeBlock.parentNode.addEventListener('mouseleave', function () {
            clearTimeout(codeBlockEnterTimer);
            codeBlockLeaveTimer = setTimeout(function () {
                button.setAttribute("style", "opacity: 0.0;");
            }, hideDelay);
        });
    });
}

if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard);
} else {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js';
    script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=';
    script.crossOrigin = 'anonymous';
    script.onload = function() {
        addCopyButtons(clipboard);
    };

    document.body.appendChild(script);
}

(function() {
    var tab = document.querySelectorAll('button[data-tabset]');
    if (tab != null) {

        var i, el, tabcontent, tabset, tabSetList, tabContentList;

        var clear = function(nodeList) {
            for (i = 0; i < nodeList.length; i++) {
                nodeList[i].classList.remove('active');
            }
        }

        var onTabClick = function() {
            tabset = event.target.dataset.tabset;
            tabcontent = event.target.dataset.tabcontent;
            tabSetList = document.querySelectorAll('button[data-tabset="'+ tabset +'"]');
            tabContentList = document.querySelectorAll('.tabcontent[data-tabset="'+ tabset +'"]');
            clear(tabSetList);
            event.target.classList.add('active');
            clear(tabContentList);
            el = document.querySelector('.tabcontent[data-tabset="' + tabset + '"].tabcontent[data-tabcontent="' + tabcontent + '"]');
            if (el != null) {
                el.classList.add('active');
            }
        }

        for (i = 0; i < tab.length; i++) {
            tabset = tab[i].dataset.tabset;
            tabcontent = tab[i].dataset.tabcontent;

            // add `tabs` class to parent element
            if (!tab[i].parentElement.classList.contains('tabs')) {
                tab[i].parentElement.classList.add('tabs');
            }

            // show active content
            if (tab[i].classList.contains('active')) {
                el = document.querySelector('.tabcontent[data-tabset="' + tabset + '"].tabcontent[data-tabcontent="' + tabcontent + '"]');
                if (el != null) {
                    el.classList.add('active');
                }
            }
        }

        for (i = 0; i < tab.length; i++) {
            tab[i].addEventListener('click', onTabClick);
        }
    }

})();

(function() {
    var form = document.getElementById("params_form");

    if (form != null) {
        const regex = /&lt;([A-Z0-9_]+)&gt;/g;
        var matches = [...new Set(document.documentElement.innerHTML.match(regex))];
        if (matches != null) {
            for (const match of matches) {
                const param = match.slice(4, match.length - 4);

                var label = document.createElement("label");
                label.setAttribute("for", param);
                label.innerText = param.replace(/_/g, " ").replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase()) + ": ";
                form.appendChild(label);

                var input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("name", param);

                if (localStorage.getItem(param)) {
                    input.value = localStorage.getItem(param);
                }

                form.appendChild(input);
            }
        }

        const orig_codeblocks = [];

        document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
            if (matches != null) {
                for (const match of matches) {
                    const find = match;
                    const regex = new RegExp(find, "g");
                    codeBlock.innerHTML = codeBlock.innerHTML.replace(regex, '<span class="o">' + match + '</span>');
                }
            }
            orig_codeblocks.push(codeBlock.innerHTML);
        });

        var onShowFormButtonClick = function() {
            var replace_btn = document.getElementById("replace_btn");
            if (form.classList.contains('active')) {
                form.classList.remove('active');
                form.style.display = "none";
                form_btn.innerText = "Show Params Form";
                replace_btn.style.display = "none";
                reset_btn.style.display = "none";
                clear_btn.style.display = "none";
            } else  {
                form.classList.add('active');
                form.style.display = "block";
                form_btn.innerText = "Hide Params Form";
                replace_btn.style.display = "inline-block";
                reset_btn.style.display = "inline-block";
                clear_btn.style.display = "inline-block";
            } 
        }

        var onReplaceParamsButtonClick = function() {
            var curr_codeblocks = [];

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
                curr_codeblocks.push(codeBlock.innerHTML);
            });

            if (!arraysEqual(curr_codeblocks, orig_codeblocks)) {
                curr_codeblocks = [...orig_codeblocks];
            }

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock, i) {
                temp_codeblock = curr_codeblocks[i];
                for (const element of form.elements) {
                    input_value = element.value;
                    if (input_value) {
                        const find = '&lt;' + element.name + '&gt;';
                        const regex = new RegExp(find, "g");
                        temp_codeblock = temp_codeblock.replace(regex, input_value);
                    }
                }
                codeBlock.innerHTML = temp_codeblock;
            });

            for (const element of form.elements) {
                if (element.value) {
                    localStorage.setItem(element.name, element.value);
                }
            }
        }

        var onResetButtonClick = function() {
            var curr_codeblocks = [];

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
                curr_codeblocks.push(codeBlock.innerHTML);
            });

            if (!arraysEqual(curr_codeblocks, orig_codeblocks)) {
                curr_codeblocks = [...orig_codeblocks];
            }

            document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock, i) {
                codeBlock.innerHTML = curr_codeblocks[i];
            });

            for (const element of form.elements) {
                element.value = "";
            }
        }

         var onClearButtonClick = function() {
            var curr_codeblocks = [];

            for (const element of form.elements) {
                element.value = "";
            }

            darkMode = 'false';

            if (localStorage.getItem("darkMode")) {
                darkMode = 'true';
            }

            localStorage.clear();

            if (darkMode) {
                localStorage.setItem('darkMode', 'true');
            }
        }

        var form_btn = document.getElementById('form_btn');
            if (form_btn != null) {
                form_btn.addEventListener('click', onShowFormButtonClick);
        }

        var replace_btn = document.getElementById('replace_btn');
            if (replace_btn != null) {
                replace_btn.addEventListener('click', onReplaceParamsButtonClick);
        }

        var reset_btn = document.getElementById('reset_btn');
            if (reset_btn != null) {
                reset_btn.addEventListener('click', onResetButtonClick);
        }

        var clear_btn = document.getElementById('clear_btn');
            if (clear_btn != null) {
                clear_btn.addEventListener('click', onClearButtonClick);
        }
    }

})();