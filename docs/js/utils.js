function arraysEqual(a, b) {
    return a === b || (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]));
}

function debounce(func, wait, immediate = false) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout); // Clear timeout immediately
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
</svg>`;

const checkmarkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6L20.6 7.8l-1.4-1.4z"/>
</svg>`;

function addCopyButtons(clipboard) {
    document.querySelectorAll('code[class^="language-"]').forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerHTML = copyIcon;

        // Insert the button inside the parent of the code block
        codeBlock.parentNode.insertBefore(button, codeBlock);

        // Define the function to copy code, excluding lines starting with '# '
        const copyCode = () => {
            const lines = codeBlock.innerText.split("\n");
            const filteredLines = lines.filter(line => !line.trim().startsWith('# '));  // Exclude lines starting with '#'
            const result = filteredLines.join('\n').trim().replace(/\n\n/g, '\n'); // Join filtered lines and clean up
            
            clipboard.writeText(result).then(() => {
                button.innerHTML = checkmarkIcon;
                setTimeout(() => button.innerHTML = copyIcon, 1500);
            }).catch(() => {
                button.innerText = 'Error';
            });
        };

        // Attach the copy action to the button
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from propagating to the parent div
            copyCode();
        });

        // Attach the copy action to the parent div (including the button area)
        codeBlock.parentNode.addEventListener('click', () => {
            copyCode();
        });

        // Show and hide button on hover
        codeBlock.parentNode.addEventListener('mouseenter', debounce(() => {
            button.style.opacity = 0.9;
        }, 100));

        codeBlock.parentNode.addEventListener('mouseleave', debounce(() => {
            button.style.opacity = 0;
        }, 100));
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
    // Utility function to clear the 'active' class from a NodeList
    const clear = nodeList => nodeList.forEach(node => node.classList.remove('active'));

    // Utility function to find and clear nested tab contents
    const clearNested = nodeList => {
        nodeList.forEach(node => {
            if (node.querySelectorAll('.tabcontent').length > 0) {
                clear(node.querySelectorAll('.tabcontent'));
            }
        });
    };

    // Event handler for tab clicks
    const onTabClick = (event) => {
        const { tabset, tabcontent } = event.target.dataset;

        // Find all tab buttons and content sections for the clicked tabset
        const tabSetList = document.querySelectorAll(`button[data-tabset="${tabset}"]`);
        const tabContentList = document.querySelectorAll(`.tabcontent[data-tabset="${tabset}"]`);

        // Clear previous active tabs and their content, including nested content
        tabSetList.forEach(tab => tab.classList.remove('active'));
        tabContentList.forEach(content => {
            content.classList.remove('active');
            
            // Make sure any nested content inside this content is also hidden
            const nestedContents = content.querySelectorAll('.tabcontent');
            nestedContents.forEach(nestedContent => nestedContent.classList.remove('active'));
        });

        // Set the clicked tab to active
        event.target.classList.add('active');

        // Show the corresponding content for the clicked tab
        const targetContent = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);
        if (targetContent) {
            targetContent.classList.add('active');

            // Handle any nested tabs inside the target content
            const nestedTabs = targetContent.querySelectorAll('button[data-tabset]');
            nestedTabs.forEach(nestedTab => {
                if (nestedTab.classList.contains('active')) {
                    const { tabset: nestedTabset, tabcontent: nestedTabcontent } = nestedTab.dataset;
                    const activeNestedContent = document.querySelector(`.tabcontent[data-tabset="${nestedTabset}"][data-tabcontent="${nestedTabcontent}"]`);
                    
                    // Make sure the active nested tab content is shown
                    if (activeNestedContent) {
                        activeNestedContent.classList.add('active');
                    }
                }
            });
        }
    };

    // Initialize tabs and contents
    const initializeTabs = () => {
        const tabs = document.querySelectorAll('button[data-tabset]');
        tabs.forEach(tab => {
            const { tabset, tabcontent } = tab.dataset;

            // Ensure the parent container has the 'tabs' class
            if (!tab.parentElement.classList.contains('tabs')) {
                tab.parentElement.classList.add('tabs');
            }

            // Activate content for initially active tabs
            if (tab.classList.contains('active')) {
                const activeContent = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            }

            // Add click event listener to each tab
            tab.addEventListener('click', onTabClick);
        });
    };

    // Wrap tab contents with the tabset-wrapper logic
    const wrapTabContents = () => {
        const tabContents = document.querySelectorAll('div[data-tabset]');
        if (tabContents.length > 0) {
            const tabGroups = {};

            // Group the divs by their data-tabset values
            tabContents.forEach(div => {
                const tabset = div.getAttribute('data-tabset');

                if (!tabGroups[tabset]) {
                    tabGroups[tabset] = [];
                }

                tabGroups[tabset].push(div);
            });

            // Wrap each group of div[data-tabset] elements in a new wrapper div
            Object.keys(tabGroups).forEach(tabset => {
                const group = tabGroups[tabset];

                // Create the wrapper div
                const wrapper = document.createElement('div');
                wrapper.classList.add('tabset-wrapper');
                wrapper.setAttribute('data-tabset-group', tabset);

                // Insert the wrapper before the first element of the group
                const firstElement = group[0];
                firstElement.parentNode.insertBefore(wrapper, firstElement);

                // Move all grouped divs inside the wrapper while maintaining their order
                group.forEach(div => {
                    wrapper.appendChild(div);
                });
            });
        }
    };

    // Initialize the tab system
    const init = () => {
        wrapTabContents();
        initializeTabs();
    };

    // Run the initialization
    init();

})();

