import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';

interface StatueOption {
  id: number;
  name: string;
}

const statueOptions: StatueOption[] = [
  { id: 1, name: '攻撃乗算' },
  { id: 2, name: '体力乗算' },
  { id: 3, name: '防御乗算' },
  { id: 4, name: '技能ダメ' },
  { id: 5, name: '連撃ダメ乗算' },
  { id: 6, name: '反撃ダメ乗算' },
  { id: 7, name: '仲間ダメ' },
  { id: 8, name: '対ボスダメ' },
  { id: 9, name: '会心ダメ加算' },
  { id: 10, name: '会心抵抗' }
];

const MAX_TOTAL = 5;
const QUERY_KEY = 'statues';

function renderInitialStatues() {
  const statueList = document.getElementById('statue-list') as HTMLDivElement;
  statueList.innerHTML = '';
  const totalCountDisplay = document.getElementById('statue-total-count') as HTMLSpanElement;
  statueOptions.forEach((option) => {
    const item = document.createElement('div');
    item.classList.add('statue-option-item');
    item.dataset.count = String(item.dataset.count || '0');
    item.dataset.id = String(option.id);

    item.innerHTML = `
            <span class="statue-option-name">${option.name}</span>
            <div class="statue-counter">
                <button data-action="decrease">-</button>
                <span class="count-display">${item.dataset.count}</span>
                <button data-action="increase">+</button>
            </div>
        `;
    item.querySelectorAll('button').forEach(button => {
      addSafeEventListener(button, 'click', (event) => handleButtonClick(event, item, totalCountDisplay));
    });
    statueList.appendChild(item);
  });

  totalCountDisplay.textContent = '0';
  totalCountDisplay.dataset.total = '0'
}

function handleButtonClick(event: Event, item: HTMLDivElement, totalCountDisplay: HTMLSpanElement){
  const button = event.currentTarget as HTMLButtonElement;
  const currentTotal = parseInt(totalCountDisplay.dataset.total || '0', 10);
  const action = button.dataset.action;
  let count = parseInt(item.dataset.count || '0', 10);
  const display = item.querySelector('.count-display') as HTMLSpanElement;

  switch (action) {
    case 'decrease':
      count = Math.max(0, count - 1);
      break;
    case 'increase':
      count = Math.min(5, currentTotal + 1 > MAX_TOTAL ? count + MAX_TOTAL - currentTotal : count + 1 );
      break;
  }

  item.dataset.count = String(count);
  display.textContent = String(count);
  updateURL();
  updateTotalCount(totalCountDisplay);
}

function updateTotalCount(totalCountDisplay: HTMLSpanElement) {
  const items = document.querySelectorAll<HTMLDivElement>('.statue-option-item');
  const totalCount = Array.from(items).reduce((sum, item) => {
    return sum + parseInt(item.dataset.count || '0', 10);
  }, 0);

  totalCountDisplay.textContent = String(totalCount);
  totalCountDisplay.dataset.total = String(totalCount);
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = Array.from(document.querySelectorAll<HTMLDivElement>('.statue-option-item[data-count]'))
    .filter(item => parseInt(item.dataset.count || '0', 10) > 0)
    .map(item => `${item.dataset.id}:${item.dataset.count}`)
    .join(',');

  if (selectedIds) {
    params.set(QUERY_KEY, selectedIds);
  } else {
    params.delete(QUERY_KEY);
  }

  history.replaceState(null, '', '?' + params.toString());
}

function loadStatuesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const statueData = params.get(QUERY_KEY)?.split(',') || [];

  let totalCount = 0;

  const statueList = document.getElementById('statue-list') as HTMLDivElement;
  statueList.querySelectorAll<HTMLDivElement>('.statue-option-item').forEach(item => {
    const id = item.dataset.id;
    if (!id) return;

    const entry = statueData.find(data => data.startsWith(`${id}:`));
    const count = entry ? parseInt(entry.split(':')[1], 10) : 0;
    const remaining = MAX_TOTAL - totalCount;
    const actualCount = Math.min(count, remaining);

    item.dataset.count = String(actualCount);
    const countDisplay = item.querySelector('.count-display') as HTMLSpanElement;
    countDisplay.textContent = String(actualCount);

    totalCount += actualCount;
  });

  const totalCountDisplay = document.getElementById('statue-total-count') as HTMLSpanElement;
  totalCountDisplay.textContent = String(totalCount);
  totalCountDisplay.dataset.total = String(totalCount);
}

export function initStatuesUI() {
  renderInitialStatues();
  loadStatuesFromURL();

  const resetStatuesBtn = document.getElementById('reset-statues-btn') as HTMLButtonElement;
  addSafeEventListener(resetStatuesBtn, 'click', () => {
    showResetModal([QUERY_KEY], '彫像');
  });
}
