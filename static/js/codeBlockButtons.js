// codeBlockButtons.js

import { copyIcon, checkmarkIcon, downArrowIcon, upArrowIcon } from './icons.js';
import { debounce } from './utils.js';

export function addCodeBlockButtons(clipboard) {
    document.querySelectorAll('code[class^="language-"]').forEach((codeBlock) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons-container';

        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerHTML = copyIcon;

        const sampleButton = document.createElement('button');
        sampleButton.className = 'sample-output-button';
        sampleButton.type = 'button';
        sampleButton.innerHTML = downArrowIcon;

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(sampleButton);

        codeBlock.parentNode.insertBefore(buttonContainer, codeBlock);

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

        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from propagating to the parent div
            copyCode();
        });

        codeBlock.parentNode.addEventListener('click', () => {
            copyCode();
        });

        let currentOutputBubble = null;  // Track the active bubble

        const showExampleOutput = () => {
            let outputBubble = codeBlock.parentNode.querySelector('.output-bubble');
            let outputButton = codeBlock.parentNode.querySelector('.sample-output-button');

            outputBubble.style.display = outputBubble.style.display === 'block' ? 'none' : 'block';
            outputButton.innerHTML = outputBubble.style.display === 'block' ? upArrowIcon : downArrowIcon;

            // Track the currently active bubble
            currentOutputBubble = outputBubble.style.display === 'block' ? outputBubble : null;
        };

        sampleButton.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent event from bubbling up
            showExampleOutput();
        });

        // Event listener for clicks outside the code block to hide the output
        document.addEventListener('click', (e) => {
            if (currentOutputBubble && !codeBlock.contains(e.target) && !currentOutputBubble.contains(e.target) && !sampleButton.contains(e.target)) {
                currentOutputBubble.style.display = 'none';
                sampleButton.innerHTML = downArrowIcon;
                currentOutputBubble = null;  // Clear the active bubble
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