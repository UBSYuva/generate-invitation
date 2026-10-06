import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DeityGanesha } from './components/deity-ganesha';
import { DeityMataji } from './components/deity-mataji';
import { DeityMahakal } from './components/deity-mahakal';
import { TrustLogo } from './components/trust-logo';
import { FloralBorder } from './components/floral-border';
import { AutoGujaratiDirective } from './directives/auto-gujarati.directive';
import { TransliterationService } from './services/transliteration.service';

interface Member {
  Id: string;
  Name: string;
  Address: string;
  City: string;
  Country: string;
}

interface YajmanInput {
  name: string;
  city: string;
}

interface KarobariInput {
  name: string;
  city: string;
}

interface DonorInput {
  name: string;
  city: string;
  amount: number;
}

interface TimingInput {
  title: string;
  value: string;
}

interface CommitteeMember {
  name: string;
  role: string;
}

interface CommitteeGroup {
  groupTitle: string;
  members: CommitteeMember[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DeityGanesha, DeityMataji, DeityMahakal, TrustLogo, FloralBorder, AutoGujaratiDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'generate-invite';
  translitService = inject(TransliterationService);
  isTransliteratingAll = false;
  members: Member[] = [];
  isExcelLoaded = false;
  isGeneratingPdf = false;
  pdfProgress = 0;

  @ViewChild('previewPanel') previewPanelEl!: ElementRef;
  @ViewChild('pagesContainer') pagesContainerEl!: ElementRef;

  configPanelWidth = 460;
  previewScaleTransform = 'none';
  scaledHeight: number | null = null;
  isResizing = false;
  savedConfigs: { name: string; date: string; headerConfig: any; yajmans: any[]; karobariMembers: any[]; donors: any[]; programTimings?: any[]; committeeGroups?: any[]; configSections?: string[] }[] = [];
  newConfigName: string = '';
  configSections: string[] = ['header', 'yajmans', 'committees', 'karobari', 'donors'];
  expandedSections: Record<string, boolean> = {};
  programTimings: TimingInput[] = [];
  committeeGroups: CommitteeGroup[] = [];
  draggedSectionIndex: number | null = null;
  draggedRowIndex: number | null = null;
  draggedRowType: string | null = null;
  draggedOverSectionIndex: number | null = null;
  draggedOverRowIndex: number | null = null;
  draggedOverRowType: string | null = null;

  // Search/Autocomplete Indexes
  activeYajmanSearchIndex: number | null = null;
  activeKarobariSearchIndex: number | null = null;
  activeDonorSearchIndex: number | null = null;

  // Search terms for filtering members
  yajmanSearchTerms: string[] = [];
  karobariSearchTerms: string[] = [];
  donorSearchTerms: string[] = [];

  // Config Section 1 - Header
  headerConfig = {
    trustName: 'શ્રી ઉનેવાળ બ્રહ્મસમાજ, વડોદરા',
    organizer: 'શ્રી ઉનેવાળ બ્રહ્મસમાજ સેવા ટ્રસ્ટ, વડોદરા',
    eventTitle: '૨૯ મો “નવરાત્રી મહોત્સવ” નો કાર્યક્રમ',
    samvatText: 'સંવત : ૨૦૮૧ આસો સુદ - ૧૩ ને રવિવાર : તા. ૦૫-૧૦-૨૦૨૫',
    dateText: '',
    eventIntro: 'ના રોજ રાખવામાં આવેલ છે, તો સર્વે જ્ઞાતિબંધુઓને હાજર રહેવા વિનંતી.',
    bannerText: '❖ હવન ❖ સાંસ્કૃતિક કાર્યક્રમ ❖ ગરબા મહોત્સવ ❖ સ્નેહ મિલન સંમેલન',
    havanTime: 'બપોરે ૨.૩૦ કલાકે',
    sanskrutikTime: 'બપોરે ૧.૩૦ થી ૫.૩૦ કલાકે',
    mahaprasadTime: 'સાંજે ૬.૩૦ કલાકે',
    garbaTime: 'રાત્રે ૭.૦૦ કલાકે',
    venueLabel: ': શુભ સ્થળ :',
    venueAddress: 'લાલબાગ અતિથિગૃહ, માંજલપુર, વડોદરા.',
    whatsappNote: 'દરેક કાર્યક્રમ ની પત્રિકા ફક્ત “વોટ્સ એપ” દ્વારા જ મોકલવામાં આવશે.',
    sloganText: 'જય ભવાની જય કનકાઈ',
    specialNote: '❖ ખાસ નોંધ :- શૈક્ષણિક પારિતોષિક મેળવવા ધો-૧૦ (મીનીમમ ૬૦% ગુણ સાથે), ધો-૧૨ તથા પી.ટી.સી. અને ૩ વર્ષ ડીપ્લોમા તથા સ્નાતક અને અનુસ્નાતક ડીગ્રી (મીનીમમ ૫૦% ગુણ સાથે) ની માર્કશીટ ની ઝેરોક્ષ (What\'s app પર મોકલેલ કોપી માન્ય ગણાશે નહીં) તા. ૨૮ ફેબ્રુઆરી ૨૦૨૬ સુધી કાર્યાલય પર મોકલવાની રહેશે. તા. ૨૮ ફેબ્રુઆરી ૨૦૨૬ પછી આવેલી માર્કશીટ પારિતોષિક મેળવવા માન્ય ગણાશે નહીં.',
    prasadiText: 'ડ્રાયફ્રુટ ની પ્રસાદી :- શ્રી નિમેષભાઈ હીરાલાલ જોષી - વડોદરા',
    garbaSubtitle: 'મહિલા મંડળ તેમજ યુવક મંડળ દ્વારા આયોજિત ગરબા મહોત્સવ',
    garbaGroup: '“વાત્સલ્ય ગ્રુપ” શ્રી મનોજ જોષી ગરબાની રમઝટ બોલાવશે',
    garbaPlayTime: 'સમય : રાત્રે ૭.૦૦ થી ૧૦.૦૦ કલાકે',
    whatsappUpdateNote: 'પત્રિકા ફક્ત વોટ્સ એપ ના માધ્યમથી જ મોકલવામાં આવે છે તો કોઈપણ સભાસદ ના વોટ્સ એપ નંબર સંસ્થાના રેકોર્ડમાં અપડેટ કરવાનો હોય અથવા બાકી હોય તો તે ઉપર જણાવેલ નામ ઉપર સંપર્ક કરીને અપડેટ કરાવી લેવા વિનંતી છે.    આપ સૌના સહકારની અપેક્ષા સહ',
    showPrasadi: true,
    showKarobariList: true,
    showSpecialNote: true,
    showGarbaCelebration: true,
    showWhatsappReminder: true
  };

  // Config Section 2 - Main Yajman (Dynamic Input)
  yajmans: YajmanInput[] = [
    { name: 'શ્રીમતી અંબિકા - શ્રી અંકિત રજનીકાન્ત ભટ્ટ', city: 'સુરત' },
    { name: 'શ્રીમતી દિવ્યા - શ્રી તેજસ પ્રહલાદભાઈ પંડ્યા', city: 'વડોદરા' }
  ];

  // Config Section 3 - Karobari Members (Dynamic Input)
  karobariMembers: KarobariInput[] = [
    { name: 'રાજેન્દ્રકુમાર શુકલ', city: 'વડોદરા' },
    { name: 'હરેશભાઈ વ્યાસ', city: 'વડોદરા' },
    { name: 'અમૃતલાલ જોષી', city: 'વડોદરા' },
    { name: 'શશિકાન્ત ભટ્ટ', city: 'વડોદરા' },
    { name: 'કિશોરીલાલ પંડ્યા', city: 'વડોદરા' },
    { name: 'સૂર્યકાન્ત પાઠક', city: 'વડોદરા' }
  ];

  // Config Section 4 - Donors (Dynamic Input, display ordered by amount desc)
  donors: DonorInput[] = [
    { name: 'શ્રી અશોકકુમાર અમૃતલાલ જોષી', city: 'વડોદરા', amount: 5100 },
    { name: 'શ્રી અંકિતભાઈ ભટ્ટ', city: 'સુરત', amount: 5000 },
    { name: 'શ્રી રાજેન્દ્ર રામકૃષ્ણ શુકલ', city: 'વડોદરા', amount: 3001 },
    { name: 'શ્રી જ્યોતિન્દ્રભાઈ બી. પુરોહિત', city: 'ઝઘડીયા', amount: 2100 },
    { name: 'શ્રી ભાસ્કરભાઈ મહેતા', city: 'વડોદરા', amount: 2100 },
    { name: 'શ્રી જયેશભાઈ મુકુંદભાઈ પંડ્યા', city: 'વડોદરા', amount: 2001 },
    { name: 'શ્રી તેજસ પ્રહલાદભાઈ પંડ્યા', city: 'વડોદરા', amount: 2001 },
    { name: 'કર્નલ મનુભાઈ જાની', city: 'વડોદરા', amount: 2001 },
    { name: 'શ્રી મિતેશભાઈ જીતેન્દ્રભાઈ પુરોહિત', city: 'ઝઘડીયા', amount: 1501 },
    { name: 'શ્રી રણજીતસિંહ આર. ગોહિલ', city: 'અંકલેશ્વર', amount: 1501 },
    { name: 'સ્વ. જશવિદ્યાબેન પુરૂષોત્તમ ઠાકર ના સ્મરણાર્થે - હ. રાજેન્દ્રશુકલ', city: 'વડોદરા', amount: 1501 },
    { name: 'દક્ષાબેન હરેશકુમાર વ્યાસ - હ. રાજેન્દ્ર શુકલ', city: 'યુ.કે.', amount: 1501 },
    { name: 'જય નયના ટ્રસ્ટ - હ. રાજેન્દ્ર શુકલ', city: 'કેનેડા', amount: 1501 },
    { name: 'મૃદુલાબેન રાજેશકુમાર જોષી - હ. રાજેન્દ્ર શુકલ', city: 'યુ.કે.', amount: 1501 },
    { name: 'વિદ્યાબેન ચુનીલાલ ઠાકર - હ. રાજેન્દ્ર શુકલ', city: 'યુ.કે.', amount: 1501 },
    { name: 'શ્રી ભરતભાઈ ગુણવંતરાય ઠાકર - હ. જૈમીન ઠાકર', city: 'સુરત', amount: 1501 },
    { name: 'શ્રી નિતિનભાઈ એસ. પુરોહિત', city: 'વડોદરા', amount: 1501 },
    { name: 'સ્વ. સુધાબેન નવીનચંદ્ર ઠાકર ના સ્મરણાર્થે - હ. નવીનચંદ્ર એ. ઠાકર', city: 'વડોદરા', amount: 1101 },
    { name: 'શ્રી પાર્થ કનકરાય મહેતા', city: 'કલાલી', amount: 1100 },
    { name: 'શ્રી જયેશભાઈ ગિરીજાશંકર મહેતા', city: 'વડોદરા', amount: 1100 },
    { name: 'શ્રી કલ્પેશકુમાર મદનલાલ ભટ્ટ', city: 'અંકલેશ્વર', amount: 1001 },
    { name: 'શ્રી નલિનભાઈ જેચંદલાલ ભટ્ટ', city: 'ભરૂચ', amount: 1001 },
    { name: 'શ્રી અશોકકુમાર કનૈયાલાલ ઠાકર', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી કલ્પેશ એસ. જોષી', city: 'ઓલપાડ', amount: 1001 },
    { name: 'શ્રી સુનિલભાઈ નરેન્દ્રભાઈ પુરોહિત', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી રાજેન્દ્ર ચુનીભાઈ ઠાકર - હ. રાજેન્દ્ર શુકલ', city: 'યુ.કે.', amount: 1001 },
    { name: 'શ્રી રમેશભાઈ ડાહ્યાલાલ ઠાકર', city: 'વડોદરા', amount: 1001 },
    { name: 'હેમુબેન ચુનીભાઈ ઠાકર - હ. રાજેન્દ્ર શુકલ', city: 'યુ.કે.', amount: 1001 },
    { name: 'શ્રી અનિલભાઈ સી. ઠાકર - હ. રાજેન્દ્ર શુકલ', city: 'યુ.કે.', amount: 1001 },
    { name: 'શ્રી ભિષ્મરાજ બિપીનભાઈ પટેલ - હ. રાજેન્દ્ર શુકલ', city: 'આફ્રિકા', amount: 1001 },
    { name: 'શ્રી ધવલ કનૈયાલાલ પુરોહિત', city: 'શુક્લતીર્થ', amount: 1001 },
    { name: 'શ્રી પ્રહલાદભાઈ ભોગીલાલ ભટ્ટ', city: 'મોટாஹબીપુરા', amount: 1001 },
    { name: 'શ્રી રાજેન્દ્રભાઈ અંબાલાલ પંડ્યા', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી દત્તેશકુમાર એન. પાઠક', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી બાલકૃષ્ણ / શ્રી કેતન પાઠક', city: 'વડોદરા', amount: 1001 },
    { name: 'કનકાઈ ભક્ત', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી દિનેશભાઈ રણછોડલાલ પંડ્યા', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી બિપીનભાઈ વાસુદેવભાઈ ભટ્ટ', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી નિરવ દેવેન્દ્રભાઈ પુરોહિત', city: 'શુક્લતીર્થ', amount: 1001 },
    { name: 'શ્રી જગદીશભાઈ એચ. પુરોહિત', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી હર્ષદભાઈ એચ. જોષી', city: 'વડોદરા', amount: 1001 },
    { name: 'શ્રી જ્યોતિન્દ્રભાઈ જે. ભટ્ટ', city: 'વડોદરા', amount: 1001 },
    { name: 'સ્વ. વસંતલાલ જટાશંકર ઉપાધ્યાય ના સ્મરણાર્થે - હ. મહેશભાઈ ઉપાધ્યાય', city: 'વિધાનગર', amount: 777 },
    { name: 'સ્વ. જશુમતીબેન ચુનીલાલ જોષી - હ. કિશોરીબેન અમૃતલાલ જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી અતુલભાઈ છગનલાલ જોષી', city: 'વેમાર', amount: 501 },
    { name: 'શ્રી નિમેષકુમાર કાંતિલાલ પંડ્યા', city: 'વડોદરા', amount: 501 },
    { name: 'સ્વ. યશોદાબેન કુમુદચંદ્ર ભટ્ટ ના સ્મરણાર્થે હ- કુમુદચંદ્ર ભટ્ટ', city: 'અમદાવાદ', amount: 501 },
    { name: 'શ્રી પરેશ કૃષ્ણકાંત મહેતા', city: 'સુરત', amount: 501 },
    { name: 'સ્વ. શાંતાબેન શંકરલાલ ના સ્મરણાર્થે - હ. જયેન્દ્ર એસ ઠાકર', city: 'અમદાવાદ', amount: 501 },
    { name: 'સ્વ. શંકરલાલ હરીલાલ ના સ્મરણાર્થે - હ. જયેન્દ્ર એસ. ઠાકર', city: 'અમદાવાદ', amount: 501 },
    { name: 'તનુજાબેન જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'સ્વ. પ્રવિણાભાઈ સી. જોષી ના સ્મરણાર્થે - હ. પ્રવિણાબેન પી. જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી રજનીકાન્ત જેઠાલાલ ઠાકર', city: 'માતર', amount: 501 },
    { name: 'શ્રી સત્યમ ભીખાલાલ ઠાકર', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી ગોપાલભાઈ સૂર્યકાન્તભાઈ પાઠક - હ. રાજેન્દ્ર શુકલ', city: 'યુ.એસ.એ', amount: 501 },
    { name: 'શ્રી મહેશકુમાર કાંતીલાલ પંડ્યા', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી કનૈયાલાલ વિષ્ણુપ્રસાદ જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'નીલાબેન કનૈયાલાલ જોષી હ - ગૌતમ જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'સ્વ. સરલાબેન સતીશચંદ્ર પુરોહિત ના સ્મરણાર્થે - હ. સતીશભાઈ પુરોહિત', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી ચેતનભાઈ એન. પાઠક', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી મુકુંદભાઈ ચંદ્રદેવ જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી મહેશભાઈ એન. જોષી', city: 'વડોદરા', amount: 501 },
    { name: 'ભાવનાબેન ભરતભાઈ ઠાકર', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી યોગેશભાઈ મધુસૂદન પુરોહિત', city: 'સુરત', amount: 501 },
    { name: 'શ્રી શૈલેષભાઈ રમેશચંદ્ર પુરોહિત', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી મિલિન્દભાઈ સનતકુમાર અધ્વર્યુ', city: 'વડોદરા', amount: 501 },
    { name: 'સ્વ. રેખાબેન જગદીશભાઈ પંડ્યા - હ. જગદીશભાઈ પી. પંડ્યા', city: 'વડોદરા', amount: 501 },
    { name: 'શ્રી મનોજભાઈ હર્ષદભાઈ જોષી', city: 'વડોદરા', amount: 501 }
  ];

  // Committee Groups - dynamic, user-configurable (replaces fixed executiveCommittee etc.)

  resetSectionExpansionState() {
    const stored = localStorage.getItem('invite_generator_section_state');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.expandedSections = {
          header: parsed.header ?? true,
          yajmans: parsed.yajmans ?? false,
          committees: parsed.committees ?? false,
          karobari: parsed.karobari ?? false,
          donors: parsed.donors ?? false
        };
        return;
      } catch (e) {
        console.warn('Could not parse section expansion state from localStorage', e);
      }
    }

    this.expandedSections = {
      header: true,
      yajmans: false,
      committees: false,
      karobari: false,
      donors: false
    };
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
    localStorage.setItem('invite_generator_section_state', JSON.stringify(this.expandedSections));
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections[section] ?? false;
  }

  ngOnInit() {
    this.loadDefaultExcel();
    this.initSearchTerms();
    this.loadSavedConfigs();
    this.resetSectionExpansionState();

    if (!this.programTimings || this.programTimings.length === 0) {
      this.programTimings = [
        { title: 'યજ્ઞ આરંભ', value: this.headerConfig.havanTime || 'બપોરે ૨.૩૦ કલાકે' },
        { title: 'સાંસ્કૃતિક કાર્યક્રમ', value: this.headerConfig.sanskrutikTime || 'બપોરે ૧.૩૦ થી ૫.૩૦ કલાકે' },
        { title: 'અલ્પાહાર', value: this.headerConfig.mahaprasadTime || 'સાંજે ૬.૩૦ કલાકે' },
        { title: 'ગરબા નો કાર્યક્રમ', value: this.headerConfig.garbaTime || 'રાત્રે ૭.૦૦ કલાકે' }
      ];
    }

    if (!this.committeeGroups || this.committeeGroups.length === 0) {
      this.committeeGroups = [
        {
          groupTitle: 'કારોબારી સભ્યો',
          members: [
            { name: 'રાજેન્દ્રભાઈ શુકલ', role: 'પ્રમુખશ્રી' },
            { name: 'અશોકભાઈ જોષી', role: 'ઉપપ્રમુખશ્રી' },
            { name: 'મનિષ જોષી', role: 'ઉપપ્રમુખશ્રી' },
            { name: 'રાજેન્દ્રભાઈ પંડ્યા', role: 'મંત્રી' },
            { name: 'ધર્મેશભાઈ પુરોહિત', role: 'સહમંત્રી' },
            { name: 'બિપીનચંદ્ર ભટ્ટ', role: 'ખજાનચી' }
          ]
        },
        {
          groupTitle: 'ટ્રસ્ટી સભ્યો',
          members: [
            { name: 'હિમાંશુ પુરોહિત', role: 'ટ્રસ્ટી પ્રમુખશ્રી' },
            { name: 'ગૌરાંગ પાઠક', role: 'ટ્રસ્ટી ઉપપ્રમુખશ્રી' },
            { name: 'શ્રીમતી હિના શુકલ', role: 'ટ્રસ્ટી મંત્રી' },
            { name: 'મુકુંદભાઈ જોષી', role: 'ટ્રસ્ટી સહમંત્રી' },
            { name: 'ચેતન પાઠક', role: 'ટ્રસ્ટી ખજાનચી' }
          ]
        },
        {
          groupTitle: 'યુવા સભ્યો',
          members: [
            { name: 'ઉર્વિશ પુરોહિત', role: 'યુવા પ્રમુખશ્રી' },
            { name: 'આશિષ પાઠક', role: 'યુવા ઉપપ્રમુખશ્રી' },
            { name: 'કેયુર ભટ્ટ', role: 'યુવા મંત્રી' },
            { name: 'નિકુલ ભટ્ટ', role: 'યુવા સહમંત્રી' },
            { name: 'જયદેવ શુકલ', role: 'યુવા ખજાનચી' }
          ]
        },
        {
          groupTitle: 'મહિલા સભ્યો',
          members: [
            { name: 'દેવીલાબેન એ. જોષી', role: 'મહિલા પ્રમુખશ્રી' },
            { name: 'ગીતાબેન બી. ભટ્ટ', role: 'મહિલા ઉપપ્રમુખશ્રી' },
            { name: 'નીતાબેન જે. ભટ્ટ', role: 'મહિલા મહામંત્રી' },
            { name: 'ચૈતાલીબેન જી. પાઠક', role: 'મહિલા સહમંત્રી' },
            { name: 'કરુણાબેન એમ. જોષી', role: 'મહિલા ખજાનચી' }
          ]
        }
      ];
    }

    const savedWidth = localStorage.getItem('invite_generator_config_panel_width');
    if (savedWidth) {
      this.configPanelWidth = parseInt(savedWidth, 10);
    }
  }

  // Auto-population initialization
  initSearchTerms() {
    this.yajmanSearchTerms = this.yajmans.map(y => y.name);
    this.karobariSearchTerms = this.karobariMembers.map(k => k.name);
    this.donorSearchTerms = this.donors.map(d => d.name);
  }

  // Load default excel list on start
  async loadDefaultExcel() {
    try {
      const response = await fetch('/members_list.xlsx');
      if (!response.ok) throw new Error('File not found');
      const arrayBuffer = await response.arrayBuffer();
      this.parseExcelData(arrayBuffer);
    } catch (error) {
      console.warn('Default member Excel file could not be pre-loaded. Please upload manually.', error);
    }
  }

  // Process Excel Array Buffer
  parseExcelData(arrayBuffer: ArrayBuffer) {
    try {
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      this.members = jsonData.map(row => ({
        Id: String(row.Id || row.id || ''),
        Name: String(row.Name || row.name || ''),
        Address: String(row.Address || row.address || ''),
        City: String(row.City || row.city || ''),
        Country: String(row.Country || row.country || '')
      }));

      this.isExcelLoaded = true;
      this.onLayoutChanged();
      console.log('Parsed', this.members.length, 'members from Excel.');
    } catch (e) {
      alert('Error parsing Excel file. Please ensure columns match: Id, Name, Address, City, Country');
      console.error(e);
    }
  }

  // Handle Excel File upload
  onExcelUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      this.parseExcelData(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  }

  // Download a blank sample Excel template with correct headers + example rows
  downloadSampleExcel() {
    const sampleRows = [
      { Id: '1001', Name: 'રાજેન્દ્રભાઈ શુક્લ', Address: '12, સ્ટેશન રોડ', City: 'વડોદરા', Country: 'India' },
      { Id: '1002', Name: 'અશોકભાઈ જોષી',      Address: '45, મહાલક્ષ્મી સોસ',  City: 'સુરત',    Country: 'India' },
      { Id: '1003', Name: 'Sample Member',       Address: '1, Main Street',       City: 'Ahmedabad', Country: 'India' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows, {
      header: ['Id', 'Name', 'Address', 'City', 'Country']
    });

    // Auto-fit column widths
    worksheet['!cols'] = [
      { wch: 8 },   // Id
      { wch: 30 },  // Name
      { wch: 35 },  // Address
      { wch: 16 },  // City
      { wch: 10 }   // Country
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
    XLSX.writeFile(workbook, 'members_list_sample.xlsx');
  }

  toggleAutoGujarati() {
    this.translitService.toggleAutoTransliterate();
  }

  get isAutoTransliterateEnabled(): boolean {
    return this.translitService.isAutoTransliterateEnabled;
  }

  async convertAllToGujarati() {
    this.isTransliteratingAll = true;
    try {
      const headerKeys = [
        'trustName', 'organizer', 'eventTitle', 'samvatText', 'dateText',
        'eventIntro', 'bannerText', 'havanTime', 'sanskrutikTime', 'mahaprasadTime',
        'garbaTime', 'venueLabel', 'venueAddress', 'whatsappNote', 'sloganText',
        'specialNote', 'prasadiText', 'garbaSubtitle', 'garbaGroup', 'garbaPlayTime',
        'whatsappUpdateNote'
      ] as const;

      for (const k of headerKeys) {
        const val = (this.headerConfig as any)[k];
        if (typeof val === 'string' && val.trim().length > 0 && /[a-zA-Z]/.test(val)) {
          (this.headerConfig as any)[k] = await this.translitService.transliterateText(val);
        }
      }

      for (const y of this.yajmans) {
        if (y.name && /[a-zA-Z]/.test(y.name)) y.name = await this.translitService.transliterateText(y.name);
        if (y.city && /[a-zA-Z]/.test(y.city)) y.city = await this.translitService.transliterateText(y.city);
      }

      for (const k of this.karobariMembers) {
        if (k.name && /[a-zA-Z]/.test(k.name)) k.name = await this.translitService.transliterateText(k.name);
        if (k.city && /[a-zA-Z]/.test(k.city)) k.city = await this.translitService.transliterateText(k.city);
      }

      for (const d of this.donors) {
        if (d.name && /[a-zA-Z]/.test(d.name)) d.name = await this.translitService.transliterateText(d.name);
        if (d.city && /[a-zA-Z]/.test(d.city)) d.city = await this.translitService.transliterateText(d.city);
      }

      for (const t of this.programTimings) {
        if (t.title && /[a-zA-Z]/.test(t.title)) t.title = await this.translitService.transliterateText(t.title);
        if (t.value && /[a-zA-Z]/.test(t.value)) t.value = await this.translitService.transliterateText(t.value);
      }

      for (const g of this.committeeGroups) {
        if (g.groupTitle && /[a-zA-Z]/.test(g.groupTitle)) g.groupTitle = await this.translitService.transliterateText(g.groupTitle);
        for (const m of g.members) {
          if (m.name && /[a-zA-Z]/.test(m.name)) m.name = await this.translitService.transliterateText(m.name);
          if (m.role && /[a-zA-Z]/.test(m.role)) m.role = await this.translitService.transliterateText(m.role);
        }
      }

      this.initSearchTerms();
      this.onLayoutChanged();
    } catch (e) {
      console.error('Error during form transliteration', e);
    } finally {
      this.isTransliteratingAll = false;
    }
  }

  // Filter members for Autocomplete dropdown
  filteredMembers(searchTerm: string): Member[] {
    if (!searchTerm || !this.members.length) return [];
    const term = searchTerm.toLowerCase().trim();
    const translitTerm = this.translitService.transliterateSync(term).toLowerCase().trim();
    return this.members.filter(m =>
      m.Name.toLowerCase().includes(term) ||
      (translitTerm && m.Name.toLowerCase().includes(translitTerm)) ||
      m.Id.toLowerCase().includes(term) ||
      m.City.toLowerCase().includes(term) ||
      (translitTerm && m.City.toLowerCase().includes(translitTerm))
    ).slice(0, 8); // Top 8 results for better layout
  }

  // --- Dynamic Yajman Methods ---
  addYajman() {
    this.yajmans.unshift({ name: '', city: '' });
    this.yajmanSearchTerms.unshift('');
    this.onLayoutChanged();
  }

  removeYajman(index: number) {
    this.yajmans.splice(index, 1);
    this.yajmanSearchTerms.splice(index, 1);
    if (this.activeYajmanSearchIndex === index) {
      this.activeYajmanSearchIndex = null;
    }
    this.onLayoutChanged();
  }

  async selectYajmanMember(index: number, member: Member) {
    let name = member.Name;
    let city = member.City;
    if (this.isAutoTransliterateEnabled && (/[a-zA-Z]/.test(name) || /[a-zA-Z]/.test(city))) {
      name = await this.translitService.transliterateText(name);
      city = await this.translitService.transliterateText(city);
    }
    this.yajmans[index].name = name;
    this.yajmans[index].city = city;
    this.yajmanSearchTerms[index] = name;
    this.activeYajmanSearchIndex = null;
    this.onLayoutChanged();
  }

  // --- Dynamic Karobari Methods ---
  addKarobari() {
    this.karobariMembers.unshift({ name: '', city: '' });
    this.karobariSearchTerms.unshift('');
    this.onLayoutChanged();
  }

  removeKarobari(index: number) {
    this.karobariMembers.splice(index, 1);
    this.karobariSearchTerms.splice(index, 1);
    if (this.activeKarobariSearchIndex === index) {
      this.activeKarobariSearchIndex = null;
    }
    this.onLayoutChanged();
  }

  async selectKarobariMember(index: number, member: Member) {
    let name = member.Name;
    let city = member.City;
    if (this.isAutoTransliterateEnabled && (/[a-zA-Z]/.test(name) || /[a-zA-Z]/.test(city))) {
      name = await this.translitService.transliterateText(name);
      city = await this.translitService.transliterateText(city);
    }
    this.karobariMembers[index].name = name;
    this.karobariMembers[index].city = city;
    this.karobariSearchTerms[index] = name;
    this.activeKarobariSearchIndex = null;
    this.onLayoutChanged();
  }

  // --- Dynamic Donor Methods ---
  addDonor() {
    this.donors.unshift({ name: '', city: '', amount: 0 });
    this.donorSearchTerms.unshift('');
    this.onLayoutChanged();
  }

  removeDonor(index: number) {
    this.donors.splice(index, 1);
    this.donorSearchTerms.splice(index, 1);
    if (this.activeDonorSearchIndex === index) {
      this.activeDonorSearchIndex = null;
    }
    this.onLayoutChanged();
  }

  async selectDonorMember(index: number, member: Member) {
    let name = member.Name;
    let city = member.City;
    if (this.isAutoTransliterateEnabled && (/[a-zA-Z]/.test(name) || /[a-zA-Z]/.test(city))) {
      name = await this.translitService.transliterateText(name);
      city = await this.translitService.transliterateText(city);
    }
    this.donors[index].name = name;
    this.donors[index].city = city;
    this.donorSearchTerms[index] = name;
    this.activeDonorSearchIndex = null;
    this.onLayoutChanged();
  }

  // --- Dynamic Timing Methods ---
  addProgramTiming() {
    this.programTimings.unshift({ title: '', value: '' });
    this.onLayoutChanged();
  }

  removeProgramTiming(index: number) {
    this.programTimings.splice(index, 1);
    this.onLayoutChanged();
  }

  get activeProgramTimings(): TimingInput[] {
    return (this.programTimings || []).filter(t => t && t.title && t.title.trim().length > 0 && t.value && t.value.trim().length > 0);
  }

  get activeGridTimings(): TimingInput[] {
    return this.activeProgramTimings.filter(t => !t.title.includes('ગરબા') && !t.title.toLowerCase().includes('garba'));
  }

  get activeBannerTimings(): TimingInput[] {
    return this.activeProgramTimings.filter(t => t.title.includes('ગરબા') || t.title.toLowerCase().includes('garba'));
  }

  getTimingColorClass(index: number): string {
    const classes = ['card-red', 'card-blue', 'card-gold', 'card-purple'];
    return classes[index % classes.length];
  }

  getTimingTitleColorClass(index: number): string {
    const classes = ['title-red', 'title-blue', 'title-gold', 'title-purple'];
    return classes[index % classes.length];
  }

  get activeYajmans(): YajmanInput[] {
    return (this.yajmans || []).filter(y => y && y.name && y.name.trim().length > 0);
  }

  get activeKarobariMembers(): KarobariInput[] {
    return (this.karobariMembers || []).filter(k => k && k.name && k.name.trim().length > 0);
  }

  get activeDonors(): DonorInput[] {
    return (this.donors || []).filter(d => d && d.name && d.name.trim().length > 0);
  }

  get activeCommitteeGroups(): CommitteeGroup[] {
    return (this.committeeGroups || []).map(g => ({
      groupTitle: g.groupTitle,
      members: (g.members || []).filter(m => m && m.name && m.name.trim().length > 0)
    })).filter(g => g.members.length > 0);
  }

  hasCommittees(): boolean {
    return this.activeCommitteeGroups.length > 0 ||
           (this.headerConfig.showKarobariList && this.activeKarobariMembers.length > 0);
  }

  // --- Dynamic Committee Group Methods ---
  addCommitteeGroup() {
    this.committeeGroups.unshift({ groupTitle: '', members: [{ name: '', role: '' }] });
    this.onLayoutChanged();
  }

  removeCommitteeGroup(groupIdx: number) {
    this.committeeGroups.splice(groupIdx, 1);
    this.onLayoutChanged();
  }

  addCommitteeMember(groupIdx: number) {
    this.committeeGroups[groupIdx].members.unshift({ name: '', role: '' });
    this.onLayoutChanged();
  }

  removeCommitteeMember(groupIdx: number, memberIdx: number) {
    this.committeeGroups[groupIdx].members.splice(memberIdx, 1);
    this.onLayoutChanged();
  }

  get hasFooterData(): boolean {
    const hasPrasadi = this.headerConfig.showPrasadi && this.headerConfig.prasadiText && this.headerConfig.prasadiText.trim().length > 0;
    const hasKarobari = this.headerConfig.showKarobariList && this.activeKarobariMembers.length > 0;
    const hasSpecialNote = this.headerConfig.showSpecialNote && this.headerConfig.specialNote && this.headerConfig.specialNote.trim().length > 0;
    const hasGarba = this.headerConfig.showGarbaCelebration && (
      (this.headerConfig.trustName && this.headerConfig.trustName.trim().length > 0) ||
      (this.headerConfig.garbaSubtitle && this.headerConfig.garbaSubtitle.trim().length > 0) ||
      (this.headerConfig.garbaGroup && this.headerConfig.garbaGroup.trim().length > 0) ||
      (this.headerConfig.garbaPlayTime && this.headerConfig.garbaPlayTime.trim().length > 0)
    );
    const hasWhatsapp = this.headerConfig.showWhatsappReminder && this.headerConfig.whatsappUpdateNote && this.headerConfig.whatsappUpdateNote.trim().length > 0;
    
    return !!(hasPrasadi || hasKarobari || hasSpecialNote || hasGarba || hasWhatsapp);
  }

  // Dynamic Sorted Donors computed property
  get sortedDonors(): DonorInput[] {
    return [...this.activeDonors].sort((a, b) => b.amount - a.amount);
  }

  toGujaratiNumber(num: number | string | undefined | null): string {
    if (num === null || num === undefined) return '';
    const str = String(num);
    const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return str.replace(/[0-9]/g, (digit) => gujaratiDigits[parseInt(digit, 10)]);
  }

  splitTimingLines(val: string): { timeOfDay: string; timeString: string } {
    if (!val) return { timeOfDay: '', timeString: '' };
    const trimmed = val.trim();
    if (trimmed.includes('\n')) {
      const parts = trimmed.split('\n');
      return { timeOfDay: parts[0].trim(), timeString: parts.slice(1).join(' ').trim() };
    }
    const prefixes = ['બપોરે', 'સાંજે', 'રાત્રે', 'સવારે'];
    for (const prefix of prefixes) {
      if (trimmed.startsWith(prefix)) {
        return { timeOfDay: prefix, timeString: trimmed.substring(prefix.length).trim() };
      }
    }
    return { timeOfDay: '', timeString: trimmed };
  }

  // Dynamic page-height chunking for Donors list:
  // Packs items as tightly as possible on A4 page layout (Page 2, Page 3, Page 4, etc.)
  // and dynamically handles footer elements size when deciding to insert a page break.
  get chunkedDonors(): DonorInput[][] {
    const sorted = this.sortedDonors;
    if (sorted.length === 0) {
      return this.hasFooterData ? [[]] : [];
    }

    const maxItemsPerPage = 40;

    let footerEquivalentRows = 0;
    if (this.headerConfig.showPrasadi && this.headerConfig.prasadiText) footerEquivalentRows += 2;
    if (this.headerConfig.showSpecialNote && this.headerConfig.specialNote) footerEquivalentRows += 4.5;
    if (this.headerConfig.showGarbaCelebration) footerEquivalentRows += 4;
    if (this.headerConfig.showWhatsappReminder) footerEquivalentRows += 2;

    const maxItemsOnFooterPage = Math.max(12, Math.floor(maxItemsPerPage - footerEquivalentRows));

    const chunks: DonorInput[][] = [];
    let currentIndex = 0;

    while (currentIndex < sorted.length) {
      const remainingItems = sorted.length - currentIndex;

      if (remainingItems <= maxItemsOnFooterPage) {
        chunks.push(sorted.slice(currentIndex));
        break;
      } else {
        const chunkSize = Math.min(maxItemsPerPage, remainingItems);
        chunks.push(sorted.slice(currentIndex, currentIndex + chunkSize));
        currentIndex += chunkSize;
      }
    }

    return chunks;
  }

  // Close all autocomplete suggestions dropdowns
  closeAllDropdowns() {
    setTimeout(() => {
      this.activeYajmanSearchIndex = null;
      this.activeKarobariSearchIndex = null;
      this.activeDonorSearchIndex = null;
    }, 200);
  }

  // --- PDF Export Logic ---
  async generatePDF() {
    this.isGeneratingPdf = true;
    this.pdfProgress = 10;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    try {
      // Find all template pages rendered in preview
      const pageElements = document.querySelectorAll('.invitation-page');
      
      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i] as HTMLElement;
        this.pdfProgress = Math.round(10 + (i / pageElements.length) * 80);

        // Temporary clone and append directly to document.body to bypass html2canvas iframe positioning bugs
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.width = '210mm';
        clone.style.height = '297mm';
        document.body.appendChild(clone);

        // Capture page as High DPI canvas
        const canvas = await html2canvas(clone, {
          scale: 2.0, // High-quality print scaling
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        document.body.removeChild(clone);

        // Add page to PDF
        if (i > 0) {
          doc.addPage();
        }

        // Fit image exactly to A4 boundaries (210mm x 297mm)
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      this.pdfProgress = 95;
      doc.save(`Invitation_Card_${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Check log for details.');
    } finally {
      this.isGeneratingPdf = false;
      this.pdfProgress = 0;
    }
  }

  // --- LocalStorage Config Management ---
  loadSavedConfigs() {
    try {
      const stored = localStorage.getItem('invite_generator_configs');
      if (stored) {
        this.savedConfigs = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading saved configurations from localStorage:', e);
    }
  }

  saveCurrentConfig() {
    if (!this.newConfigName || !this.newConfigName.trim()) {
      alert('કૃપા કરીને કન્ફિગરેશનનું નામ દાખલ કરો (Please enter a name)');
      return;
    }

    const name = this.newConfigName.trim();
    const configData = {
      name: name,
      date: new Date().toLocaleDateString('gu-IN') + ' ' + new Date().toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' }),
      headerConfig: JSON.parse(JSON.stringify(this.headerConfig)),
      yajmans: JSON.parse(JSON.stringify(this.yajmans)),
      karobariMembers: JSON.parse(JSON.stringify(this.karobariMembers)),
      donors: JSON.parse(JSON.stringify(this.donors)),
      programTimings: JSON.parse(JSON.stringify(this.programTimings)),
      committeeGroups: JSON.parse(JSON.stringify(this.committeeGroups)),
      configSections: JSON.parse(JSON.stringify(this.configSections))
    };

    const existingIndex = this.savedConfigs.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingIndex > -1) {
      if (confirm(`"${name}" નામનું કન્ફિગરેશન પહેલેથી અસ્તિત્વમાં છે. શું તમે તેને બદલવા માંગો છો?`)) {
        this.savedConfigs[existingIndex] = configData;
      } else {
        return;
      }
    } else {
      this.savedConfigs.push(configData);
    }

    try {
      localStorage.setItem('invite_generator_configs', JSON.stringify(this.savedConfigs));
      this.newConfigName = '';
      alert('કન્ફિગરેશન સફળતાપૂર્વક સાચવવામાં આવ્યું છે! (Config saved successfully)');
    } catch (e) {
      alert('કન્ફિગરેશન સાચવવામાં ભૂલ આવી. (Failed to save config)');
      console.error(e);
    }
  }

  loadConfig(config: any) {
    if (!config) return;
    
    this.headerConfig = JSON.parse(JSON.stringify(config.headerConfig));
    this.yajmans = JSON.parse(JSON.stringify(config.yajmans));
    this.karobariMembers = JSON.parse(JSON.stringify(config.karobariMembers));
    this.donors = JSON.parse(JSON.stringify(config.donors));
    if (config.configSections) {
      this.configSections = JSON.parse(JSON.stringify(config.configSections));
      // Ensure 'committees' exists in loaded configs (backward compat)
      if (!this.configSections.includes('committees')) {
        // Insert before 'karobari' if present, otherwise before 'donors'
        const karobariIdx = this.configSections.indexOf('karobari');
        const donorIdx = this.configSections.indexOf('donors');
        const insertAt = karobariIdx > -1 ? karobariIdx : (donorIdx > -1 ? donorIdx : this.configSections.length);
        this.configSections.splice(insertAt, 0, 'committees');
      }
      // Fix old configs where karobari came before committees (wrong order)
      const kiIdx = this.configSections.indexOf('karobari');
      const ciIdx = this.configSections.indexOf('committees');
      if (kiIdx > -1 && ciIdx > -1 && kiIdx < ciIdx) {
        // Swap: move committees before karobari
        this.configSections.splice(ciIdx, 1);
        this.configSections.splice(kiIdx, 0, 'committees');
      }
    } else {
      this.configSections = ['header', 'yajmans', 'committees', 'karobari', 'donors'];
    }

    if (config.programTimings) {
      this.programTimings = JSON.parse(JSON.stringify(config.programTimings));
    } else {
      this.programTimings = [];
      if (this.headerConfig.havanTime) this.programTimings.push({ title: 'યજ્ઞ આરંભ', value: this.headerConfig.havanTime });
      if (this.headerConfig.sanskrutikTime) this.programTimings.push({ title: 'સાંસ્કૃતિક કાર્યક્રમ', value: this.headerConfig.sanskrutikTime });
      if (this.headerConfig.mahaprasadTime) this.programTimings.push({ title: 'મહાપ્રસાદી', value: this.headerConfig.mahaprasadTime });
      if (this.headerConfig.garbaTime) this.programTimings.push({ title: 'ગરબા કાર્યક્રમ', value: this.headerConfig.garbaTime });
    }

    if (config.committeeGroups && config.committeeGroups.length > 0) {
      this.committeeGroups = JSON.parse(JSON.stringify(config.committeeGroups));
    }

    this.initSearchTerms();
    this.resetSectionExpansionState();
    this.onLayoutChanged();
    
    alert(`"${config.name}" કન્ફિગરેશન સફળતાપૂર્વક લોડ કરવામાં આવ્યું છે! (Config loaded)`);
  }

  deleteConfig(index: number, event: MouseEvent) {
    event.stopPropagation();
    
    const config = this.savedConfigs[index];
    if (confirm(`શું તમે કન્ફિગરેશન "${config.name}" ખરેખર કાઢી નાખવા માંગો છો?`)) {
      this.savedConfigs.splice(index, 1);
      try {
        localStorage.setItem('invite_generator_configs', JSON.stringify(this.savedConfigs));
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Export configs to JSON file
  exportConfigs() {
    if (this.savedConfigs.length === 0) {
      alert('સાચવેલ કોઈ કન્ફિગરેશન નથી જેને એક્સપોર્ટ કરી શકાય. (No configurations to export)');
      return;
    }
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.savedConfigs));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `invite_configurations_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert('એક્સપોર્ટ કરવામાં ભૂલ આવી. (Export failed)');
      console.error(e);
    }
  }

  // Import configs from JSON file
  importConfigs(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const importedList = JSON.parse(e.target.result);
        if (Array.isArray(importedList)) {
          let valid = true;
          for (const item of importedList) {
            if (!item.name || !item.headerConfig || !item.yajmans || !item.donors) {
              valid = false;
              break;
            }
          }

          if (!valid) {
            alert('અમાન્ય કન્ફિગરેશન ફાઇલ (Invalid configuration file format)');
            return;
          }

          for (const imported of importedList) {
            const existingIdx = this.savedConfigs.findIndex(c => c.name.toLowerCase() === imported.name.toLowerCase());
            if (existingIdx > -1) {
              this.savedConfigs[existingIdx] = imported;
            } else {
              this.savedConfigs.push(imported);
            }
          }

          localStorage.setItem('invite_generator_configs', JSON.stringify(this.savedConfigs));
          alert('કન્ફિગરેશન સફળતાપૂર્વક આયાત કરવામાં આવ્યું છે! (Configurations imported successfully)');
          
          // Clear input file
          event.target.value = '';
        } else {
          alert('કૃપા કરીને માન્ય કન્ફિગરેશન ફાઇલ અપલોડ કરો. (Must be a JSON array)');
        }
      } catch (error) {
        alert('ફાઇલ રીડિંગમાં ભૂલ આવી. (Error parsing configuration JSON file)');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  // --- HTML5 Drag & Drop Card Sections ---
  onSectionDragStart(index: number) {
    this.draggedSectionIndex = index;
  }

  onSectionDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.draggedOverSectionIndex = index;
  }

  onSectionDragLeave() {
    this.draggedOverSectionIndex = null;
  }

  onSectionDragEnd() {
    this.draggedSectionIndex = null;
    this.draggedOverSectionIndex = null;
  }

  onSectionDrop(index: number) {
    this.draggedOverSectionIndex = null;
    if (this.draggedSectionIndex === null || this.draggedSectionIndex === index) return;

    const temp = this.configSections[this.draggedSectionIndex];
    this.configSections.splice(this.draggedSectionIndex, 1);
    this.configSections.splice(index, 0, temp);

    this.draggedSectionIndex = null;
  }

  // --- HTML5 Drag & Drop Row Reordering ---
  onRowDragStart(index: number, type: string) {
    this.draggedRowIndex = index;
    this.draggedRowType = type;
  }

  onRowDragOver(event: DragEvent, index: number, type: string) {
    event.preventDefault();
    this.draggedOverRowIndex = index;
    this.draggedOverRowType = type;
  }

  onRowDragLeave() {
    this.draggedOverRowIndex = null;
    this.draggedOverRowType = null;
  }

  onRowDragEnd() {
    this.draggedRowIndex = null;
    this.draggedRowType = null;
    this.draggedOverRowIndex = null;
    this.draggedOverRowType = null;
  }

  onRowDrop(index: number, type: string) {
    this.draggedOverRowIndex = null;
    this.draggedOverRowType = null;
    if (this.draggedRowType !== type || this.draggedRowIndex === null || this.draggedRowIndex === index) return;

    if (type === 'yajman') {
      const temp = this.yajmans[this.draggedRowIndex];
      this.yajmans.splice(this.draggedRowIndex, 1);
      this.yajmans.splice(index, 0, temp);

      const tempTerm = this.yajmanSearchTerms[this.draggedRowIndex];
      this.yajmanSearchTerms.splice(this.draggedRowIndex, 1);
      this.yajmanSearchTerms.splice(index, 0, tempTerm);
    } else if (type === 'karobari') {
      const temp = this.karobariMembers[this.draggedRowIndex];
      this.karobariMembers.splice(this.draggedRowIndex, 1);
      this.karobariMembers.splice(index, 0, temp);

      const tempTerm = this.karobariSearchTerms[this.draggedRowIndex];
      this.karobariSearchTerms.splice(this.draggedRowIndex, 1);
      this.karobariSearchTerms.splice(index, 0, tempTerm);
    } else if (type === 'timing') {
      const temp = this.programTimings[this.draggedRowIndex];
      this.programTimings.splice(this.draggedRowIndex, 1);
      this.programTimings.splice(index, 0, temp);
    }

    this.draggedRowIndex = null;
    this.draggedRowType = null;
  }

  // --- Resizing & Preview Auto-Scaling Logic ---
  ngAfterViewInit() {
    setTimeout(() => {
      this.updatePreviewScale();
    }, 150);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.updatePreviewScale();
  }

  onLayoutChanged() {
    setTimeout(() => {
      this.updatePreviewScale();
    }, 50);
  }

  startResizing(event: MouseEvent) {
    event.preventDefault();
    this.isResizing = true;
    
    const startX = event.clientX;
    const startWidth = this.configPanelWidth;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!this.isResizing) return;
      const deltaX = moveEvent.clientX - startX;
      this.configPanelWidth = Math.max(320, Math.min(800, startWidth + deltaX));
      this.updatePreviewScale();
    };
    
    const onMouseUp = () => {
      this.isResizing = false;
      localStorage.setItem('invite_generator_config_panel_width', String(this.configPanelWidth));
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  updatePreviewScale() {
    if (!this.previewPanelEl || !this.pagesContainerEl) return;
    
    const containerWidth = this.previewPanelEl.nativeElement.clientWidth;
    const targetWidth = 850; 
    
    const scale = Math.min(1, containerWidth / targetWidth);
    this.previewScaleTransform = `scale(${scale})`;
    
    const originalHeight = this.pagesContainerEl.nativeElement.offsetHeight;
    this.scaledHeight = originalHeight * scale;
  }
}
