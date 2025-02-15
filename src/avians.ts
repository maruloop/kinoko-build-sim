import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';

const StatusColor = {
    YELLOW: 'yellow',
    PURPLE: 'purple',
    BLUE: 'blue',
    GRAY: 'gray',
    RAINBOW: 'rainbow',
}

interface AvianStatus {
    id: number;
    name: string;
    color: string;
}

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

const AVIAN_STATUS: AvianStatus[] = [
    { id: 1, name: '集結超連撃', color: StatusColor.YELLOW },
    { id: 2, name: '超反射反撃', color: StatusColor.YELLOW },
    { id: 3, name: '超絶通常攻撃', color: StatusColor.YELLOW },
    { id: 4, name: 'スーパープラス', color: StatusColor.YELLOW },
    { id: 5, name: '完全不制御', color: StatusColor.YELLOW },
    { id: 6, name: '正当防衛', color: StatusColor.YELLOW },
    { id: 7, name: '精密防衛', color: StatusColor.YELLOW },
    { id: 8, name: '反射無効', color: StatusColor.YELLOW },
    { id: 9, name: '恨み十分', color: StatusColor.YELLOW },
    { id: 10, name: '敵意一心', color: StatusColor.YELLOW },
    { id: 11, name: '迂回作戦', color: StatusColor.YELLOW },
    { id: 12, name: '強敵育我', color: StatusColor.YELLOW },
    { id: 13, name: '快速治癒', color: StatusColor.YELLOW },
    { id: 14, name: '異常状態免疫', color: StatusColor.YELLOW },
    { id: 15, name: '寿命延長', color: StatusColor.YELLOW },
    { id: 16, name: '短期体質', color: StatusColor.YELLOW },
    { id: 17, name: '鋼塀鉄壁', color: StatusColor.YELLOW },
    { id: 18, name: '速いが鈍い', color: StatusColor.PURPLE },
    { id: 19, name: '研鈍妖斬', color: StatusColor.PURPLE },
    { id: 20, name: '器用貧乏', color: StatusColor.PURPLE },
    { id: 21, name: '惰性気体', color: StatusColor.PURPLE },
    { id: 22, name: '背後の刃', color: StatusColor.PURPLE },
    { id: 23, name: '単独進行', color: StatusColor.PURPLE },
    { id: 24, name: '長命比べ', color: StatusColor.PURPLE },
    { id: 25, name: '紙防御', color: StatusColor.PURPLE },
    { id: 26, name: '脆弱マスター', color: StatusColor.PURPLE },
    { id: 27, name: '耐久軟弱', color: StatusColor.PURPLE },
    { id: 28, name: '重厚甲冑', color: StatusColor.PURPLE },
    { id: 29, name: '安定主義', color: StatusColor.PURPLE },
    { id: 30, name: '野良の味方', color: StatusColor.PURPLE },
    { id: 31, name: '吉報を待つ', color: StatusColor.PURPLE },
    { id: 32, name: '他損自利', color: StatusColor.PURPLE },
    { id: 33, name: '利他自損', color: StatusColor.PURPLE },
    { id: 34, name: '克己復傷', color: StatusColor.PURPLE },
    { id: 35, name: '進退窮まる', color: StatusColor.PURPLE },
    { id: 36, name: '上上下下', color: StatusColor.PURPLE },
    { id: 37, name: '中庸の道', color: StatusColor.PURPLE },
    { id: 38, name: '染毒矢尻', color: StatusColor.PURPLE },
    { id: 39, name: 'キノコ連撃', color: StatusColor.BLUE },
    { id: 40, name: '反射反撃', color: StatusColor.BLUE },
    { id: 41, name: '強化通常攻撃', color: StatusColor.BLUE },
    { id: 42, name: '能力技能', color: StatusColor.BLUE },
    { id: 43, name: '強化された、行け', color: StatusColor.BLUE },
    { id: 44, name: '憤怒加算', color: StatusColor.BLUE },
    { id: 45, name: '鉄桶回避', color: StatusColor.BLUE },
    { id: 46, name: '再生能力', color: StatusColor.BLUE },
    { id: 47, name: 'スーパーリーグ', color: StatusColor.RAINBOW },
    { id: 48, name: '全方位打撃', color: StatusColor.RAINBOW },
    { id: 49, name: '全能制御術', color: StatusColor.RAINBOW },
    { id: 50, name: '逆行制御術', color: StatusColor.RAINBOW },
    { id: 51, name: '爆裂コスモ', color: StatusColor.RAINBOW },
    { id: 52, name: '無限爆発打撃', color: StatusColor.RAINBOW },
    { id: 53, name: '天性の大爆発', color: StatusColor.RAINBOW },
    { id: 54, name: '多重発射', color: StatusColor.RAINBOW },
    { id: 55, name: '如羽流行', color: StatusColor.RAINBOW },
    { id: 56, name: '風軌斬裂', color: StatusColor.RAINBOW },
    { id: 57, name: '無限夢幻', color: StatusColor.RAINBOW },
    { id: 58, name: '重拳反撃', color: StatusColor.RAINBOW },
    { id: 59, name: '激怒狂斬', color: StatusColor.RAINBOW },
    { id: 60, name: '急所直撃', color: StatusColor.RAINBOW },
    { id: 61, name: '速度超過禁止', color: StatusColor.RAINBOW },
    { id: 62, name: 'アンテナ誘雷', color: StatusColor.RAINBOW },
    { id: 63, name: '神託の触れ', color: StatusColor.RAINBOW },
    { id: 64, name: '秘術の光輝', color: StatusColor.RAINBOW },
];

