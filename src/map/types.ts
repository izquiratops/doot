// [position, texcoords, normals]
export type WebGlTuple = [Array<number>, Array<number>, Array<number>];

export interface Geometry {
    material: string;
    data: {
        position?: Array<number>;
        texcoord?: Array<number>;
        normal?: Array<number>;
    };
}

export interface Object3D {
    materialLibs: Array<string>;
    geometries: Array<Geometry>;
}
