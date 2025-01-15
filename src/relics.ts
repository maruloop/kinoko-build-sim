import { showResetModal } from './resetModal';
import { addSafeEventListener } from './helper';

interface Relic {
  id: number;
  name: string;
  type: RelicType;
  icon: string;
}

enum RelicType {
  Mask = '仮面',
  Fossil = '化石',
  EarthTreasure = '地宝',
  Book = '書物',
  Statue = '彫像',
  Necklace = '首飾',
  Spore = '胞子'
}

const relics: Relic[] = [
  { id: 1, name: '絆の仮面', type: RelicType.Mask, icon: 'icons/relics/1.jpg' },
  { id: 2, name: '矢王の仮面', type: RelicType.Mask, icon: 'icons/relics/2.jpg' },
  { id: 3, name: '金剛の仮面', type: RelicType.Mask, icon: 'icons/relics/3.jpg' },
  { id: 4, name: '祭祀の面具', type: RelicType.Mask, icon: 'icons/relics/4.jpg' },
  { id: 5, name: '魔王の仮面', type: RelicType.Mask, icon: 'icons/relics/5.jpg' },
  { id: 6, name: '引雷凧', type: RelicType.Fossil, icon: 'icons/relics/6.jpg' },
  { id: 7, name: '金箔卵殻', type: RelicType.Fossil, icon: 'icons/relics/7.jpg' },
  { id: 8, name: '旋風羽毛', type: RelicType.Fossil, icon: 'icons/relics/8.jpg' },
  { id: 9, name: '琥珀デン虫', type: RelicType.Fossil, icon: 'icons/relics/9.jpg' },
  { id: 10, name: '竜紋骨環', type: RelicType.Fossil, icon: 'icons/relics/10.jpg' },
  { id: 11, name: '矢竹', type: RelicType.EarthTreasure, icon: 'icons/relics/11.jpg' },
  { id: 12, name: '青い雪花', type: RelicType.EarthTreasure, icon: 'icons/relics/12.jpg' },
  { id: 13, name: '恵みの雨', type: RelicType.EarthTreasure, icon: 'icons/relics/13.jpg' },
  { id: 14, name: '魔法の箱', type: RelicType.EarthTreasure, icon: 'icons/relics/14.jpg' },
  { id: 15, name: '異形水晶', type: RelicType.EarthTreasure, icon: 'icons/relics/15.jpg' },
  { id: 16, name: '火焔の書', type: RelicType.Book, icon: 'icons/relics/16.jpg' },
  { id: 17, name: '獣皮の書', type: RelicType.Book, icon: 'icons/relics/17.jpg' },
  { id: 18, name: '免疫の書', type: RelicType.Book, icon: 'icons/relics/18.jpg' },
  { id: 19, name: '癒しの書', type: RelicType.Book, icon: 'icons/relics/19.jpg' },
  { id: 20, name: '石脈の書', type: RelicType.Book, icon: 'icons/relics/20.jpg' },
  { id: 21, name: 'エネ彫像', type: RelicType.Statue, icon: 'icons/relics/21.jpg' },
  { id: 22, name: '檻彫像', type: RelicType.Statue, icon: 'icons/relics/22.jpg' },
  { id: 23, name: '幻晶彫像', type: RelicType.Statue, icon: 'icons/relics/23.jpg' },
  { id: 24, name: '時の彫像', type: RelicType.Statue, icon: 'icons/relics/24.jpg' },
  { id: 25, name: '星羅彫像', type: RelicType.Statue, icon: 'icons/relics/25.jpg' },
  { id: 26, name: '防御首飾', type: RelicType.Necklace, icon: 'icons/relics/26.jpg' },
  { id: 27, name: '赤鎌首飾', type: RelicType.Necklace, icon: 'icons/relics/27.jpg' },
  { id: 28, name: '暴風首飾', type: RelicType.Necklace, icon: 'icons/relics/28.jpg' },
  { id: 29, name: '英霊首飾', type: RelicType.Necklace, icon: 'icons/relics/29.jpg' },
  { id: 30, name: '隠淵首飾', type: RelicType.Necklace, icon: 'icons/relics/30.jpg' },
  { id: 31, name: '時空胞子', type: RelicType.Spore, icon: 'icons/relics/31.jpg' },
  { id: 32, name: '涅槃胞子', type: RelicType.Spore, icon: 'icons/relics/32.jpg' },
  { id: 33, name: '強力胞子', type: RelicType.Spore, icon: 'icons/relics/33.jpg' },
  { id: 34, name: '覆羽胞子', type: RelicType.Spore, icon: 'icons/relics/34.jpg' },
  { id: 35, name: '棘胞子', type: RelicType.Spore, icon: 'icons/relics/35.jpg' }
];

