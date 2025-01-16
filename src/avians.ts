import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';

interface Avian {
    id: number;
    name: string;
    icon: string;
}

const AVIANS: Avian[] = [
    { id: 1, name: '好戦アンニン', icon: 'icons/avians/1.jpg' },
    { id: 2, name: '微光ロウソク', icon: 'icons/avians/2.jpg' },
    { id: 3, name: 'ヤシボール', icon: 'icons/avians/3.jpg' },
    { id: 4, name: 'もこもこメェ', icon: 'icons/avians/4.jpg' },
    { id: 5, name: 'トマタマ炒め', icon: 'icons/avians/5.jpg' },
    { id: 6, name: 'AI助手', icon: 'icons/avians/6.jpg' },
    { id: 7, name: '乳酸ココア', icon: 'icons/avians/7.jpg' },
    { id: 8, name: '衝撃ペンギン', icon: 'icons/avians/8.jpg' },
    { id: 9, name: '積雨雲', icon: 'icons/avians/9.jpg' },
    { id: 10, name: '三連射手', icon: 'icons/avians/10.jpg' },
    { id: 11, name: 'リンリンベル', icon: 'icons/avians/11.jpg' },
    { id: 12, name: '晴天の使者', icon: 'icons/avians/12.jpg' },
    { id: 13, name: '旅クラゲ', icon: 'icons/avians/13.jpg' },
    { id: 14, name: '迷風の葉', icon: 'icons/avians/14.jpg' },
    { id: 15, name: 'チョビ蛾', icon: 'icons/avians/15.jpg' },
    { id: 16, name: '乳酸飛行士', icon: 'icons/avians/16.jpg' },
    { id: 17, name: 'アヌビス', icon: 'icons/avians/17.jpg' },
    { id: 18, name: '蛍夜トト', icon: 'icons/avians/18.jpg' },
    { id: 19, name: '月縛霊', icon: 'icons/avians/19.jpg' },
    { id: 20, name: '鳥神ホルス', icon: 'icons/avians/20.jpg' },
    { id: 21, name: 'まほにゃん', icon: 'icons/avians/21.jpg' },
    { id: 22, name: 'すいちゃん', icon: 'icons/avians/22.jpg' },
    { id: 23, name: 'にゃんぷう', icon: 'icons/avians/23.jpg' },
    { id: 24, name: 'ミシェル', icon: 'icons/avians/24.jpg' },
    { id: 25, name: 'Teal', icon: 'icons/avians/25.jpg' },
    { id: 26, name: 'Pinky', icon: 'icons/avians/26.jpg' },
    { id: 27, name: 'B.Duck', icon: 'icons/avians/27.jpg' },
    { id: 28, name: 'フクロウ', icon: 'icons/avians/28.jpg' },
    { id: 29, name: '閃光フクロウ', icon: 'icons/avians/29.jpg' },
    { id: 30, name: 'クワジーロ', icon: 'icons/avians/30.jpg' },
    { id: 31, name: 'シャークラー', icon: 'icons/avians/31.jpg' },
    { id: 32, name: 'ガニラン', icon: 'icons/avians/32.jpg' },
    { id: 33, name: 'ギルモン', icon: 'icons/avians/33.jpg' },
    { id: 34, name: 'インプモン', icon: 'icons/avians/34.jpg' },
    { id: 35, name: 'デュークモン', icon: 'icons/avians/35.jpg' },
    { id: 36, name: 'メギドラモン', icon: 'icons/avians/36.jpg' },
    { id: 37, name: 'ベルゼブモン', icon: 'icons/avians/37.jpg' },
];

const EMPTY_ICON = '<span class="icon empty"></span>';
const QUERY_KEY = 'avian';

function renderAvianSelection() {
    const aviansGrid = document.getElementById('avian-list') as HTMLDivElement;
    aviansGrid.innerHTML = '';

    AVIANS.forEach(avian => {
        const avianElement = document.createElement('img');
        avianElement.src = avian.icon;
        avianElement.alt = avian.name;
        avianElement.classList.add('icon');
        avianElement.dataset.id = String(avian.id);

        addSafeEventListener(avianElement, 'click', () => toggleAvian(avian));
        aviansGrid.appendChild(avianElement);
    });

    updateAvianSelectionUI();
}

function toggleAvian(avian: Avian) {
    const avianSlot = document.getElementById('selected-avian') as HTMLDivElement;
    const selectedAvianId = avianSlot.dataset.avianId;

    if (selectedAvianId === String(avian.id)) {
        avianSlot.removeAttribute('data-avian-id');
        avianSlot.innerHTML = EMPTY_ICON;
        updateURL(null);
    } else {
        avianSlot.dataset.avianId = String(avian.id);
        avianSlot.innerHTML = '';

        const avianImage = document.createElement('img');
        avianImage.src = avian.icon;
        avianImage.alt = avian.name;
        avianImage.classList.add('icon');

        addSafeEventListener(avianImage, 'click', () => {
            avianSlot.removeAttribute('data-avian-id');
            avianSlot.innerHTML = EMPTY_ICON;
            updateAvianSelectionUI();
            updateURL(null);
        });

        avianSlot.appendChild(avianImage);
        updateURL(avian.id);
    }

    updateAvianSelectionUI();
}

function updateAvianSelectionUI() {
    document.querySelectorAll<HTMLImageElement>('#avian-list .icon').forEach(icon => {
        const id = icon.dataset.id;
        const isSelected = document.querySelector(`#selected-avian[data-avian-id="${id}"]`);

        if (isSelected) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
}

function updateURL(avianId: number | null) {
    const params = new URLSearchParams(window.location.search);

    if (avianId !== null) {
        params.set(QUERY_KEY, String(avianId));
    } else {
        params.delete(QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadAvianFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedAvian = params.get(QUERY_KEY);

    const avianSlot = document.getElementById('selected-avian') as HTMLDivElement;

    if (selectedAvian) {
        avianSlot.dataset.avianId = selectedAvian;
        const avian = AVIANS.find(a => a.id === parseInt(selectedAvian, 10));
        if (avian) {
            avianSlot.innerHTML = `<img src="${avian.icon}" alt="${avian.name}" class="icon">`;
        }
    } else {
        avianSlot.innerHTML = EMPTY_ICON;
        avianSlot.removeAttribute('data-avian-id');
    }
    updateAvianSelectionUI();
}

export function initAvianUI() {
    renderAvianSelection();
    loadAvianFromURL();
    const resetAvianBtn = document.getElementById('reset-avian-btn') as HTMLButtonElement;
    addSafeEventListener(resetAvianBtn, 'click', () => {
        showResetModal([QUERY_KEY], 'ペット');
    });
}
