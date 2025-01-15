import { pals, Pal } from './consts';
import { getPalLimit } from './jobs';
import { showResetModal } from './resetModal';
import { addSafeEventListener } from './helper';

const QUERY_KEY = 'pals';
const EMPTY_ICON = '<span class="icon empty"></span>';

function renderPalSelection() {
  const palsList = document.getElementById('pal-list') as HTMLDivElement;
  palsList.innerHTML = '';

  pals.forEach(pal => {
    const palElement = document.createElement('img');
    palElement.src = pal.icon;
    palElement.alt = pal.name;
    palElement.classList.add('icon');
    palElement.dataset.id = String(pal.id);

    addSafeEventListener(palElement, 'click', () => togglePal(pal));
    palsList.appendChild(palElement);
  });
  updatePalSelectionUI();
}

function togglePal(pal: Pal) {
  console.log('toggle');
  const existingSlot = document.querySelector(
    `.pal-slot[data-pal-id="${pal.id}"]`
  ) as HTMLDivElement | null;

  if (existingSlot) {
    const slotNumber = parseInt(existingSlot.dataset.slot || '1', 10);
    removePal(slotNumber);
  } else {
    console.log('add');
    const emptySlot = document.querySelector(
      '.pal-slot:not([data-pal-id])'
    ) as HTMLDivElement;
    console.log(emptySlot);

    if (emptySlot) {
      emptySlot.dataset.palId = String(pal.id);
      emptySlot.innerHTML = '';
      const palImage = document.createElement('img');
      palImage.src = pal.icon;
      palImage.alt = pal.name;
      palImage.classList.add('icon');
      palImage.dataset.palId = String(pal.id);

      addSafeEventListener(palImage, 'click', () => {
        const slot = parseInt(emptySlot.dataset.slot || '1', 10);
        removePal(slot);
      });

      emptySlot.appendChild(palImage);
      updateURL();
      renderPalSelection();
    }
  }
}

function removePal(slot: number) {
  const slotElement = document.querySelector(`.pal-slot[data-slot="${slot}"]`) as HTMLDivElement;

  if (slotElement) {
    slotElement.removeAttribute('data-pal-id');
    slotElement.innerHTML = EMPTY_ICON;
  }

  renderPalSelection();
  updateURL();
}

function updatePalSelectionUI() {
  document.querySelectorAll<HTMLImageElement>('#pal-list .icon').forEach(icon => {
    const id = icon.dataset.id;
    const isSelected = document.querySelector(`.pal-slot[data-pal-id="${id}"]`);

    if (isSelected) {
      icon.classList.add('selected');
    } else {
      icon.classList.remove('selected');
    }
  });
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);

  const palString = Array.from(document.querySelectorAll('.pal-slot[data-pal-id]'))
    .map(slot => {
      const slotNum = slot.getAttribute('data-slot');
      const palId = slot.getAttribute('data-pal-id');
      return `${slotNum}:${palId}`;
    })
    .join(',');

  if (palString) {
    params.set(QUERY_KEY, palString);
  } else {
    params.delete(QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function renderEmptySelectedPals() {
  const selectedPalsList = document.getElementById('selected-pals') as HTMLDivElement;
  selectedPalsList.innerHTML = '';

  const palLimit = getPalLimit();
  for (let i = 0; i < palLimit; i++) {
    const palSlot = document.createElement('div');
    palSlot.classList.add('pal-slot');
    palSlot.dataset.slot = String(i);
    palSlot.innerHTML = EMPTY_ICON;
    selectedPalsList.appendChild(palSlot);
  }
}

function loadPalsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const palString = params.get(QUERY_KEY);
  const palMap = new Map(
    (palString || '').split(',').map(pair => {
      const [slotStr, palIdStr] = pair.split(':');
      return [slotStr, palIdStr];
    })
  );

  const slots = document.querySelectorAll<HTMLDivElement>('.pal-slot');
  slots.forEach(slot => {
    const slotId = slot.dataset.slot!;
    const palId = palMap.get(slotId);
    const pal = pals.find(p => p.id === parseInt(palId || '', 10));

    if (pal){
      slot.dataset.palId = String(pal.id);
      slot.innerHTML = '';

      const palImage = document.createElement('img');
      palImage.src = pal.icon;
      palImage.classList.add('icon');
      palImage.alt = pal.name;

      addSafeEventListener(palImage, 'click', () => {
        const slotNumber = parseInt(slot.dataset.slot || '1', 10);
        removePal(slotNumber);
      });

      slot.appendChild(palImage);
    } else {
      slot.removeAttribute('data-pal-id');
      slot.innerHTML = EMPTY_ICON;
    }
  });
  updatePalSelectionUI();
}

export function updatePalLimitOnJobChange() {
  const selectedPalsList = document.getElementById('selected-pals') as HTMLDivElement;
  const currentSlots = selectedPalsList.querySelectorAll('.pal-slot').length;
  const newLimit = getPalLimit();

  if (currentSlots > newLimit) {
    for (let i = newLimit; i < currentSlots; i++) {
      const slot = selectedPalsList.querySelector(`[data-slot="${i}"]`);
      if (slot) {
        slot.remove();
      }
    }
    renderPalSelection();
    updateURL();
  }
  else if (currentSlots < newLimit) {
    for (let i = currentSlots; i < newLimit; i++) {
      const palElement = document.createElement('div');
      palElement.classList.add('pal-slot');
      palElement.dataset.slot = String(i);
      palElement.innerHTML = '<span class="icon empty"></span>';
      selectedPalsList.appendChild(palElement);
    }
  }
}

export function initPalsUI() {
  renderEmptySelectedPals();
  renderPalSelection();
  loadPalsFromURL();

  const resetPalsBtn = document.getElementById('reset-pals-btn') as HTMLButtonElement;
  addSafeEventListener(resetPalsBtn, 'click', () => {
    showResetModal([QUERY_KEY], '仲間');
  });
}

// For test
export function getPalState() {
  const selectedPals: Record<number, string | null> = {};

  document.querySelectorAll('.pal-slot[data-pal-id]').forEach(slot => {
    const slotNumber = parseInt(slot.getAttribute('data-slot')!, 10);
    const palId = slot.getAttribute('data-pal-id');
    selectedPals[slotNumber] = palId;
  });

  document.querySelectorAll('.pal-slot:not([data-pal-id])').forEach(slot => {
    const slotNumber = parseInt(slot.getAttribute('data-slot')!, 10);
    selectedPals[slotNumber] = null;
  });

  return {
    selectedPals,
    totalCount: Object.values(selectedPals).filter(id => id !== null).length
  };
}

