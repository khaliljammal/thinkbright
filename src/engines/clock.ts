import { useCallback, useRef, type MutableRefObject } from 'react';
import { useSharedValue, runOnUI, SharedValue } from 'react-native-reanimated';

/**
 * Response times are taken on the UI thread on both ends: the stimulus onset is
 * stamped there, and the touch is stamped there by the gesture handler worklet.
 * Neither crosses the JS bridge before being timed, so a busy JS thread can't
 * inflate a reaction time.
 *
 * Both callbacks are stable — trial lifecycles depend on them, and an unstable
 * identity would tear down and restart the trial on every render.
 */
export function useTrialClock(): {
  onsetAt: SharedValue<number>;
  markOnset: () => void;
  clearOnset: () => void;
} {
  const onsetAt = useSharedValue(0);

  const markOnset = useCallback(() => {
    runOnUI(() => {
      'worklet';
      onsetAt.value = performance.now();
    })();
  }, [onsetAt]);

  const clearOnset = useCallback(() => {
    runOnUI(() => {
      'worklet';
      onsetAt.value = 0;
    })();
  }, [onsetAt]);

  return { onsetAt, markOnset, clearOnset };
}

/**
 * Always-current ref to a value. Lets a trial lifecycle read the latest
 * callback without listing it as an effect dependency — which would restart
 * the trial every render.
 */
export function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
