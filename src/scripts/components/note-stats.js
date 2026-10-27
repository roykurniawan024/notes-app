class NoteStats extends HTMLElement {
  static get observedAttributes() {
    return ['total-count', 'active-count', 'archived-count', 'current-filter'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  render() {
    const total = this.getAttribute('total-count') || '0';
    const active = this.getAttribute('active-count') || '0';
    const archived = this.getAttribute('archived-count') || '0';
    const currentFilter = this.getAttribute('current-filter') || 'all';

    this.innerHTML = `
      <nav class="stats-grid" role="tablist" aria-label="Filter status catatan">
        <div class="stat-card ${currentFilter === 'all' ? 'active' : ''}" data-filter="all" role="tab" tabindex="0">
          <div class="stat-card__info">
            <span>Semua</span>
            <strong id="countBadgeAll">${total}</strong>
          </div>
        </div>

        <div class="stat-card ${currentFilter === 'active' ? 'active' : ''}" data-filter="active" role="tab" tabindex="0">
          <div class="stat-card__info">
            <span>Aktif</span>
            <strong id="countBadgeActive">${active}</strong>
          </div>
        </div>

        <div class="stat-card ${currentFilter === 'archived' ? 'active' : ''}" data-filter="archived" role="tab" tabindex="0">
          <div class="stat-card__info">
            <span>Arsip</span>
            <strong id="countBadgeArchived">${archived}</strong>
          </div>
        </div>
      </nav>
    `;

    this.querySelectorAll('.stat-card').forEach((card) => {
      card.addEventListener('click', () => {
        const filter = card.getAttribute('data-filter');
        this.dispatchEvent(
          new CustomEvent('filter-selected', {
            detail: { filter },
            bubbles: true,
          })
        );
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const filter = card.getAttribute('data-filter');
          this.dispatchEvent(
            new CustomEvent('filter-selected', {
              detail: { filter },
              bubbles: true,
            })
          );
        }
      });
    });
  }
}

if (!customElements.get('note-stats')) {
  customElements.define('note-stats', NoteStats);
}

export default NoteStats;