const QUERY_KEY = 'relics';
const EMPTY_ICON = '<span class="icon empty"></span>';

function renderEmptyRelicSlots() {
  const selectedRelicsList = document.getElementById('selected-relics') as HTMLDivElement;
  selectedRelicsList.innerHTML = '';

  Object.values(RelicType).forEach((type, index) => {
    const slot = document.createElement('div');
    slot.classList.add('relic-slot');
    slot.dataset.slot = String(index);
    slot.dataset.type = type;
    slot.innerHTML = EMPTY_ICON;
    selectedRelicsList.appendChild(slot);
  });
}

function renderRelicSelection() {
  const relicsList = document.getElementById('relics-list') as HTMLDivElement;
  relicsList.innerHTML = '';

  Object.values(RelicType).forEach(type => {
    const groupContainer = document.createElement('div');
    groupContainer.classList.add('relic-group');
    groupContainer.innerHTML = ``;

    const groupRelics = relics.filter(relic => relic.type === type);

    groupRelics.forEach(relic => {
      const relicElement = document.createElement('img');
      relicElement.src = relic.icon;
      relicElement.alt = relic.name;
      relicElement.classList.add('icon');
      relicElement.dataset.id = String(relic.id);
      relicElement.dataset.type = relic.type;

      addSafeEventListener(relicElement, 'click', () => toggleRelicSelection(relic));
      groupContainer.appendChild(relicElement);
    });

    relicsList.appendChild(groupContainer);
  });
  updateRelicSelectionUI();
}


function toggleRelicSelection(relic: Relic) {
  const slot = document.querySelector(
    `.relic-slot[data-type="${relic.type}"]`
  ) as HTMLDivElement | null;

  if (!slot) {
    console.warn(`Slot not found for relic type: ${relic.type}`);
    return;
  }

  const currentRelicId = slot.dataset.relicId
    ? parseInt(slot.dataset.relicId, 10)
    : null;

  if (currentRelicId === relic.id) {
    removeRelicByType(relic.type);
  } else {
    if (currentRelicId != null) {
      removeRelicByType(relic.type);
    }
    slot.dataset.relicId = String(relic.id);
    slot.innerHTML = `<img src="${relic.icon}" alt="${relic.name}" class="icon">`;
  }
  updateURL();
  renderRelicSelection();
}

function removeRelicByType(type: string) {
  const slot = document.querySelector(`.relic-slot[data-type="${type}"]`) as HTMLDivElement | null;

  if (slot) {
    slot.removeAttribute('data-relic-id');
    slot.innerHTML = EMPTY_ICON;
  }
}

function updateRelicSelectionUI() {
  document.querySelectorAll<HTMLImageElement>('.relic-group .icon').forEach(icon => {
    const id = icon.dataset.id;
    const isSelected = document.querySelector(`.relic-slot[data-relic-id="${id}"]`);

    if (isSelected) {
      icon.classList.add('selected');
    } else {
      icon.classList.remove('selected');
    }
  });
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);

  const relicString = Array.from(document.querySelectorAll('.relic-slot[data-relic-id]'))
    .map(slot => {
      const relicId = slot.getAttribute('data-relic-id');
      return relicId;
    })
    .join(',');

  if (relicString) {
    params.set(QUERY_KEY, relicString);
  } else {
    params.delete(QUERY_KEY);
  }
  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadRelicsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const relicIds = params.get(QUERY_KEY)?.split(',').map(id => parseInt(id, 10)) || [];

  const slots = document.querySelectorAll<HTMLDivElement>('.relic-slot');
  slots.forEach(slot => {
    const relicType = slot.dataset.type;
    const relic = relics.find(r => r.type === relicType && relicIds.includes(r.id) );

    if (relic) {
      slot.dataset.relicId = String(relic.id);
      slot.innerHTML = '';
      const relicImage = document.createElement('img');
      relicImage.src = relic.icon;
      relicImage.classList.add('icon');
      relicImage.alt = relic.name;
      slot.appendChild(relicImage);
    } else {
      slot.removeAttribute('data-relic-id');
      slot.innerHTML = EMPTY_ICON;
    }
  });
  updateRelicSelectionUI();
}

export function initRelicsUI() {
  renderEmptyRelicSlots();
  renderRelicSelection();
  loadRelicsFromURL();
  const resetRelicsBtn = document.getElementById('reset-relics-btn') as HTMLButtonElement;
  addSafeEventListener(resetRelicsBtn, 'click', () => {
    showResetModal([QUERY_KEY], '遺物');
  });
}
