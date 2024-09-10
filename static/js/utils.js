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