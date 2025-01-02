import { initJobsUI } from './jobs';
import { initEquipmentsUI } from './equipments';
import { initSkillsUI } from './skills';
import { initPalsUI } from './pals';
import { initRelicsUI } from './relics';
import { initStatuesUI } from './statues';
import { initEnchantmentsUI } from './enchantment';

export function updateAllUI() {
  initJobsUI();
  initEquipmentsUI();
  initSkillsUI();
  initPalsUI();
  initRelicsUI();
  initStatuesUI();
  initEnchantmentsUI();
}
