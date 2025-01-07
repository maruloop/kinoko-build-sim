import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';

interface StatueOption {
  id: number;
  name: string;
}

const MAX_STATUE_COUNT = 5;

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
const QUERY_KEY = 'statues';

let totalStatueCount = 0;

const statueList = document.getElementById('statue-list') as HTMLDivElement;
const totalCountDisplay = document.getElementById('statue-total-count') as HTMLSpanElement;

function renderInitialStatues() {
  statueList.innerHTML = '';
  statueOptions.forEach((option, index) => {
    const item = document.createElement('div');
    item.classList.add('statue-option-item');
    item.dataset.count = String(item.dataset.count || '0');
    item.dataset.index = String(index);

    item.innerHTML = `
            <span class="statue-option-name">${option.name}</span>
            <div class="statue-counter">
                <button data-action="decrease">-</button>
                <span class="statue-option-count">${item.dataset.count}</span>
                <button data-action="increase">+</button>
            </div>
        `;
    statueList.appendChild(item);
  });

  totalCountDisplay.textContent = `${totalStatueCount}`;
}


addSafeEventListener(statueList, 'click', (event) => {
  const target = event.target as HTMLButtonElement;
  const item = target.closest('.statue-option-item') as HTMLDivElement | null;

  if (item) {
    const index = Number(item.dataset.index);
    let currentCount = parseInt(item.dataset.count || '0', 10);
    const action = target.dataset.action;

    if (action === 'increase' && totalStatueCount < MAX_STATUE_COUNT && currentCount < MAX_STATUE_COUNT) {
      currentCount++;
      totalStatueCount++;
    } else if (action === 'decrease' && currentCount > 0) {
      currentCount--;
      totalStatueCount--;
    }

    item.dataset.count = String(currentCount);
    const countDisplay = item.querySelector('.statue-counter span')!;
    countDisplay.textContent = String(currentCount);
    updateURL();
  }
});

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = Array.from(document.querySelectorAll<HTMLDivElement>('.statue-option-item[data-count]'))
    .filter(item => parseInt(item.dataset.count || '0', 10) > 0)
    .map(item => `${item.dataset.index}:${item.dataset.count}`)
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

  renderInitialStatues();
  totalStatueCount = 0;

  statueData.forEach(entry => {
    const [indexStr, countStr] = entry.split(':');
    const index = parseInt(indexStr, 10);
    const count = parseInt(countStr, 10);

    const item = document.querySelector(
      `.statue-option-item[data-index="${index}"]`
    ) as HTMLDivElement;

    if (item && !isNaN(count)) {
      const actualCount = Math.min(count, MAX_STATUE_COUNT);
      item.dataset.count = String(actualCount);
      item.querySelector('span.statue-option-count')!.textContent = String(actualCount);
      totalStatueCount += actualCount;
    }
  });

  totalCountDisplay.textContent = `${totalStatueCount}`;
}

export function initStatuesUI() {
  loadStatuesFromURL();

  const resetStatuesBtn = document.getElementById('reset-statues-btn') as HTMLButtonElement;
  addSafeEventListener(resetStatuesBtn, 'click', () => {
    showResetModal([QUERY_KEY], '彫像');
  });
}
