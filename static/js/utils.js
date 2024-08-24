function addCopyButtons(clipboard) {
    document.querySelectorAll('code[class^="language-"]').forEach(function (codeBlock) {
        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = 'Copy';

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
                    button.innerText = 'Copy';
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
                    button.innerText = 'Copy';
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