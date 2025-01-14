import { skills, Skill } from './consts';
import { showResetModal } from './resetModal';
import { addSafeEventListener } from './helper';

const MAX_SLOTS = 5;
const QUERY_KEY = 'skills';

function renderSkillSelection() {
  const skillsList = document.getElementById('skill-list') as HTMLDivElement;
  skillsList.innerHTML = '';

  skills.forEach(skill => {
    const skillElement = document.createElement('img');
    skillElement.src = skill.icon;
    skillElement.alt = skill.name;
    skillElement.classList.add('icon');
    skillElement.dataset.id = String(skill.id);

    addSafeEventListener(skillElement, 'click', () => toggleSkill(skill));
    skillsList.appendChild(skillElement);
  });
  updateSkillSelectionUI();
}

function toggleSkill(skill: Skill) {
  const existingSlot = document.querySelector(
    `.skill-slot[data-skill-id="${skill.id}"]`
  ) as HTMLDivElement | null;

  if (existingSlot) {
    const slotNumber = parseInt(existingSlot.dataset.slot || '0', 10);
    removeSkill(slotNumber);
  } else {
    const emptySlot = document.querySelector(
      '.skill-slot:not([data-skill-id])'
    ) as HTMLDivElement;

    if (emptySlot) {
      emptySlot.dataset.skillId = String(skill.id);
      emptySlot.innerHTML = '';
      const skillImage = document.createElement('img');
      skillImage.src = skill.icon;
      skillImage.alt = skill.name;
      skillImage.classList.add('icon');
      skillImage.dataset.palId = String(skill.id);

      addSafeEventListener(skillImage, 'click', () => {
        const slot = parseInt(emptySlot.dataset.slot || '0', 10);
        removeSkill(slot);
      });

      emptySlot.appendChild(skillImage);
      updateURL();
      renderSkillSelection();
    }
  }
}


function removeSkill(slot: number) {
  const slotElement = document.querySelector(`.skill-slot[data-slot="${slot}"]`) as HTMLDivElement;

  if (slotElement) {
    slotElement.removeAttribute('data-skill-id');
    slotElement.innerHTML = '<span class="icon empty"></span>';
  }

  renderSkillSelection();
  updateURL();
}

function updateSkillSelectionUI() {
  document.querySelectorAll<HTMLImageElement>('#skill-list .icon').forEach(icon => {
    const id = icon.dataset.id;
    const isSelected = document.querySelector(`.skill-slot[data-skill-id="${id}"]`);

    if (isSelected) {
      icon.classList.add('selected');
    } else {
      icon.classList.remove('selected');
    }
  });
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const skillString = Array.from(document.querySelectorAll('.skill-slot[data-skill-id]'))
    .map(slot => {
      const slotNum = slot.getAttribute('data-slot');
      const skillId = slot.getAttribute('data-skill-id');
      return `${slotNum}:${skillId}`;
    })
    .join(',');

  if (skillString) {
    params.set(QUERY_KEY, skillString);
  } else {
    params.delete(QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function renderEmptySkillSlots() {
  const selectedSkillsList = document.getElementById('selected-skills') as HTMLDivElement;
  selectedSkillsList.innerHTML = '';

  for (let i = 0; i < MAX_SLOTS; i++) {
    const skillSlot = document.createElement('div');
    skillSlot.classList.add('skill-slot');
    skillSlot.dataset.slot = String(i);
    skillSlot.innerHTML = '<span class="icon empty"></span>';
    selectedSkillsList.appendChild(skillSlot);
  }
}
function loadSkillsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const skillString = params.get(QUERY_KEY);
  const skillMap = new Map<string, string>();

  if (skillString) {
    skillString.split(',').forEach(pair => {
      const [slotStr, skillIdStr] = pair.split(':');
      skillMap.set(slotStr, skillIdStr);
    });
  }

  const slots = document.querySelectorAll<HTMLDivElement>('.skill-slot');
  slots.forEach(slot => {
    const slotId = slot.dataset.slot!;
    const skillId = skillMap.get(slotId);
    const skill = skills.find(s => s.id === parseInt(skillId || '', 10));

    if (skill) {
      slot.dataset.skillId = String(skill.id);
      slot.innerHTML = '';

      const skillImage = document.createElement('img');
      skillImage.src = skill.icon;
      skillImage.classList.add('icon');
      skillImage.alt = skill.name;

      addSafeEventListener(skillImage, 'click', () => {
        const slotNumber = parseInt(slot.dataset.slot || '1', 10);
        removeSkill(slotNumber);
      });

      slot.appendChild(skillImage);
    } else {
      slot.dataset.skillId = '';
      slot.innerHTML = '<span class="icon empty"></span>';
    }
  });
}


export function initSkillsUI() {
  renderEmptySkillSlots();
  renderSkillSelection();
  loadSkillsFromURL();

  const resetSkillsBtn = document.getElementById('reset-skills-btn') as HTMLButtonElement;
  addSafeEventListener(resetSkillsBtn, 'click', () => {
    showResetModal([QUERY_KEY], '技能');
  });
}
