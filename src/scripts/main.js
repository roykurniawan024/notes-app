import NotesApi from './data/api.js';
import FeedbackHelper from './utils/feedback.js';

const THEME_KEY = 'DICODING_NOTES_THEME_V2';
const ACCENT_PALETTE = ['indigo', 'emerald', 'amber', 'rose'];

class NotesAppController {
  constructor() {
    this.activeNotes = [];
    this.archivedNotes = [];
    this.filter = 'all'; // 'all' | 'active' | 'archived'
    this.searchQuery = '';
    this.sortBy = 'newest'; // 'newest' | 'oldest' | 'title'
    this.viewMode = 'grid'; // 'grid' | 'list'
    this.pendingDelete = null;

    this.notesGridEl = document.getElementById('notesGrid');
    this.emptyStateEl = document.getElementById('emptyState');
    this.noteStatsEl = document.querySelector('note-stats');
    this.loadingIndicatorEl = document.querySelector('loading-indicator');
    this.filterButtons = document.querySelectorAll('.filter-tab');
    this.sortSelectEl = document.getElementById('sortSelect');
    this.viewGridBtn = document.getElementById('viewGridBtn');
    this.viewListBtn = document.getElementById('viewListBtn');

    this.deleteModalEl = document.getElementById('deleteModal');
    this.deleteModalTitleEl = document.getElementById('deleteModalNoteTitle');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    this.detailModalEl = document.getElementById('detailModal');
    this.detailModalTitleEl = document.getElementById('detailModalTitle');
    this.detailModalMetaEl = document.getElementById('detailModalMeta');
    this.detailModalBodyEl = document.getElementById('detailModalBody');
    this.closeDetailBtn = document.getElementById('closeDetailBtn');
    this.seedNotesBtn = document.getElementById('seedNotesBtn');

    this.initTheme();
    this.bindEvents();
    this.loadNotesFromApi();
  }

  showLoading(message = 'Memproses data...') {
    if (this.loadingIndicatorEl) {
      this.loadingIndicatorEl.setAttribute('message', message);
      this.loadingIndicatorEl.setAttribute('visible', 'true');
    }
  }

  hideLoading() {
    if (this.loadingIndicatorEl) {
      this.loadingIndicatorEl.setAttribute('visible', 'false');
    }
  }

  async seedSampleNotes() {
    const samples = [
      {
        title: 'Arsitektur Modul Webpack & ES6',
        body: 'Memisahkan konfigurasi webpack.common.js, webpack.dev.js, dan webpack.prod.js agar proses development serta build produksi berjalan optimal.',
      },
      {
        title: 'Integrasi Fetch API Asynchronous',
        body: 'Mengelola request GET, POST, dan DELETE ke endpoint Dicoding Notes API v2 menggunakan async/await beserta penanganan status loading.',
      },
      {
        title: 'Desain Komponen Web Reusable',
        body: 'Membangun antarmuka modular dengan Custom Elements: app-bar, note-stats, note-input, note-item, loading-indicator, dan app-footer.',
      },
    ];

    this.showLoading('Menambahkan 3 catatan contoh ke server API...');
    try {
      for (const item of samples) {
        await NotesApi.createNote(item);
      }
      FeedbackHelper.showSuccess('3 catatan contoh berhasil disimpan ke server.');
      await this.loadNotesFromApi();
    } catch (error) {
      FeedbackHelper.showError(error.message || 'Gagal membuat catatan contoh.');
    } finally {
      this.hideLoading();
    }
  }

  async loadNotesFromApi() {
    this.showLoading('Mengambil daftar catatan dari server...');
    try {
      const [activeData, archivedData] = await Promise.all([
        NotesApi.getNotes(),
        NotesApi.getArchivedNotes(),
      ]);

      this.activeNotes = (activeData || []).map((note, index) => ({
        ...note,
        accent: ACCENT_PALETTE[index % ACCENT_PALETTE.length],
      }));

      this.archivedNotes = (archivedData || []).map((note, index) => ({
        ...note,
        accent: ACCENT_PALETTE[(index + 2) % ACCENT_PALETTE.length],
      }));

      this.renderAll();
    } catch (error) {
      FeedbackHelper.showError(error.message || 'Gagal memuat catatan dari REST API.');
    } finally {
      this.hideLoading();
    }
  }

  initTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        this.updateThemeButton(true);
      }
    } catch {
      // Ignore localStorage error if restricted
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.updateThemeButton(nextDark);
    try {
      localStorage.setItem(THEME_KEY, nextDark ? 'dark' : 'light');
    } catch {
      // Ignore
    }
  }

  updateThemeButton(isDark) {
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon && label) {
      icon.textContent = '◐';
      label.textContent = isDark ? 'Tema Terang' : 'Tema Gelap';
    }
  }

  copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        this.fallbackCopy(text);
      });
    } else {
      this.fallbackCopy(text);
    }
  }

  fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch {
      // Ignore
    }
    textarea.remove();
  }

  bindEvents() {
    document.addEventListener('note-submitted', async (e) => {
      const { note } = e.detail;
      await this.handleCreateNote(note);
    });

    document.addEventListener('note-toggle-archive', async (e) => {
      const { id, title, isArchived } = e.detail;
      await this.handleToggleArchive(id, title, isArchived);
    });

    document.addEventListener('note-delete-requested', (e) => {
      const { id, title } = e.detail;
      this.openDeleteModal(id, title);
    });

    document.addEventListener('note-copy-requested', (e) => {
      const { title, body } = e.detail;
      this.copyTextToClipboard(`${title}\n\n${body}`);
      FeedbackHelper.showSuccess(`Isi catatan "${title}" berhasil disalin ke clipboard!`);
    });

    document.addEventListener('note-detail-requested', (e) => {
      this.openDetailModal(e.detail);
    });

    document.addEventListener('search-changed', (e) => {
      this.searchQuery = (e.detail.query || '').trim().toLowerCase();
      this.renderNotesList();
    });

    document.addEventListener('filter-selected', (e) => {
      const { filter } = e.detail;
      this.setFilter(filter);
    });

    document.addEventListener('theme-toggle', () => {
      this.toggleTheme();
    });

    this.filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });

    if (this.sortSelectEl) {
      this.sortSelectEl.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderNotesList();
      });
    }

    if (this.viewGridBtn && this.viewListBtn) {
      this.viewGridBtn.addEventListener('click', () => this.setViewMode('grid'));
      this.viewListBtn.addEventListener('click', () => this.setViewMode('list'));
    }

    if (this.cancelDeleteBtn) {
      this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    }

    if (this.confirmDeleteBtn) {
      this.confirmDeleteBtn.addEventListener('click', async () => {
        if (this.pendingDelete) {
          const { id } = this.pendingDelete;
          this.closeDeleteModal();
          await this.handleDeleteNote(id);
        }
      });
    }

    if (this.deleteModalEl) {
      this.deleteModalEl.addEventListener('click', (e) => {
        if (e.target === this.deleteModalEl) {
          this.closeDeleteModal();
        }
      });
    }

    if (this.seedNotesBtn) {
      this.seedNotesBtn.addEventListener('click', () => this.seedSampleNotes());
    }

    if (this.closeDetailBtn) {
      this.closeDetailBtn.addEventListener('click', () => this.closeDetailModal());
    }

    if (this.detailModalEl) {
      this.detailModalEl.addEventListener('click', (e) => {
        if (e.target === this.detailModalEl) {
          this.closeDetailModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.deleteModalEl && this.deleteModalEl.classList.contains('open')) {
          this.closeDeleteModal();
        }
        if (this.detailModalEl && this.detailModalEl.classList.contains('open')) {
          this.closeDetailModal();
        }
      }
    });
  }

  setViewMode(mode) {
    this.viewMode = mode;
    if (this.notesGridEl) {
      this.notesGridEl.classList.toggle('notes-grid--list', mode === 'list');
    }
    if (this.viewGridBtn && this.viewListBtn) {
      this.viewGridBtn.classList.toggle('active', mode === 'grid');
      this.viewListBtn.classList.toggle('active', mode === 'list');
    }
  }

  openDetailModal({ id, title, body, formattedDate, isArchived, wordCount }) {
    if (!this.detailModalEl) return;
    if (this.detailModalTitleEl) this.detailModalTitleEl.textContent = title;
    if (this.detailModalMetaEl) {
      this.detailModalMetaEl.textContent = `${formattedDate} • ${isArchived ? 'Diarsipkan' : 'Catatan Aktif'} • ${wordCount} kata • #${id}`;
    }
    if (this.detailModalBodyEl) this.detailModalBodyEl.textContent = body;
    this.detailModalEl.classList.add('open');
  }

  closeDetailModal() {
    if (this.detailModalEl) {
      this.detailModalEl.classList.remove('open');
    }
  }

  async handleCreateNote({ title, body, archived }) {
    this.showLoading('Menyimpan catatan baru ke REST API...');
    try {
      const createdNote = await NotesApi.createNote({ title, body });

      if (archived && createdNote && createdNote.id) {
        await NotesApi.archiveNote(createdNote.id);
        FeedbackHelper.showSuccess('Catatan berhasil ditambahkan dan langsung diarsipkan!');
      } else {
        FeedbackHelper.showSuccess('Catatan baru berhasil ditambahkan!');
      }

      await this.loadNotesFromApi();
    } catch (error) {
      FeedbackHelper.showError(error.message || 'Gagal menambahkan catatan baru ke server.');
    } finally {
      this.hideLoading();
    }
  }

  async handleToggleArchive(id, title, isArchived) {
    const actionLabel = isArchived ? 'mengembalikan' : 'mengarsipkan';
    this.showLoading(`Sedang ${actionLabel} catatan...`);

    try {
      if (isArchived) {
        await NotesApi.unarchiveNote(id);
        FeedbackHelper.showSuccess(`Catatan "${title}" dipindahkan ke catatan aktif.`);
      } else {
        await NotesApi.archiveNote(id);
        FeedbackHelper.showSuccess(`Catatan "${title}" berhasil diarsipkan.`);
      }

      await this.loadNotesFromApi();
    } catch (error) {
      FeedbackHelper.showError(error.message || `Gagal ${actionLabel} catatan.`);
    } finally {
      this.hideLoading();
    }
  }

  openDeleteModal(id, title) {
    this.pendingDelete = { id, title };
    if (this.deleteModalTitleEl) {
      this.deleteModalTitleEl.textContent = `"${title}"`;
    }
    if (this.deleteModalEl) {
      this.deleteModalEl.classList.add('open');
    }
    if (this.confirmDeleteBtn) {
      this.confirmDeleteBtn.focus();
    }
  }

  closeDeleteModal() {
    this.pendingDelete = null;
    if (this.deleteModalEl) {
      this.deleteModalEl.classList.remove('open');
    }
  }

  async handleDeleteNote(id) {
    this.showLoading('Menghapus catatan dari REST API...');
    try {
      await NotesApi.deleteNote(id);
      FeedbackHelper.showSuccess('Catatan berhasil dihapus secara permanen.');
      await this.loadNotesFromApi();
    } catch (error) {
      FeedbackHelper.showError(error.message || 'Gagal menghapus catatan dari server.');
    } finally {
      this.hideLoading();
    }
  }

  setFilter(filter) {
    this.filter = filter;
    this.filterButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    this.updateStats();
    this.renderNotesList();
  }

  getAllNotesCombined() {
    return [...this.activeNotes, ...this.archivedNotes];
  }

  getFilteredNotes() {
    let list = [];
    if (this.filter === 'active') {
      list = [...this.activeNotes];
    } else if (this.filter === 'archived') {
      list = [...this.archivedNotes];
    } else {
      list = this.getAllNotesCombined();
    }

    if (this.searchQuery) {
      list = list.filter((note) => {
        const titleMatch = (note.title || '').toLowerCase().includes(this.searchQuery);
        const bodyMatch = (note.body || '').toLowerCase().includes(this.searchQuery);
        return titleMatch || bodyMatch;
      });
    }

    list.sort((a, b) => {
      if (this.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (this.sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (this.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '', 'id');
      }
      return 0;
    });

    return list;
  }

  updateStats() {
    const totalCount = this.getAllNotesCombined().length;
    const activeCount = this.activeNotes.length;
    const archivedCount = this.archivedNotes.length;

    if (this.noteStatsEl) {
      this.noteStatsEl.setAttribute('total-count', String(totalCount));
      this.noteStatsEl.setAttribute('active-count', String(activeCount));
      this.noteStatsEl.setAttribute('archived-count', String(archivedCount));
      this.noteStatsEl.setAttribute('current-filter', this.filter);
    }

    const badgeAll = document.getElementById('countBadgeAll');
    const badgeActive = document.getElementById('countBadgeActive');
    const badgeArchived = document.getElementById('countBadgeArchived');

    if (badgeAll) badgeAll.textContent = String(totalCount);
    if (badgeActive) badgeActive.textContent = String(activeCount);
    if (badgeArchived) badgeArchived.textContent = String(archivedCount);
  }

  renderNotesList() {
    const notesToRender = this.getFilteredNotes();

    if (!this.notesGridEl) return;

    this.notesGridEl.innerHTML = '';

    if (notesToRender.length === 0) {
      if (this.emptyStateEl) this.emptyStateEl.classList.add('visible');
      return;
    }

    if (this.emptyStateEl) this.emptyStateEl.classList.remove('visible');

    notesToRender.forEach((note) => {
      const noteItem = document.createElement('note-item');
      noteItem.setAttribute('note-id', note.id || '');
      noteItem.setAttribute('note-title', note.title || '');
      noteItem.setAttribute('note-body', note.body || '');
      noteItem.setAttribute('created-at', note.createdAt || '');
      noteItem.setAttribute('archived', note.archived ? 'true' : 'false');
      noteItem.setAttribute('card-accent', note.accent || 'indigo');
      this.notesGridEl.appendChild(noteItem);
    });
  }

  renderAll() {
    this.updateStats();
    this.renderNotesList();
  }
}

export default NotesAppController;
