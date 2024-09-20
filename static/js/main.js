// main.js

import { addCodeBlockButtons } from './codeBlockButtons.js';
import { addTabbedViews } from './tabbedViews.js';
import { addParamsForm } from './paramsForm.js';

initializeLayout();
addCodeBlockButtons(navigator.clipboard);
addTabbedViews();
addParamsForm();

function initializeLayout(){
    document.querySelectorAll('code[class^="language-"]').forEach((codeBlock) => {
        let outputBubble = codeBlock.parentNode.querySelector('.output-bubble');
        let outputButton = codeBlock.parentNode.querySelector('.sample-output-button');

        // Find the parent of the current code block
        const parentContainer = codeBlock.closest('.highlight');
        const nearestExample = parentContainer ? parentContainer.nextElementSibling : null;

        // Check if nearest element has 'sample' class and is the correct container
        if (nearestExample && nearestExample.classList.contains('sample-code')) {
            const codeElement = nearestExample.querySelector('code');
            if (codeElement) {
                const sampleHTML = codeElement.innerHTML;

                if (!outputBubble) {
                    outputBubble = document.createElement('div');
                    outputBubble.className = 'output-bubble';
                    outputBubble.innerHTML = sampleHTML;  // Append sample content
                    codeBlock.parentNode.appendChild(outputBubble);
                } else {
                    outputBubble.innerText = `Sample Output:\n${sampleHTML}`;
                }

                // Remove the nearestExample after appending its content
                nearestExample.remove();
            } else {
                return;
            }
        } else {
            // If no sample is found, show a default message
            if (!outputBubble) {
                outputBubble = document.createElement('div');
                outputBubble.className = 'output-bubble';
                outputBubble.innerText = `Sample Output:\nTO-DO`;
                codeBlock.parentNode.appendChild(outputBubble);
            }
            return;
        }
    });

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
};