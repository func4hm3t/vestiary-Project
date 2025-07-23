import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private container = document.getElementById('global-toast')!;

  show(message: string, duration = 3000) {
    if (!this.container) {
      console.error('Toast container bulunamadı!');
      return;
    }

    // Mesaj elementi oluştur
    const msgEl = document.createElement('div');
    msgEl.className = 'toast-message';
    msgEl.textContent = message;

    // Container'a ekle
    this.container.appendChild(msgEl);
    // Görünür yap
    this.container.classList.add('show');

    // Süre sonunda temizle
    setTimeout(() => {
      this.container.removeChild(msgEl);
      if (!this.container.hasChildNodes()) {
        this.container.classList.remove('show');
      }
    }, duration);
  }
}
