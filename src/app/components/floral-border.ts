import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-floral-border',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="floral-border-wrapper" [class.inverted]="inverted()">
      <svg viewBox="0 0 1000 38" preserveAspectRatio="none" class="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#b71c1c" />
            <stop offset="25%" stop-color="#c2185b" />
            <stop offset="75%" stop-color="#d32f2f" />
            <stop offset="100%" stop-color="#880e4f" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffd54f" />
            <stop offset="50%" stop-color="#fff59d" />
            <stop offset="100%" stop-color="#ffb300" />
          </linearGradient>
          <linearGradient id="lotusPink" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff80ab" />
            <stop offset="50%" stop-color="#f06292" />
            <stop offset="100%" stop-color="#c2185b" />
          </linearGradient>
          <linearGradient id="tealAmbi" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00e5ff" />
            <stop offset="50%" stop-color="#00acc1" />
            <stop offset="100%" stop-color="#006064" />
          </linearGradient>

          <!-- Single Flower / Toran Motif Unit (Repeatable every 100px) -->
          <pattern id="festiveMotif" width="100" height="38" patternUnits="userSpaceOnUse">
            <!-- Background Accent Bar -->
            <rect x="0" y="2" width="100" height="4" fill="url(#goldLine)" />
            <rect x="0" y="32" width="100" height="4" fill="url(#goldLine)" />

            <!-- Green Mango Leaves / Toran Base -->
            <path d="M 0 6 Q 25 18 50 6 Q 75 18 100 6 L 100 12 Q 75 22 50 12 Q 25 22 0 12 Z" fill="#2e7d32" opacity="0.9" />
            <path d="M 25 14 Q 38 24 50 14" stroke="#81c784" stroke-width="0.8" fill="none" />
            <path d="M 75 14 Q 88 24 100 14" stroke="#81c784" stroke-width="0.8" fill="none" />

            <!-- Turquoise / Teal Paisley (Ambi) Swirls -->
            <path d="M 12 18 C 12 10 24 10 24 18 C 24 24 16 28 8 30 C 14 28 20 24 18 18 Z" fill="url(#tealAmbi)" />
            <path d="M 88 18 C 88 10 76 10 76 18 C 76 24 84 28 92 30 C 86 28 80 24 82 18 Z" fill="url(#tealAmbi)" />
            <circle cx="16" cy="18" r="1.5" fill="#fff9c4" />
            <circle cx="84" cy="18" r="1.5" fill="#fff9c4" />

            <!-- Central Blooming Pink Lotus -->
            <!-- Back petals -->
            <path d="M 50 7 C 42 12 36 20 50 28 C 64 20 58 12 50 7 Z" fill="url(#lotusPink)" />
            <path d="M 44 12 C 34 16 34 24 48 26 Z" fill="#e91e63" />
            <path d="M 56 12 C 66 16 66 24 52 26 Z" fill="#e91e63" />
            <!-- Front Lotus Bud & Core -->
            <ellipse cx="50" cy="20" rx="3.5" ry="6" fill="#f8bbd0" stroke="#c2185b" stroke-width="0.5" />
            <circle cx="50" cy="17" r="2" fill="#ffd54f" />

            <!-- Golden Marigold Medallions on both sides -->
            <circle cx="0" cy="19" r="6" fill="#ffb300" stroke="#e65100" stroke-width="0.8" />
            <circle cx="0" cy="19" r="3" fill="#fff59d" />
            <circle cx="100" cy="19" r="6" fill="#ffb300" stroke="#e65100" stroke-width="0.8" />
            <circle cx="100" cy="19" r="3" fill="#fff59d" />

            <!-- Hanging Pearls / Beads Garland -->
            <path d="M 0 20 Q 25 34 50 24 Q 75 34 100 20" stroke="#fff9c4" stroke-width="1.2" stroke-dasharray="1 3" fill="none" />
            <circle cx="25" cy="27" r="1.8" fill="#ffd700" stroke="#ff8f00" stroke-width="0.4" />
            <circle cx="75" cy="27" r="1.8" fill="#ffd700" stroke="#ff8f00" stroke-width="0.4" />
            <circle cx="50" cy="29" r="2.2" fill="#d50000" stroke="#ffd700" stroke-width="0.5" />
          </pattern>
        </defs>

        <!-- Solid Background Band with Gradient -->
        <rect x="0" y="0" width="1000" height="38" fill="url(#bandGrad)" />

        <!-- Pattern Overlay -->
        <rect x="0" y="0" width="1000" height="38" fill="url(#festiveMotif)" />

        <!-- Top and Bottom Golden Finish Borders -->
        <rect x="0" y="0" width="1000" height="2.5" fill="url(#goldLine)" />
        <rect x="0" y="35.5" width="1000" height="2.5" fill="url(#goldLine)" />
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .floral-border-wrapper {
      width: 100%;
      height: 32px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .floral-border-wrapper.inverted {
      transform: rotate(180deg);
    }
  `]
})
export class FloralBorder {
  inverted = input<boolean>(false);
}
