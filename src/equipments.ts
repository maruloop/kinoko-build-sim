import { showResetModal } from './resetModal';
import { addSafeEventListener } from './helper';

interface EquipmentOption {
  id: number;
  name: string;
}

const equipmentOptions: EquipmentOption[] = [
  { id: 1, name: '回復'},
  { id: 2, name: '回避'},
  { id: 3, name: 'ダウン'},
  { id: 4, name: '連撃'},
  { id: 5, name: '反撃'},
  { id: 6, name: '会心'},
  { id: 7, name: '仲間連撃'},
  { id: 8, name: '仲間会心'},
  { id: 9, name: '技能会心'},
];

const MAX_TOTAL = 20;
const QUERY_KEY = 'equipments';

function renderEquipments() {
  const equipmentList = document.getElementById('equipments-option-list') as HTMLDivElement;
  const totalCountDisplay = document.getElementById('equipments-total-count') as HTMLSpanElement;
  equipmentList.innerHTML = '';
  equipmentOptions.forEach((option) => {
    const item = document.createElement('div');
    item.classList.add('equipments-option-item');
    item.dataset.count = '0';
    item.dataset.id = option.id;

    item.innerHTML = `
      <span class="equipments-option-name">${option.name}</span>
      <div class="equipments-counter">
        <button data-id="${option.id}" data-action="decrease10">-10</button>
        <button data-id="${option.id}" data-action="decrease">-</button>
        <span class="count-display">0</span>
        <button data-id="${option.id}" data-action="increase">+</button>
        <button data-id="${option.id}" data-action="increase10">+10</button>
      </div>
    `;

    item.querySelectorAll('button').forEach(button => {
      addSafeEventListener(button, 'click', (event) => handleButtonClick(event, item, totalCountDisplay));
    });

    equipmentList.appendChild(item);
  });
  totalCountDisplay.dataset.total = '0';
  totalCountDisplay.textContent = `0`;
}

function handleButtonClick(event: Event, item: HTMLDivElement, totalCountDisplay: HTMLSpanElement) {
  const button = event.currentTarget as HTMLButtonElement;
  const totalElement = document.getElementById('equipments-total-count') as HTMLDivElement;
  const currentTotal = parseInt(totalElement.dataset.total, 10);
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
      count = Math.min(10, currentTotal + 1 > 20 ? count + 20 - currentTotal : count + 1);
      break;
    case 'increase10':
      count = Math.min(10, currentTotal + 10 > 20 ? count + 20 - currentTotal : count + 10);
      break;
  }

  item.dataset.count = count.toString();
  display.textContent = count.toString();

  updateTotalCount(totalCountDisplay);
  updateURL();
}

function updateTotalCount(totalCountDisplay: HTMLSpanElement) {
  const items = document.querySelectorAll<HTMLDivElement>('.equipments-option-item');
  const totalElement = document.getElementById('equipments-total-count') as HTMLDivElement;
  const totalCount = Array.from(items).reduce((sum, item) => {
    return sum + parseInt(item.dataset.count || '0', 10);
  }, 0);

  totalCountDisplay.textContent = totalCount.toString();
  totalElement.dataset.total = totalCount.toString();
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);

  const selectedIds = Array.from(document.querySelectorAll<HTMLDivElement>('.equipments-option-item'))
    .filter(item => parseInt(item.dataset.count || '0', 10) > 0)
    .map(item => `${item.dataset.id}:${item.dataset.count}`)
    .join(',');

  if (selectedIds) {
    params.set(QUERY_KEY, selectedIds);
  } else {
    params.delete(QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadEquipmentsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const equipmentData = params.get(QUERY_KEY)?.split(',') || [];

  const equipmentList = document.getElementById('equipments-option-list') as HTMLDivElement;

  let totalCount = 0;

  equipmentList.querySelectorAll<HTMLDivElement>('.equipments-option-item').forEach(item => {
    const id = item.dataset.id;
    if (!id) return;

    const entry = equipmentData.find(data => data.startsWith(`${id}:`));
    const count = entry ? parseInt(entry.split(':')[1], 10) : 0;

    const remaining = MAX_TOTAL - totalCount;
    const actualCount = Math.min(count, remaining);

    item.dataset.count = String(actualCount);
    const countDisplay = item.querySelector('.count-display') as HTMLSpanElement;
    countDisplay.textContent = String(actualCount);

    totalCount += actualCount;
  });

  const totalCountDisplay = document.getElementById('equipments-total-count') as HTMLSpanElement;
  totalCountDisplay.textContent = String(totalCount);
  totalCountDisplay.dataset.total = String(totalCount);
}


export function initEquipmentsUI() {
  renderEquipments();
  loadEquipmentsFromURL();

  const resetEquipmentsBtn = document.getElementById('reset-equipments-btn') as HTMLButtonElement;

  addSafeEventListener(resetEquipmentsBtn, 'click', () => {
    showResetModal([QUERY_KEY], '装備');
  });
}


// for test
export function getEquipmentState() {
  return {
    totalCount,
    equipmentOptions: equipmentOptions.map(option => ({ ...option }))
  };
}
