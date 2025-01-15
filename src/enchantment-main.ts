import { addSafeEventListener } from './helper';
import { EnchantmentOption, MAIN_QUERY_KEY } from './enchantment';

interface EnchantmentMain {
  id: number;
  name: string;
  options: EnchantmentOption[];
}

const MAIN_OPTIONS: EnchantmentMain[] = [
  {
    id: 1,
    name: 'Ⅳ',
    options: [
      { id: 1, name: '反撃ダメ' },
      { id: 2, name: '連撃ダメ' },
      { id: 3, name: '仲間ダメ' },
      { id: 4, name: '技能ダメ' },
      { id: 5, name: '通常ダメ' },
    ],
  },
  {
    id: 2,
    name: 'Ⅴ',
    options: [
      { id: 6, name: '連撃ダメージ軽減' },
      { id: 7, name: '反撃ダメージ軽減' },
      { id: 8, name: '仲間ダメージ軽減' },
      { id: 9, name: '通常攻撃ダメージ軽減' },
    ],
  },
  {
    id: 3,
    name: 'Ⅵ',
    options: [
      { id: 10, name: '会心ダメ加算' },
      { id: 11, name: '会心抵抗加算' },
      { id: 12, name: '技能ダメージ軽減' },
      { id: 13, name: 'ボスダメージ' },
      { id: 14, name: 'ボスダメージ軽減' },
    ],
  },
]


function renderEnchantMain() {
  const container = document.getElementById('enchantment-main-container') as HTMLDivElement;
  const existingSections = container.querySelectorAll('.enchantment-part');
  existingSections.forEach(section => {
    section.remove();
  });

  MAIN_OPTIONS.forEach((main) => {
    const section = document.createElement('div');
    section.classList.add('enchantment-part');

    const label = document.createElement('h4');
    label.classList.add('inline-title');
    label.textContent = `${main.name}:`;

    const select = document.createElement('select');
    select.dataset.part = String(main.id);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '選択してください';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    main.options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.name;
      opt.textContent = option.name;
      opt.dataset.id = String(option.id);
      select.appendChild(opt);
    });

    section.appendChild(label);
    section.appendChild(select);
    container.appendChild(section);

    addSafeEventListener(select, 'change', updateURL);
  });
}

function updateURL(event: Event) {
  const select = event.target as HTMLSelectElement;
  const part = select.dataset.part;  // A, B, C など
  const selectedOption = select.selectedOptions[0];
  const selectedId = selectedOption.dataset.id;

  const params = new URLSearchParams(window.location.search);
  const currentSelections = params.get(MAIN_QUERY_KEY)?.split(',') || [];
  const updatedSelections = currentSelections.filter(pair => !pair.startsWith(`${part}:`));

  if (selectedId) {
    updatedSelections.push(`${part}:${selectedId}`);
  }

  if (updatedSelections.length > 0) {
    params.set(MAIN_QUERY_KEY, updatedSelections.join(','));
  } else {
    params.delete(MAIN_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadEnchantMainFromURL() {
  const params = new URLSearchParams(window.location.search);
  const setsString = params.get(MAIN_QUERY_KEY);

  if (setsString) {
    const pairs = setsString.split(',');

    pairs.forEach(pair => {
      const [part, selectedId] = pair.split(':');
      const select = document.querySelector(
        `select[data-part="${part}"]`
      ) as HTMLSelectElement;

      if (select) {
        const option = select.querySelector(
          `option[data-id="${selectedId}"]`
        ) as HTMLOptionElement;

        if (option) {
          select.value = option.value;
        }
      }
    });
  } else {
    MAIN_OPTIONS.forEach((main) => {
      const select = document.querySelector(
        `select[data-part="${main.id}"]`
      ) as HTMLSelectElement;

      if (select) {
        select.selectedIndex = 0;
      }
    });
  }
}

export function initEnchantmentMainUI() {
  renderEnchantMain();
  loadEnchantMainFromURL();
}
