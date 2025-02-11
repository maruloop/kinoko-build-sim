import { addSafeEventListener } from './helper';
import { showResetModal } from './resetModal';

interface Ship {
    id: number;
    name: string;
    icon: string;
}

const SHIP: Ship[] = [
    { id: 1, name: '快適ボート', icon: 'icons/ships/1.jpg' },
    { id: 2, name: '青白カヌー', icon: 'icons/ships/2.jpg' },
    { id: 3, name: 'ダック船', icon: 'icons/ships/3.jpg' },
    { id: 4, name: '偵察ボート', icon: 'icons/ships/4.jpg' },
    { id: 5, name: '幽霊船', icon: 'icons/ships/5.jpg' },
    { id: 6, name: 'ドラゴンボート', icon: 'icons/ships/6.jpg' },
    { id: 7, name: 'チョコバナナボート', icon: 'icons/ships/7.jpg' },
];

const EMPTY_ICON = '<span class="icon empty"></span>';
const QUERY_KEY = 'ship';

function renderShipSelection() {
    const shipGrid = document.getElementById('ship-list') as HTMLDivElement;
    shipGrid.innerHTML = '';

    SHIP.forEach(ship => {
        const shipElement = document.createElement('img');
        shipElement.src = ship.icon;
        shipElement.alt = ship.name;
        shipElement.classList.add('icon');
        shipElement.dataset.id = String(ship.id);

        addSafeEventListener(shipElement, 'click', () => toggleShip(ship));
        shipGrid.appendChild(shipElement);
    });

    updateShipSelectionUI();
}

function toggleShip(ship: Ship) {
    const shipSlot = document.getElementById('selected-ship') as HTMLDivElement;
    const selectedShipId = shipSlot.dataset.shipId;

    if (selectedShipId === String(ship.id)) {
        shipSlot.removeAttribute('data-ship-id');
        shipSlot.innerHTML = EMPTY_ICON;
        updateURL(null);
    } else {
        shipSlot.dataset.shipId = String(ship.id);
        shipSlot.innerHTML = '';

        const shipImage = document.createElement('img');
        shipImage.src = ship.icon;
        shipImage.alt = ship.name;
        shipImage.classList.add('icon');

        addSafeEventListener(shipImage, 'click', () => {
            shipSlot.removeAttribute('data-ship-id');
            shipSlot.innerHTML = EMPTY_ICON;
            updateShipSelectionUI();
            updateURL(null);
        });

        shipSlot.appendChild(shipImage);
        updateURL(ship.id);
    }

    updateShipSelectionUI();
}

function updateShipSelectionUI() {
    document.querySelectorAll<HTMLImageElement>('#ship-list .icon').forEach(icon => {
        const id = icon.dataset.id;
        const isSelected = document.querySelector(`#selected-ship[data-ship-id="${id}"]`);

        if (isSelected) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
}

function updateURL(shipId: number | null) {
    const params = new URLSearchParams(window.location.search);

    if (shipId !== null) {
        params.set(QUERY_KEY, String(shipId));
    } else {
        params.delete(QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadShipFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedShip = params.get(QUERY_KEY);

    const shipSlot = document.getElementById('selected-ship') as HTMLDivElement;

    if (selectedShip) {
        shipSlot.dataset.shipId = selectedShip;
        const ship = SHIP.find(s => s.id === parseInt(selectedShip, 10));
        if (ship) {
            shipSlot.innerHTML = `<img src="${ship.icon}" alt="${ship.name}" class="icon">`;
        }
    } else {
        shipSlot.innerHTML = EMPTY_ICON;
        shipSlot.removeAttribute('data-ship-id');
    }
    updateShipSelectionUI();
}

export function initShipUI() {
    renderShipSelection();
    loadShipFromURL();

    const resetShipBtn = document.getElementById('reset-ship-btn') as HTMLButtonElement;
    addSafeEventListener(resetShipBtn, 'click', () => {
        showResetModal([QUERY_KEY], '船');
    });
}
