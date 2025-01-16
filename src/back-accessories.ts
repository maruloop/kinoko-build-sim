import { addSafeEventListener } from './helper';
import { BACK_ACCESSORIES_QUERY_KEY } from './mounts-artifacts-back-accessories';

interface BackAccessory {
    id: number;
    name: string;
    icon: string;
}

const BACK_ACCESSORIES: BackAccessory[] = [
    { id: 1, name: '金光の飛羽', icon: 'icons/back_accessories/1.jpg' },
    { id: 2, name: '羽融月煙', icon: 'icons/back_accessories/2.jpg' },
    { id: 3, name: '青山入色', icon: 'icons/back_accessories/3.jpg' },
    { id: 4, name: '剣魄凌風', icon: 'icons/back_accessories/4.jpg' },
    { id: 5, name: '昇龍軌跡', icon: 'icons/back_accessories/5.jpg' },
    { id: 6, name: '虚現連結', icon: 'icons/back_accessories/6.jpg' },
    { id: 7, name: '宇宙からの来訪者', icon: 'icons/back_accessories/7.jpg' },
    { id: 8, name: '今晩の食材', icon: 'icons/back_accessories/8.jpg' },
    { id: 9, name: '蝶の羽化', icon: 'icons/back_accessories/9.jpg' },
    { id: 10, name: 'サマーパラソル', icon: 'icons/back_accessories/10.jpg' },
    { id: 11, name: 'トビマスカイ', icon: 'icons/back_accessories/11.jpg' },
    { id: 12, name: '背後霊', icon: 'icons/back_accessories/12.jpg' },
    { id: 13, name: '堕落の天使', icon: 'icons/back_accessories/13.jpg' },
    { id: 14, name: '獣骨逸風', icon: 'icons/back_accessories/14.jpg' },
    { id: 15, name: '時のプリズム', icon: 'icons/back_accessories/15.jpg' },
    { id: 16, name: 'デュークモン：クリムゾンモードの翼', icon: 'icons/back_accessories/16.jpg' },
    { id: 17, name: 'ベルゼブモン：ブラストモードの翼', icon: 'icons/back_accessories/17.jpg' },
    { id: 18, name: '魔法陣', icon: 'icons/back_accessories/18.jpg' },
    { id: 19, name: 'ケロスラスター', icon: 'icons/back_accessories/19.jpg' },
    { id: 20, name: '骨竜錠', icon: 'icons/back_accessories/20.jpg' },
    { id: 21, name: '雪影幽霊', icon: 'icons/back_accessories/21.jpg' },
];

const EMPTY_ICON = '<span class="icon empty"></span>';

function renderBackAccessorySelection() {
    const backAccessoriesGrid = document.getElementById('back-accessory-list') as HTMLDivElement;
    backAccessoriesGrid.innerHTML = '';

    BACK_ACCESSORIES.forEach(backAccessory => {
        const backAccessoryElement = document.createElement('img');
        backAccessoryElement.src = backAccessory.icon;
        backAccessoryElement.alt = backAccessory.name;
        backAccessoryElement.classList.add('icon');
        backAccessoryElement.dataset.id = String(backAccessory.id);

        addSafeEventListener(backAccessoryElement, 'click', () => toggleBackAccessory(backAccessory));
        backAccessoriesGrid.appendChild(backAccessoryElement);
    });

    updateBackAccessorySelectionUI();
}

function toggleBackAccessory(backAccessory: BackAccessory) {
    const backAccessorySlot = document.getElementById('selected-back-accessory') as HTMLDivElement;
    const selectedBackAccessoryId = backAccessorySlot.dataset.backAccessoryId;

    if (selectedBackAccessoryId === String(backAccessory.id)) {
        backAccessorySlot.removeAttribute('data-back-accessory-id');
        backAccessorySlot.innerHTML = EMPTY_ICON;
        updateURL(null);
    } else {
        backAccessorySlot.dataset.backAccessoryId = String(backAccessory.id);
        backAccessorySlot.innerHTML = '';

        const backAccessoryImage = document.createElement('img');
        backAccessoryImage.src = backAccessory.icon;
        backAccessoryImage.alt = backAccessory.name;
        backAccessoryImage.classList.add('icon');

        addSafeEventListener(backAccessoryImage, 'click', () => {
            backAccessorySlot.removeAttribute('data-back-accessory-id');
            backAccessorySlot.innerHTML = EMPTY_ICON;
            updateBackAccessorySelectionUI();
            updateURL(null);
        });

        backAccessorySlot.appendChild(backAccessoryImage);
        updateURL(backAccessory.id);
    }

    updateBackAccessorySelectionUI();
}

function updateBackAccessorySelectionUI() {
    document.querySelectorAll<HTMLImageElement>('#back-accessory-list .icon').forEach(icon => {
        const id = icon.dataset.id;
        const isSelected = document.querySelector(`#selected-back-accesory[data-back-accessory-id="${id}"]`);

        if (isSelected) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
}

function updateURL(backAccessoryId: number | null) {
    const params = new URLSearchParams(window.location.search);

    if (backAccessoryId !== null) {
        params.set(BACK_ACCESSORIES_QUERY_KEY, String(backAccessoryId));
    } else {
        params.delete(BACK_ACCESSORIES_QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadBackAccessoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedBackAccessory = params.get(BACK_ACCESSORIES_QUERY_KEY);

    const backAccessorySlot = document.getElementById('selected-back-accessory') as HTMLDivElement;

    if (selectedBackAccessory) {
        backAccessorySlot.dataset.backAccessoryId = selectedBackAccessory;
        const backAccessory = BACK_ACCESSORIES.find(b => b.id === parseInt(selectedBackAccessory, 10));
        if (backAccessory) {
            backAccessorySlot.innerHTML = `<img src="${backAccessory.icon}" alt="${backAccessory.name}" class="icon">`;
        }
    } else {
        backAccessorySlot.innerHTML = EMPTY_ICON;
        backAccessorySlot.removeAttribute('data-back-accessory-id');
    }
    updateBackAccessorySelectionUI();
}

export function initBackAccessoryUI() {
    renderBackAccessorySelection();
    loadBackAccessoryFromURL();
}
