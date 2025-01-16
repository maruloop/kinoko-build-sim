import { addSafeEventListener } from './helper';
import { MOUNTS_QUERY_KEY } from './mounts-artifacts-back-accessories';

interface Mount {
    id: number;
    name: string;
    icon: string;
}

const MOUNTS: Mount[] = [
    { id: 1, name: 'ドデカブタック', icon: 'icons/mounts/1.jpg' },
    { id: 2, name: 'ユニコーン', icon: 'icons/mounts/2.jpg' },
    { id: 3, name: '溶岩魔龍', icon: 'icons/mounts/3.jpg' },
    { id: 4, name: '聖光魔竜', icon: 'icons/mounts/4.jpg' },
    { id: 5, name: '紫翼', icon: 'icons/mounts/5.jpg' },
    { id: 6, name: '浮き浮き雲', icon: 'icons/mounts/6.jpg' },
    { id: 7, name: '玉兎1号', icon: 'icons/mounts/7.jpg' },
    { id: 8, name: '詩と往く', icon: 'icons/mounts/8.jpg' },
    { id: 9, name: '遊魚紙鳶', icon: 'icons/mounts/9.jpg' },
    { id: 10, name: 'オートバイク', icon: 'icons/mounts/10.jpg' },
    { id: 11, name: '烈焔バイク', icon: 'icons/mounts/11.jpg' },
    { id: 12, name: '月下湾', icon: 'icons/mounts/12.jpg' },
    { id: 13, name: '百変スライム', icon: 'icons/mounts/13.jpg' },
    { id: 14, name: '雪夜ヨヨ', icon: 'icons/mounts/14.jpg' },
    { id: 15, name: '心の赴くままに', icon: 'icons/mounts/15.jpg' },
    { id: 16, name: 'スイカフロート', icon: 'icons/mounts/16.jpg' },
    { id: 17, name: 'ダッキング', icon: 'icons/mounts/17.jpg' },
    { id: 18, name: 'デンデンローラー', icon: 'icons/mounts/18.jpg' },
    { id: 19, name: '幽々カボチャ車', icon: 'icons/mounts/19.jpg' },
    { id: 20, name: 'グラニ', icon: 'icons/mounts/20.jpg' },
    { id: 21, name: 'ベヒーモス', icon: 'icons/mounts/21.jpg' },
    { id: 22, name: '魔法の書', icon: 'icons/mounts/22.jpg' },
    { id: 23, name: '双蛙ブルブル', icon: 'icons/mounts/23.jpg' },
    { id: 24, name: '雪中訪問者', icon: 'icons/mounts/24.jpg' },
    { id: 25, name: 'タイムマシン', icon: 'icons/mounts/25.jpg' },
    { id: 26, name: '焚寂破心', icon: 'icons/mounts/26.jpg' },
    { id: 27, name: '風火輪', icon: 'icons/mounts/27.jpg' },
    { id: 28, name: '白虎', icon: 'icons/mounts/28.jpg' },
    { id: 29, name: '青牛モーモー', icon: 'icons/mounts/29.jpg' },
    { id: 30, name: '青の女王', icon: 'icons/mounts/30.jpg' },
    { id: 31, name: '丸々蛙', icon: 'icons/mounts/31.jpg' },
    { id: 32, name: 'ラム酒樽', icon: 'icons/mounts/32.jpg' },
    { id: 33, name: 'ガッツウィング1号', icon: 'icons/mounts/33.jpg' },
];

const EMPTY_ICON = '<span class="icon empty"></span>';

function renderMountSelection() {
    const mountsGrid = document.getElementById('mount-list') as HTMLDivElement;
    mountsGrid.innerHTML = '';

    MOUNTS.forEach(mount => {
        const mountElement = document.createElement('img');
        mountElement.src = mount.icon;
        mountElement.alt = mount.name;
        mountElement.classList.add('icon');
        mountElement.dataset.id = String(mount.id);

        addSafeEventListener(mountElement, 'click', () => toggleMount(mount));
        mountsGrid.appendChild(mountElement);
    });

    updateMountSelectionUI();
}

function toggleMount(mount: Mount) {
    const mountSlot = document.getElementById('selected-mount') as HTMLDivElement;
    const selectedMountId = mountSlot.dataset.mountId;

    if (selectedMountId === String(mount.id)) {
        mountSlot.removeAttribute('data-mount-id');
        mountSlot.innerHTML = EMPTY_ICON;
        updateURL(null);
    } else {
        mountSlot.dataset.mountId = String(mount.id);
        mountSlot.innerHTML = '';

        const mountImage = document.createElement('img');
        mountImage.src = mount.icon;
        mountImage.alt = mount.name;
        mountImage.classList.add('icon');

        addSafeEventListener(mountImage, 'click', () => {
            mountSlot.removeAttribute('data-mount-id');
            mountSlot.innerHTML = EMPTY_ICON;
            updateMountSelectionUI();
            updateURL(null);
        });

        mountSlot.appendChild(mountImage);
        updateURL(mount.id);
    }

    updateMountSelectionUI();
}

function updateMountSelectionUI() {
    document.querySelectorAll<HTMLImageElement>('#mount-list .icon').forEach(icon => {
        const id = icon.dataset.id;
        const isSelected = document.querySelector(`#selected-mount[data-mount-id="${id}"]`);

        if (isSelected) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
}

function updateURL(mountId: number | null) {
    const params = new URLSearchParams(window.location.search);

    if (mountId !== null) {
        params.set(MOUNTS_QUERY_KEY, String(mountId));
    } else {
        params.delete(MOUNTS_QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadMountFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedMount = params.get(MOUNTS_QUERY_KEY);

    const mountSlot = document.getElementById('selected-mount') as HTMLDivElement;

    if (selectedMount) {
        mountSlot.dataset.mountId = selectedMount;
        const mount = MOUNTS.find(m => m.id === parseInt(selectedMount, 10));
        if (mount) {
            mountSlot.innerHTML = `<img src="${mount.icon}" alt="${mount.name}" class="icon">`;
        }
    } else {
        mountSlot.innerHTML = EMPTY_ICON;
        mountSlot.removeAttribute('data-mount-id');
    }
    updateMountSelectionUI();
}

export function initMountUI() {
    renderMountSelection();
    loadMountFromURL();
}
