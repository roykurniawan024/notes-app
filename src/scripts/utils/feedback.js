class FeedbackHelper {
  static showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
      <div class="toast__content">
        <p class="toast__message">${message}</p>
      </div>
      <button type="button" class="toast__close" aria-label="Tutup notifikasi">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('toast--hiding');
      setTimeout(() => toast.remove(), 200);
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.isConnected) {
        toast.classList.add('toast--hiding');
        setTimeout(() => toast.remove(), 200);
      }
    }, duration);
  }

  static showError(message) {
    this.showToast(message, 'error', 4500);
  }

  static showSuccess(message) {
    this.showToast(message, 'success', 3000);
  }
}

export default FeedbackHelper;
