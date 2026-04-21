const DEFAULT_OPTIONS = {
  rate: 0.84,
  pitch: 1,
  volume: 1,
  lang: 'en-IN',
};

function hasWindow() {
  return typeof window !== 'undefined';
}

export function hasBrowserSpeech() {
  return hasWindow() && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function cancelSpeech() {
  if (!hasBrowserSpeech()) return;
  window.speechSynthesis.cancel();
}

export function pauseSpeech() {
  if (!hasBrowserSpeech()) return;
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech() {
  if (!hasBrowserSpeech()) return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function speakText(text, handlers = {}, options = {}) {
  const speechOptions = { ...DEFAULT_OPTIONS, ...options };

  if (!hasBrowserSpeech() || !text) {
    const safeTextLength = (text || '').length;
    const fallbackTimer = hasWindow()
      ? window.setTimeout(() => {
          handlers.onEnd?.({ fallback: true });
        }, Math.max(800, Math.min(1600, Math.round(safeTextLength * 28))))
      : null;

    return {
      cancel: () => {
        if (fallbackTimer) {
          window.clearTimeout(fallbackTimer);
        }
      },
      pause: () => {},
      resume: () => {},
      supported: false,
    };
  }

  cancelSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = speechOptions.rate;
  utterance.pitch = speechOptions.pitch;
  utterance.volume = speechOptions.volume;
  utterance.lang = speechOptions.lang;
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = (event) => handlers.onEnd?.(event);
  utterance.onerror = (event) => handlers.onError?.(event);

  window.speechSynthesis.speak(utterance);

  return {
    cancel: cancelSpeech,
    pause: pauseSpeech,
    resume: resumeSpeech,
    supported: true,
  };
}
