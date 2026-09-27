import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-deity-mahakal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="mahakal-root" 
      [style.width.px]="effectiveWidth()" 
      [style.height.px]="effectiveHeight()"
      id="deity-mahakal-frame"
    >
      <!-- Divine Soft Celestial Aura Behind the Shivling -->
      <svg class="mahakal-bg-aura" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mkShivaAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fffde7" stop-opacity="0.95" />
            <stop offset="40%" stop-color="#fff8e1" stop-opacity="0.65" />
            <stop offset="75%" stop-color="#ffe082" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#ffd54f" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="44" fill="url(#mkShivaAura)" />
      </svg>

      <!-- Sacred Mahakal Shivling Image -->
      <div class="mahakal-img-viewport">
        <img 
          src="images/mahakal-shivling.png" 
          alt="॥ જય મહાકાલ ॥" 
          class="mahakal-idol-image"
          referrerpolicy="no-referrer"
          crossorigin="anonymous"
        />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .mahakal-root {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      margin: 0 auto;
    }

    .mahakal-bg-aura {
      position: absolute;
      top: -2%;
      left: -5%;
      width: 110%;
      height: 106%;
      pointer-events: none;
      z-index: 0;
    }

    .mahakal-img-viewport {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mahakal-idol-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center bottom;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.32));
      transition: transform 0.25s ease;
      display: block;
    }

    .mahakal-root:hover .mahakal-idol-image {
      transform: scale(1.03);
    }
  `]
})
export class DeityMahakal {
  size = input<number>(90);
  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);

  effectiveWidth = computed(() => this.width() ?? this.size());
  effectiveHeight = computed(() => this.height() ?? Math.round((this.width() ?? this.size()) * 1.066));
}


