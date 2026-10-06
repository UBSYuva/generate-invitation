import { Directive, ElementRef, HostListener, Optional, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TransliterationService } from '../services/transliteration.service';

@Directive({
  selector: 'input[type="text"]:not([noAutoGujarati]), textarea:not([noAutoGujarati]), input:not([type]):not([noAutoGujarati])',
  standalone: true
})
export class AutoGujaratiDirective {
  private el = inject(ElementRef);
  private translitService = inject(TransliterationService);
  @Optional() private ngControl = inject(NgControl, { optional: true });

  @HostListener('keydown', ['$event'])
  async onKeyDown(event: KeyboardEvent) {
    if (!this.translitService.isAutoTransliterateEnabled) {
      return;
    }

    // Trigger word transliteration when user types Space, Enter, comma, or period
    if (event.key === ' ' || event.key === 'Enter' || event.key === ',' || event.key === '.') {
      const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
      const cursorPos = input.selectionStart || 0;
      const text = input.value || '';

      // Find the word immediately preceding the cursor
      const textBeforeCursor = text.substring(0, cursorPos);
      const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

      if (match && match[1]) {
        const englishWord = match[1];
        const wordStart = cursorPos - englishWord.length;

        // Prevent default space/key insertion temporarily so we can place it cleanly
        event.preventDefault();

        // 1. Instant synchronous transliteration (0ms latency)
        let gujaratiWord = this.translitService.transliterateSync(englishWord);

        const newTextBeforeCursor = textBeforeCursor.substring(0, wordStart) + gujaratiWord + event.key;
        const textAfterCursor = text.substring(cursorPos);
        const updatedFullText = newTextBeforeCursor + textAfterCursor;

        this.updateValue(updatedFullText);

        const newCursorPos = newTextBeforeCursor.length;
        setTimeout(() => {
          input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);

        // 2. Async check with Google Input Tools API in case it has an even better dictionary candidate
        this.translitService.transliterateWord(englishWord).then((improved) => {
          if (improved && improved !== gujaratiWord) {
            const currentVal = input.value;
            // Only replace if the user hasn't drastically changed that part
            if (currentVal.includes(gujaratiWord)) {
              const refinedVal = currentVal.replace(gujaratiWord, improved);
              const currentCursor = input.selectionStart;
              this.updateValue(refinedVal);
              setTimeout(() => {
                input.setSelectionRange(currentCursor, currentCursor);
              }, 0);
            }
          }
        });
      }
    }
  }

  @HostListener('blur')
  async onBlur() {
    if (!this.translitService.isAutoTransliterateEnabled) {
      return;
    }

    const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const currentVal = input.value || '';

    // If there is any remaining English word in the input on blur, transliterate it
    if (/[a-zA-Z]/.test(currentVal)) {
      const converted = await this.translitService.transliterateText(currentVal);
      if (converted && converted !== currentVal) {
        this.updateValue(converted);
      }
    }
  }

  private updateValue(val: string) {
    const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    input.value = val;

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(val);
      this.ngControl.control.markAsDirty();
    } else {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
