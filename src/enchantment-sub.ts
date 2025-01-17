import { addSafeEventListener } from './helper';
import { EnchantmentOption, SUB_QUERY_KEY } from './enchantment';

const SUB_OPTIONS: EnchantmentOption[] = [
  { id: 1, name: '連撃ダメージ軽減' },
  { id: 2, name: '反撃ダメージ軽減' },
  { id: 3, name: '技能ダメージ軽減' },
  { id: 4, name: '連撃ダメ' },
  { id: 5, name: '反撃ダメ' },
  { id: 6, name: '仲間ダメ' },
  { id: 7, name: '技能ダメ' },
  { id: 8, name: '技能会心ダメージ' },
  { id: 9, name: '連撃ダメージ乗算' },
  { id: 10, name: '反撃ダメージ乗算' },
  { id: 11, name: '仲間会心ダメ' },
  { id: 12, name: 'ダウン' },
  { id: 13, name: '回避' },
  { id: 14, name: '回避無視' },
  { id: 15, name: '打ち上げ' },
  { id: 16, name: 'ダウン無視' },
  { id: 17, name: '打ち上げ無視' },
  { id: 18, name: '治癒量' },
  { id: 19, name: '通常攻撃ダメージ乗算' },
  { id: 20, name: '通常ダメ' },
  { id: 21, name: '通常攻撃ダメージ軽減' },
  { id: 22, name: 'ボスダメージ' },
  { id: 23, name: 'ボスダメージ軽減' },
]

function renderSubOptions() {
  const list = document.getElementById('enchantment-sub-list') as HTMLDivElement;
  list.innerHTML = '';

  SUB_OPTIONS.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('enchantment-sub-option-item');
    optionDiv.textContent = option.name;
    optionDiv.dataset.id = String(option.id);

    list.appendChild(optionDiv);
  });

  addSafeEventListener(list, 'click', handleSubOptionClick);
}

function handleSubOptionClick(event: Event) {
  const target = event.target as HTMLDivElement;

  if (target.classList.contains('enchantment-sub-option-item')) {
    target.classList.toggle('selected');
    updateURL();
  }
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selected = Array.from(document.querySelectorAll<HTMLDivElement>(
    '.enchantment-sub-option-item.selected'
  )).map(item => item.dataset.id);

  if (selected.length > 0) {
    params.set(SUB_QUERY_KEY, selected.join(','));
  } else {
    params.delete(SUB_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadSubOptionsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = params.get(SUB_QUERY_KEY)?.split(',') || [];
  const optionElements = document.querySelectorAll<HTMLDivElement>('.enchantment-sub-option-item');

  optionElements.forEach(optionElement => {
    const optionId = optionElement.dataset.id;
    const option = SUB_OPTIONS.find(op => optionId === String(op.id) && selectedIds.includes(String(op.id)));
    if (option) {
      optionElement.classList.add('selected');
    } else {
      optionElement.classList.remove('selected');
    }
  });
}

export function initEnchantmentSubUI() {
  renderSubOptions();
  loadSubOptionsFromURL();
}
