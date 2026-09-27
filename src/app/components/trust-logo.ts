import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-trust-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="trust-logo-container inline-flex flex-col items-center">
      @if (isWatermark()) {
        <!-- ================= AUTHENTIC WATERMARK SEAL (MATCHING REFERENCE SCAN) ================= -->
        <svg 
          [attr.width]="size()" 
          [attr.height]="size()" 
          viewBox="0 0 160 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          class="trust-logo-svg watermark-svg"
          [style.color]="watermarkColor()"
        >
          <defs>
            <!-- 250-degree upper arc embracing left, top, and right flanks around the image -->
            <path id="wmTopArc" d="M 31.7 113.8 A 59 59 0 1 1 128.3 113.8" fill="none" />
            <!-- 110-degree lower arc embracing the bottom area around the image -->
            <path id="wmBottomArc" d="M 128.3 113.8 A 59 59 0 0 1 31.7 113.8" fill="none" />
            <clipPath [id]="clipId">
              <circle cx="80" cy="80" r="41.5" />
            </clipPath>
          </defs>

          <!-- Outer concentric border rings matching scanned invitation -->
          <circle cx="80" cy="80" r="77" fill="none" stroke="currentColor" stroke-width="1.1" />
          <circle cx="80" cy="80" r="73.5" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1.8 2.8" />
          <circle cx="80" cy="80" r="70.5" fill="none" stroke="currentColor" stroke-width="0.9" />

          <!-- Circular Text Band in Gujarati surrounding all perimeter area around the idol -->
          <text font-family="'Mukta Vaani', 'Noto Sans Gujarati', 'Anek Gujarati', sans-serif" font-size="9.2" font-weight="700" fill="currentColor" letter-spacing="1.4" word-spacing="3.5">
            <textPath href="#wmTopArc" startOffset="50%" text-anchor="middle">
              ❖  શ્રી ઉનેવાળ બ્રહ્મસમાજ  ❖
            </textPath>
          </text>

          <text font-family="'Mukta Vaani', 'Noto Sans Gujarati', 'Anek Gujarati', sans-serif" font-size="9" font-weight="700" fill="currentColor" letter-spacing="1.8" word-spacing="3">
            <textPath href="#wmBottomArc" startOffset="50%" text-anchor="middle">
              ❖ • વડોદરા • ❖
            </textPath>
          </text>

          <!-- Inner concentric rings -->
          <circle cx="80" cy="80" r="47.5" fill="none" stroke="currentColor" stroke-width="0.9" />
          <circle cx="80" cy="80" r="44.5" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1.8 2.8" />
          <circle cx="80" cy="80" r="41.5" fill="none" stroke="currentColor" stroke-width="1.1" />

          <!-- Three Radial Dots at Bottom as shown in reference scan -->
          <circle cx="80" cy="151" r="1.3" fill="currentColor" />
          <circle cx="80" cy="154.5" r="1.3" fill="currentColor" />
          <circle cx="80" cy="158" r="1.3" fill="currentColor" />

          <!-- Center Kankai (Kanakeshwari Mataji) Idol Image from Header using all inner area -->
          <g [attr.clip-path]="'url(#' + clipId + ')'">
            <!-- Subtle divine radiant glow behind Mataji -->
            <circle cx="80" cy="80" r="41.5" fill="currentColor" fill-opacity="0.04" />
            
            <image 
              href="images/kanakeshwari-mataji.png" 
              x="39" 
              y="38" 
              width="82" 
              height="84" 
              preserveAspectRatio="xMidYMid meet"
              class="wm-kankai-idol"
            />
          </g>
        </svg>
      } @else {
        <!-- Standard Full-Color Trust Logo -->
        <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" class="trust-logo-svg">
          <defs>
            <!-- Soft Golden-Cream Glow -->
            <radialGradient id="trustGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="65%" stop-color="#fffdf7" />
              <stop offset="100%" stop-color="#fdfbf0" />
            </radialGradient>

            <!-- Bronze / Gold Outer Rim -->
            <linearGradient id="trustBronze" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#c5a059" />
              <stop offset="50%" stop-color="#8d6e3f" />
              <stop offset="100%" stop-color="#5d4037" />
            </linearGradient>

            <!-- Golden Leaf Gradient -->
            <linearGradient id="treeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff9c4" />
              <stop offset="40%" stop-color="#ffe082" />
              <stop offset="100%" stop-color="#cfb584" />
            </linearGradient>

            <!-- Hands Silver / Soft Pearl -->
            <linearGradient id="handGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#cfd8dc" />
              <stop offset="50%" stop-color="#eceff1" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>

            <!-- Arc paths for text wrapping -->
            <path id="trustTopArc" d="M 22 80 A 58 58 0 1 1 138 80" fill="none" />
            <path id="trustBottomArc" d="M 138 80 A 58 58 0 0 1 22 80" fill="none" />
          </defs>

          <!-- Outer edge -->
          <circle cx="80" cy="80" r="77" fill="#fffefb" stroke="url(#trustBronze)" stroke-width="2.2" />
          
          <!-- Beaded golden pearls ring -->
          <circle cx="80" cy="80" r="72" fill="none" stroke="#b78103" stroke-width="1" stroke-dasharray="1.5 3" />
          
          <!-- Inner ring border for text band -->
          <circle cx="80" cy="80" r="70" fill="none" stroke="url(#trustBronze)" stroke-width="1.2" />
          <circle cx="80" cy="80" r="47" fill="url(#trustGlow)" stroke="url(#trustBronze)" stroke-width="1.4" />

          <!-- Curved Circular Text -->
          <text font-family="'Cinzel', 'Poppins', serif, sans-serif" font-size="7.6" font-weight="800" [attr.fill]="textColor()" letter-spacing="0.6">
            <textPath href="#trustTopArc" startOffset="50%" text-anchor="middle">
              SHREE UNEWAL BRAHMA SAMAJ SEVA TRUST
            </textPath>
          </text>

          <text font-family="'Cinzel', 'Poppins', serif, sans-serif" font-size="8.4" font-weight="800" [attr.fill]="textColor()" letter-spacing="1.8">
            <textPath href="#trustBottomArc" startOffset="50%" text-anchor="middle">
              ••• VADODARA •••
            </textPath>
          </text>

          <!-- Sacred Tree / Lotus Spray (Kalpavriksha) -->
          <g transform="translate(80, 80)">
            <path d="M0 -34 C-3 -42 0 -47 0 -47 C0 -47 3 -42 0 -34 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />
            <path d="M-8 -32 C-14 -38 -12 -44 -12 -44 C-12 -44 -7 -40 -8 -32 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />
            <path d="M8 -32 C14 -38 12 -44 12 -44 C12 -44 7 -40 8 -32 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />

            <path d="M-16 -24 C-24 -28 -25 -34 -25 -34 C-25 -34 -18 -32 -16 -24 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />
            <path d="M16 -24 C24 -28 25 -34 25 -34 C25 -34 18 -32 16 -24 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />

            <path d="M-22 -14 C-31 -16 -33 -22 -33 -22 C-33 -22 -26 -19 -22 -14 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />
            <path d="M22 -14 C31 -16 33 -22 33 -22 C33 -22 26 -19 22 -14 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />

            <path d="M-24 -2 C-34 -3 -37 -8 -37 -8 C-37 -8 -29 -7 -24 -2 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />
            <path d="M24 -2 C34 -3 37 -8 37 -8 C37 -8 29 -7 24 -2 Z" fill="url(#treeLeaf)" stroke="#b78103" stroke-width="0.5" />

            <circle cx="-20" cy="-30" r="1.5" fill="#ffd54f" stroke="#b78103" stroke-width="0.3" />
            <circle cx="20" cy="-30" r="1.5" fill="#ffd54f" stroke="#b78103" stroke-width="0.3" />
            <circle cx="-30" cy="-12" r="1.5" fill="#ffd54f" stroke="#b78103" stroke-width="0.3" />
            <circle cx="30" cy="-12" r="1.5" fill="#ffd54f" stroke="#b78103" stroke-width="0.3" />
          </g>

          <!-- Two Benevolent Cupped Hands at bottom -->
          <g transform="translate(80, 80)">
            <path d="M-4 34 C-12 33 -28 26 -32 10 C-33 6 -29 6 -28 10 C-25 21 -15 26 -4 28 Z" fill="url(#handGrad)" stroke="#78909c" stroke-width="0.6" />
            <path d="M-28 10 C-27 16 -20 22 -8 24 M-32 14 C-28 20 -18 24 -6 26" stroke="#b0bec5" stroke-width="0.5" fill="none" />

            <path d="M4 34 C12 33 28 26 32 10 C33 6 29 6 28 10 C25 21 15 26 4 28 Z" fill="url(#handGrad)" stroke="#78909c" stroke-width="0.6" />
            <path d="M28 10 C27 16 20 22 8 24 M32 14 C28 20 18 24 6 26" stroke="#b0bec5" stroke-width="0.5" fill="none" />

            <path d="M-10 32 C-4 35 4 35 10 32 L8 38 C4 40 -4 40 -8 38 Z" fill="url(#handGrad)" stroke="#78909c" stroke-width="0.6" />
          </g>

          <!-- Center Miniature Maa Kanakeshwari Idol -->
          <g transform="translate(80, 72) scale(0.38)">
            <g transform="translate(-65, -78)">
              <circle cx="65" cy="40" r="28" fill="#ffe082" opacity="0.6" />
              <path d="M48 132 C55 122 75 120 95 125 C98 132 90 140 70 140 C52 140 48 136 48 132 Z" fill="#3e2723" />
              <path d="M22 126 C18 116 26 106 38 106 C46 106 52 112 50 124 C46 134 32 136 22 126 Z" fill="#ffb300" stroke="#b78103" stroke-width="0.8" />
              <ellipse cx="38" cy="110" rx="8" ry="7" fill="#ff9800" />
              <circle cx="36" cy="107" r="1.5" fill="#212121" />

              <path d="M46 78 C42 90 40 108 42 126 C50 130 68 132 80 126 C82 108 80 90 76 78 Z" fill="#d32f2f" stroke="#b71c1c" stroke-width="1" />
              <path d="M42 124 C52 128 70 128 80 124" stroke="#ffd700" stroke-width="3" fill="none" />
              <path d="M52 60 C48 64 48 74 52 78 C58 80 66 80 72 78 C76 74 76 64 72 60 Z" fill="#2e7d32" />

              <ellipse cx="63" cy="48" rx="9" ry="10" fill="#fff8e1" stroke="#ffcc80" stroke-width="0.6" />
              <circle cx="59" cy="48" r="1.4" fill="#212121" />
              <circle cx="67" cy="48" r="1.4" fill="#212121" />
              <circle cx="63" cy="44" r="1.8" fill="#d50000" />
              <path d="M52 38 C54 22 62 15 63 15 C64 15 72 22 74 38 Z" fill="#ffd54f" stroke="#b78103" stroke-width="1.2" />
              <circle cx="63" cy="24" r="2.2" fill="#d50000" />

              <path d="M86 31 L60 22 C50 20 48 16 46 14 C56 16 75 22 88 30 Z" fill="#ffd54f" stroke="#b78103" stroke-width="1" />
              <line x1="92" y1="36" x2="68" y2="136" stroke="#ffd54f" stroke-width="3" />
            </g>
          </g>
        </svg>
      }

      <!-- Optional Subtitle below emblem -->
      @if (showTextBelow() && !isWatermark()) {
        <div class="trust-logo-label text-center mt-1.5 leading-tight">
          <div class="font-bold text-[11px] tracking-wide" [style.color]="textColor()">
            SHREE UNEWAL BRAHMA SAMAJ SEVA TRUST
          </div>
          <div class="font-bold text-[10px] tracking-widest text-[#8d6e3f] mt-0.5">
            —— VADODARA ——
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .trust-logo-container {
      position: relative;
    }

    .wm-kankai-idol {
      opacity: 0.82;
      filter: contrast(0.95) brightness(1.06);
      transform-origin: center center;
    }
  `]
})
export class TrustLogo {
  size = input<number>(75);
  textColor = input<string>('#1565c0');
  showTextBelow = input<boolean>(false);
  isWatermark = input<boolean>(false);
  watermarkColor = input<string>('#e65100');

  readonly clipId = 'kankaiClip-' + Math.random().toString(36).substring(2, 9);
}

