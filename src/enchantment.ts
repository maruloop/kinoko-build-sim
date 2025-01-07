import { addSafeEventListener } from './helper';
import { initEnchantmentSetsUI } from "./enchantment-sets";
import { initEnchantmentMainUI } from './enchantment-main';
import { initEnchantmentSubUI } from "./enchantment-sub";
import { showResetModal } from './resetModal';

export const SETS_QUERY_KEY = 'enchantment-sets';
export const MAIN_QUERY_KEY = 'enchantment-main'
export const SUB_QUERY_KEY = 'enchantment-sub'

export interface EnchantmentOption {
  id: number;
  name: string;
}

export function initEnchantmentsUI() {
  initEnchantmentSetsUI();
  initEnchantmentMainUI();
  initEnchantmentSubUI();


  const resetEquipmentsBtn = document.getElementById('reset-enchantments-btn') as HTMLButtonElement;

  addSafeEventListener(resetEquipmentsBtn, 'click', () => {
    showResetModal([SETS_QUERY_KEY, MAIN_QUERY_KEY, SUB_QUERY_KEY], '神器付魔');
  });
}
