import { addSafeEventListener } from './helper';
import { SOULS_SUB_QUERY_KEY } from './souls';

interface SoulSubOption {
  id: number;
  name: string;
}

const SUB_OPTIONS: SoulSubOption[] = [
  { id: 1, name: '連撃ダメージ軽減' },
  { id: 2, name: '通常攻撃ダメージ軽減' },
  { id: 3, name: '技能ダメージ軽減' },
  { id: 4, name: '仲間ダメージ軽減' },
  { id: 5, name: '反撃ダメージ軽減' },
  { id: 6, name: '治癒' },
  { id: 7, name: '打上げ' },
  { id: 8, name: '打上げ無視' },
  { id: 9, name: '連撃乗算' },
  { id: 10, name: '反撃乗算' },
  { id: 11, name: '通常攻撃乗算' },
  { id: 12, name: '仲間会心ダメ' },
]

function renderSubOptions() {
  const list = document.getElementById('souls-sub-list') as HTMLDivElement;
  list.innerHTML = '';

  SUB_OPTIONS.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('souls-sub-option-item');
    optionDiv.textContent = option.name;
    optionDiv.dataset.id = String(option.id);

    list.appendChild(optionDiv);
  });

  addSafeEventListener(list, 'click', handleSubOptionClick);
}

function handleSubOptionClick(event: Event) {
  const target = event.target as HTMLDivElement;

  if (target.classList.contains('souls-sub-option-item')) {
    target.classList.toggle('selected');
    updateURL();
  }
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selected = Array.from(document.querySelectorAll<HTMLDivElement>(
    '.souls-sub-option-item.selected'
  )).map(item => item.dataset.id);

  if (selected.length > 0) {
    params.set(SOULS_SUB_QUERY_KEY, selected.join(','));
  } else {
    params.delete(SOULS_SUB_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadSubOptionsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = params.get(SOULS_SUB_QUERY_KEY)?.split(',') || [];
  const optionElements = document.querySelectorAll<HTMLDivElement>('.souls-sub-option-item');

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

export function initSoulsSubUI() {
  renderSubOptions();
  loadSubOptionsFromURL();
}
