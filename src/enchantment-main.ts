import { addSafeEventListener } from './helper';

interface EnchantmentMain {
  id: number;
  name: string;
  options: EnchantmentOption[];
}

interface EnchantmentOption {
  id: number;
  name: string;
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
      { id: 11, name: '連撃ダメージ軽減' },
      { id: 12, name: '仲間ダメージ軽減' },
      { id: 13, name: '技能ダメージ軽減' },
      { id: 14, name: '通常攻撃ダメージ軽減' },
    ],
  },
  {
    id: 3,
    name: 'Ⅵ',
    options: [
      { id: 21, name: '会心ダメ加算' },
      { id: 22, name: '会心抵抗加算' },
      { id: 23, name: 'ボスダメージ' },
      { id: 24, name: 'ボスダメージ軽減' },
    ],
  },
]

const QUERY_KEY = 'enchantment-main'

function renderEnchantMain() {
  const container = document.getElementById('enchantment-main-container') as HTMLDivElement;

  MAIN_OPTIONS.forEach((main) => {
    const section = document.createElement('div');
    section.classList.add('enchantment-part');

    const label = document.createElement('h4');
    label.classList.add('inline-title');
    label.textContent = `${main.name}:`;

    const select = document.createElement('select');
    select.dataset.part = main.id;

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
  const part = select.dataset.part;
  const selectedOption = select.selectedOptions[0];
  const selectedId = selectedOption.dataset.id;

  const params = new URLSearchParams(window.location.search);
  if (selectedId) {
    params.set(`${QUERY_KEY}-${part}`, selectedId);
  } else {
    params.delete(`${QUERY_KEY}-${part}`);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadEnchantMainFromURL() {
  const params = new URLSearchParams(window.location.search);

  MAIN_OPTIONS.forEach((main) => {
    const selectedId = params.get(`${QUERY_KEY}-${main.id}`);
    const select = document.querySelector(
      `select[data-part="${main.id}"]`
    ) as HTMLSelectElement;

    if (selectedId) {
      const option = select.querySelector(
        `option[data-id="${selectedId}"]`
      ) as HTMLOptionElement;

      if (option) {
        select.value = option.value;
      }
    } else {
      select.selectedIndex = 0;
    }
  });
}

export function initEnchantmentMainUI() {
  renderEnchantMain();
  loadEnchantMainFromURL();
}
