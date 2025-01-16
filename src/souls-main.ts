import { addSafeEventListener } from './helper';
import { SOULS_MAIN_QUERY_KEY } from './souls';

interface SoulOption {
  id: number;
  name: string;
}

const SOUL_OPTIONS: SoulOption[] = [
  { id: 1, name: '体力乗算&体力回復加算'},
  { id: 2, name: '防御乗算&対ボスダメ軽減'},
  { id: 3, name: '攻撃乗算&治癒率'},
  { id: 4, name: '会心抵抗&仲間会心率&仲間会心ダメージ'},
  { id: 5, name: '会心ダメ加算&技能会心ダメージ'},
  { id: 6, name: '反撃ダメ&仲間ダメ'},
  { id: 7, name: '連撃ダメ&対ボスダメ'},
  { id: 8, name: '通常ダメ&技能ダメ'},
];

function renderSouls() {
  const equipmentList = document.getElementById('souls-main-option-list') as HTMLDivElement;
  equipmentList.innerHTML = '';
  SOUL_OPTIONS.forEach((option) => {
    const item = document.createElement('div');
    item.classList.add('souls-main-option-item');
    item.dataset.count = '0';
    item.dataset.id = String(option.id);

    item.innerHTML = `
      <span class="souls-main-option-name">${option.name}</span>
      <div class="souls-main-counter">
        <button data-id="${option.id}" data-action="decrease10">-10</button>
        <button data-id="${option.id}" data-action="decrease">-</button>
        <span class="count-display">0</span>
        <button data-id="${option.id}" data-action="increase">+</button>
        <button data-id="${option.id}" data-action="increase10">+10</button>
      </div>
    `;

    item.querySelectorAll('button').forEach(button => {
      addSafeEventListener(button, 'click', (event) => handleButtonClick(event, item));
    });

    equipmentList.appendChild(item);
  });
}

function handleButtonClick(event: Event, item: HTMLDivElement) {
  const button = event.currentTarget as HTMLButtonElement;
  const action = button.dataset.action;
  let count = parseInt(item.dataset.count || '0', 10);
  const display = item.querySelector('.count-display') as HTMLSpanElement;

  switch (action) {
    case 'decrease10':
      count = Math.max(0, count - 10);
      break;
    case 'decrease':
      count = Math.max(0, count - 1);
      break;
    case 'increase':
      count = count + 1;
      break;
    case 'increase10':
      count = count + 10;
      break;
  }

  item.dataset.count = String(count);
  display.textContent = String(count);

  updateURL();
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);

  const selectedIds = Array.from(document.querySelectorAll<HTMLDivElement>('.souls-main-option-item'))
    .filter(item => parseInt(item.dataset.count || '0', 10) > 0)
    .map(item => `${item.dataset.id}:${item.dataset.count}`)
    .join(',');

  if (selectedIds) {
    params.set(SOULS_MAIN_QUERY_KEY, selectedIds);
  } else {
    params.delete(SOULS_MAIN_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadSoulsMainFromURL() {
  const params = new URLSearchParams(window.location.search);
  const soulsMainData = params.get(SOULS_MAIN_QUERY_KEY)?.split(',') || [];

  const soulsMainList = document.getElementById('souls-main-option-list') as HTMLDivElement;

  soulsMainList.querySelectorAll<HTMLDivElement>('.souls-main-option-item').forEach(item => {
    const id = item.dataset.id;
    if (!id) return;

    const entry = soulsMainData.find(data => data.startsWith(`${id}:`));
    const count = entry ? parseInt(entry.split(':')[1], 10) : 0;

    item.dataset.count = String(count);
    const countDisplay = item.querySelector('.count-display') as HTMLSpanElement;
    countDisplay.textContent = String(count);
  });
}


export function initSoulsMainUI() {
  renderSouls();
  loadSoulsMainFromURL();
}
