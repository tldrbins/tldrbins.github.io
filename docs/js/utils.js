// utils.js

export function updateAllKeywords(originalText, newValue) {
  document.querySelectorAll('.editable-keyword').forEach(element => {
    if (element.dataset.originalText === originalText) {
      element.textContent = newValue;
    }
  });
}

export function debounce(func, wait, immediate = false) {
    let timeout;
    return (...args) => {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}