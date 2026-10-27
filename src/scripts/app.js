import './components/app-bar.js';
import './components/note-stats.js';
import './components/note-input.js';
import './components/note-item.js';
import './components/loading-indicator.js';
import './components/app-footer.js';
import NotesAppController from './main.js';

const initApp = () => {
  if (window.__NOTES_APP_INITIALIZED__) return;
  window.__NOTES_APP_INITIALIZED__ = true;

  const app = new NotesAppController();

  const refreshBtn = document.getElementById('refreshApiBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      app.loadNotesFromApi();
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
