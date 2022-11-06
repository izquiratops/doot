import { Object3D } from '../map/types';

// [position, texcoords, normals]
type WebGlTuple = [Array<number>, Array<number>, Array<number>];

export abstract class ObjLoader {
    static async parse(path: string): Promise<Object3D> {
        // Raw .OBJ script data
        // v: Vertex position
        const objPositions = [[0, 0, 0]];
        // vt: Texture coordinates
        const objTexcoords = [[0, 0]];
        // vn: Normal coordinates
        const objNormals = [[0, 0, 0]];

        const objVertexData = [objPositions, objTexcoords, objNormals];

        /**
         * Fill WebGL vertex data with the indices found on 'f' keywords.
         *
         * @param vert string value with indices for position, texcoords and normal
         * Example: 1/2/3 (where 1 is saying "use position 1" from 'v')
         */
        function addVertex(vert: string) {
            const pointer = vert.split('/');

            // Every vert value points into a vertex data position, texcoord or normal
            for (
                let keywordIndex = 0;
                keywordIndex < pointer.length;
                keywordIndex++
            ) {
                // idx: 0 -> v | 1 -> vt | 2 -> vn
                if (pointer[keywordIndex]) {
                    const pointerIndex = parseInt(pointer[keywordIndex]);
                    webglVertexData[keywordIndex].push(
                        ...objVertexData[keywordIndex][pointerIndex],
                    );
                }
            }
        }

        // Method to parse data for every supported keyword
        const pushVertexData: { [keyword: string]: Function } = {
            v(args: Array<string>) {
                objPositions.push(args.map(parseFloat));
            },
            vn(args: Array<string>) {
                objNormals.push(args.map(parseFloat));
            },
            vt(args: Array<string>) {
                objTexcoords.push(args.map(parseFloat));
            },
            f(args: Array<string>) {
                // Triangulate face
                const numTriangles = args.length - 2;
                for (let idx = 0; idx < numTriangles; ++idx) {
                    addVertex(args[0]);
                    addVertex(args[idx + 1]);
                    addVertex(args[idx + 2]);
                }
            },
        };

        // WebGL Vertex Data
        const webglVertexData: WebGlTuple = [[], [], []];

        // Start reading the script
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`${response.statusText}: ${path}`);
        }

        const content = await response.text();
        const filter = /(\w*)(?: )*(.*)/;
        const lines = content.split('\n');

        for (let idx = 0; idx < lines.length; idx++) {
            const line = lines[idx].trim();

            if (line === '' || line.startsWith('#')) {
                continue;
            }

            const filteredLine = filter.exec(line);
            if (!filteredLine) {
                continue;
            }

            // keyword -> 'v', unparsedArgs -> '-320 -16 -128'
            const [_, keyword, unparsedArgs] = filteredLine;
            const args = unparsedArgs.split(/\s+/);

            const handler = pushVertexData[keyword];
            if (handler) {
                handler(args);
            } else {
                console.warn('unhandled keyword:', keyword, 'at line', idx + 1);
            }
        }

        return {
            position: webglVertexData[0],
            texcoord: webglVertexData[1],
            normal: webglVertexData[2],
        };
    }
}
