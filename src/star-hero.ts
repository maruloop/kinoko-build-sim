import { showResetModal } from './resetModal';
import { addSafeEventListener } from './helper';

const QUERY_KEY = 'star-hero';
const EMPTY_ICON = '<span class="icon empty"></span>';
const MAX_COST = 10;

interface StarHero {
  id: number;
  name: string;
  icon: string;
  cost: number;
}

const starHeroes: StarHero[] = [
  { id: 1, name: '神聖なる戦神', icon: 'icons/star_heroes/1.jpg', cost: 4 },
  { id: 2, name: '嵐の支配者', icon: 'icons/star_heroes/2.jpg', cost: 4 },
  { id: 3, name: '万獣の王', icon: 'icons/star_heroes/3.jpg', cost: 4 },
  { id: 4, name: '聖なる守護者', icon: 'icons/star_heroes/4.jpg', cost: 4 },
  { id: 5, name: '万願の灯神', icon: 'icons/star_heroes/5.jpg', cost: 4 },
  { id: 6, name: '霊報の使者', icon: 'icons/star_heroes/6.jpg', cost: 3 },
  { id: 7, name: '知恵の導師', icon: 'icons/star_heroes/7.jpg', cost: 3 },
  { id: 8, name: '時守りの妖精', icon: 'icons/star_heroes/8.jpg', cost: 3 },
  { id: 9, name: '光輝の騎士', icon: 'icons/star_heroes/9.jpg', cost: 3 },
  { id: 10, name: '獣霊の庇護者', icon: 'icons/star_heroes/10.jpg', cost: 3 },
  { id: 11, name: '虚空の導き手', icon: 'icons/star_heroes/11.jpg', cost: 3 },
  { id: 12, name: '秩序の守護者', icon: 'icons/star_heroes/12.jpg', cost: 3 },
  { id: 13, name: '生態系の守護者', icon: 'icons/star_heroes/13.jpg', cost: 3 },
  { id: 14, name: '環境の守護者', icon: 'icons/star_heroes/14.jpg', cost: 3 },
  { id: 15, name: '知識の書霊', icon: 'icons/star_heroes/15.jpg', cost: 2 },
  { id: 16, name: '無畏の飛鳥', icon: 'icons/star_heroes/16.jpg', cost: 2 },
  { id: 17, name: '活力の若将軍', icon: 'icons/star_heroes/17.jpg', cost: 2 },
  { id: 18, name: '先鋒ウニ', icon: 'icons/star_heroes/18.jpg', cost: 2 },
  { id: 19, name: '忠義な衛兵', icon: 'icons/star_heroes/19.jpg', cost: 2 },
  { id: 20, name: '繁栄の使者', icon: 'icons/star_heroes/20.jpg', cost: 2 },
  { id: 21, name: '豊穣の使者', icon: 'icons/star_heroes/21.jpg', cost: 2 },
  { id: 22, name: '天穹の監視者', icon: 'icons/star_heroes/22.jpg', cost: 2 },
  { id: 23, name: '勇敢な魂騎士', icon: 'icons/star_heroes/23.jpg', cost: 2 },
  { id: 24, name: '岩武の騎士', icon: 'icons/star_heroes/24.jpg', cost: 2 },
  { id: 25, name: '影の守護霊', icon: 'icons/star_heroes/25.jpg', cost: 2 },
];

function renderStarHeroSelection() {
  const starHeroesList = document.getElementById('star-hero-list') as HTMLDivElement;
  starHeroesList.innerHTML = '';

  starHeroes.forEach(starHero => {
    const starHeroElement = document.createElement('img');
    starHeroElement.src = starHero.icon;
    starHeroElement.alt = starHero.name;
    starHeroElement.classList.add('icon');
    starHeroElement.dataset.id = String(starHero.id);

    addSafeEventListener(starHeroElement, 'click', () => toggleStarHero(starHero));
    starHeroesList.appendChild(starHeroElement);
  });
  updateStarHeroSelectionUI();
}

function toggleStarHero(starHero: StarHero) {
  const existingSlot = document.querySelector(
    `.star-hero-slot[data-star-hero-id="${starHero.id}"]`
  ) as HTMLDivElement | null;

  if (existingSlot) {
    const slotNumber = parseInt(existingSlot.dataset.slot || '0', 10);
    removeStarHero(slotNumber);
  } else {
    const emptySlot = document.querySelector(
      '.star-hero-slot:not([data-star-hero-id])'
    ) as HTMLDivElement;
    const totalCostDisplay = document.getElementById('star-hero-total-cost') as HTMLSpanElement;
    const currentTotal = parseInt(totalCostDisplay.dataset.total || '0', 10);

    if (emptySlot && currentTotal + starHero.cost <= MAX_COST) {
      emptySlot.dataset.starHeroId = String(starHero.id);
      emptySlot.innerHTML = '';
      const starHeroImage = document.createElement('img');
      starHeroImage.src = starHero.icon;
      starHeroImage.alt = starHero.name;
      starHeroImage.classList.add('icon');
      starHeroImage.dataset.palId = String(starHero.id);
      emptySlot.dataset.cost = String(starHero.cost);

      addSafeEventListener(starHeroImage, 'click', () => {
        const slot = parseInt(emptySlot.dataset.slot || '0', 10);
        removeStarHero(slot);
      });

      emptySlot.appendChild(starHeroImage);
      updateURL();
      renderStarHeroSelection();
      updateTotalCost();
    }
  }
}

