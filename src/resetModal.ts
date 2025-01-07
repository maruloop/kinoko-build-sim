import { updateAllUI } from './uiManager';

let resetTargetKeys: string[] = [];

const modal = document.createElement('div');
modal.innerHTML = `
  <div class="modal-content">
    <p>本当にリセットしますか？</p>
    <button id="confirm-yes">はい</button>
    <button id="confirm-no">キャンセル</button>
  </div>
`;
modal.classList.add('modal');
document.body.appendChild(modal);

const confirmYesBtn = modal.querySelector('#confirm-yes') as HTMLButtonElement;
const confirmNoBtn = modal.querySelector('#confirm-no') as HTMLButtonElement;

// 1つでも配列として受け取る
export function showResetModal(queryKeys: string[], itemName: string) {
  resetTargetKeys = queryKeys;
  modal.querySelector('p')!.textContent = `${itemName}をリセットしますか？`;
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
  resetTargetKeys = [];
}

function resetQueryParameter() {
  const params = new URLSearchParams(window.location.search);

  resetTargetKeys.forEach(key => params.delete(key));

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

confirmYesBtn.addEventListener('click', () => {
  resetQueryParameter();
  updateAllUI();
  closeModal();
});

confirmNoBtn.addEventListener('click', closeModal);
