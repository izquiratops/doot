interface Props {
    x: number;
    y: number;
    z: number;
}

export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set values(props: Props) {
        this.x = props.x;
        this.y = props.y;
        this.z = props.z;
    }

    get values(): Props {
        return { x: this.x, y: this.y, z: this.z };
    }

    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    length(): number {
        return Math.hypot(this.x, this.y, this.z);
    }

    rotate(yaw: number, pitch: number): void {
        this.rotateX(pitch);
        this.rotateY(yaw);
    }

    private rotateX(rad: number): void {
        this.x = this.z * Math.sin(rad) + this.x * Math.cos(rad);
        this.z = this.z * Math.cos(rad) - this.x * Math.sin(rad);
    }

    private rotateY(rad: number): void {
        this.y = this.y * Math.cos(rad) - this.z * Math.sin(rad);
        this.z = this.y * Math.sin(rad) + this.z * Math.cos(rad);
    }
}

export abstract class Vec3Tools {
    static angle2D(a: Vec3, b: Vec3): number {
        return Math.atan2(b.x - a.x, b.z - a.z);
    }

    static distance(a: Vec3, b: Vec3): number {
        return Vec3Tools.subtract(a, b).length();
    }

    static add(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static subtract(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static multiply(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static scalarMultiply(a: Vec3, scalar: number): Vec3 {
        return new Vec3(a.x * scalar, a.y * scalar, a.z * scalar);
    }

    static cross(a: Vec3, b: Vec3): Vec3 {
        const x = a.y * b.z - a.z * b.y;
        const y = a.z * b.x - a.x * b.z;
        const z = a.x * b.y - a.y * b.x;

        return new Vec3(x, y, z);
    }

    static normalizeVector(a: Vec3): Vec3 {
        return Vec3Tools.scalarMultiply(a, 1 / a.length());
    }

    static faceNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
        const { subtract, cross, normalizeVector } = Vec3Tools;
        const tmp = cross(subtract(a, b), subtract(c, b));
        return normalizeVector(tmp);
    }
}
