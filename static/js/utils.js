// utils.js

export function arraysEqual(a, b) {
    return a === b || (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]));
}

export function debounce(func, wait, immediate = false) {
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