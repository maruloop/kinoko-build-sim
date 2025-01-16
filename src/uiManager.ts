import { initSummaryUI } from './summary';
import { initJobsUI } from './jobs';
import { initEquipmentsUI } from './equipments';
import { initSkillsUI } from './skills';
import { initPalsUI } from './pals';
import { initRelicsUI } from './relics';
import { initStatuesUI } from './statues';
import { initEnchantmentsUI } from './enchantment';
import { initMountsArtifactsBackAccessoriesUI } from './mounts-artifacts-back-accessories';
import { initAvianUI } from './avians';
import { initSoulsUI } from './souls';

export function updateAllUI() {
  initSummaryUI();
  initJobsUI();
  initEquipmentsUI();
  initSkillsUI();
  initPalsUI();
  initRelicsUI();
  initStatuesUI();
  initEnchantmentsUI();
  initMountsArtifactsBackAccessoriesUI();
  initAvianUI();
  initSoulsUI();
}
