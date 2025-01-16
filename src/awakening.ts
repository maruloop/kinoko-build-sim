import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';

interface AwakeningSelection {
  id: number;
  name: string;
}

interface AwakeningOption {
  id: number;
  name: string;
  selection: AwakeningSelection[] | null;
}

const AWAKENING_OPTIONS: AwakeningOption[] = [
  { id: 1, name: '攻撃乗算', selection: null },
  { id: 2, name: '体力乗算', selection: null },
  { id: 3, name: '防御乗算', selection: null },
  {
    id: 4, name: '会心系', selection: [
      { id: 1, name: '会心ダメージ' },
      { id: 2, name: '技能会心ダメージ' },
      { id: 3, name: '仲間会心ダメージ' },
    ]
  },
  { id: 5, name: '会心抵抗', selection: null },
  {
    id: 6, name: '属性ダメージ系', selection: [
      { id: 1, name: '通常ダメージ' },
      { id: 2, name: '仲間ダメージ' },
      { id: 3, name: '技能ダメージ' },
    ]
  },
];

const LEVEL_QUERY_KEY = 'awakening';
const SELECT_QUERY_KEY = 'awakening-select';

function renderAwakening() {
  const awakeningList = document.getElementById('awakening-option-list') as HTMLDivElement;
  awakeningList.innerHTML = '';
  AWAKENING_OPTIONS.forEach((option) => {
    const item = document.createElement('div');
    item.classList.add('awakening-option-item');
    item.dataset.count = '0';
    item.dataset.id = String(option.id);

    const name = createNameElement(option);
    item.appendChild(name);

    const counterDiv = document.createElement('div');
    counterDiv.classList.add('awakening-counter');

    const decrease10Button = document.createElement('button');
    decrease10Button.dataset.id = String(option.id);
    decrease10Button.dataset.action = 'decrease10';
    decrease10Button.textContent = '-10';
    counterDiv.appendChild(decrease10Button);

    const decreaseButton = document.createElement('button');
    decreaseButton.dataset.id = String(option.id);
    decreaseButton.dataset.action = 'decrease';
    decreaseButton.textContent = '-';
    counterDiv.appendChild(decreaseButton);

    const countSpan = document.createElement('span');
    countSpan.classList.add('count-display');
    countSpan.textContent = '0';
    counterDiv.appendChild(countSpan);

    const increaseButton = document.createElement('button');
    increaseButton.dataset.id = String(option.id);
    increaseButton.dataset.action = 'increase';
    increaseButton.textContent = '+';
    counterDiv.appendChild(increaseButton);

    const increase10Button = document.createElement('button');
    increase10Button.dataset.id = String(option.id);
    increase10Button.dataset.action = 'increase10';
    increase10Button.textContent = '+10';
    counterDiv.appendChild(increase10Button);

    item.appendChild(counterDiv);

    item.querySelectorAll('button').forEach(button => {
      addSafeEventListener(button, 'click', (event) => handleButtonClick(event, item));
    });

    awakeningList.appendChild(item);
  });
}

function createNameElement(option: AwakeningOption): HTMLElement {
  if (!option.selection) {
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('awakening-option-name');
    nameSpan.textContent = option.name;
    return nameSpan;
  } else {
    const select = document.createElement('select');
    select.classList.add('awakening-option-select');

    option.selection.forEach(selectionOption => {
      const optionElement = document.createElement('option');
      optionElement.value = String(selectionOption.id);
      optionElement.textContent = selectionOption.name;
      select.appendChild(optionElement);
    });
    select.selectedIndex = 0;

    addSafeEventListener(select, 'change', () => {
      updateURL();
    });

    return select;
  }
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
  updateLevelURL();
  updateSelectURL();
}

function updateLevelURL() {
  const params = new URLSearchParams(window.location.search);

  const selectedIds = Array.from(document.querySelectorAll<HTMLDivElement>('.awakening-option-item'))
    .filter(item => parseInt(item.dataset.count || '0', 10) > 0)
    .map(item => `${item.dataset.id}:${item.dataset.count}`)
    .join(',');

  if (selectedIds) {
    params.set(LEVEL_QUERY_KEY, selectedIds);
  } else {
    params.delete(LEVEL_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function updateSelectURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedString = Array.from(document.querySelectorAll<HTMLSelectElement>('.awakening-option-select'))
    .map(select => {
      const parentItem = select.closest('.awakening-option-item');
      const optionId = parentItem?.dataset.id;
      const selectedValue = select.value;

      return optionId && selectedValue ? `${optionId}:${selectedValue}` : null;
    })
    .filter((pair): pair is string => pair !== null)
    .join(',');

  if (selectedString) {
    params.set(SELECT_QUERY_KEY, selectedString);
  } else {
    params.delete(SELECT_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadFromURL() {
  loadAwakeningFromURL();
  loadAwakeningSelectFromURL();
}

function loadAwakeningFromURL() {
  const params = new URLSearchParams(window.location.search);
  const awakeningData = params.get(LEVEL_QUERY_KEY)?.split(',') || [];

  const awakeningList = document.getElementById('awakening-option-list') as HTMLDivElement;

  awakeningList.querySelectorAll<HTMLDivElement>('.awakening-option-item').forEach(item => {
    const id = item.dataset.id;
    if (!id) return;

    const entry = awakeningData.find(data => data.startsWith(`${id}:`));
    const count = entry ? parseInt(entry.split(':')[1], 10) : 0;

    item.dataset.count = String(count);
    const countDisplay = item.querySelector('.count-display') as HTMLSpanElement;
    countDisplay.textContent = String(count);
  });
}

function loadAwakeningSelectFromURL() {
  const params = new URLSearchParams(window.location.search);
  const selectString = params.get(SELECT_QUERY_KEY);

  const selectMap = new Map(
    (selectString || '').split(',').map(pair => {
      const [optionId, selectionId] = pair.split(':');
      return [optionId, selectionId];
    })
  );

  document.querySelectorAll<HTMLSelectElement>('.awakening-option-select').forEach(select => {
    const parentItem = select.closest('.awakening-option-item');
    const optionId = parentItem?.dataset.id;
    const selectionId = selectMap.get(optionId);
    const awakeningOption = AWAKENING_OPTIONS.find(a => a.id === Number(optionId));
    const awakeningSelect = awakeningOption?.selection?.find(s => s.id == parseInt(selectionId || '', 10));

    if (awakeningSelect) {
      select.value = selectionId;
    } else {
      select.selectedIndex = 0;
    }
  });
}

export function initAwakeningUI() {
  renderAwakening();
  loadFromURL();
  const resetawakeningBtn = document.getElementById('reset-awakening-btn') as HTMLButtonElement;
  addSafeEventListener(resetawakeningBtn, 'click', () => {
    showResetModal([LEVEL_QUERY_KEY, SELECT_QUERY_KEY], '覚醒');
  });
}
