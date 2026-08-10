import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() enabled = false;
  @Output() enabledChange = new EventEmitter<boolean>();
  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;
  private hasUserInteracted = false;

  toggle(): void {
    this.enabledChange.emit(!this.enabled);
  }

  ngAfterViewInit(): void {
    this.attachInteractionListeners();

    if (this.enabled) {
      this.play();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enabled']) {
      if (this.enabled) {
        this.play();
      } else {
        this.pause();
      }
    }
  }

  ngOnDestroy(): void {
    this.detachInteractionListeners();
  }

  private attachInteractionListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('click', this.handleUserInteraction);
    window.addEventListener('keydown', this.handleUserInteraction);
    window.addEventListener('pointerdown', this.handleUserInteraction);
    window.addEventListener('touchstart', this.handleUserInteraction);
    window.addEventListener('scroll', this.handleUserInteraction, {
      passive: true,
    });
  }

  private detachInteractionListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('click', this.handleUserInteraction);
    window.removeEventListener('keydown', this.handleUserInteraction);
    window.removeEventListener('pointerdown', this.handleUserInteraction);
    window.removeEventListener('touchstart', this.handleUserInteraction);
    window.removeEventListener('scroll', this.handleUserInteraction);
  }

  private readonly handleUserInteraction = (): void => {
    this.hasUserInteracted = true;

    if (this.enabled) {
      this.play();
    }
  };

  private play(): void {
    try {
      const audio = this.audioRef?.nativeElement;
      if (!audio || !this.enabled) {
        return;
      }

      if (!audio.paused) {
        return;
      }

      audio.muted = false;
      audio.volume = 1;

      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.then === 'function') {
        playAttempt.catch(() => {
          if (this.enabled && this.hasUserInteracted) {
            console.log(
              'Playback is still blocked by the browser. A later user gesture will retry it.',
            );
          }
        });
      }
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  }

  private pause(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) {
      return;
    }

    audio.pause();
  }
}
