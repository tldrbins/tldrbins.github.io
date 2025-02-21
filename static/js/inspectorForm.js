// paramsForm.js

import { checkmarkIcon } from './icons.js';
import { updateAllKeywords } from './utils.js';

export function addInspectorFormListener() {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById("dynamicForm");
        if (!form) return;

        const buttons = {
            form: document.getElementById("form_btn"),
            replace: document.getElementById("replace_btn"),
            reset: document.getElementById("reset_btn"),
            clear: document.getElementById("clear_btn"),
        };

        const formElements = [...form.elements];
        const inputs = form.querySelectorAll("input");
        const autoReplaceCheckbox = document.getElementById("autoReplace");

        const replaceKeywordsFromCache = () => {
            document.querySelectorAll('.editable-keyword').forEach(keyword => {
              const originalText = keyword.dataset.originalText;
              const cachedValue = localStorage.getItem(originalText);

              if (cachedValue) {
                keyword.textContent = cachedValue;
              } else {
                keyword.textContent = `<${originalText}>`;
              }
            });
          };

        inputs.forEach(input => {
            const cachedValue = localStorage.getItem(input.name);
            if (cachedValue) {
                input.value = cachedValue;
            }
        });

        const isAutoReplaceEnabled = localStorage.getItem('autoReplace') === 'true';
        if (autoReplaceCheckbox) {
            autoReplaceCheckbox.checked = isAutoReplaceEnabled;
            autoReplaceCheckbox.addEventListener('change', (e) => {
              const isChecked = e.target.checked;
              localStorage.setItem('autoReplace', isChecked);

              if (isChecked) {
                replaceKeywordsFromCache();
              } else {
                document.querySelectorAll('.editable-keyword').forEach(keyword => {
                  const originalText = keyword.dataset.originalText;
                  keyword.textContent = `<${originalText}>`;
                });
              }
            });
        }

        if (isAutoReplaceEnabled) {
          replaceKeywordsFromCache();
        }

        const toggleFormVisibility = () => {
            const isActive = form.classList.toggle('active');
            form.style.display = isActive ? "grid" : "none";
            buttons.form.innerText = isActive ? "Hide Inspector" : "Show Inspector";
            buttons.replace.style.display = isActive ? "inline-block" : "none";
            buttons.reset.style.display = isActive ? "inline-block" : "none";
            buttons.clear.style.display = isActive ? "inline-block" : "none";
        };

        const replaceKeywords = () => {
            formElements.forEach(element => {
                const originalText = element.name;
                const newValue = element.value.trim();

                if (newValue) {
                    try {
                        localStorage.setItem(element.name, element.value);
                    } catch (e) {
                        console.error("LocalStorage error: ", e);
                    }
                    updateAllKeywords(originalText, newValue);
                } else {
                    try {
                        localStorage.removeItem(element.name);
                    } catch (e) {
                        console.error("LocalStorage error: ", e);
                    }
                    updateAllKeywords(originalText, `<${originalText}>`);
                }
            });
            provideFeedback(buttons.replace);
        };

        const resetKeywords = () => {
            document.querySelectorAll('.editable-keyword').forEach(keyword => {
                const originalText = keyword.dataset.originalText;
                keyword.textContent = `<${originalText}>`;
            });
            provideFeedback(buttons.reset);
        };

        const clearFormAndCache = () => {
            formElements.forEach(element => {
                element.value = "";
            });

            const tempDarkMode = localStorage.getItem('darkMode');
            localStorage.clear();
            if (tempDarkMode) {
                localStorage.setItem('darkMode', tempDarkMode);
            }
            provideFeedback(buttons.clear);
        };

        const provideFeedback = (button) => {
            const originalText = button.innerHTML;
            button.innerHTML = checkmarkIcon;

            setTimeout(() => {
                button.innerHTML = originalText;
            }, 1000);
        };

        buttons.form?.addEventListener('click', toggleFormVisibility);
        buttons.replace?.addEventListener('click', replaceKeywords);
        buttons.reset?.addEventListener('click', resetKeywords);
        buttons.clear?.addEventListener('click', clearFormAndCache);
    });
}