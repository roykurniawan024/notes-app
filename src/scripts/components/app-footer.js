class AppFooter extends HTMLElement {
  static get observedAttributes() {
    return ['course-name', 'year'];
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
    const courseName =
      this.getAttribute('course-name') || 'Belajar Fundamental Front-End Web Development';
    const year = this.getAttribute('year') || '2026';

    this.innerHTML = `
      <footer class="app-footer">
        <p>
          <strong>Notes App</strong> &mdash; Submission Proyek <span>${courseName}</span> &copy; ${year}
        </p>
      </footer>
    `;
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}

export default AppFooter;
