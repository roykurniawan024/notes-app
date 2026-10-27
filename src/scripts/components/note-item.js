class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'created-at', 'archived', 'card-accent'];
  }

  connectedCallback() {
    this.render();
    this.animateEntrance();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  animateEntrance() {
    const card = this.querySelector('.note-card');
    if (card && typeof card.animate === 'function') {
      card.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 220,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
        }
      );
    }
  }

  formatDate(isoString) {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return isoString;
    }
  }

  countWords(text) {
    const cleaned = String(text || '').trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).length;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  render() {
    const id = this.getAttribute('note-id') || '';
    const title = this.getAttribute('note-title') || 'Tanpa Judul';
    const body = this.getAttribute('note-body') || '';
    const createdAt = this.getAttribute('created-at') || '';
    const isArchived = this.getAttribute('archived') === 'true';
    const accent = this.getAttribute('card-accent') || 'indigo';

    const formattedDate = this.formatDate(createdAt);
    const wordCount = this.countWords(body);

    this.innerHTML = `
      <article class="note-card" data-accent="${this.escapeHtml(accent)}">
        <div class="note-card__header">
          <div class="note-card__top">
            <span class="note-card__badge ${
              isArchived ? 'note-card__badge--archived' : 'note-card__badge--active'
            }">
              ${isArchived ? 'Arsip' : 'Aktif'}
            </span>
            <time class="note-card__date" datetime="${this.escapeHtml(createdAt)}">${formattedDate}</time>
          </div>
          <div class="note-card__title-wrap">
            <span class="note-card__dot" aria-hidden="true"></span>
            <h3 class="note-card__title">${this.escapeHtml(title)}</h3>
          </div>
        </div>

        <p class="note-card__body">${this.escapeHtml(body)}</p>

        <div class="note-card__footer">
          <div class="note-card__util">
            <span class="note-card__words">${wordCount} kata</span>
            <button
              type="button"
              class="btn-card-icon"
              data-action="copy-note"
              title="Salin catatan"
              aria-label="Salin isi catatan"
            >
              <svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button
              type="button"
              class="btn-card-icon"
              data-action="view-detail"
              title="Baca selengkapnya"
              aria-label="Baca detail catatan"
            >
              <svg class="icon" viewBox="0 0 24 24"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
            </button>
          </div>
          <div class="note-card__actions">
            <button
              type="button"
              class="btn-card-action btn-card-action--archive"
              data-action="toggle-archive"
              title="${isArchived ? 'Pindahkan ke Aktif' : 'Simpan ke Arsip'}"
            >
              <span>${isArchived ? 'Aktifkan' : 'Arsipkan'}</span>
            </button>
            <button
              type="button"
              class="btn-card-action btn-card-action--delete"
              data-action="delete"
              title="Hapus Catatan"
            >
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </article>
    `;

    const archiveBtn = this.querySelector('[data-action="toggle-archive"]');
    const deleteBtn = this.querySelector('[data-action="delete"]');
    const copyBtn = this.querySelector('[data-action="copy-note"]');
    const detailBtn = this.querySelector('[data-action="view-detail"]');

    if (archiveBtn) {
      archiveBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('note-toggle-archive', {
            detail: { id, title, isArchived },
            bubbles: true,
          })
        );
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('note-delete-requested', {
            detail: { id, title },
            bubbles: true,
          })
        );
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('note-copy-requested', {
            detail: { title, body },
            bubbles: true,
          })
        );
      });
    }

    if (detailBtn) {
      detailBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('note-detail-requested', {
            detail: { id, title, body, createdAt, isArchived, formattedDate, wordCount },
            bubbles: true,
          })
        );
      });
    }
  }
}

if (!customElements.get('note-item')) {
  customElements.define('note-item', NoteItem);
}

export default NoteItem;
