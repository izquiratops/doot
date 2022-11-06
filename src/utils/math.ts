export abstract class MathTools {
    static clamp(v: number, min: number, max: number) {
        if (v < min) {
            return min;
        } else if (v > max) {
            return max;
        } else {
            return v;
        }
    }

    static angleMod(rad: number) {
        return Math.atan2(Math.sin(rad), Math.cos(rad));
    }

    static degToRad(deg: number) {
        return (deg * Math.PI) / 180;
    }

    static radToDeg(rad: number) {
        return (rad * 180) / Math.PI;
    }
}
