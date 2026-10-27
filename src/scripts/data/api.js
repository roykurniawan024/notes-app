class NotesApi {
  static async getNotes() {
    try {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message || 'Gagal memuat catatan aktif');
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal terhubung ke server Dicoding Notes API');
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes/archived');
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message || 'Gagal memuat catatan arsip');
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal terhubung ke server Dicoding Notes API');
    }
  }

  static async createNote({ title, body }) {
    try {
      const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message || 'Gagal menambahkan catatan');
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengirim data catatan baru');
    }
  }

  static async deleteNote(id) {
    try {
      const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
        method: 'DELETE',
      });
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message || 'Gagal menghapus catatan');
      }

      return responseJson.message;
    } catch (error) {
      throw new Error(error.message || 'Gagal memproses penghapusan catatan');
    }
  }

  static async archiveNote(id) {
    try {
      const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/archive`, {
        method: 'POST',
      });
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message || 'Gagal mengarsipkan catatan');
      }

      return responseJson.message;
    } catch (error) {
      throw new Error(error.message || 'Gagal memproses pengarsipan catatan');
    }
  }

  static async unarchiveNote(id) {
    try {
      const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`, {
        method: 'POST',
      });
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message || 'Gagal membatalkan arsip catatan');
      }

      return responseJson.message;
    } catch (error) {
      throw new Error(error.message || 'Gagal memproses pembatalan arsip');
    }
  }
}

export default NotesApi;
