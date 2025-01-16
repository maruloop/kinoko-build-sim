import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';
import { initMountUI } from './mounts';
import { initArtifactUI } from './artifacts';
import { initBackAccessoryUI } from './back-accessories';

export const MOUNTS_QUERY_KEY = 'mounts';
export const ARTIFACTS_QUERY_KEY = 'artifacts'
export const BACK_ACCESSORIES_QUERY_KEY = 'back-accessories'

export function initMountsArtifactsBackAccessoriesUI() {
  initMountUI();
  initArtifactUI();
  initBackAccessoryUI();

  const resetMountsArtifactsBackAccessoriesBtn = document.getElementById('reset-mounts-artifacts-back-accessories-btn') as HTMLButtonElement;

  addSafeEventListener(resetMountsArtifactsBackAccessoriesBtn, 'click', () => {
    showResetModal([MOUNTS_QUERY_KEY, ARTIFACTS_QUERY_KEY, BACK_ACCESSORIES_QUERY_KEY], '騎乗&神器&背飾り');
  });
}
