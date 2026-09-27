import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-deity-mataji',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="mataji-root" 
      [style.width.px]="effectiveWidth()" 
      [style.height.px]="effectiveHeight()"
      id="deity-kanakeshwari-frame"
    >
      <!-- Divine Radiance Sunburst Halo Aura Behind Maa Kanakeshwari -->
      <svg class="mataji-bg-aura" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mkSunburstAura" cx="50%" cy="38%" r="52%">
            <stop offset="0%" stop-color="#fffde7" stop-opacity="0.95" />
            <stop offset="35%" stop-color="#fff59d" stop-opacity="0.7" />
            <stop offset="65%" stop-color="#ffd54f" stop-opacity="0.4" />
            <stop offset="88%" stop-color="#ffb300" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#ff8f00" stop-opacity="0" />
          </radialGradient>

          <!-- Golden Rays Gradient -->
          <linearGradient id="mkRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffd54f" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#ff8f00" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Divine Halo Glow Circle behind Head & Crown -->
        <circle cx="50" cy="42" r="38" fill="url(#mkSunburstAura)" />

        <!-- Sacred Golden Radiant Rings -->
        <circle cx="50" cy="38" r="28" stroke="#ffd54f" stroke-width="0.8" stroke-dasharray="2 3" stroke-opacity="0.6" />
        <circle cx="50" cy="38" r="33" stroke="#ffb300" stroke-width="0.5" stroke-opacity="0.4" />
        
        <!-- Divine Light Beam Flares -->
        <g stroke="url(#mkRayGrad)" stroke-width="0.75" stroke-opacity="0.5">
          <line x1="50" y1="5" x2="50" y2="18" />
          <line x1="72" y1="14" x2="63" y2="23" />
          <line x1="28" y1="14" x2="37" y2="23" />
          <line x1="83" y1="36" x2="71" y2="37" />
          <line x1="17" y1="36" x2="29" y2="37" />
        </g>
      </svg>

      <!-- Maa Kanakeshwari Sacred Idol Image -->
      <div class="mataji-img-viewport">
        <img 
          src="images/kanakeshwari-mataji.png" 
          alt="॥ શ્રી કનકેશ્વરી માતાજી પ્રસન્નાડસ્તુ ॥" 
          class="mataji-idol-image"
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

    .mataji-root {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      overflow: visible;
      margin: 0 auto;
    }

    .mataji-bg-aura {
      position: absolute;
      top: -2%;
      left: -5%;
      width: 110%;
      height: 106%;
      pointer-events: none;
      z-index: 0;
    }

    .mataji-img-viewport {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
    }

    .mataji-idol-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center bottom;
      display: block;
      filter: drop-shadow(0 3px 6px rgba(62, 39, 35, 0.38)) drop-shadow(0 1px 2px rgba(183, 28, 28, 0.2));
      transition: transform 0.25s ease;
    }

    .mataji-root:hover .mataji-idol-image {
      transform: scale(1.03);
    }
  `]
})
export class DeityMataji {
  size = input<number>(90);
  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);

  effectiveWidth = computed(() => this.width() ?? this.size());
  effectiveHeight = computed(() => this.height() ?? Math.round((this.width() ?? this.size()) * 1.066));
}
