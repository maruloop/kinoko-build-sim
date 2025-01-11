import { updatePalLimitOnJobChange } from './pals';
import { addSafeEventListener } from './helper';

interface Job {
  id: number;
  name: string;
  palLimit: number;
}

const jobs: Job[] = [
  { id: 1, name: '武聖', palLimit: 5 },
  { id: 2, name: '戦神', palLimit: 5 },
  { id: 3, name: '聖狩', palLimit: 5 },
  { id: 4, name: '羽皇', palLimit: 5 },
  { id: 5, name: '先知', palLimit: 5 },
  { id: 6, name: '魔王', palLimit: 5 },
  { id: 7, name: '獣王', palLimit: 6 },
  { id: 8, name: '霊尊', palLimit: 6 }
];

const QUERY_KEY = 'job';

const jobRadios = document.querySelectorAll<HTMLInputElement>('input[name="job"]');

jobRadios.forEach((radio) => {
  addSafeEventListener(radio, 'change', (event) => {
    const selectedRadio = event.target as HTMLInputElement;
    const selectedId = parseInt(selectedRadio.value, 10);
    document.getElementById('job-options')!.dataset.selectedJob = String(selectedId);
    updateURL(selectedId);
    updatePalLimitOnJobChange();
  });
});

function updateURL(selectedJobId: Number) {
  const params = new URLSearchParams(window.location.search);
  params.set(QUERY_KEY, String(selectedJobId));
  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadJobFromURL() {
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get(QUERY_KEY) || '1', 10);
  const job = jobs.find(j => j.id === jobId);

  if (job) {
    document.getElementById('job-options')!.dataset.selectedJob = String(jobId);
    updateRadioSelection(jobId);
  }
}

function updateRadioSelection(jobId: number) {
  const selectedRadio = document.querySelector(`input[name="job"][value="${jobId}"]`) as HTMLInputElement | null;
  if (selectedRadio) {
    selectedRadio.checked = true;
  }
}

export function initJobsUI() {
  loadJobFromURL();
  updatePalLimitOnJobChange();
}

export function getSelectedJob(): Job {
  const selectedId = parseInt(document.getElementById('job-options')!.dataset.selectedJob || '1');
  return jobs.find(j => j.id === selectedId) || jobs[0];
}

export function getPalLimit(): number {
  const selectedId = parseInt(document.getElementById('job-options')!.dataset.selectedJob || '1');
  return jobs.find(j => j.id === selectedId)?.palLimit || jobs[0].palLimit;
}