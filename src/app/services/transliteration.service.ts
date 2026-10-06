import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransliterationService {
  private cache = new Map<string, string>();
  private pendingRequests = new Map<string, Promise<string>>();
  public isAutoTransliterateEnabled = true;

  // Well-known Gujarati dictionary of common names, surnames, cities, titles, and words
  private readonly staticDictionary: Record<string, string> = {
    // Common first names
    'urvesh': 'ઉર્વેશ',
    'urvish': 'ઉર્વિશ',
    'ankit': 'અંકિત',
    'rajendra': 'રાજેન્દ્ર',
    'rajendrabhai': 'રાજેન્દ્રભાઈ',
    'ashok': 'અશોક',
    'ashokkumar': 'અશોકકુમાર',
    'ashokbhai': 'અશોકભાઈ',
    'ramesh': 'રમેશ',
    'rameshbhai': 'રમેશભાઈ',
    'tejas': 'તેજસ',
    'bipin': 'બિપીન',
    'bipinchandra': 'બિપીનચંદ્ર',
    'manish': 'મનિષ',
    'dharmesh': 'ધર્મેશ',
    'dharmeshbhai': 'ધર્મેશભાઈ',
    'himanshu': 'હિમાંશુ',
    'gaurang': 'ગૌરાંગ',
    'heena': 'હિના',
    'hina': 'હિના',
    'mukund': 'મુકુંદ',
    'mukundbhai': 'મુકુંદભાઈ',
    'chetan': 'ચેતન',
    'ashish': 'આશિષ',
    'keyur': 'કેયુર',
    'nikul': 'નિકુલ',
    'jaydev': 'જયદેવ',
    'devila': 'દેવીલા',
    'devilaben': 'દેવીલાબેન',
    'geeta': 'ગીતા',
    'geetaben': 'ગીતાબેન',
    'neeta': 'નીતા',
    'neetaben': 'નીતાબેન',
    'chaitali': 'ચૈતાલી',
    'chaitaliben': 'ચૈતાલીબેન',
    'karuna': 'કરુણા',
    'karunaben': 'કરુણાબેન',
    'haresh': 'હરેશ',
    'hareshbhai': 'હરેશભાઈ',
    'hareshkumar': 'હરેશકુમાર',
    'amrutlal': 'અમૃતલાલ',
    'shashikant': 'શશિકાન્ત',
    'kishorilal': 'કિશોરીલાલ',
    'suryakant': 'સૂર્યકાન્ત',
    'jyotindra': 'જ્યોતિન્દ્ર',
    'jyotindrabhai': 'જ્યોતિન્દ્રભાઈ',
    'bhaskar': 'ભાસ્કર',
    'bhaskarbhai': 'ભાસ્કરભાઈ',
    'jayesh': 'જયેશ',
    'jayeshbhai': 'જયેશભાઈ',
    'manubhai': 'મનુભાઈ',
    'mitesh': 'મિતેશ',
    'miteshbhai': 'મિતેશભાઈ',
    'ranjitsinh': 'રણજીતસિંહ',
    'dakshaben': 'દક્ષાબેન',
    'mridula': 'મૃદુલા',
    'mridulaben': 'મૃદુલાબેન',
    'vidyaben': 'વિદ્યાબેન',
    'bharat': 'ભરત',
    'bharatbhai': 'ભરતભાઈ',
    'jaimin': 'જૈમીન',
    'nitin': 'નિતિન',
    'nitinbhai': 'નિતિનભાઈ',
    'sudhaben': 'સુધાબેન',
    'navinchandra': 'નવીનચંદ્ર',
    'parth': 'પાર્થ',
    'kalpesh': 'કલ્પેશ',
    'kalpeshkumar': 'કલ્પેશકુમાર',
    'nalin': 'નલિન',
    'nalinbhai': 'નલિનભાઈ',
    'sunil': 'સુનિલ',
    'sunilbhai': 'સુનિલભાઈ',
    'hemu': 'હેમુ',
    'hemuben': 'હેમુબેન',
    'anil': 'અનિલ',
    'anilbhai': 'અનિલભાઈ',
    'bhishmaraj': 'ભિષ્મરાજ',
    'dhaval': 'ધવલ',
    'prahlad': 'પ્રહલાદ',
    'prahladbhai': 'પ્રહલાદભાઈ',
    'dattesh': 'દત્તેશ',
    'datteshkumar': 'દત્તેશકુમાર',
    'balkrishna': 'બાલકૃષ્ણ',
    'ketan': 'કેતન',
    'dinesh': 'દિનેશ',
    'dineshbhai': 'દિનેશભાઈ',
    'nirav': 'નિરવ',
    'jagdish': 'જગદીશ',
    'jagdishbhai': 'જગદીશભાઈ',
    'harshad': 'હર્ષદ',
    'harshadbhai': 'હર્ષદભાઈ',
    'vasantlal': 'વસંતલાલ',
    'mahesh': 'મહેશ',
    'maheshbhai': 'મહેશભાઈ',
    'maheshkumar': 'મહેશકુમાર',
    'jashumati': 'જશુમતી',
    'jashumatiben': 'જશુમતીબેન',
    'atul': 'અતુલ',
    'atulbhai': 'અતુલભાઈ',
    'nimesh': 'નિમેષ',
    'nimeshkumar': 'નિમેષકુમાર',
    'nimeshbhai': 'નિમેષભાઈ',
    'yashoda': 'યશોદા',
    'yashodaben': 'યશોદાબેન',
    'paresh': 'પરેશ',
    'shanta': 'શાંતા',
    'shantaben': 'શાંતાબેન',
    'shankarlal': 'શંકરલાલ',
    'tanuja': 'તનુજા',
    'tanujaben': 'તનુજાબેન',
    'pravin': 'પ્રવીણ',
    'pravinbhai': 'પ્રવીણભાઈ',
    'rajnikant': 'રજનીકાન્ત',
    'satyam': 'સત્યમ',
    'gopal': 'ગોપાલ',
    'gopalbhai': 'ગોપાલભાઈ',
    'kanaiyalal': 'કનૈયાલાલ',
    'neela': 'નીલા',
    'neelaben': 'નીલાબેન',
    'gautam': 'ગૌતમ',
    'sarla': 'સરલા',
    'sarlaben': 'સરલાબેન',
    'satish': 'સતીશ',
    'satishbhai': 'સતીશભાઈ',
    'bhavna': 'ભાવના',
    'bhavnaben': 'ભાવનાબેન',
    'yogesh': 'યોગેશ',
    'yogeshbhai': 'યોગેશભાઈ',
    'shailesh': 'શૈલેષ',
    'shaileshbhai': 'શૈલેષભાઈ',
    'milind': 'મિલિન્દ',
    'milindbhai': 'મિલિન્દભાઈ',
    'rekha': 'રેખા',
    'rekhaben': 'રેખાબેન',
    'manoj': 'મનોજ',
    'manojbhai': 'મનોજભાઈ',
    'ambika': 'અંબિકા',
    'divya': 'દિવ્યા',

    // Surnames / Castes
    'bhatt': 'ભટ્ટ',
    'pandya': 'પંડ્યા',
    'joshi': 'જોષી',
    'shukla': 'શુકલ',
    'shukal': 'શુકલ',
    'vyas': 'વ્યાસ',
    'pathak': 'પાઠક',
    'purohit': 'પુરોહિત',
    'jani': 'જાની',
    'mehta': 'મહેતા',
    'thakar': 'ઠાકર',
    'thakor': 'ઠાકોર',
    'patel': 'પટેલ',
    'shah': 'શાહ',
    'parikh': 'પરીખ',
    'modi': 'મોદી',
    'desai': 'દેસાઈ',
    'upadhyay': 'ઉપાધ્યાય',
    'adhvaryu': 'અધ્વર્યુ',
    'adhwaryu': 'અધ્વર્યુ',
    'gohil': 'ગોહિલ',

    // Titles & Suffixes
    'shree': 'શ્રી',
    'shri': 'શ્રી',
    'shreemati': 'શ્રીમતી',
    'smt': 'શ્રીમતી',
    'bhai': 'ભાઈ',
    'ben': 'બેન',
    'kumar': 'કુમાર',
    'lal': 'લાલ',
    'ji': 'જી',
    'sw': 'સ્વ.',
    'swargiy': 'સ્વર્ગીય',
    'colonel': 'કર્નલ',
    'dr': 'ડૉ.',
    'doctor': 'ડૉક્ટર',
    'pramukh': 'પ્રમુખશ્રી',
    'upapramukh': 'ઉપપ્રમુખશ્રી',
    'mantri': 'મંત્રી',
    'sahmantri': 'સહમંત્રી',
    'mahamantri': 'મહામંત્રી',
    'khajanchi': 'ખજાનચી',
    'trustee': 'ટ્રસ્ટી',

    // Cities & Towns
    'vadodara': 'વડોદરા',
    'baroda': 'વડોદરા',
    'surat': 'સુરત',
    'ahmedabad': 'અમદાવાદ',
    'amdavad': 'અમદાવાદ',
    'rajkot': 'રાજકોટ',
    'bhavnagar': 'ભાવનગર',
    'jamnagar': 'જામનગર',
    'junagadh': 'જુનાગઢ',
    'gandhinagar': 'ગાંધીનગર',
    'anand': 'આણંદ',
    'nadiad': 'નડિયાદ',
    'bharuch': 'ભરૂચ',
    'ankleshwar': 'અંકલેશ્વર',
    'navsari': 'નવસારી',
    'valsad': 'વલસાડ',
    'vapi': 'વાપી',
    'zagadia': 'ઝઘડીયા',
    'zagadiya': 'ઝઘડીયા',
    'olpad': 'ઓલપાડ',
    'kalali': 'કલાલી',
    'shuklatirth': 'શુક્લતીર્થ',
    'motahabipura': 'મોટாஹબીપુરા',
    'vidyanagar': 'વિધાનગર',
    'vemar': 'વેમાર',
    'matar': 'માતર',
    'mumbai': 'મુંબઈ',
    'bombay': 'મુંબઈ',
    'delhi': 'દિલ્હી',
    'pune': 'પુણે',
    'uk': 'યુ.કે.',
    'usa': 'યુ.એસ.એ',
    'canada': 'કેનેડા',
    'africa': 'આફ્રિકા',

    // Religious, Organization & Event Words
    'namah': 'નમઃ',
    'prasanadastu': 'પ્રસન્નાડસ્તુ',
    'jay': 'જય',
    'ganesh': 'ગણેશ',
    'ganeshay': 'ગણેશાય',
    'kanakeshwari': 'કનકેશ્વરી',
    'kanakai': 'કનકાઈ',
    'mahakal': 'મહાકાલ',
    'shiv': 'શિવ',
    'om': 'ૐ',
    'shubh': 'શુભ',
    'sthal': 'સ્થળ',
    'trust': 'ટ્રસ્ટ',
    'seva': 'સેવા',
    'brahmsamaj': 'બ્રહ્મસમાજ',
    'samaj': 'સમાજ',
    'uneval': 'ઉનેવાળ',
    'aayojit': 'આયોજિત',
    'prerit': 'પ્રેરિત',
    'navratri': 'નવરાત્રી',
    'mahotsav': 'મહોત્સવ',
    'garba': 'ગરબા',
    'havan': 'હવન',
    'karyakram': 'કાર્યક્રમ',
    'sanskrutik': 'સાંસ્કૃતિક',
    'mahaprasad': 'મહાપ્રસાદ',
    'alpahar': 'અલ્પાહાર',
    'samvat': 'સંવત',
    'aaso': 'આસો',
    'sud': 'સુદ',
    'vad': 'વદ',
    'ravivar': 'રવિવાર',
    'somvar': 'સોમવાર',
    'mangalvar': 'મંગળવાર',
    'budhvar': 'બુધવાર',
    'guruvar': 'ગુરુવાર',
    'shukravar': 'શુક્રવાર',
    'shanivar': 'શનિવાર',
    'tarikh': 'તા.',
    'ta': 'તા.',
    'samay': 'સમય',
    'bapore': 'બપોરે',
    'sanje': 'સાંજે',
    'raatre': 'રાત્રે',
    'savare': 'સવારે',
    'kalake': 'કલાકે',
    'prasadi': 'પ્રસાદી',
    'dan': 'દાન',
    'bhet': 'ભેટ',
    'aapanar': 'આપનાર',
    'dnor': 'દાતા',
    'yajman': 'યજમાન',
    'karobari': 'કારોબારી',
    'samiti': 'સમિતિ',
    'karyalay': 'કાર્યાલય'
  };

  constructor() {
    // Populate static dictionary into cache
    for (const [key, val] of Object.entries(this.staticDictionary)) {
      this.cache.set(key.toLowerCase(), val);
    }

    // Load any persisted cache from localStorage
    try {
      const saved = localStorage.getItem('gujarati_translit_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'string') {
            this.cache.set(k.toLowerCase(), v);
          }
        }
      }

      const pref = localStorage.getItem('gujarati_auto_transliterate');
      if (pref !== null) {
        this.isAutoTransliterateEnabled = pref === 'true';
      }
    } catch (e) {
      console.warn('Could not load translit cache', e);
    }
  }

  toggleAutoTransliterate(): boolean {
    this.isAutoTransliterateEnabled = !this.isAutoTransliterateEnabled;
    try {
      localStorage.setItem('gujarati_auto_transliterate', String(this.isAutoTransliterateEnabled));
    } catch {}
    return this.isAutoTransliterateEnabled;
  }

  private saveCache() {
    try {
      const obj: Record<string, string> = {};
      let count = 0;
      for (const [k, v] of this.cache.entries()) {
        obj[k] = v;
        if (++count > 2000) break; // keep cache reasonable
      }
      localStorage.setItem('gujarati_translit_cache', JSON.stringify(obj));
    } catch {}
  }

  /**
   * Transliterate a single English word into Gujarati.
   * Uses memory cache -> Google Input Tools online API -> offline phonetic engine fallback.
   */
  async transliterateWord(word: string): Promise<string> {
    if (!word || !/[a-zA-Z]/.test(word)) {
      return word;
    }

    const cleanWord = word.trim();
    const lower = cleanWord.toLowerCase();

    // 1. Check local cache
    if (this.cache.has(lower)) {
      return this.cache.get(lower)!;
    }

    // 2. Check pending requests
    if (this.pendingRequests.has(lower)) {
      return this.pendingRequests.get(lower)!;
    }

    // 3. Try Google Input Tools transliteration API
    const requestPromise = (async () => {
      try {
        const url = `https://inputtools.google.com/request?text=${encodeURIComponent(cleanWord)}&itc=gu-t-i0-und&num=1`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json && json[0] === 'SUCCESS' && json[1] && json[1][0] && json[1][0][1] && json[1][0][1][0]) {
            const gujaratiWord = json[1][0][1][0];
            this.cache.set(lower, gujaratiWord);
            this.saveCache();
            return gujaratiWord;
          }
        }
      } catch (e) {
        // network offline or blocked, fallback gracefully
      }

      // 4. Fallback to algorithmic Indic phonetic transliterator
      const fallback = this.phoneticTransliterate(cleanWord);
      this.cache.set(lower, fallback);
      return fallback;
    })();

    this.pendingRequests.set(lower, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(lower);
    }
  }

  /**
   * Transliterate full text / sentence asynchronously.
   * Retains numbers, punctuation, spaces, and existing Gujarati characters.
   */
  async transliterateText(text: string): Promise<string> {
    if (!text || !/[a-zA-Z]/.test(text)) {
      return text;
    }

    // Split text into tokens (words and non-words)
    const tokens = text.split(/([a-zA-Z]+)/);
    const resultParts: string[] = [];

    for (const token of tokens) {
      if (/[a-zA-Z]/.test(token)) {
        const transliterated = await this.transliterateWord(token);
        resultParts.push(transliterated);
      } else {
        resultParts.push(token);
      }
    }

    return resultParts.join('');
  }

  /**
   * Instant synchronous transliteration.
   * If word is in cache/dictionary, returns it immediately;
   * otherwise uses the offline phonetic engine, and fires background API call to warm cache.
   */
  transliterateSync(text: string): string {
    if (!text || !/[a-zA-Z]/.test(text)) {
      return text;
    }

    const tokens = text.split(/([a-zA-Z]+)/);
    const resultParts: string[] = [];

    for (const token of tokens) {
      if (/[a-zA-Z]/.test(token)) {
        const lower = token.toLowerCase();
        if (this.cache.has(lower)) {
          resultParts.push(this.cache.get(lower)!);
        } else {
          const phonetic = this.phoneticTransliterate(token);
          resultParts.push(phonetic);
          // Trigger async network fetch in background to improve accuracy
          this.transliterateWord(token);
        }
      } else {
        resultParts.push(token);
      }
    }

    return resultParts.join('');
  }

  /**
   * High-accuracy rule-based English to Gujarati phonetic transliterator
   */
  public phoneticTransliterate(input: string): string {
    if (!input) return '';
    const word = input.trim();
    const lower = word.toLowerCase();

    // Check direct static dict
    if (this.staticDictionary[lower]) {
      return this.staticDictionary[lower];
    }

    // Hand-crafted special patterns & clusters
    // "Urvesh" -> 'ઉર્વેશ'
    if (lower === 'urvesh') return 'ઉર્વેશ';
    if (lower === 'urvish') return 'ઉર્વિશ';

    let s = lower;
    let out = '';
    let i = 0;

    const initialVowels: Record<string, string> = {
      'aa': 'આ', 'a': 'અ', 'ee': 'ઈ', 'i': 'ઇ', 'oo': 'ઊ', 'u': 'ઉ',
      'e': 'એ', 'ai': 'ઐ', 'o': 'ઓ', 'au': 'ઔ', 'ou': 'ઔ', 'am': 'અં',
      'an': 'અં', 'ah': 'અઃ', 'ru': 'ઋ'
    };

    const matras: Record<string, string> = {
      'aa': 'ા', 'a': '', 'ee': 'ી', 'i': 'િ', 'oo': 'ૂ', 'u': 'ુ',
      'e': 'ે', 'ai': 'ૈ', 'o': 'ો', 'au': 'ૌ', 'ou': 'ૌ', 'am': 'ં',
      'an': 'ં', 'ah': 'ઃ', 'ru': 'ૃ'
    };

    const consonants: Record<string, string> = {
      'k': 'ક', 'kh': 'ખ', 'g': 'ગ', 'gh': 'ઘ', 'ng': 'ઙ',
      'ch': 'ચ', 'chh': 'છ', 'j': 'જ', 'jh': 'ઝ', 'ny': 'ઞ',
      'tt': 'ટ', 'thh': 'ઠ', 'dd': 'ડ', 'dhh': 'ઢ', 'nn': 'ણ',
      't': 'ત', 'th': 'થ', 'd': 'દ', 'dh': 'ધ', 'n': 'ન',
      'p': 'પ', 'ph': 'ફ', 'f': 'ફ', 'b': 'બ', 'bh': 'ભ', 'm': 'મ',
      'y': 'ય', 'r': 'ર', 'l': 'લ', 'v': 'વ', 'w': 'વ',
      'sh': 'શ', 'shh': 'ષ', 's': 'સ', 'h': 'હ',
      'ksh': 'ક્ષ', 'x': 'ક્ષ', 'gn': 'જ્ઞ', 'gy': 'જ્ઞ', 'tr': 'ત્ર', 'shr': 'શ્ર'
    };

    // Sort keys by length descending for greedy matching
    const consonantKeys = Object.keys(consonants).sort((a, b) => b.length - a.length);
    const vowelKeys = Object.keys(initialVowels).sort((a, b) => b.length - a.length);

    while (i < s.length) {
      // Check for standalone numbers or symbols
      if (/[0-9]/.test(s[i])) {
        out += s[i];
        i++;
        continue;
      }

      // Check if at word start or after non-consonant, vowel
      if (i === 0 || out.endsWith(' ') || out.endsWith('-')) {
        let matchedVowel = false;
        for (const vk of vowelKeys) {
          if (s.startsWith(vk, i)) {
            // Check special "urv" -> "ઉર્વ"
            if (vk === 'u' && s.startsWith('urv', i)) {
              out += 'ઉર્વ';
              i += 3;
              // Check next vowel after v
              let nextVowel = '';
              for (const nvk of vowelKeys) {
                if (s.startsWith(nvk, i)) {
                  nextVowel = nvk;
                  break;
                }
              }
              if (nextVowel) {
                out += matras[nextVowel] || '';
                i += nextVowel.length;
              }
              matchedVowel = true;
              break;
            }

            out += initialVowels[vk];
            i += vk.length;
            matchedVowel = true;
            break;
          }
        }
        if (matchedVowel) continue;
      }

      // Match consonant
      let matchedConsonant = false;
      for (const ck of consonantKeys) {
        if (s.startsWith(ck, i)) {
          let gujConsonant = consonants[ck];
          i += ck.length;

          // Check if followed by vowel
          let matchedMatra = false;
          for (const vk of vowelKeys) {
            if (s.startsWith(vk, i)) {
              out += gujConsonant + (matras[vk] !== undefined ? matras[vk] : '');
              i += vk.length;
              matchedMatra = true;
              break;
            }
          }

          if (!matchedMatra) {
            // Consonant with no vowel following: check if followed by another consonant (conjunct / halant)
            // or at the end of word (inherent 'a')
            if (i < s.length && /[a-z]/.test(s[i])) {
              // Reph check: 'r' followed by consonant (like "ar" -> ાર / ાર્ or "rv" ->  BeautifulSoup r-conjunct)
              if (ck === 'r' && i < s.length) {
                // Next consonant
                for (const nextCk of consonantKeys) {
                  if (s.startsWith(nextCk, i)) {
                    const nextGuj = consonants[nextCk];
                    i += nextCk.length;
                    // check next vowel
                    let nextMatra = '';
                    for (const nvk of vowelKeys) {
                      if (s.startsWith(nvk, i)) {
                        nextMatra = matras[nvk] || '';
                        i += nvk.length;
                        break;
                      }
                    }
                    out += nextGuj + (nextMatra || '') + 'ર્'; // or reph form
                    matchedMatra = true;
                    break;
                  }
                }
                if (matchedMatra) break;
              }

              // Halant / virama for conjunct
              out += gujConsonant + '્';
            } else {
              // Word-ending consonant has inherent 'a' sound in Gujarati
              out += gujConsonant;
            }
          }

          matchedConsonant = true;
          break;
        }
      }

      if (!matchedConsonant) {
        // Unknown or non-alphabetic character
        out += s[i];
        i++;
      }
    }

    return out;
  }
}