const EMPTY_ICON = '<span class="icon empty"></span>';
const QUERY_KEY = 'avian';
const STATUS_QUERY_KEY = 'avian-status';
const MAX_STATUS = 4;

function renderAvianStatus() {
    const list = document.getElementById('avian-status-list') as HTMLDivElement;
    list.innerHTML = '';

    AVIAN_STATUS.forEach(status => {
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('avian-status-item', status.color);
        statusDiv.textContent = status.name;
        statusDiv.dataset.id = String(status.id);

        list.appendChild(statusDiv);
    });

    addSafeEventListener(list, 'click', handleStatusClick);
}

function handleStatusClick(event: Event) {
    const target = event.target as HTMLDivElement;
    const totalCountDisplay = document.getElementById('avian-status-total-count') as HTMLSpanElement;
    const currentTotal = parseInt(totalCountDisplay.dataset.total || '0', 10);

    if (target.classList.contains('avian-status-item')) {
        if (!target.classList.contains('selected') && currentTotal < MAX_STATUS) {
            target.classList.toggle('selected');
            updateURL();
            totalCountDisplay.dataset.total = String(currentTotal + 1);
            totalCountDisplay.textContent = String(currentTotal + 1);
        } else if (target.classList.contains('selected')) {
            target.classList.toggle('selected');
            updateURL();
            totalCountDisplay.dataset.total = String(currentTotal - 1);
            totalCountDisplay.textContent = String(currentTotal - 1);
        }
    }
}

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
        updateURL();
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
            updateURL();
        });

        avianSlot.appendChild(avianImage);
        updateURL();
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

function updateURL() {
    updateAvianURL();
    updateStatusURL();
}

function updateStatusURL() {
    const params = new URLSearchParams(window.location.search);
    const selected = Array.from(document.querySelectorAll<HTMLDivElement>(
        '.avian-status-item.selected'
    )).map(item => item.dataset.id);

    if (selected.length > 0) {
        params.set(STATUS_QUERY_KEY, selected.join(','));
    } else {
        params.delete(STATUS_QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function updateAvianURL() {
    const params = new URLSearchParams(window.location.search);
    const avianSlot = document.getElementById('selected-avian') as HTMLDivElement;
    const selectedAvianId = avianSlot.dataset.avianId;

    if (selectedAvianId) {
        params.set(QUERY_KEY, String(selectedAvianId));
    } else {
        params.delete(QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}
function loadFromURL() {
    loadAvianFromURL();
    loadAvianStatusFromURL();
}

function loadAvianStatusFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedIds = params.get(STATUS_QUERY_KEY)?.split(',') || [];
    const optionElements = document.querySelectorAll<HTMLDivElement>('.avian-status-item');

    let totalCount = 0;

    optionElements.forEach(optionElement => {
        const optionId = optionElement.dataset.id;
        const option = AVIAN_STATUS.find(op => optionId === String(op.id) && selectedIds.includes(String(op.id)));
        if (option) {
            optionElement.classList.add('selected');
            totalCount++;
        } else {
            optionElement.classList.remove('selected');
        }
    });

    const totalCountDisplay = document.getElementById('avian-status-total-count') as HTMLSpanElement;
    totalCountDisplay.dataset.total = String(totalCount);
    totalCountDisplay.textContent = String(totalCount);
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
    renderAvianStatus();
    renderAvianSelection();
    loadFromURL();
    const resetAvianBtn = document.getElementById('reset-avian-btn') as HTMLButtonElement;
    addSafeEventListener(resetAvianBtn, 'click', () => {
        showResetModal([QUERY_KEY], 'ペット');
    });
}
