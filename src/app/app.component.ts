import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  showEnvelope = true;
  scratchRevealed = [false, false, false, false];
  celebrationMode = false;
  countdown = { days: 0, hours: 0, mins: 0, secs: 0 };
  countdownItems = [
    { l: 'Days', v: 0 },
    { l: 'Hours', v: 0 },
    { l: 'Mins', v: 0 },
    { l: 'Secs', v: 0 },
  ];
  private readonly musicPreferenceKey = 'wedding-music-paused';
  private hasInteractedOnce = false;
  private timer: any;
  private scratchContexts: Array<CanvasRenderingContext2D | null> = [
    null,
    null,
    null,
    null,
  ];
  private scratchPointerStates = new Map<number, boolean>();
  petals = Array.from({ length: 15 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    emoji: [
      '🌸',
      '🪷',
      '✨',
      '🌼',
      '🌺',
      '🌹',
      '🌷',
      '💐',
      '🌻',
      '🌸',
      '🪷',
      '✨',
      '🌼',
      '🌺',
      '🌹',
      '🌷',
      '💐',
      '🌻',
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
  };

  photos = [
    { src: 'assets/photos/1.jpg', caption: 'Engagement' },
    { src: 'assets/photos/2.jpg', caption: 'Mehndi Vibes' },
    { src: 'assets/photos/3.jpg', caption: 'Sangeet Night' },
    { src: 'assets/photos/4.jpg', caption: 'Our Journey' },
    { src: 'assets/photos/5.jpg', caption: 'Haldi Smiles' },
    { src: 'assets/photos/6.jpg', caption: 'Forever Together' },
  ];
  isPlaying = signal(false);
  lightboxIndex: number | null = null;

  @ViewChild('audioPlayer') audio!: ElementRef<HTMLAudioElement>;
  @ViewChildren('scratchCanvas') scratchCanvases!: QueryList<
    ElementRef<HTMLCanvasElement>
  >;

  toggleMusic() {
    this.hasInteractedOnce = true;
    if (this.isPlaying()) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }

  private playMusic() {
    const audio = this.audio?.nativeElement;
    if (!audio) {
      return;
    }

    const playAttempt = audio.play();
    if (!playAttempt) {
      return;
    }
    audio.currentTime = 0;

    playAttempt
      .then(() => {
        this.isPlaying.set(true);
        localStorage.setItem(this.musicPreferenceKey, 'false');
      })
      .catch((error: DOMException) => {
        if (error?.name === 'NotAllowedError') {
          this.isPlaying.set(false);
          return;
        }

        this.isPlaying.set(false);
      });
  }

  private pauseMusic() {
    const audio = this.audio?.nativeElement;
    if (!audio) {
      return;
    }

    audio.pause();
    this.isPlaying.set(false);
    localStorage.setItem(this.musicPreferenceKey, 'true');
  }

  openLightbox(i: number) {
    this.lightboxIndex = i;
  }
  closeLightbox() {
    this.lightboxIndex = null;
  }
  ngOnInit() {
    this.startCountdown();
    this.isPlaying.set(false);

    setTimeout(() => {
      this.closeEnvelope();
    }, 3500);
  }
  ngAfterViewInit() {
    requestAnimationFrame(() => this.setupScratchCards());
    window.addEventListener('resize', this.handleScratchResize);
    document.addEventListener('pointerdown', this.handleFirstUserInteraction, {
      once: true,
    });
  }
  startCountdown() {
    const target = new Date('2026-11-26T00:00:00+05:30').getTime();
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
  ngOnDestroy() {
    this.isPlaying.set(false);
    clearInterval(this.timer);
    window.removeEventListener('resize', this.handleScratchResize);
    document.removeEventListener(
      'pointerdown',
      this.handleFirstUserInteraction,
    );
  }
  private handleScratchResize = () => {
    requestAnimationFrame(() => this.setupScratchCards());
  };

  private handleFirstUserInteraction = () => {
    if (
      this.hasInteractedOnce ||
      localStorage.getItem(this.musicPreferenceKey) === 'true'
    ) {
      return;
    }

    this.hasInteractedOnce = true;
    if (!this.showEnvelope) {
      this.playMusic();
    }
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
    this.playMusic();
  }
  openEnvelope() {
    this.closeEnvelope();
  }
}
