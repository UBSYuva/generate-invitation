import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-deity-ganesha',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="ganpati-root" 
      [style.width.px]="effectiveWidth()" 
      [style.height.px]="effectiveHeight()"
      id="deity-ganesha-card-frame"
    >
      <!-- Divine Sunburst Halo Aura Behind the Mandir Arch -->
      <svg class="ganpati-bg-aura" viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="gpAura" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#fff9c4" stop-opacity="0.95" />
            <stop offset="55%" stop-color="#ffe082" stop-opacity="0.6" />
            <stop offset="85%" stop-color="#ffb300" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#ff8f00" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="55" cy="54" r="50" fill="url(#gpAura)" />
      </svg>

      <!-- Seated Lord Ganesha Photo in Arched Mandir Portal -->
      <div class="ganpati-photo-viewport">
        <img 
          src="images/ganesh-idol.jpg" 
          alt="શ્રી ગણેશાય નમઃ" 
          class="ganpati-idol-image"
          referrerpolicy="no-referrer"
          crossorigin="anonymous"
        />
        <div class="ganpati-inner-vignette"></div>
      </div>

      <!-- Sacred Gold Filigree Mandir Arch, Kalash Apex, & Lotus Peetham Base -->
      <svg class="ganpati-frame-overlay" viewBox="0 0 110 128" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Rich Royal Gold Gradient -->
          <linearGradient id="gpGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff9c4" />
            <stop offset="25%" stop-color="#ffd54f" />
            <stop offset="60%" stop-color="#ff8f00" />
            <stop offset="85%" stop-color="#e65100" />
            <stop offset="100%" stop-color="#b8860b" />
          </linearGradient>

          <!-- Golden Highlight -->
          <linearGradient id="gpShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffd54f" />
            <stop offset="50%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#ffb300" />
          </linearGradient>

          <filter id="gpDropShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.8" stdDeviation="1.5" flood-color="#3e2723" flood-opacity="0.4" />
          </filter>
        </defs>

        <!-- Top Apex Kalash with Coconut and Mango Leaves -->
        <g filter="url(#gpDropShadow)">
          <path d="M55 2 L56.8 6 L53.2 6 Z" fill="url(#gpShine)" />
          <circle cx="55" cy="7.5" r="2.2" fill="url(#gpGoldGrad)" />
          <path d="M50 12.5 C52 9.5 58 9.5 60 12.5 Z" fill="url(#gpGoldGrad)" />
        </g>

        <!-- Outer Ornamental Archway Rim -->
        <g filter="url(#gpDropShadow)">
          <!-- Outer Arch Silhouette -->
          <path 
            d="M 13 54 C 13 27 31 12 55 12 C 79 12 97 27 97 54 L 97 106 C 97 110 93 114 88 114 L 22 114 C 17 114 13 110 13 106 Z" 
            stroke="url(#gpGoldGrad)" 
            stroke-width="2.6" 
            fill="none" 
          />
          <!-- Bright Gold Center Filament -->
          <path 
            d="M 15 54 C 15 28.5 32.5 14 55 14 C 77.5 14 95 28.5 95 54 L 95 105 C 95 108.5 92 112 87.5 112 L 22.5 112 C 18 112 15 108.5 15 105 Z" 
            stroke="url(#gpShine)" 
            stroke-width="0.9" 
            fill="none" 
            stroke-opacity="0.85" 
          />
          <!-- Dotted Temple Pearl Border -->
          <path 
            d="M 17.5 54 C 17.5 30.5 34 16.5 55 16.5 C 76 16.5 92.5 30.5 92.5 54 L 92.5 103 C 92.5 106 90 109 86 109 L 24 109 C 20 109 17.5 106 17.5 103 Z" 
            stroke="url(#gpGoldGrad)" 
            stroke-width="0.75" 
            stroke-dasharray="1.2 1.8" 
            fill="none" 
          />
        </g>

        <!-- Ornate Sculpted Lotus Peetham (Pedestal) at Base -->
        <g filter="url(#gpDropShadow)">
          <!-- Base plinth -->
          <path d="M 16 113 C 28 123 55 126 82 123 C 90 120 94 116 94 113 C 78 111 32 111 16 113 Z" fill="url(#gpGoldGrad)" stroke="#8d6e63" stroke-width="0.5" />
          <!-- Central Lotus Petal -->
          <path d="M 55 127 C 49 121 47 114 55 109 C 63 114 61 121 55 127 Z" fill="url(#gpShine)" stroke="#e65100" stroke-width="0.5" />
          <!-- Left Petals -->
          <path d="M 42 125 C 37 120 38 113 46 111 C 51 115 49 122 42 125 Z" fill="url(#gpGoldGrad)" stroke="#e65100" stroke-width="0.5" />
          <path d="M 30 121 C 26 117 28 112 36 111 C 40 114 38 119 30 121 Z" fill="url(#gpGoldGrad)" stroke="#e65100" stroke-width="0.5" />
          <!-- Right Petals -->
          <path d="M 68 125 C 73 120 72 113 64 111 C 59 115 61 122 68 125 Z" fill="url(#gpGoldGrad)" stroke="#e65100" stroke-width="0.5" />
          <path d="M 80 121 C 84 117 82 112 74 111 C 70 114 72 119 80 121 Z" fill="url(#gpGoldGrad)" stroke="#e65100" stroke-width="0.5" />
        </g>
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .ganpati-root {
      position: relative;
      display: inline-block;
      overflow: visible;
      margin: 0 auto;
    }

    .ganpati-bg-aura {
      position: absolute;
      top: -2%;
      left: -2%;
      width: 104%;
      height: 104%;
      pointer-events: none;
      z-index: 0;
    }

    .ganpati-photo-viewport {
      position: absolute;
      top: 8.5%;
      left: 12.2%;
      width: 75.6%;
      height: 79.5%;
      border-radius: 46% 46% 6px 6px;
      overflow: hidden;
      z-index: 1;
      background: #18151f;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
    }

    .ganpati-idol-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      display: block;
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }

    .ganpati-inner-vignette {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      box-shadow: inset 0 0 10px rgba(255, 179, 0, 0.2), inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    .ganpati-frame-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }
  `]
})
export class DeityGanesha {
  size = input<number>(90);
  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);

  effectiveWidth = computed(() => this.width() ?? this.size());
  effectiveHeight = computed(() => this.height() ?? Math.round((this.width() ?? this.size()) * 1.066));
}
