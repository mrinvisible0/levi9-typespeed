class WordDifficultyMeter {
    constructor(layout) {
        this.layout = layout;
    }

    meassure(text) {
        const sameFingerPenalty = SAME_FINGER_PENALTY;
        const sameHandPenalty   = SAME_HAND_PENALTY;
        const mapping = this.layout.toMetrics();
        const L_SHIFT = mapping['l-shift'];
        const R_SHIFT = mapping['r-shift'];

        let position = 0;
        let effort = 0;
        let prevKey = mapping[' '];
        let prevShift = false;

        while (position < text.length) {
            const i = position++;//remove i
            const symbol = text[i];
            const key = mapping[symbol];
            if (key === undefined) {
                prevKey = mapping[' '];
                continue;
            }

            const hand = key.hand;
            const finger = key.finger;


            // basic calculation
            effort += key.effort;

            // various hand movement overheads
            if (hand !== false && key !== prevKey) { // skipping repeats and spaces
                if (finger === prevKey.finger) { // same finger usage penalty
                    const prevEffort = prevKey.effort + 1;
                    const overhead = prevEffort * sameFingerPenalty;
                    effort += overhead;
                } else if (hand === prevKey.hand) { // same hand usage penalty
                    const prevEffort = prevKey.effort + 1;
                    const overhead = prevEffort * sameHandPenalty;
                    effort += overhead;
                } else if (prevShift !== null && prevShift.hand === hand) { // retraction from a shift position penalty
                    const overhead = prevShift.effort * sameHandPenalty;
                    effort += overhead;
                }
            }

            // pressing the shift button overhead
            if (key.shift) {
                prevShift = hand === 'r' ? L_SHIFT : R_SHIFT;
            } else {
                prevShift = null;
            }

            prevKey = key;
        }

        return Math.round(effort);
    }
}
