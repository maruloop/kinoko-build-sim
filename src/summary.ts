import { addSafeEventListener } from './helper';

const TITLE_QUERY_KEY = 'title';
const DESCRIPTION_QUERY_KEY = 'description';
const MAX_DESCRIPTION = 500;
const MAX_TITLE = 50;

function updateUrlTitle(title: string) {
  const params = new URLSearchParams(window.location.search);

  if (title != '') {
    params.set(TITLE_QUERY_KEY, title);
  } else {
    params.delete(TITLE_QUERY_KEY);
  }
  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function updateUrlDescription(description: string) {
  const params = new URLSearchParams(window.location.search);
  if (description != '') {
    params.set(DESCRIPTION_QUERY_KEY, description);
  } else {
    params.delete(DESCRIPTION_QUERY_KEY);
  }
  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadSummaryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const existingTitle = params.get(TITLE_QUERY_KEY);
  const title = document.getElementById('build-title') as HTMLInputElement;
  if (existingTitle && title) {
    title.value = sanitizeTitle(decodeURIComponent(existingTitle));
  }
  const existingDescription = params.get(DESCRIPTION_QUERY_KEY);
  const description = document.getElementById('build-description') as HTMLTextAreaElement;
  if (existingDescription && description) {
    description.value = sanitizeTitle(decodeURIComponent(existingDescription));
  }
}

function renderTitlePanel() {
  const container = document.getElementById('summary-info-container') as HTMLElement;
  container.innerHTML = '';

  const form = document.createElement("form");
  form.id = "title-form";

  const title = document.createElement("input");
  title.type = "text";
  title.id = "build-title";
  title.name = "title";
  title.placeholder = "ビルド名";
  title.maxLength = MAX_TITLE;

  addSafeEventListener(title, 'input', () => {
    const sanitizedValue = sanitizeTitle(title.value);

    if (title.value !== sanitizedValue) {
      title.value = sanitizedValue;
    }
    const titleString = title.value.trim();
    updateUrlTitle(titleString);
  });

  const description = document.createElement("textarea");
  description.id = "build-description";
  description.name = "description";
  description.placeholder = "ビルドの説明を入力...";
  description.rows = 4;
  description.cols = 50;

  addSafeEventListener(description, 'input', () => {
    let sanitizedValue = description.value.trim();

    if (sanitizedValue.length > MAX_DESCRIPTION) {
      sanitizedValue = sanitizedValue.slice(0, MAX_DESCRIPTION);
      description.value = sanitizedValue;
    }
    updateUrlDescription(sanitizedValue);
  });

  form.appendChild(title);
  form.appendChild(description);
  container.appendChild(form);
}

function sanitizeTitle(value: string) {
  return value.replace(/[<>&"'`]/g, '');
};

function renderJobPanel() { }
function renderEquipmentPanel() { }
function renderSkillPanel() { }
function renderPalPanel() { }
function renderRelicPanel() { }
function renderStatuePanel() { }
function renderBackTalentsPanel() { }
function renderEnchantmentPanel() { }
function renderAwakeningPanel() { }
function renderMountArtifactBackAccessoryPanel() { }
function renderAvianPanel() { }
function renderSoulPanel() { }
function renderShipPanel() { }
function renderStarHeroPanel() { }

export function initSummaryUI() {
  renderTitlePanel();
  renderJobPanel();
  renderEquipmentPanel();
  renderSkillPanel();
  renderPalPanel();
  renderRelicPanel();
  renderStatuePanel();
  renderBackTalentsPanel();
  renderEnchantmentPanel();
  renderAwakeningPanel();
  renderMountArtifactBackAccessoryPanel();
  renderAvianPanel();
  renderSoulPanel();
  renderShipPanel();
  renderStarHeroPanel();
  loadSummaryFromURL();
}
