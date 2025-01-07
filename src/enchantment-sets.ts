import { addSafeEventListener } from './helper';
import { SETS_QUERY_KEY } from './enchantment';

interface EnchantmentSets {
  id: number;
  name: string;
}

const ENCHANTMENT_SETS: EnchantmentSets[] = [
  { id: 1, name: '連撃ダメージ乗算' },
  { id: 2, name: '反撃ダメージ乗算' },
  { id: 3, name: '会心ダメージ乗算' },
  { id: 4, name: '会心抵抗乗算' },
  { id: 5, name: '通常攻撃ダメージ乗算' },
  { id: 6, name: '技能ダメージ乗算' },
  { id: 7, name: '仲間ダメージ乗算乗算' }
];

const MAX_TOTAL = 6;

function renderEnchantmentSets() {
  const container = document.getElementById('enchantment-sets-container') as HTMLDivElement;
  const existingItems = container.querySelectorAll('.enchantment-set-item');
  existingItems.forEach(item => {
    item.remove();
  });

  ENCHANTMENT_SETS.forEach(set => {
    const item = document.createElement('div');
    item.classList.add('enchantment-set-item');
    item.dataset.type = String(set.id);
    item.dataset.count = '0';

    const setName = document.createElement('span');
    setName.textContent = set.name;

    const checkboxGroup = document.createElement('div');
    checkboxGroup.classList.add('checkbox-group');

    const checkboxX2 = document.createElement('input');
    checkboxX2.type = 'checkbox';
    checkboxX2.dataset.value = '2';
    checkboxX2.id = `set-${set.id}-x2`;

    const labelX2 = document.createElement('label');
    labelX2.htmlFor = checkboxX2.id;
    labelX2.textContent = 'x2';

    const checkboxX4 = document.createElement('input');
    checkboxX4.type = 'checkbox';
    checkboxX4.dataset.value = '4';
    checkboxX4.id = `set-${set.id}-x4`;

    const labelX4 = document.createElement('label');
    labelX4.htmlFor = checkboxX4.id;
    labelX4.textContent = 'x4';

    checkboxGroup.appendChild(checkboxX2);
    checkboxGroup.appendChild(labelX2);
    checkboxGroup.appendChild(checkboxX4);
    checkboxGroup.appendChild(labelX4);

    item.appendChild(setName);
    item.appendChild(checkboxGroup);

    container.appendChild(item);
  });
}

function adjustEnchantmentSet(item: HTMLDivElement, value: number, checked: boolean) {
  const currentCount = parseInt(item.dataset.count || '0', 10);
  const newCount = checked ? currentCount + value : currentCount - value;
  const container = document.getElementById('enchantment-sets-container') as HTMLDivElement;
  const currentTotal = parseInt(container.dataset.total || '0', 10);
  const newTotal = currentTotal + (checked ? value : -value);

  if (newTotal <= MAX_TOTAL) {
    item.dataset.count = String(newCount);
    container.dataset.total = String(newTotal);
    updateURL();
  } else {
    const checkbox = item.querySelector(`input[data-value="${value}"]`) as HTMLInputElement;
    checkbox.checked = false;
  }
}

function handleCheckboxChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const item = checkbox.closest('.enchantment-set-item') as HTMLDivElement;
  const value = parseInt(checkbox.dataset.value!, 10);
  const checked = checkbox.checked;

  adjustEnchantmentSet(item, value, checked);
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedSets = Array.from(document.querySelectorAll<HTMLInputElement>(
    '.enchantment-set-item input:checked'
  )).map(checkbox => {
    const item = checkbox.closest('.enchantment-set-item') as HTMLDivElement;
    const type = item.dataset.type;
    const value = checkbox.dataset.value;
    return `${type}:${value}`;
  }).join(',');

  if (selectedSets) {
    params.set(SETS_QUERY_KEY, selectedSets);
  } else {
    params.delete(SETS_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadEnchantmentsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const setsString = params.get(SETS_QUERY_KEY);
  const container = document.getElementById('enchantment-sets-container') as HTMLDivElement;
  container.dataset.total = '0';

  renderEnchantmentSets();

  if (setsString) {
    const pairs = setsString.split(',').map(pair => pair.split(':'));

    pairs.forEach(([type, value]) => {
      const item = container.querySelector(`.enchantment-set-item[data-type="${type}"]`) as HTMLDivElement;
      const checkbox = item.querySelector(`input[data-value="${value}"]`) as HTMLInputElement;

      if (checkbox) {
        checkbox.checked = true;
        adjustEnchantmentSet(item, parseInt(value, 10), true);
      }
    });
  }
}

export function initEnchantmentSetsUI() {
  loadEnchantmentsFromURL();
  const checkboxes = document.querySelectorAll<HTMLInputElement>(
    '.enchantment-set-item input[type="checkbox"]'
  );

  checkboxes.forEach(checkbox => {
    addSafeEventListener(checkbox, 'change', handleCheckboxChange);
  });
}
