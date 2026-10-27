class NoteInput extends HTMLElement {
  static get observedAttributes() {
    return ['form-title', 'max-title-length', 'min-body-length'];
  }

  constructor() {
    super();
    this.selectedAccent = 'indigo';
  }

  connectedCallback() {
    this.render();
    this.setupValidation();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
      this.setupValidation();
    }
  }

  render() {
    const formTitle = this.getAttribute('form-title') || 'Buat Catatan Baru';
    const maxTitle = parseInt(this.getAttribute('max-title-length') || '50', 10);
    const minBody = parseInt(this.getAttribute('min-body-length') || '10', 10);

    this.innerHTML = `
      <aside class="form-card" aria-label="Formulir tambah catatan">
        <div class="form-card__header">
          <h2 class="form-card__title">${formTitle}</h2>
          <p class="form-card__subtitle">Isi judul dan rincian catatan di bawah ini.</p>
        </div>

        <form id="noteForm" novalidate>
          <div class="form-group">
            <div class="form-label-row">
              <label for="noteTitle">Judul Catatan</label>
              <span class="char-counter" id="titleCounter">0 / ${maxTitle}</span>
            </div>
            <input
              type="text"
              id="noteTitle"
              name="title"
              class="form-control"
              placeholder="Contoh: Agenda Rapat Mingguan"
              maxlength="${maxTitle}"
              required
              autocomplete="off"
            />
            <div class="validation-msg" id="titleValidationMsg" aria-live="polite"></div>
          </div>

          <div class="form-group">
            <div class="form-label-row">
              <label for="noteBody">Isi Catatan</label>
              <span class="char-counter" id="bodyCounter">Min. ${minBody} karakter</span>
            </div>
            <textarea
              id="noteBody"
              name="body"
              class="form-control"
              placeholder="Tuliskan rincian catatan Anda..."
              rows="4"
              required
            ></textarea>
            <div class="validation-msg" id="bodyValidationMsg" aria-live="polite"></div>
          </div>

          <div class="form-options-row">
            <div class="color-picker-group">
              <label>Warna Label</label>
              <div class="color-dots" id="accentPicker">
                <button type="button" class="color-dot active" data-color="indigo" title="Biru" aria-label="Warna Biru"></button>
                <button type="button" class="color-dot" data-color="emerald" title="Hijau" aria-label="Warna Hijau"></button>
                <button type="button" class="color-dot" data-color="amber" title="Kuning" aria-label="Warna Kuning"></button>
                <button type="button" class="color-dot" data-color="rose" title="Merah" aria-label="Warna Merah"></button>
              </div>
            </div>

            <div class="archive-check-group">
              <label>Status Awal</label>
              <label class="checkbox-pill" for="noteArchived">
                <input type="checkbox" id="noteArchived" name="archived" />
                <span>Simpan di Arsip</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn-submit" id="submitNoteBtn">
            <span>Simpan Catatan</span>
          </button>
        </form>
      </aside>
    `;
  }

  setupValidation() {
    const maxTitle = parseInt(this.getAttribute('max-title-length') || '50', 10);
    const minBody = parseInt(this.getAttribute('min-body-length') || '10', 10);

    const form = this.querySelector('#noteForm');
    const titleInput = this.querySelector('#noteTitle');
    const bodyInput = this.querySelector('#noteBody');
    const archivedInput = this.querySelector('#noteArchived');
    const titleCounter = this.querySelector('#titleCounter');
    const bodyCounter = this.querySelector('#bodyCounter');
    const titleMsg = this.querySelector('#titleValidationMsg');
    const bodyMsg = this.querySelector('#bodyValidationMsg');
    const colorDots = this.querySelectorAll('.color-dot');

    colorDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        colorDots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');
        this.selectedAccent = dot.getAttribute('data-color') || 'indigo';
      });
    });

    const validateTitle = () => {
      const val = titleInput.value.trim();
      const rawLen = titleInput.value.length;
      const remaining = maxTitle - rawLen;

      titleCounter.textContent = `${rawLen} / ${maxTitle}`;
      titleCounter.classList.toggle('warning', remaining <= 10 && remaining > 3);
      titleCounter.classList.toggle('danger', remaining <= 3);

      if (val.length === 0) {
        titleInput.classList.add('is-invalid');
        titleInput.classList.remove('is-valid');
        titleMsg.textContent = 'Judul catatan wajib diisi.';
        titleMsg.className = 'validation-msg visible';
        return false;
      }
      if (val.length < 3) {
        titleInput.classList.add('is-invalid');
        titleInput.classList.remove('is-valid');
        titleMsg.textContent = `Judul minimal 3 karakter (kurang ${3 - val.length} karakter).`;
        titleMsg.className = 'validation-msg visible';
        return false;
      }

      titleInput.classList.remove('is-invalid');
      titleInput.classList.add('is-valid');
      titleMsg.textContent = '';
      titleMsg.className = 'validation-msg';
      return true;
    };

    const validateBody = () => {
      const val = bodyInput.value.trim();
      const len = val.length;

      bodyCounter.textContent = `${len} karakter`;
      bodyCounter.classList.toggle('warning', len > 0 && len < minBody);

      if (len === 0) {
        bodyInput.classList.add('is-invalid');
        bodyInput.classList.remove('is-valid');
        bodyMsg.textContent = 'Isi catatan tidak boleh kosong.';
        bodyMsg.className = 'validation-msg visible';
        return false;
      }
      if (len < minBody) {
        bodyInput.classList.add('is-invalid');
        bodyInput.classList.remove('is-valid');
        bodyMsg.textContent = `Isi catatan minimal ${minBody} karakter (kurang ${minBody - len} karakter).`;
        bodyMsg.className = 'validation-msg visible';
        return false;
      }

      bodyInput.classList.remove('is-invalid');
      bodyInput.classList.add('is-valid');
      bodyMsg.textContent = '';
      bodyMsg.className = 'validation-msg';
      return true;
    };

    titleInput.addEventListener('input', validateTitle);
    titleInput.addEventListener('blur', validateTitle);
    bodyInput.addEventListener('input', validateBody);
    bodyInput.addEventListener('blur', validateBody);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isTitleOk = validateTitle();
      const isBodyOk = validateBody();

      if (!isTitleOk) {
        titleInput.focus();
        return;
      }
      if (!isBodyOk) {
        bodyInput.focus();
        return;
      }

      const notePayload = {
        title: titleInput.value.trim(),
        body: bodyInput.value.trim(),
        archived: archivedInput.checked,
        accent: this.selectedAccent,
      };

      this.dispatchEvent(
        new CustomEvent('note-submitted', {
          detail: { note: notePayload },
          bubbles: true,
        })
      );

      form.reset();
      titleInput.classList.remove('is-valid', 'is-invalid');
      bodyInput.classList.remove('is-valid', 'is-invalid');
      titleMsg.className = 'validation-msg';
      titleMsg.textContent = '';
      bodyMsg.className = 'validation-msg';
      bodyMsg.textContent = '';
      titleCounter.textContent = `0 / ${maxTitle}`;
      titleCounter.classList.remove('warning', 'danger');
      bodyCounter.textContent = `Min. ${minBody} karakter`;
      bodyCounter.classList.remove('warning');
    });
  }
}

if (!customElements.get('note-input')) {
  customElements.define('note-input', NoteInput);
}

export default NoteInput;
