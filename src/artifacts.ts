import { addSafeEventListener } from './helper';
import { ARTIFACTS_QUERY_KEY } from './mounts-artifacts-back-accessories';

interface Artifact {
    id: number;
    name: string;
    icon: string;
}

const ARTIFACTS: Artifact[] = [
    { id: 1, name: '混元武聖槌', icon: 'icons/artifacts/1.jpg' },
    { id: 2, name: '夜行鴉眼の鎌', icon: 'icons/artifacts/2.jpg' },
    { id: 3, name: '飴ガトリング', icon: 'icons/artifacts/3.jpg' },
    { id: 4, name: '開天の剣', icon: 'icons/artifacts/4.jpg' },
    { id: 5, name: '千層塔', icon: 'icons/artifacts/5.jpg' },
    { id: 6, name: '傷心式襲撃', icon: 'icons/artifacts/6.jpg' },
    { id: 7, name: '両刃の弦', icon: 'icons/artifacts/7.jpg' },
    { id: 8, name: '加減を知れ', icon: 'icons/artifacts/8.jpg' },
    { id: 9, name: 'セイレーンの囁き', icon: 'icons/artifacts/9.jpg' },
    { id: 10, name: '大ガァーンソー', icon: 'icons/artifacts/10.jpg' },
    { id: 11, name: '魔法の杖', icon: 'icons/artifacts/11.jpg' },
    { id: 12, name: 'ブルトガング＆グングニル', icon: 'icons/artifacts/12.jpg' },
    { id: 13, name: 'ブラスター', icon: 'icons/artifacts/13.jpg' },
    { id: 14, name: 'ビリットスティック', icon: 'icons/artifacts/14.jpg' },
    { id: 15, name: '古城ロウソク', icon: 'icons/artifacts/15.jpg' },
    { id: 16, name: 'デメテルの刃', icon: 'icons/artifacts/16.jpg' },
    { id: 17, name: '神盾霜火', icon: 'icons/artifacts/17.jpg' },
    { id: 18, name: '蒼炎御守刀', icon: 'icons/artifacts/18.jpg' },
    { id: 19, name: 'ウルトラゼロランス', icon: 'icons/artifacts/19.jpg' },
    { id: 20, name: 'ウルティメイトイージス', icon: 'icons/artifacts/20.jpg' },
];

const EMPTY_ICON = '<span class="icon empty"></span>';

function renderArtifactSelection() {
    const artifactsGrid = document.getElementById('artifact-list') as HTMLDivElement;
    artifactsGrid.innerHTML = '';

    ARTIFACTS.forEach(artifact => {
        const artifactElement = document.createElement('img');
        artifactElement.src = artifact.icon;
        artifactElement.alt = artifact.name;
        artifactElement.classList.add('icon');
        artifactElement.dataset.id = String(artifact.id);

        addSafeEventListener(artifactElement, 'click', () => toggleArtifact(artifact));
        artifactsGrid.appendChild(artifactElement);
    });

    updateArtifactSelectionUI();
}

function toggleArtifact(artifact: Artifact) {
    const artifactSlot = document.getElementById('selected-artifact') as HTMLDivElement;
    const selectedArtifactId = artifactSlot.dataset.artifactId;

    if (selectedArtifactId === String(artifact.id)) {
        artifactSlot.removeAttribute('data-artifact-id');
        artifactSlot.innerHTML = EMPTY_ICON;
        updateURL(null);
    } else {
        artifactSlot.dataset.artifactId = String(artifact.id);
        artifactSlot.innerHTML = '';

        const artifactImage = document.createElement('img');
        artifactImage.src = artifact.icon;
        artifactImage.alt = artifact.name;
        artifactImage.classList.add('icon');

        addSafeEventListener(artifactImage, 'click', () => {
            artifactSlot.removeAttribute('data-artifact-id');
            artifactSlot.innerHTML = EMPTY_ICON;
            updateArtifactSelectionUI();
            updateURL(null);
        });

        artifactSlot.appendChild(artifactImage);
        updateURL(artifact.id);
    }

    updateArtifactSelectionUI();
}

function updateArtifactSelectionUI() {
    document.querySelectorAll<HTMLImageElement>('#artifact-list .icon').forEach(icon => {
        const id = icon.dataset.id;
        const isSelected = document.querySelector(`#selected-artifact[data-artifact-id="${id}"]`);

        if (isSelected) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
}

function updateURL(artifactId: number | null) {
    const params = new URLSearchParams(window.location.search);

    if (artifactId !== null) {
        params.set(ARTIFACTS_QUERY_KEY, String(artifactId));
    } else {
        params.delete(ARTIFACTS_QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadArtifactFromURL() {
    const params = new URLSearchParams(window.location.search);
    const selectedArtifact = params.get(ARTIFACTS_QUERY_KEY);

    const artifactSlot = document.getElementById('selected-artifact') as HTMLDivElement;

    if (selectedArtifact) {
        artifactSlot.dataset.artifactId = selectedArtifact;
        const artifact = ARTIFACTS.find(a => a.id === parseInt(selectedArtifact, 10));
        if (artifact) {
            artifactSlot.innerHTML = `<img src="${artifact.icon}" alt="${artifact.name}" class="icon">`;
        }
    } else {
        artifactSlot.innerHTML = EMPTY_ICON;
        artifactSlot.removeAttribute('data-artifact-id');
    }
    updateArtifactSelectionUI();
}

export function initArtifactUI() {
    renderArtifactSelection();
    loadArtifactFromURL();
}
