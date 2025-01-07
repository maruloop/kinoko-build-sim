import { addSafeEventListener } from './helper';

const TITLE_QUERY_KEY = 'title';

function updateURL(title: string) {
    const params = new URLSearchParams(window.location.search);
    params.set(TITLE_QUERY_KEY, title);
    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadSummaryFromURL() {
    const input = document.getElementById('build-title');
    const params = new URLSearchParams(window.location.search);
    const existingTitle = params.get(TITLE_QUERY_KEY);
    if (existingTitle) {
        input.value = decodeURIComponent(existingTitle);
    }
}

export function initSummaryUI() {
    const input = document.getElementById('build-title');

    loadSummaryFromURL();
    addSafeEventListener(input, 'input', () => {
        const sanitizedValue = input.value.replace(/[<>&"'`]/g, '');

        if (input.value !== sanitizedValue) {
            input.value = sanitizedValue;
        }
        const title = input.value.trim();
        updateURL(title);
    });
}
