class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ['brand-title', 'subtitle', 'badge-text'];
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
    const brandTitle = this.getAttribute('brand-title') || 'Notes';
    const subtitle = this.getAttribute('subtitle') || 'Ruang Kerja Catatan';

    this.innerHTML = `
      <header class="app-header">
        <div class="app-header__inner">
          <div class="brand">
            <div class="brand__logo" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <div class="brand__text">
              <h1>${brandTitle}</h1>
              <span class="brand__subtitle">${subtitle}</span>
            </div>
          </div>

          <div class="search-box">
            <span class="search-box__icon" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="search"
              id="globalSearchInput"
              placeholder="Cari judul atau isi catatan..."
              aria-label="Cari catatan"
            />
            <button type="button" class="search-box__clear" id="clearSearchBtn" title="Bersihkan pencarian" aria-label="Bersihkan pencarian">
              ✕
            </button>
          </div>

          <div class="header-actions">
            <button type="button" class="theme-btn" id="themeToggleBtn" aria-label="Ganti tema tampilan">
              <span id="themeIcon" aria-hidden="true">◐</span>
              <span id="themeLabel">Mode Gelap</span>
            </button>
          </div>
        </div>
      </header>
    `;

    const searchInput = this.querySelector('#globalSearchInput');
    const clearBtn = this.querySelector('#clearSearchBtn');
    const themeBtn = this.querySelector('#themeToggleBtn');

    if (searchInput && clearBtn) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        clearBtn.classList.toggle('visible', query.length > 0);
        this.dispatchEvent(
          new CustomEvent('search-changed', {
            detail: { query },
            bubbles: true,
          })
        );
      });

      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        this.dispatchEvent(
          new CustomEvent('search-changed', {
            detail: { query: '' },
            bubbles: true,
          })
        );
        searchInput.focus();
      });
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('theme-toggle', { bubbles: true }));
      });
    }
  }
}

if (!customElements.get('app-bar')) {
  customElements.define('app-bar', AppBar);
}

export default AppBar;
