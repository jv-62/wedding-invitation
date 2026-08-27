import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    AudioPlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('scratchCanvas') scratchCanvases!: QueryList<
    ElementRef<HTMLCanvasElement>
  >;
  private timer: any;
  private scratchContexts: Array<CanvasRenderingContext2D | null> = [
    null,
    null,
    null,
    null,
  ];
  private scratchPointerStates = new Map<number, boolean>();

  showEnvelope = true;
  copy = {
    envelopeSeal: 'J ♥️ J',
    mantra: {
      symbol: 'ॐ',
      title: '|| मंगल मंत्र ||',
      lines: [
        'जयम् जयायै गणपतये नमो नमः ।',
        'सिद्धि बुद्धिा प्रदायिने, मंगलं कुरु मे सदा ।।',
      ],
      translation: [
        'Salutations to Lord Ganesha, the giver of victory (Jayam) and triumph (Jaya).',
        'Bestow upon us wisdom, prosperity and success always.',
      ],
    },
    invitation: {
      teaser: 'You are lovingly invited to celebrate our wedding with us',
      couple: 'Jayam & Jaya',
      note: 'Your presence will make this auspicious occasion truly special.',
    },
    countdown: {
      pre: 'A lifetime of togetherness begins with one sacred step',
      title: 'The wedding countdown is on!',
      revealDate: 'Thursday, 26 · 11 · 2026',
      prompt: 'Scratch all the cards to reveal the special date.',
      ariaLabel: 'Scratch reveal card',
    },
    families: {
      groom: {
        heading: "Groom's Family",
        subtitle: 'Welcoming family traditions',
        message: 'We request the pleasure of your presence and blessings',
      },
      bride: {
        heading: "Bride's Family",
        subtitle: `Cherishing family's blessings`,
        message: 'Eager to celebrate this joyous occasion with your presence',
      },
    },
    festivities: {
      heading: 'Wedding Festivities',
    },
    venueSection: {
      heading: 'Venue',
      button: 'Open in Maps',
      mapAlt: 'Shree Devleela Garden map',
    },
    closing: {
      blessing: 'Awaiting your blessings',
      signoff: 'With love - Jayam & Jaya',
    },
  };
  scratchRevealed = [false, false, false, false];
  countdown = { days: 0, hours: 0, mins: 0, secs: 0 };
  countdownItems = [
    { l: 'Days', v: 0 },
    { l: 'Hours', v: 0 },
    { l: 'Mins', v: 0 },
    { l: 'Secs', v: 0 },
  ];
  petals = Array.from({ length: 15 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    emoji: [
      '🌸',
      '🪷',
      '✨',
      '🎉',
      '🌼',
      '🌺',
      '🌹',
      '🌷',
      '💐',
      '🌻',
      '♥️',
      '💛',
      '🌸',
      '🪷',
      '✨',
      '🎉',
      '🌼',
      '🌺',
      '🌹',
      '🌷',
      '💐',
      '🌻',
      '♥️',
      '💛',
    ][i % 18],
  }));
  brideFamily = {
    parents: 'D/O Late Shree Shankarlal Pareta & Smt. Jyoti Pareta',
    family: 'Pareta Family',
  };
  groomFamily = {
    parents: 'S/O Shree Dinesh Verma & Smt. Shalini Verma',
    family: 'Verma Family',
  };
  venue = {
    name: 'Shree Devleela Garden',
    address:
      'Devleela Parisar, Bhangarh Road, Chandra gupt mourya chouraha / M.R.10 Square, 79, Malvi Nagar, New Hira Nagar, Sukhliya, Indore, Madhya Pradesh 452010',
    map: 'https://maps.app.goo.gl/mNCuHX8D1kXkrny57',
    image: 'assets/photos/venue.webp',
  };
  festivities = [
    {
      date: '25th Nov 2026',
      title: 'Haldi Ceremony',
      hashtag: '#HaldiRangJayaJayamSang',
      time: '10:00 AM',
      image: 'assets/photos/haldi.jpg',
      details: 'Colorful haldi ceremony with family blessings',
    },
    {
      date: '25th Nov 2026',
      title: 'Ring Ceremony',
      hashtag: '#JayaJayamAbOfficial',
      time: '4:00 PM',
      image: 'assets/photos/ring-ceremony.png',
      details: 'Exchange of rings and smiles intimate family',
    },
    {
      date: '25th Nov 2026',
      title: 'Sangeet Night',
      hashtag: '#SwingWithJayam&Jaya',
      time: '6:00 PM',
      image: 'assets/photos/sangeet-night.png',
      details: 'An evening of lively performances and family moments',
    },
    {
      date: '26th Nov 2026',
      title: 'Barat',
      hashtag: '#Barat-e-Jayam',
      time: '10:00 AM',
      image: 'assets/photos/barat.png',
      details: 'Festive procession to the wedding venue',
    },
    {
      date: '26th Nov 2026',
      title: 'Wedding Ceremony',
      hashtag: '#JayamJayaSaathVachan',
      time: '1:00 PM',
      image: 'assets/photos/phere.png',
      details:
        'Blessings and rituals at Shree Devleela Garden to share heartfelt vows',
    },
    {
      date: '26th Nov 2026',
      title: 'Grand Reception',
      hashtag: '#JashnWithJayaJayam',
      time: '7:00 PM',
      image: 'assets/photos/grand-reception.png',
      details: `Celebration of JJ's forever with gourmet dining`,
    },
  ];
  isPlaying = signal(false);

  constructor() {}

  get isAllCardsScratched(): boolean {
    return this.scratchRevealed.every((revealed) => revealed);
  }

  ngOnInit() {
    this.startCountdown();
    setTimeout(() => {
      this.closeEnvelope();
    }, 3500);
  }
  ngAfterViewInit() {
    requestAnimationFrame(() => this.setupScratchCards());
    window.addEventListener('resize', this.handleScratchResize);
  }

  startCountdown() {
    const target = new Date('2026-11-26T13:00:00+05:30').getTime();
    this.timer = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(this.timer);
        return;
      }

      this.countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      this.countdown.mins = Math.floor((diff / (1000 * 60)) % 60);
      this.countdown.secs = Math.floor((diff / 1000) % 60);

      this.countdownItems[0].v = this.countdown.days;
      this.countdownItems[1].v = this.countdown.hours;
      this.countdownItems[2].v = this.countdown.mins;
      this.countdownItems[3].v = this.countdown.secs;
    }, 1000);
  }

  private handleScratchResize = () => {
    requestAnimationFrame(() => this.setupScratchCards());
  };
  private setupScratchCards() {
    const canvases = this.scratchCanvases?.toArray() ?? [];
    canvases.forEach((canvasRef, index) => {
      this.setupScratchCanvas(canvasRef.nativeElement, index);
    });
  }
  private setupScratchCanvas(canvas: HTMLCanvasElement, index: number) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = canvas.getContext('2d');
    this.scratchContexts[index] = ctx;
    if (!ctx) {
      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#f3c76d');
    gradient.addColorStop(1, '#b5832a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(92, 26, 26, 0.72)';
    ctx.font = '600 14px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch', rect.width / 2, rect.height / 2 - 8);

    ctx.font = '500 11px Arial';
    ctx.fillText('✨', rect.width / 2, rect.height / 2 + 16);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.strokeRect(0, 0, rect.width, rect.height);
  }
  startScratch(index: number, event: PointerEvent) {
    if (this.scratchRevealed[index]) {
      return;
    }

    event.preventDefault();
    this.scratchPointerStates.set(index, true);
    this.scratchAt(index, event);
  }
  scratch(index: number, event: PointerEvent) {
    if (!this.scratchPointerStates.get(index) || this.scratchRevealed[index]) {
      return;
    }

    event.preventDefault();
    this.scratchAt(index, event);
  }
  endScratch(index: number) {
    this.scratchPointerStates.set(index, false);
    this.checkScratchReveal(index);
  }
  private scratchAt(index: number, event: PointerEvent) {
    const canvas = this.scratchCanvases?.toArray()[index]?.nativeElement;
    const ctx = this.scratchContexts[index];
    if (!canvas || !ctx) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  private checkScratchReveal(index: number) {
    const canvas = this.scratchCanvases?.toArray()[index]?.nativeElement;
    const ctx = this.scratchContexts[index];
    if (!canvas || !ctx || this.scratchRevealed[index]) {
      return;
    }

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let transparentPixels = 0;

    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] < 128) {
        transparentPixels++;
      }
    }

    const revealRatio = transparentPixels / (width * height);
    if (revealRatio > 0.16) {
      this.scratchRevealed[index] = true;
    }
  }
  closeEnvelope() {
    this.showEnvelope = false;
    this.isPlaying.set(true);
  }
  openEnvelope() {
    this.closeEnvelope();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    window.removeEventListener('resize', this.handleScratchResize);
  }
}
