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
  const list = document.getElementById('enchantment-main-list') as HTMLDivElement;
  const existingSections = list.querySelectorAll('.enchantment-part');
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
    select.classList.add('enchantment-main')

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
    list.appendChild(section);

    addSafeEventListener(select, 'change', updateURL);
  });
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selections: string[] = [];

  document.querySelectorAll<HTMLSelectElement>('select.enchantment-main').forEach(select => {
    const part = select.dataset.part;
    const selectedOption = select.selectedOptions[0];
    const selectedId = selectedOption?.dataset.id;

    if (part && selectedId) {
      selections.push(`${part}:${selectedId}`);
    }
  });

  if (selections.length > 0) {
    params.set(MAIN_QUERY_KEY, selections.join(','));
  } else {
    params.delete(MAIN_QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadEnchantMainFromURL() {
  const params = new URLSearchParams(window.location.search);
  const mainString = params.get(MAIN_QUERY_KEY);
  const mainMap = new Map(
    (mainString || '').split(',').map(pair => {
      const [partId, mainId] = pair.split(':');
      return [partId, mainId];
    })
  );

  const selects = document.querySelectorAll<HTMLSelectElement>('select.enchantment-main');
  selects.forEach(select => {
    const partId = select.dataset.part;
    const mainId = mainMap.get(partId);
    const enchantmentPart = MAIN_OPTIONS.find(p => p.id === Number(partId) );
    const enchantmentOption = enchantmentPart?.options.find(op => op.id === parseInt(mainId || '', 10));

    if(enchantmentOption){
      select.value = enchantmentOption.name;
    }else{
      select.selectedIndex = 0;
    }
  });
}

export function initEnchantmentMainUI() {
  renderEnchantMain();
  loadEnchantMainFromURL();
}
