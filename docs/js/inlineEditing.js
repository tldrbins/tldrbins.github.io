import { updateAllKeywords } from './utils.js';

function updateFormInputs() {
  const form = document.getElementById("dynamicForm");
  if (form) {
    form.querySelectorAll("input").forEach(input => {
      const cachedValue = localStorage.getItem(input.name);
      if (cachedValue) {
        input.value = cachedValue;
      }
    });
  }
}

export function addInlineEditingListener(clipboard) {
  document.addEventListener('DOMContentLoaded', function() {
    // Function to create a new keyword element
    function createKeywordElement(text, originalText) {
      const newKeyword = document.createElement('span');
      newKeyword.className = 'o editable-keyword';
      newKeyword.textContent = text;
      newKeyword.dataset.originalText = originalText;
      newKeyword.addEventListener('click', handleKeywordClick);
      return newKeyword;
    }

    // Function to handle the blur event
    function handleBlurEvent(input, originalText, rawValue) {
      const newValue = input.value.trim();

      if (newValue === originalText || newValue === '') {
        const originalKeywordWithBrackets = `<${originalText}>`;
        updateAllKeywords(originalText, originalKeywordWithBrackets);
        localStorage.removeItem(originalText);
        input.replaceWith(createKeywordElement(originalKeywordWithBrackets, originalText));
        return;
      }

      if (newValue !== rawValue) {
        localStorage.setItem(originalText, newValue);
        updateAllKeywords(originalText, newValue);
      }

      input.replaceWith(createKeywordElement(newValue, originalText));

      updateFormInputs()
    }

    // Function to handle the click event
    function handleKeywordClick() {
      const originalText = this.dataset.originalText;
      const rawValue = this.textContent.replace(/^<(.*)>$/g, '$1');

      const input = document.createElement('input');
      input.type = 'text';
      input.value = rawValue;
      this.replaceWith(input);
      input.focus();
      input.select();

      input.addEventListener('blur', () => handleBlurEvent(input, originalText, rawValue));
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          this.blur();
        }
      });
    }

    // Initialize keywords and restore values from localStorage
    document.querySelectorAll('.editable-keyword').forEach(keyword => {
      const originalText = keyword.textContent.replace(/[<>]/g, '');
      keyword.dataset.originalText = originalText;
      keyword.textContent = `<${originalText}>`;
      keyword.addEventListener('click', handleKeywordClick);
    });
  });
}