// codeBlockButtons.js

import { copyIcon, checkmarkIcon, downArrowIcon, upArrowIcon } from './icons.js';
import { debounce } from './utils.js';

export function addCodeBlockButtonsListener(clipboard) {
    document.querySelectorAll('code[class^="language-"]').forEach((codeBlock) => {
        const button = codeBlock.parentNode.querySelector('.buttons-container .copy-code-button');
        const sampleButton = codeBlock.parentNode.querySelector('.buttons-container .sample-output-button');

        const copyCode = (e) => {
            // Check if the clicked element or any of its ancestors have the class 'editable-keyword'
            if (e.target.closest('.editable-keyword')) {
                return;
            }

            const lines = codeBlock.innerText.split("\n");
            const filteredLines = lines.filter(line => !line.trim().startsWith('# '));  // Exclude lines starting with '#'
            const result = filteredLines.join('\n').trim().replace(/\n\n/g, '\n');
            
            clipboard.writeText(result).then(() => {
                button.innerHTML = checkmarkIcon;
                setTimeout(() => button.innerHTML = copyIcon, 1500);
            }).catch(() => {
                button.innerText = 'Error';
            });
        };

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            copyCode(e);
        });

        codeBlock.parentNode.addEventListener('click', (e) => {
            copyCode(e);
        });

        let currentOutputBubble = null;

        const showExampleOutput = () => {
            let outputBubble = codeBlock.parentNode.querySelector('.output-bubble');
            let outputButton = codeBlock.parentNode.querySelector('.sample-output-button');

            outputBubble.style.display = outputBubble.style.display === 'block' ? 'none' : 'block';
            outputButton.innerHTML = outputBubble.style.display === 'block' ? upArrowIcon : downArrowIcon;

            currentOutputBubble = outputBubble.style.display === 'block' ? outputBubble : null;
        };

        sampleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showExampleOutput();
        });

        document.addEventListener('click', (e) => {
            const dynamicFormContainer = document.getElementById('dynamicFormContainer');
            
            if (
                currentOutputBubble && 
                !codeBlock.contains(e.target) && 
                !currentOutputBubble.contains(e.target) && 
                !sampleButton.contains(e.target) && 
                !(dynamicFormContainer && dynamicFormContainer.contains(e.target))  // Exclude dynamicFormContainer
            ) {
                currentOutputBubble.style.display = 'none';
                sampleButton.innerHTML = downArrowIcon;
                currentOutputBubble = null;
            }
        });

        codeBlock.parentNode.addEventListener('mouseenter', debounce(() => {
            button.style.opacity = 0.9;
            sampleButton.style.opacity = 0.9;
        }, 100));

        codeBlock.parentNode.addEventListener('mouseleave', debounce(() => {
            button.style.opacity = 0;
            sampleButton.style.opacity = 0;
        }, 100));
    });
}