import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';
import { initSoulsMainUI } from './souls-main';
import { initSoulsSubUI } from './souls-sub';

export const SOULS_MAIN_QUERY_KEY = 'souls-main';
export const SOULS_SUB_QUERY_KEY = 'souls-sub';

export function initSoulsUI() {
  initSoulsMainUI();
  initSoulsSubUI();

  const resetSoulsBtn = document.getElementById('reset-souls-btn') as HTMLButtonElement;

  addSafeEventListener(resetSoulsBtn, 'click', () => {
    showResetModal([SOULS_MAIN_QUERY_KEY, SOULS_SUB_QUERY_KEY], '武魂');
  });
}
