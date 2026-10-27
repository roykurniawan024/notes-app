class LoadingIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['message', 'visible'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      if (name === 'visible') {
        this.updateVisibility();
      } else {
        this.render();
      }
    }
  }

  updateVisibility() {
    const isVisible = this.getAttribute('visible') === 'true';
    if (isVisible) {
      this.classList.add('active');
      this.setAttribute('aria-hidden', 'false');
    } else {
      this.classList.remove('active');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  render() {
    const message = this.getAttribute('message') || 'Memproses permintaan...';

    this.innerHTML = `
      <div class="loading-backdrop" role="status" aria-live="polite">
        <div class="loading-modal">
          <div class="loading-spinner" aria-hidden="true">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text">${message}</p>
        </div>
      </div>
    `;

    this.updateVisibility();
  }
}

customElements.define('loading-indicator', LoadingIndicator);