function updateTotalCost() {
  const selected = document.querySelectorAll<HTMLDivElement>('.star-hero-slot');
  const totalCost = Array.from(selected).reduce((sum, item) => {
    return sum + parseInt(item.dataset.cost || '0', 10);
  }, 0);
  const totalCostDisplay = document.getElementById('star-hero-total-cost') as HTMLSpanElement;
  totalCostDisplay.textContent = String(totalCost);
  totalCostDisplay.dataset.total = String(totalCost);
}

function removeStarHero(slot: number) {
  const slotElement = document.querySelector(`.star-hero-slot[data-slot="${slot}"]`) as HTMLDivElement;

  if (slotElement) {
    slotElement.removeAttribute('data-star-hero-id');
    slotElement.dataset.cost = '0';
    slotElement.innerHTML = EMPTY_ICON;
  }

  renderStarHeroSelection();
  updateURL();
  updateTotalCost();
}

function updateStarHeroSelectionUI() {
  document.querySelectorAll<HTMLImageElement>('#star-hero-list .icon').forEach(icon => {
    const id = icon.dataset.id;
    const isSelected = document.querySelector(`.star-hero-slot[data-star-hero-id="${id}"]`);

    if (isSelected) {
      icon.classList.add('selected');
    } else {
      icon.classList.remove('selected');
    }
  });
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const starHeroString = Array.from(document.querySelectorAll('.star-hero-slot[data-star-hero-id]'))
    .map(slot => {
      const slotNum = slot.getAttribute('data-slot');
      const starHeroId = slot.getAttribute('data-star-hero-id');
      return `${slotNum}:${starHeroId}`;
    })
    .join(',');

  if (starHeroString) {
    params.set(QUERY_KEY, starHeroString);
  } else {
    params.delete(QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function renderEmptyStarHeroSlots() {
  const selectedStarHeroesList = document.getElementById('selected-star-hero') as HTMLDivElement;
  selectedStarHeroesList.innerHTML = '';

  const mainSlot = document.createElement('div');
  mainSlot.classList.add('star-hero-slot', 'main');
  mainSlot.dataset.slot = '0';
  mainSlot.innerHTML = EMPTY_ICON;
  const sub1Slot = document.createElement('div');
  sub1Slot.classList.add('star-hero-slot', 'sub');
  sub1Slot.dataset.slot = '1';
  sub1Slot.innerHTML = EMPTY_ICON;
  const sub2Slot = document.createElement('div');
  sub2Slot.classList.add('star-hero-slot', 'sub');
  sub2Slot.dataset.slot = '2';
  sub2Slot.innerHTML = EMPTY_ICON;
  selectedStarHeroesList.appendChild(mainSlot);
  selectedStarHeroesList.appendChild(sub1Slot);
  selectedStarHeroesList.appendChild(sub2Slot);

  const totalCostDisplay = document.getElementById('star-hero-total-cost') as HTMLSpanElement;
  totalCostDisplay.textContent = '0';
  totalCostDisplay.dataset.total = '0'
}

function loadStarHeroFromURL() {
  const params = new URLSearchParams(window.location.search);
  const starHeroString = params.get(QUERY_KEY);

  const starHeroMap = new Map(
    (starHeroString || '').split(',').map(pair => {
      const [slotStr, starHeroIdStr] = pair.split(':');
      return [slotStr, starHeroIdStr];
    })
  );

  const slots = document.querySelectorAll<HTMLDivElement>('.star-hero-slot');
  slots.forEach(slot => {
    const slotId = slot.dataset.slot!;
    const starHeroId = starHeroMap.get(slotId);
    const starHero = starHeroes.find(s => s.id === parseInt(starHeroId || '', 10));

    if (starHero) {
      slot.dataset.starHeroId = String(starHero.id);
      slot.innerHTML = '';

      const starHeroImage = document.createElement('img');
      starHeroImage.src = starHero.icon;
      starHeroImage.classList.add('icon');
      starHeroImage.alt = starHero.name;

      addSafeEventListener(starHeroImage, 'click', () => {
        const slotNumber = parseInt(slot.dataset.slot || '1', 10);
        removeStarHero(slotNumber);
      });

      slot.appendChild(starHeroImage);
    } else {
      slot.removeAttribute('data-star-hero-id');
      slot.innerHTML = EMPTY_ICON;
    }
  });
  updateStarHeroSelectionUI();
  updateTotalCost();
}


export function initStarHeroesUI() {
  renderEmptyStarHeroSlots();
  renderStarHeroSelection();
  loadStarHeroFromURL();

  const resetStarHeroBtn = document.getElementById('reset-star-heroes-btn') as HTMLButtonElement;
  addSafeEventListener(resetStarHeroBtn, 'click', () => {
    showResetModal([QUERY_KEY], '星将');
  });
}