function reorderForm() {
    const form = document.getElementById("dynamicForm");

    // Convert the form's child nodes (the input-group divs) to an array
    const inputsArray = Array.from(form.getElementsByClassName("input-group"));

    // Sort the input-group divs by the text content of their labels (case-insensitive)
    inputsArray.sort((a, b) => {
        const labelA = a.querySelector("label").textContent.trim().toUpperCase();
        const labelB = b.querySelector("label").textContent.trim().toUpperCase();
        return labelA.localeCompare(labelB);
    });

    // Use a document fragment for batch updates
    const fragment = document.createDocumentFragment();
    
    // Append sorted input-group divs to the fragment
    inputsArray.forEach(inputGroup => {
        fragment.appendChild(inputGroup);
    });

    // Clear the form and append the fragment in one operation
    form.innerHTML = "";  // Clears all existing children
    form.appendChild(fragment);
}

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

            // Change button text to a check icon (using Unicode for check mark or Font Awesome if available)
            const replaceButton = buttons.replace;
            const originalText = replaceButton.innerHTML; // Save the original text

            replaceButton.innerHTML = checkmarkIcon; // Check mark (✔)

            // Restore the original button text after a delay (e.g., 1 second)
            setTimeout(() => {
                replaceButton.innerHTML = originalText;
            }, 1000); // 1000 milliseconds = 1 second
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

            // Change button text to a check icon (using Unicode for check mark or Font Awesome if available)
            const resetButton = buttons.reset;
            const originalText = resetButton.innerHTML; // Save the original text

            resetButton.innerHTML = checkmarkIcon; // Check mark (✔)

            // Restore the original button text after a delay (e.g., 1 second)
            setTimeout(() => {
                resetButton.innerHTML = originalText;
            }, 1000); // 1000 milliseconds = 1 second
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

            // Change button text to a check icon (using Unicode for check mark or Font Awesome if available)
            const clearButton = buttons.clear;
            const originalText = clearButton.innerHTML; // Save the original text

            clearButton.innerHTML = checkmarkIcon; // Check mark (✔)

            // Restore the original button text after a delay (e.g., 1 second)
            setTimeout(() => {
                clearButton.innerHTML = originalText;
            }, 1000); // 1000 milliseconds = 1 second
        };

        buttons.form?.addEventListener('click', onShowFormButtonClick);
        buttons.replace?.addEventListener('click', onReplaceParamsButtonClick);
        buttons.reset?.addEventListener('click', onResetButtonClick);
        buttons.clear?.addEventListener('click', onClearButtonClick);
    }
})();

(function(){
    let groups = [[]]; // Start with a single empty group

    document.querySelectorAll('.highlight').forEach((element, i, elements) => {
        groups[groups.length - 1].push(element);
        
        if (elements[i + 1] && elements[i + 1].previousElementSibling !== element) {
            groups.push([]); // Start a new group if next element is not a highlight
        }
    });

    // Apply styles to groups
    groups.forEach(group => {
        if (group.length > 1) {
            group.forEach((element, index) => {
                if (index === 0) element.classList.add('codeBlock-start');
                else if (index === group.length - 1) element.classList.add('codeBlock-end');
                else element.classList.add('codeBlock');
            });
        }
    });
})();