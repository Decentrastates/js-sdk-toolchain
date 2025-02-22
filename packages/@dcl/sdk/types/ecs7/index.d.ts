/**
 * @public
 */
declare function ArrayType<T>(type: EcsType<T>): EcsType<Array<T>>;

/**
 * @public
 */
declare type ByteBuffer = ReturnType<typeof createByteBuffer>;

declare interface Color3 {
    r: number;
    g: number;
    b: number;
}

/**
 * @public
 */
declare type ComponentDefinition<T extends EcsType = EcsType<any>> = {
    _id: number;
    has(entity: Entity): boolean;
    getFrom(entity: Entity): DeepReadonly<ComponentType<T>>;
    getOrNull(entity: Entity): DeepReadonly<ComponentType<T>> | null;
    create(entity: Entity, val?: ComponentType<T>): ComponentType<T>;
    mutable(entity: Entity): ComponentType<T>;
    createOrReplace(entity: Entity, val?: ComponentType<T>): ComponentType<T>;
    deleteFrom(entity: Entity): ComponentType<T> | null;
    upsertFromBinary(entity: Entity, data: ByteBuffer): ComponentType<T> | null;
    updateFromBinary(entity: Entity, data: ByteBuffer): ComponentType<T> | null;
    toBinary(entity: Entity): ByteBuffer;
    writeToByteBuffer(entity: Entity, buffer: ByteBuffer): void;
    iterator(): Iterable<[Entity, ComponentType<T>]>;
    dirtyIterator(): Iterable<Entity>;
    clearDirty(): void;
    isDirty(entity: Entity): boolean;
};

/**
 * @public
 */
declare type ComponentEcsType<T extends [ComponentDefinition, ...ComponentDefinition[]]> = {
    [K in keyof T]: T[K] extends ComponentDefinition ? ReturnType<T[K]['mutable']> : never;
};

/**
 * @public
 */
declare type ComponentType<T extends EcsType> = EcsResult<T>;

/**
 * ByteBuffer is a wrapper of DataView which also adds a read and write offset.
 *  Also in a write operation it resizes the buffer is being used if it needs.
 *
 * - Use read and write function to generate or consume data.
 * - Use set and get only if you are sure that you're doing.
 */
declare function createByteBuffer(options?: CreateByteBufferOptions): {
    /**
     * @returns The entire current Uint8Array.
     *
     * WARNING: if the buffer grows, the view had changed itself,
     *  and the reference will be a invalid one.
     */
    buffer(): Uint8Array;
    /**
     * @returns The capacity of the current buffer
     */
    bufferLength(): number;
    /**
     * Resets byteBuffer to avoid creating a new one
     */
    resetBuffer(): void;
    /**
     * @returns The current read offset
     */
    currentReadOffset(): number;
    /**
     * @returns The current write offset
     */
    currentWriteOffset(): number;
    /**
     * Reading purpose
     * Returns the previuos offsset size before incrementing
     */
    incrementReadOffset(amount: number): number;
    /**
     * @returns How many bytes are available to read.
     */
    remainingBytes(): number;
    readFloat32(): number;
    readFloat64(): number;
    readInt8(): number;
    readInt16(): number;
    readInt32(): number;
    readInt64(): bigint;
    readUint8(): number;
    readUint16(): number;
    readUint32(): number;
    readUint64(): bigint;
    readBuffer(): Uint8Array;
    /**
     * Writing purpose
     */
    /**
     * Increment offset
     * @param amount - how many bytes
     * @returns The offset when this reserving starts.
     */
    incrementWriteOffset(amount: number): number;
    /**
     * @returns The total number of bytes writen in the buffer.
     */
    size(): number;
    /**
     * Take care using this function, if you modify the data after, the
     * returned subarray will change too. If you'll modify the content of the
     * bytebuffer, maybe you want to use toCopiedBinary()
     *
     * @returns The subarray from 0 to offset as reference.
     */
    toBinary(): Uint8Array;
    /**
     * Safe copied buffer of the current data of ByteBuffer
     *
     * @returns The subarray from 0 to offset.
     */
    toCopiedBinary(): Uint8Array;
    writeBuffer(value: Uint8Array, writeLength?: boolean): void;
    writeFloat32(value: number): void;
    writeFloat64(value: number): void;
    writeInt8(value: number): void;
    writeInt16(value: number): void;
    writeInt32(value: number): void;
    writeInt64(value: bigint): void;
    writeUint8(value: number): void;
    writeUint16(value: number): void;
    writeUint32(value: number): void;
    writeUint64(value: bigint): void;
    getFloat32(offset: number): number;
    getFloat64(offset: number): number;
    getInt8(offset: number): number;
    getInt16(offset: number): number;
    getInt32(offset: number): number;
    getInt64(offset: number): bigint;
    getUint8(offset: number): number;
    getUint16(offset: number): number;
    getUint32(offset: number): number;
    getUint64(offset: number): bigint;
    setFloat32(offset: number, value: number): void;
    setFloat64(offset: number, value: number): void;
    setInt8(offset: number, value: number): void;
    setInt16(offset: number, value: number): void;
    setInt32(offset: number, value: number): void;
    setInt64(offset: number, value: bigint): void;
    setUint8(offset: number, value: number): void;
    setUint16(offset: number, value: number): void;
    setUint32(offset: number, value: number): void;
    setUint64(offset: number, value: bigint): void;
};

/**
 * @param writing - writing option, see object specs.
 * @param reading - reading option, see object specs.
 * @param initialCapacity - Initial capacity of buffer to allocate, ignored if you use writing or reading options
 */
declare interface CreateByteBufferOptions {
    /**
     * @param buffer - a buffer already allocated to read from there.
     * @param currentOffset - set the cursor where begins to read. Default 0
     * @param length - delimite where the valid data ends. Default: buffer.length
     */
    reading?: {
        buffer: Uint8Array;
        length?: number;
        currentOffset: number;
    };
    /**
     * @param buffer - a buffer already allocated to write there.
     * @param currentOffset - set the cursor to not start writing from the begin of it. Default 0
     */
    writing?: {
        buffer: Uint8Array;
        currentOffset?: number;
    };
    initialCapacity?: number;
}

/**
 * Make each field readonly deeply
 * @public
 */
declare type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

declare function defineSdkComponents(engine: Pick<IEngine, 'defineComponent'>): {
    Animator: ComponentDefinition<EcsType<PBAnimator>>;
    AudioSource: ComponentDefinition<EcsType<PBAudioSource>>;
    AudioStream: ComponentDefinition<EcsType<PBAudioStream>>;
    AvatarAttach: ComponentDefinition<EcsType<PBAvatarAttach>>;
    AvatarModifierArea: ComponentDefinition<EcsType<PBAvatarModifierArea>>;
    AvatarShape: ComponentDefinition<EcsType<PBAvatarShape>>;
    Billboard: ComponentDefinition<EcsType<PBBillboard>>;
    BoxShape: ComponentDefinition<EcsType<PBBoxShape>>;
    CameraModeArea: ComponentDefinition<EcsType<PBCameraModeArea>>;
    CylinderShape: ComponentDefinition<EcsType<PBCylinderShape>>;
    GLTFShape: ComponentDefinition<EcsType<PBGLTFShape>>;
    NFTShape: ComponentDefinition<EcsType<PBNFTShape>>;
    OnPointerDown: ComponentDefinition<EcsType<PBOnPointerDown>>;
    OnPointerDownResult: ComponentDefinition<EcsType<PBOnPointerDownResult>>;
    OnPointerUp: ComponentDefinition<EcsType<PBOnPointerUp>>;
    OnPointerUpResult: ComponentDefinition<EcsType<PBOnPointerUpResult>>;
    PlaneShape: ComponentDefinition<EcsType<PBPlaneShape>>;
    SphereShape: ComponentDefinition<EcsType<PBSphereShape>>;
    TextShape: ComponentDefinition<EcsType<PBTextShape>>;
    UiTransform: ComponentDefinition<EcsType<PBUiTransform>>;
    Transform: ComponentDefinition<EcsType<Transform>>;
};

/**
 * Constant used to convert from Euler degrees to radians
 * @public
 */
declare const DEG2RAD: number;

/** @public */
declare type double = number;

/**
 * @public
 */
declare const EcsBoolean: EcsType<boolean>;

/**
 * @public
 */
declare type EcsResult<T extends EcsType> = T extends EcsType ? ReturnType<T['deserialize']> : never;

/**
 * @public
 */
declare const EcsString: EcsType<string>;

/**
 * @public
 */
declare type EcsType<T = any> = {
    serialize(value: T, builder: ByteBuffer): void;
    deserialize(reader: ByteBuffer): T;
    create(): T;
};

/**
 * @public
 */
declare function Engine({ transports }?: IEngineParams): IEngine;

/**
 * @alpha * This file initialization is an alpha one. This is based on the old-ecs
 * init and it'll be changing.
 */
declare const engine: IEngine;

/**
 * @public
 */
declare type Entity = number & {
    [entitySymbol]: true;
};

declare const entitySymbol: unique symbol;

/**
 * @public
 */
declare function Enum<T>(type: EcsType<any>): EcsType<T>;

/**
 * Constant used to define the minimal number value in Babylon.js
 * @public
 */
declare const Epsilon = 0.000001;

/** Excludes property keys from T where the property is assignable to U */
declare type ExcludeUndefined<T> = {
    [P in keyof T]: undefined extends T[P] ? never : P;
}[keyof T];

/**
 * @public
 */
declare const FlatString: EcsType<string>;

/** @public */
declare type float = number;

/**
 * @public
 */
declare const Float32: EcsType<number>;

/**
 * @public
 */
declare const Float64: EcsType<number>;

/** @public */
declare type FloatArray = number[];

/**
 * @public
 */
declare type IEngine = {
    addEntity(dynamic?: boolean): Entity;
    addDynamicEntity(): Entity;
    removeEntity(entity: Entity): void;
    addSystem(system: Update, priority?: number): number;
    removeSystem(id: SystemId): boolean;
    defineComponent<T extends EcsType>(componentId: number, spec: T): ComponentDefinition<T>;
    mutableGroupOf<T extends [ComponentDefinition, ...ComponentDefinition[]]>(...components: T): Iterable<[Entity, ...ComponentEcsType<T>]>;
    groupOf<T extends [ComponentDefinition, ...ComponentDefinition[]]>(...components: T): Iterable<[Entity, ...DeepReadonly<ComponentEcsType<T>>]>;
    getComponent<T extends EcsType>(componentId: number): ComponentDefinition<T>;
    update(dt: number): void;
    baseComponents: SdkComponetns;
};

/**
 * @public
 */
declare type IEngineParams = {
    transports?: Transport[];
};

/** Include property keys from T where the property is assignable to U */
declare type IncludeUndefined<T> = {
    [P in keyof T]: undefined extends T[P] ? P : never;
}[keyof T];

/**
 * @public
 */
declare const Int16: EcsType<number>;

/**
 * @public
 */
declare const Int32: EcsType<number>;

/**
 * @public
 */
declare const Int64: EcsType<number>;

/**
 * @public
 */
declare const Int8: EcsType<number>;

/**
 * Interface for the size containing width and height
 * @public
 */
declare interface ISize {
    /**
     * Width
     */
    width: number;
    /**
     * Heighht
     */
    height: number;
}

/**
 * @public
 */
declare function MapType<T extends Spec>(spec: T): EcsType<Result<T>>;

/**
 * Class used to store matrix data (4x4)
 * @public
 */
declare namespace Matrix {
    type Matrix4x4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
    ];
    type MutableMatrix = {
        /**
         * Gets the update flag of the matrix which is an unique number for the matrix.
         * It will be incremented every time the matrix data change.
         * You can use it to speed the comparison between two versions of the same matrix.
         */
        updateFlag: number;
        isIdentity: boolean;
        isIdentity3x2: boolean;
        _isIdentityDirty: boolean;
        _isIdentity3x2Dirty: boolean;
        _m: Matrix4x4;
    };
    type ReadonlyMatrix = DeepReadonly<MutableMatrix>;
    /**
     * Gets the internal data of the matrix
     */
    function m(self: MutableMatrix): Readonly<Matrix4x4>;
    /**
     * Gets an identity matrix that must not be updated
     */
    function IdentityReadOnly(): ReadonlyMatrix;
    /**
     * Creates an empty matrix (filled with zeros)
     */
    function create(): MutableMatrix;
    /**
     * Creates a matrix from an array
     * @param array - defines the source array
     * @param offset - defines an offset in the source array
     * @returns a new Matrix set from the starting index of the given array
     */
    function fromArray(array: ArrayLike<number>, offset?: number): MutableMatrix;
    /**
     * Copy the content of an array into a given matrix
     * @param array - defines the source array
     * @param offset - defines an offset in the source array
     * @param result - defines the target matrix
     */
    function fromArrayToRef(array: ArrayLike<number>, offset: number, result: MutableMatrix): void;
    /**
     * Stores an array into a matrix after having multiplied each component by a given factor
     * @param array - defines the source array
     * @param offset - defines the offset in the source array
     * @param scale - defines the scaling factor
     * @param result - defines the target matrix
     */
    function fromFloatArrayToRefScaled(array: FloatArray, offset: number, scale: number, result: MutableMatrix): void;
    /**
     * Stores a list of values (16) inside a given matrix
     * @param initialM11 - defines 1st value of 1st row
     * @param initialM12 - defines 2nd value of 1st row
     * @param initialM13 - defines 3rd value of 1st row
     * @param initialM14 - defines 4th value of 1st row
     * @param initialM21 - defines 1st value of 2nd row
     * @param initialM22 - defines 2nd value of 2nd row
     * @param initialM23 - defines 3rd value of 2nd row
     * @param initialM24 - defines 4th value of 2nd row
     * @param initialM31 - defines 1st value of 3rd row
     * @param initialM32 - defines 2nd value of 3rd row
     * @param initialM33 - defines 3rd value of 3rd row
     * @param initialM34 - defines 4th value of 3rd row
     * @param initialM41 - defines 1st value of 4th row
     * @param initialM42 - defines 2nd value of 4th row
     * @param initialM43 - defines 3rd value of 4th row
     * @param initialM44 - defines 4th value of 4th row
     * @param result - defines the target matrix
     */
    function fromValuesToRef(initialM11: number, initialM12: number, initialM13: number, initialM14: number, initialM21: number, initialM22: number, initialM23: number, initialM24: number, initialM31: number, initialM32: number, initialM33: number, initialM34: number, initialM41: number, initialM42: number, initialM43: number, initialM44: number, result: MutableMatrix): void;
    /**
     * Creates new matrix from a list of values (16)
     * @param initialM11 - defines 1st value of 1st row
     * @param initialM12 - defines 2nd value of 1st row
     * @param initialM13 - defines 3rd value of 1st row
     * @param initialM14 - defines 4th value of 1st row
     * @param initialM21 - defines 1st value of 2nd row
     * @param initialM22 - defines 2nd value of 2nd row
     * @param initialM23 - defines 3rd value of 2nd row
     * @param initialM24 - defines 4th value of 2nd row
     * @param initialM31 - defines 1st value of 3rd row
     * @param initialM32 - defines 2nd value of 3rd row
     * @param initialM33 - defines 3rd value of 3rd row
     * @param initialM34 - defines 4th value of 3rd row
     * @param initialM41 - defines 1st value of 4th row
     * @param initialM42 - defines 2nd value of 4th row
     * @param initialM43 - defines 3rd value of 4th row
     * @param initialM44 - defines 4th value of 4th row
     * @returns the new matrix
     */
    function fromValues(initialM11: number, initialM12: number, initialM13: number, initialM14: number, initialM21: number, initialM22: number, initialM23: number, initialM24: number, initialM31: number, initialM32: number, initialM33: number, initialM34: number, initialM41: number, initialM42: number, initialM43: number, initialM44: number): MutableMatrix;
    /**
     * Creates a new matrix composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * @param scale - defines the scale vector3
     * @param rotation - defines the rotation quaternion
     * @param translation - defines the translation vector3
     * @returns a new matrix
     */
    function compose(scale: Vector3.ReadonlyVector3, rotation: Quaternion.ReadonlyQuaternion, translation: Vector3.ReadonlyVector3): MutableMatrix;
    /**
     * Sets a matrix to a value composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * @param scale - defines the scale vector3
     * @param rotation - defines the rotation quaternion
     * @param translation - defines the translation vector3
     * @param result - defines the target matrix
     */
    function composeToRef(scale: Vector3.ReadonlyVector3, rotation: Quaternion.ReadonlyQuaternion, translation: Vector3.ReadonlyVector3, result: MutableMatrix): void;
    /**
     * Creates a new identity matrix
     * @returns a new identity matrix
     */
    function Identity(): MutableMatrix;
    /**
     * Creates a new identity matrix and stores the result in a given matrix
     * @param result - defines the target matrix
     */
    function IdentityToRef(result: MutableMatrix): void;
    /**
     * Creates a new zero matrix
     * @returns a new zero matrix
     */
    function Zero(): MutableMatrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the X axis
     * @param angle - defines the angle (in radians) to use
     * @returns the new matrix
     */
    function RotationX(angle: number): MutableMatrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the X axis and stores it in a given matrix
     * @param angle - defines the angle (in radians) to use
     * @param result - defines the target matrix
     */
    function rotationXToRef(angle: number, result: MutableMatrix): void;
    /**
     * Creates a new rotation matrix for "angle" radians around the Y axis
     * @param angle - defines the angle (in radians) to use
     * @returns the new matrix
     */
    function rotationY(angle: number): MutableMatrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the Y axis and stores it in a given matrix
     * @param angle - defines the angle (in radians) to use
     * @param result - defines the target matrix
     */
    function rotationYToRef(angle: number, result: MutableMatrix): void;
    /**
     * Creates a new rotation matrix for "angle" radians around the Z axis
     * @param angle - defines the angle (in radians) to use
     * @returns the new matrix
     */
    function rotationZ(angle: number): MutableMatrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the Z axis and stores it in a given matrix
     * @param angle - defines the angle (in radians) to use
     * @param result - defines the target matrix
     */
    function rotationZToRef(angle: number, result: MutableMatrix): void;
    /**
     * Creates a new rotation matrix for "angle" radians around the given axis
     * @param axis - defines the axis to use
     * @param angle - defines the angle (in radians) to use
     * @returns the new matrix
     */
    function rotationAxis(axis: Vector3.ReadonlyVector3, angle: number): MutableMatrix;
    /**
     * Creates a new rotation matrix for "angle" radians around the given axis and stores it in a given matrix
     * @param axis - defines the axis to use
     * @param angle - defines the angle (in radians) to use
     * @param result - defines the target matrix
     */
    function rotationAxisToRef(_axis: Vector3.ReadonlyVector3, angle: number, result: MutableMatrix): void;
    /**
     * Creates a rotation matrix
     * @param yaw - defines the yaw angle in radians (Y axis)
     * @param pitch - defines the pitch angle in radians (X axis)
     * @param roll - defines the roll angle in radians (X axis)
     * @returns the new rotation matrix
     */
    function rotationYawPitchRoll(yaw: number, pitch: number, roll: number): MutableMatrix;
    /**
     * Creates a rotation matrix and stores it in a given matrix
     * @param yaw - defines the yaw angle in radians (Y axis)
     * @param pitch - defines the pitch angle in radians (X axis)
     * @param roll - defines the roll angle in radians (X axis)
     * @param result - defines the target matrix
     */
    function rotationYawPitchRollToRef(yaw: number, pitch: number, roll: number, result: MutableMatrix): void;
    /**
     * Creates a scaling matrix
     * @param x - defines the scale factor on X axis
     * @param y - defines the scale factor on Y axis
     * @param z - defines the scale factor on Z axis
     * @returns the new matrix
     */
    function scaling(x: number, y: number, z: number): MutableMatrix;
    /**
     * Creates a scaling matrix and stores it in a given matrix
     * @param x - defines the scale factor on X axis
     * @param y - defines the scale factor on Y axis
     * @param z - defines the scale factor on Z axis
     * @param result - defines the target matrix
     */
    function scalingToRef(x: number, y: number, z: number, result: MutableMatrix): void;
    /**
     * Creates a translation matrix
     * @param x - defines the translation on X axis
     * @param y - defines the translation on Y axis
     * @param z - defines the translationon Z axis
     * @returns the new matrix
     */
    function translation(x: number, y: number, z: number): MutableMatrix;
    /**
     * Creates a translation matrix and stores it in a given matrix
     * @param x - defines the translation on X axis
     * @param y - defines the translation on Y axis
     * @param z - defines the translationon Z axis
     * @param result - defines the target matrix
     */
    function translationToRef(x: number, y: number, z: number, result: MutableMatrix): void;
    /**
     * Returns a new Matrix whose values are the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
     * @param startValue - defines the start value
     * @param endValue - defines the end value
     * @param gradient - defines the gradient factor
     * @returns the new matrix
     */
    function lerp(startValue: ReadonlyMatrix, endValue: ReadonlyMatrix, gradient: number): MutableMatrix;
    /**
     * Set the given matrix "result" as the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
     * @param startValue - defines the start value
     * @param endValue - defines the end value
     * @param gradient - defines the gradient factor
     * @param result - defines the Matrix object where to store data
     */
    function lerpToRef(startValue: ReadonlyMatrix, endValue: ReadonlyMatrix, gradient: number, result: MutableMatrix): void;
    /**
     * Builds a new matrix whose values are computed by:
     * * decomposing the the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
     * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
     * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
     * @param startValue - defines the first matrix
     * @param endValue - defines the second matrix
     * @param gradient - defines the gradient between the two matrices
     * @returns the new matrix
     */
    function decomposeLerp(startValue: ReadonlyMatrix, endValue: ReadonlyMatrix, gradient: number): MutableMatrix;
    /**
     * Update a matrix to values which are computed by:
     * * decomposing the the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
     * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
     * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
     * @param startValue - defines the first matrix
     * @param endValue - defines the second matrix
     * @param gradient - defines the gradient between the two matrices
     * @param result - defines the target matrix
     */
    function decomposeLerpToRef(startValue: ReadonlyMatrix, endValue: ReadonlyMatrix, gradient: number, result: MutableMatrix): void;
    /**
     * Gets a new rotation matrix used to rotate an entity so as it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up"
     * self function works in left handed mode
     * @param eye - defines the final position of the entity
     * @param target - defines where the entity should look at
     * @param up - defines the up vector for the entity
     * @returns the new matrix
     */
    function LookAtLH(eye: Vector3.ReadonlyVector3, target: Vector3.ReadonlyVector3, up: Vector3.ReadonlyVector3): MutableMatrix;
    /**
     * Sets the given "result" Matrix to a rotation matrix used to rotate an entity so that it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up".
     * self function works in left handed mode
     * @param eye - defines the final position of the entity
     * @param target - defines where the entity should look at
     * @param up - defines the up vector for the entity
     * @param result - defines the target matrix
     */
    function lookAtLHToRef(eye: Vector3.ReadonlyVector3, target: Vector3.ReadonlyVector3, up: Vector3.ReadonlyVector3, result: MutableMatrix): void;
    /**
     * Gets a new rotation matrix used to rotate an entity so as it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up"
     * self function works in right handed mode
     * @param eye - defines the final position of the entity
     * @param target - defines where the entity should look at
     * @param up - defines the up vector for the entity
     * @returns the new matrix
     */
    function lookAtRH(eye: Vector3.ReadonlyVector3, target: Vector3.ReadonlyVector3, up: Vector3.ReadonlyVector3): MutableMatrix;
    /**
     * Sets the given "result" Matrix to a rotation matrix used to rotate an entity so that it looks at the target vector3, from the eye vector3 position, the up vector3 being oriented like "up".
     * self function works in right handed mode
     * @param eye - defines the final position of the entity
     * @param target - defines where the entity should look at
     * @param up - defines the up vector for the entity
     * @param result - defines the target matrix
     */
    function lookAtRHToRef(eye: Vector3.ReadonlyVector3, target: Vector3.ReadonlyVector3, up: Vector3.ReadonlyVector3, result: MutableMatrix): void;
    /**
     * Create a left-handed orthographic projection matrix
     * @param width - defines the viewport width
     * @param height - defines the viewport height
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @returns a new matrix as a left-handed orthographic projection matrix
     */
    function orthoLH(width: number, height: number, znear: number, zfar: number): MutableMatrix;
    /**
     * Store a left-handed orthographic projection to a given matrix
     * @param width - defines the viewport width
     * @param height - defines the viewport height
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @param result - defines the target matrix
     */
    function orthoLHToRef(width: number, height: number, znear: number, zfar: number, result: MutableMatrix): void;
    /**
     * Create a left-handed orthographic projection matrix
     * @param left - defines the viewport left coordinate
     * @param right - defines the viewport right coordinate
     * @param bottom - defines the viewport bottom coordinate
     * @param top - defines the viewport top coordinate
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @returns a new matrix as a left-handed orthographic projection matrix
     */
    function OrthoOffCenterLH(left: number, right: number, bottom: number, top: number, znear: number, zfar: number): MutableMatrix;
    /**
     * Stores a left-handed orthographic projection into a given matrix
     * @param left - defines the viewport left coordinate
     * @param right - defines the viewport right coordinate
     * @param bottom - defines the viewport bottom coordinate
     * @param top - defines the viewport top coordinate
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @param result - defines the target matrix
     */
    function orthoOffCenterLHToRef(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, result: MutableMatrix): void;
    /**
     * Creates a right-handed orthographic projection matrix
     * @param left - defines the viewport left coordinate
     * @param right - defines the viewport right coordinate
     * @param bottom - defines the viewport bottom coordinate
     * @param top - defines the viewport top coordinate
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @returns a new matrix as a right-handed orthographic projection matrix
     */
    function orthoOffCenterRH(left: number, right: number, bottom: number, top: number, znear: number, zfar: number): MutableMatrix;
    /**
     * Stores a right-handed orthographic projection into a given matrix
     * @param left - defines the viewport left coordinate
     * @param right - defines the viewport right coordinate
     * @param bottom - defines the viewport bottom coordinate
     * @param top - defines the viewport top coordinate
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @param result - defines the target matrix
     */
    function orthoOffCenterRHToRef(left: number, right: number, bottom: number, top: number, znear: number, zfar: number, result: MutableMatrix): void;
    /**
     * Creates a left-handed perspective projection matrix
     * @param width - defines the viewport width
     * @param height - defines the viewport height
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @returns a new matrix as a left-handed perspective projection matrix
     */
    function perspectiveLH(width: number, height: number, znear: number, zfar: number): MutableMatrix;
    /**
     * Creates a left-handed perspective projection matrix
     * @param fov - defines the horizontal field of view
     * @param aspect - defines the aspect ratio
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @returns a new matrix as a left-handed perspective projection matrix
     */
    function perspectiveFovLH(fov: number, aspect: number, znear: number, zfar: number): MutableMatrix;
    /**
     * Stores a left-handed perspective projection into a given matrix
     * @param fov - defines the horizontal field of view
     * @param aspect - defines the aspect ratio
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @param result - defines the target matrix
     * @param isVerticalFovFixed - defines it the fov is vertically fixed (default) or horizontally
     */
    function perspectiveFovLHToRef(fov: number, aspect: number, znear: number, zfar: number, result: MutableMatrix, isVerticalFovFixed?: boolean): void;
    /**
     * Creates a right-handed perspective projection matrix
     * @param fov - defines the horizontal field of view
     * @param aspect - defines the aspect ratio
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @returns a new matrix as a right-handed perspective projection matrix
     */
    function PerspectiveFovRH(fov: number, aspect: number, znear: number, zfar: number): MutableMatrix;
    /**
     * Stores a right-handed perspective projection into a given matrix
     * @param fov - defines the horizontal field of view
     * @param aspect - defines the aspect ratio
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @param result - defines the target matrix
     * @param isVerticalFovFixed - defines it the fov is vertically fixed (default) or horizontally
     */
    function perspectiveFovRHToRef(fov: number, aspect: number, znear: number, zfar: number, result: MutableMatrix, isVerticalFovFixed?: boolean): void;
    /**
     * Stores a perspective projection for WebVR info a given matrix
     * @param fov - defines the field of view
     * @param znear - defines the near clip plane
     * @param zfar - defines the far clip plane
     * @param result - defines the target matrix
     * @param rightHanded - defines if the matrix must be in right-handed mode (false by default)
     */
    function perspectiveFovWebVRToRef(fov: {
        upDegrees: number;
        downDegrees: number;
        leftDegrees: number;
        rightDegrees: number;
    }, znear: number, zfar: number, result: MutableMatrix, rightHanded?: boolean): void;
    /**
     * Extracts a 2x2 matrix from a given matrix and store the result in a FloatArray
     * @param matrix - defines the matrix to use
     * @returns a new FloatArray array with 4 elements : the 2x2 matrix extracted from the given matrix
     */
    function GetAsMatrix2x2(matrix: ReadonlyMatrix): FloatArray;
    /**
     * Extracts a 3x3 matrix from a given matrix and store the result in a FloatArray
     * @param matrix - defines the matrix to use
     * @returns a new FloatArray array with 9 elements : the 3x3 matrix extracted from the given matrix
     */
    function GetAsMatrix3x3(matrix: ReadonlyMatrix): FloatArray;
    /**
     * Compute the transpose of a given matrix
     * @param matrix - defines the matrix to transpose
     * @returns the new matrix
     */
    function transpose(matrix: ReadonlyMatrix): MutableMatrix;
    /**
     * Compute the transpose of a matrix and store it in a target matrix
     * @param matrix - defines the matrix to transpose
     * @param result - defines the target matrix
     */
    function transposeToRef(matrix: ReadonlyMatrix, result: MutableMatrix): void;
    /**
     * Computes a reflection matrix from a plane
     * @param plane - defines the reflection plane
     * @returns a new matrix
     */
    function reflection(plane: Plane.ReadonlyPlane): MutableMatrix;
    /**
     * Computes a reflection matrix from a plane
     * @param plane - defines the reflection plane
     * @param result - defines the target matrix
     */
    function reflectionToRef(_plane: Plane.ReadonlyPlane, result: MutableMatrix): void;
    /**
     * Sets the given matrix as a rotation matrix composed from the 3 left handed axes
     * @param xaxis - defines the value of the 1st axis
     * @param yaxis - defines the value of the 2nd axis
     * @param zaxis - defines the value of the 3rd axis
     * @param result - defines the target matrix
     */
    function fromXYZAxesToRef(xaxis: Vector3.ReadonlyVector3, yaxis: Vector3.ReadonlyVector3, zaxis: Vector3.ReadonlyVector3, result: MutableMatrix): void;
    /**
     * Creates a rotation matrix from a quaternion and stores it in a target matrix
     * @param quat - defines the quaternion to use
     * @param result - defines the target matrix
     */
    function fromQuaternionToRef(quat: Quaternion.ReadonlyQuaternion, result: MutableMatrix): void;
    /**
     * Check if the current matrix is identity
     * @returns true is the matrix is the identity matrix
     */
    function isIdentityUpdate(self: MutableMatrix): boolean;
    /**
     * Check if the current matrix is identity as a texture matrix (3x2 store in 4x4)
     * @returns true is the matrix is the identity matrix
     */
    function isIdentityAs3x2Update(self: MutableMatrix): boolean;
    /**
     * Gets the determinant of the matrix
     * @returns the matrix determinant
     */
    function determinant(self: ReadonlyMatrix): number;
    /**
     * Returns the matrix as a FloatArray
     * @returns the matrix underlying array
     */
    function toArray(self: ReadonlyMatrix): Readonly<FloatArray>;
    /**
     * Returns the matrix as a FloatArray
     * @returns the matrix underlying array.
     */
    function asArray(self: ReadonlyMatrix): Readonly<FloatArray>;
    /**
     * Sets all the matrix elements to zero
     * @returns the current matrix
     */
    function reset(self: MutableMatrix): void;
    /**
     * Adds the current matrix with a second one
     * @param other - defines the matrix to add
     * @returns a new matrix as the addition of the current matrix and the given one
     */
    function add(self: ReadonlyMatrix, other: ReadonlyMatrix): MutableMatrix;
    /**
     * Sets the given matrix "result" to the addition of the current matrix and the given one
     * @param other - defines the matrix to add
     * @param result - defines the target matrix
     * @returns the current matrix
     */
    function addToRef(self: ReadonlyMatrix, other: ReadonlyMatrix, result: MutableMatrix): void;
    /**
     * Adds in place the given matrix to the current matrix
     * @param other - defines the second operand
     * @returns the current updated matrix
     */
    function addToSelf(self: MutableMatrix, other: ReadonlyMatrix): void;
    /**
     * Creates a new matrix as the invert of a given matrix
     * @param source - defines the source matrix
     * @returns the new matrix
     */
    function invert(source: ReadonlyMatrix): MutableMatrix;
    /**
     * Sets the given matrix to the current inverted Matrix
     * @param other - defines the target matrix
     * @returns the unmodified current matrix
     */
    function invertToRef(source: ReadonlyMatrix, result: MutableMatrix): void;
    /**
     * add a value at the specified position in the current Matrix
     * @param index - the index of the value within the matrix. between 0 and 15.
     * @param value - the value to be added
     * @returns the current updated matrix
     */
    function addAtIndex(self: MutableMatrix, index: number, value: number): void;
    /**
     * mutiply the specified position in the current Matrix by a value
     * @param index - the index of the value within the matrix. between 0 and 15.
     * @param value - the value to be added
     * @returns the current updated matrix
     */
    function multiplyAtIndex(self: MutableMatrix, index: number, value: number): MutableMatrix;
    /**
     * Inserts the translation vector (using 3 floats) in the current matrix
     * @param x - defines the 1st component of the translation
     * @param y - defines the 2nd component of the translation
     * @param z - defines the 3rd component of the translation
     * @returns the current updated matrix
     */
    function setTranslationFromFloats(self: MutableMatrix, x: number, y: number, z: number): void;
    /**
     * Inserts the translation vector in the current matrix
     * @param vector3 - defines the translation to insert
     * @returns the current updated matrix
     */
    function setTranslation(self: MutableMatrix, vector3: Vector3.ReadonlyVector3): void;
    /**
     * Gets the translation value of the current matrix
     * @returns a new Vector3 as the extracted translation from the matrix
     */
    function getTranslation(self: MutableMatrix): Vector3.MutableVector3;
    /**
     * Fill a Vector3 with the extracted translation from the matrix
     * @param result - defines the Vector3 where to store the translation
     * @returns the current matrix
     */
    function getTranslationToRef(self: MutableMatrix, result: Vector3.MutableVector3): void;
    /**
     * Remove rotation and scaling part from the matrix
     * @returns the updated matrix
     */
    function removeRotationAndScaling(self: MutableMatrix): MutableMatrix;
    /**
     * Multiply two matrices
     * @param other - defines the second operand
     * @returns a new matrix set with the multiplication result of the current Matrix and the given one
     */
    function multiply(self: MutableMatrix, other: ReadonlyMatrix): MutableMatrix;
    /**
     * Copy the current matrix from the given one
     * @param other - defines the source matrix
     * @returns the current updated matrix
     */
    function copy(from: ReadonlyMatrix, dest: MutableMatrix): void;
    /**
     * Populates the given array from the starting index with the current matrix values
     * @param array - defines the target array
     * @param offset - defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    function copyToArray(self: ReadonlyMatrix, arrayDest: FloatArray, offsetDest?: number): void;
    /**
     * Sets the given matrix "result" with the multiplication result of the current Matrix and the given one
     * @param other - defines the second operand
     * @param result - defines the matrix where to store the multiplication
     * @returns the current matrix
     */
    function multiplyToRef(self: ReadonlyMatrix, other: ReadonlyMatrix, result: MutableMatrix): void;
    /**
     * Sets the FloatArray "result" from the given index "offset" with the multiplication of the current matrix and the given one
     * @param other - defines the second operand
     * @param result - defines the array where to store the multiplication
     * @param offset - defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    function multiplyToArray(self: ReadonlyMatrix, other: ReadonlyMatrix, result: FloatArray, offset: number): void;
    /**
     * Check equality between self matrix and a second one
     * @param value - defines the second matrix to compare
     * @returns true is the current matrix and the given one values are strictly equal
     */
    function equals(self: ReadonlyMatrix, value: ReadonlyMatrix): boolean;
    /**
     * Clone the current matrix
     * @returns a new matrix from the current matrix
     */
    function clone(self: ReadonlyMatrix): MutableMatrix;
    /**
     * Gets the hash code of the current matrix
     * @returns the hash code
     */
    function getHashCode(self: ReadonlyMatrix): number;
    /**
     * Decomposes the current Matrix into a translation, rotation and scaling components
     * @param scale - defines the scale vector3 given as a reference to update
     * @param rotation - defines the rotation quaternion given as a reference to update
     * @param translation - defines the translation vector3 given as a reference to update
     * @returns true if operation was successful
     */
    function decompose(self: ReadonlyMatrix, scale?: Vector3.MutableVector3, rotation?: Quaternion.MutableQuaternion, translation?: Vector3.MutableVector3): boolean;
    /**
     * Gets specific row of the matrix
     * @param index - defines the number of the row to get
     * @returns the index-th row of the current matrix as a new Vector4
     */
    /**
     * Sets the index-th row of the current matrix to the vector4 values
     * @param index - defines the number of the row to set
     * @param row - defines the target vector4
     * @returns the updated current matrix
     */
    /**
     * Sets the index-th row of the current matrix with the given 4 x float values
     * @param index - defines the row index
     * @param x - defines the x component to set
     * @param y - defines the y component to set
     * @param z - defines the z component to set
     * @param w - defines the w component to set
     * @returns the updated current matrix
     */
    function setRowFromFloats(self: MutableMatrix, index: number, x: number, y: number, z: number, w: number): void;
    /**
     * Compute a new matrix set with the current matrix values multiplied by scale (float)
     * @param scale - defines the scale factor
     * @returns a new matrix
     */
    function scale(self: ReadonlyMatrix, scale: number): MutableMatrix;
    /**
     * Scale the current matrix values by a factor to a given result matrix
     * @param scale - defines the scale factor
     * @param result - defines the matrix to store the result
     * @returns the current matrix
     */
    function scaleToRef(self: ReadonlyMatrix, scale: number, result: MutableMatrix): void;
    /**
     * Scale the current matrix values by a factor and add the result to a given matrix
     * @param scale - defines the scale factor
     * @param result - defines the Matrix to store the result
     * @returns the current matrix
     */
    function scaleAndAddToRef(self: ReadonlyMatrix, scale: number, result: MutableMatrix): void;
    /**
     * Writes to the given matrix a normal matrix, computed from self one (using values from identity matrix for fourth row and column).
     * @param ref - matrix to store the result
     */
    function normalMatrixToRef(self: ReadonlyMatrix, ref: MutableMatrix): void;
    /**
     * Gets only rotation part of the current matrix
     * @returns a new matrix sets to the extracted rotation matrix from the current one
     */
    function getRotationMatrix(self: ReadonlyMatrix): MutableMatrix;
    /**
     * Extracts the rotation matrix from the current one and sets it as the given "result"
     * @param result - defines the target matrix to store data to
     * @returns the current matrix
     */
    function getRotationMatrixToRef(self: ReadonlyMatrix, result: MutableMatrix): void;
    /**
     * Toggles model matrix from being right handed to left handed in place and vice versa
     */
    function toggleModelMatrixHandInPlace(self: MutableMatrix): void;
    /**
     * Toggles projection matrix from being right handed to left handed in place and vice versa
     */
    function toggleProjectionMatrixHandInPlace(self: MutableMatrix): void;
}

/** @public */
declare type Nullable<T> = T | null;

declare type OnlyNonUndefinedTypes<T> = {
    [K in ExcludeUndefined<T>]: T[K];
};

declare type OnlyOptionalUndefinedTypes<T> = {
    [K in IncludeUndefined<T>]?: T[K];
};

/**
 * @public
 */
declare function Optional<T>(spec: EcsType<T>): EcsType<T | undefined>;

/**
 * Defines potential orientation for back face culling
 * @public
 */
declare enum Orientation {
    /**
     * Clockwise
     */
    CW = 0,
    /** Counter clockwise */
    CCW = 1
}

declare interface PBAnimationState {
    name: string;
    clip: string;
    playing: boolean;
    weight: number;
    speed: number;
    loop: boolean;
    shouldReset: boolean;
}

declare interface PBAnimator {
    states: PBAnimationState[];
}

declare interface PBAudioSource {
    playing: boolean;
    volume: number;
    loop: boolean;
    pitch: number;
    playedAtTimestamp: number;
    audioClipUrl: string;
}

declare interface PBAudioStream {
    playing: boolean;
    volume: number;
    url: string;
}

declare interface PBAvatarAttach {
    avatarId: string;
    anchorPointId: number;
}

declare interface PBAvatarModifierArea {
    area: Vector3_2 | undefined;
    excludeIds: string[];
    modifiers: PBAvatarModifierArea_Modifier[];
}

declare enum PBAvatarModifierArea_Modifier {
    HIDE_AVATARS = 0,
    DISABLE_PASSPORTS = 1,
    UNRECOGNIZED = -1
}

declare interface PBAvatarShape {
    id: string;
    name: string;
    bodyShape: string;
    skinColor: Color3 | undefined;
    hairColor: Color3 | undefined;
    eyeColor: Color3 | undefined;
    wearables: string[];
    expressionTriggerId: string;
    expressionTriggerTimestamp: number;
    stickerTriggerId: string;
    stickerTriggerTimestamp: number;
    talking: boolean;
}

declare interface PBBillboard {
    x: boolean;
    y: boolean;
    z: boolean;
}

declare interface PBBoxShape {
    withCollisions: boolean;
    isPointerBlocker: boolean;
    visible: boolean;
    uvs: number[];
}

declare interface PBCameraModeArea {
    area: Vector3_2 | undefined;
    mode: PBCameraModeArea_CameraMode;
}

declare enum PBCameraModeArea_CameraMode {
    FIRST_PERSON = 0,
    THIRD_PERSON = 1,
    UNRECOGNIZED = -1
}

declare interface PBCylinderShape {
    withCollisions: boolean;
    isPointerBlocker: boolean;
    visible: boolean;
    radiusTop: number;
    radiusBottom: number;
}

declare interface PBGLTFShape {
    withCollisions: boolean;
    isPointerBlocker: boolean;
    visible: boolean;
    src: string;
}

declare interface PBNFTShape {
    withCollisions: boolean;
    isPointerBlocker: boolean;
    visible: boolean;
    src: string;
    assetId: string;
    style: number;
    color: Color3 | undefined;
}

declare interface PBOnPointerDown {
    button: number;
    hoverText: string;
    distance: number;
    showFeedback: boolean;
}

declare interface PBOnPointerDownResult {
    button: number;
    meshName: string;
    origin: Vector3_2 | undefined;
    direction: Vector3_2 | undefined;
    point: Vector3_2 | undefined;
    normal: Vector3_2 | undefined;
    distance: number;
    timestamp: number;
}

declare interface PBOnPointerUp {
    button: number;
    hoverText: string;
    distance: number;
    showFeedback: boolean;
}

declare interface PBOnPointerUpResult {
    button: number;
    meshName: string;
    origin: Vector3_2 | undefined;
    direction: Vector3_2 | undefined;
    point: Vector3_2 | undefined;
    normal: Vector3_2 | undefined;
    distance: number;
    timestamp: number;
}

declare interface PBPlaneShape {
    withCollisions: boolean;
    isPointerBlocker: boolean;
    visible: boolean;
    uvs: number[];
}

declare interface PBSphereShape {
    withCollisions: boolean;
    isPointerBlocker: boolean;
    visible: boolean;
}

declare interface PBTextShape {
    text: string;
    visible: boolean;
    font: string;
    opacity: number;
    fontSize: number;
    fontAutoSize: boolean;
    hTextAlign: string;
    vTextAlign: string;
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    lineSpacing: number;
    lineCount: number;
    textWrapping: boolean;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    outlineWidth: number;
    shadowColor: Color3 | undefined;
    outlineColor: Color3 | undefined;
    textColor: Color3 | undefined;
}

declare interface PBUiTransform {
    positionType: YGPositionType;
    alignContent: YGAlign;
    alignItems: YGAlign;
    alignSelf: YGAlign;
    flexDirection: YGFlexDirection;
    flexWrap: YGWrap;
    justifyContent: YGJustify;
    overflow: YGOverflow;
    display: YGDisplay;
    direction: YGDirection;
    flex: number;
    flexBasisUnit: YGUnit;
    flexBasis: number;
    flexGrow: number;
    flexShrink: number;
    widthUnit: YGUnit;
    width: number;
    heightUnit: YGUnit;
    height: number;
    minWidthUnit: YGUnit;
    minWidth: number;
    minHeightUnit: YGUnit;
    minHeight: number;
    maxWidthUnit: YGUnit;
    maxWidth: number;
    maxHeightUnit: YGUnit;
    maxHeight: number;
    positionLeftUnit: YGUnit;
    positionLeft: number;
    positionTopUnit: YGUnit;
    positionTop: number;
    positionRightUnit: YGUnit;
    positionRight: number;
    positionBottomUnit: YGUnit;
    positionBottom: number;
    /** margin */
    marginLeftUnit: YGUnit;
    marginLeft: number;
    marginTopUnit: YGUnit;
    marginTop: number;
    marginRightUnit: YGUnit;
    marginRight: number;
    marginBottomUnit: YGUnit;
    marginBottom: number;
    paddingLeftUnit: YGUnit;
    paddingLeft: number;
    paddingTopUnit: YGUnit;
    paddingTop: number;
    paddingRightUnit: YGUnit;
    paddingRight: number;
    paddingBottomUnit: YGUnit;
    paddingBottom: number;
    borderLeft: number;
    borderTop: number;
    borderRight: number;
    borderBottom: number;
}

/**
 * Represens a plane by the equation ax + by + cz + d = 0
 * @public
 */
declare namespace Plane {
    type MutablePlane = {
        /**
         * Normal of the plane (a,b,c)
         */
        normal: Vector3.MutableVector3;
        /**
         * d component of the plane
         */
        d: number;
    };
    type ReadonlyPlane = DeepReadonly<MutablePlane>;
    /**
     * Creates a Plane object according to the given floats a, b, c, d and the plane equation : ax + by + cz + d = 0
     * @param a - a component of the plane
     * @param b - b component of the plane
     * @param c - c component of the plane
     * @param d - d component of the plane
     */
    function create(a: number, b: number, c: number, d: number): {
        normal: Vector3.MutableVector3;
        d: number;
    };
    /**
     * Creates a plane from an  array
     * @param array - the array to create a plane from
     * @returns a new Plane from the given array.
     */
    function fromArray(array: ArrayLike<number>): MutablePlane;
    /**
     * Creates a plane from three points
     * @param point1 - point used to create the plane
     * @param point2 - point used to create the plane
     * @param point3 - point used to create the plane
     * @returns a new Plane defined by the three given points.
     */
    function fromPoints(_point1: Vector3.ReadonlyVector3, _point2: Vector3.ReadonlyVector3, _point3: Vector3.ReadonlyVector3): MutablePlane;
    /**
     * Creates a plane from an origin point and a normal
     * @param origin - origin of the plane to be constructed
     * @param normal - normal of the plane to be constructed
     * @returns a new Plane the normal vector to this plane at the given origin point.
     * Note : the vector "normal" is updated because normalized.
     */
    function romPositionAndNormal(origin: Vector3.ReadonlyVector3, normal: Vector3.ReadonlyVector3): MutablePlane;
    /**
     * Calculates the distance from a plane and a point
     * @param origin - origin of the plane to be constructed
     * @param normal - normal of the plane to be constructed
     * @param point - point to calculate distance to
     * @returns the signed distance between the plane defined by the normal vector at the "origin"" point and the given other point.
     */
    function signedDistanceToPlaneFromPositionAndNormal(origin: Vector3.ReadonlyVector3, normal: Vector3.ReadonlyVector3, point: Vector3.ReadonlyVector3): number;
    /**
     * @returns the plane coordinates as a new array of 4 elements [a, b, c, d].
     */
    function asArray(plane: ReadonlyPlane): number[];
    /**
     * @returns a new plane copied from the current Plane.
     */
    function clone(plane: ReadonlyPlane): MutablePlane;
    /**
     * @returns the Plane hash code.
     */
    function getHashCode(_plane: ReadonlyPlane): number;
    /**
     * Normalize the current Plane in place.
     * @returns the updated Plane.
     */
    function normalize(plane: ReadonlyPlane): MutablePlane;
    /**
     * Applies a transformation the plane and returns the result
     * @param transformation - the transformation matrix to be applied to the plane
     * @returns a new Plane as the result of the transformation of the current Plane by the given matrix.
     */
    function transform(plane: ReadonlyPlane, transformation: Matrix.ReadonlyMatrix): MutablePlane;
    /**
     * Calcualtte the dot product between the point and the plane normal
     * @param point - point to calculate the dot product with
     * @returns the dot product (float) of the point coordinates and the plane normal.
     */
    function dotCoordinate(plane: ReadonlyPlane, point: Vector3.ReadonlyVector3): number;
    /**
     * Updates the current Plane from the plane defined by the three given points.
     * @param point1 - one of the points used to contruct the plane
     * @param point2 - one of the points used to contruct the plane
     * @param point3 - one of the points used to contruct the plane
     * @returns the updated Plane.
     */
    function copyFromPoints(point1: Vector3.ReadonlyVector3, point2: Vector3.ReadonlyVector3, point3: Vector3.ReadonlyVector3): MutablePlane;
    /**
     * Checks if the plane is facing a given direction
     * @param direction - the direction to check if the plane is facing
     * @param epsilon - value the dot product is compared against (returns true if dot &lt;= epsilon)
     * @returns True is the vector "direction"  is the same side than the plane normal.
     */
    function isFrontFacingTo(plane: ReadonlyPlane, direction: Vector3.ReadonlyVector3, epsilon: number): boolean;
    /**
     * Calculates the distance to a point
     * @param point - point to calculate distance to
     * @returns the signed distance (float) from the given point to the Plane.
     */
    function signedDistanceTo(plane: ReadonlyPlane, point: Vector3.ReadonlyVector3): number;
}

/**
 * @public
 */
declare namespace Quaternion {
    /**
     * @public
     */
    export type MutableQuaternion = {
        y: number;
        x: number;
        z: number;
        w: number;
    };
    /**
     * @public
     */
    export type ReadonlyQuaternion = DeepReadonly<MutableQuaternion>;
    /**
     * Creates a new Quaternion from the given floats
     * @param x - defines the first component (0 by default)
     * @param y - defines the second component (0 by default)
     * @param z - defines the third component (0 by default)
     * @param w - defines the fourth component (1.0 by default)
     */
    export function create(
    /** defines the first component (0 by default) */
    x?: number, 
    /** defines the second component (0 by default) */
    y?: number, 
    /** defines the third component (0 by default) */
    z?: number, 
    /** defines the fourth component (1.0 by default) */
    w?: number): MutableQuaternion;
    /**
     * Returns a new Quaternion as the result of the addition of the two given quaternions.
     * @param q1 - the first quaternion
     * @param q2 - the second quaternion
     * @returns the resulting quaternion
     */
    export function add(q1: ReadonlyQuaternion, q2: ReadonlyQuaternion): MutableQuaternion;
    /**
     * Creates a new rotation from the given Euler float angles (y, x, z) and stores it in the target quaternion
     * @param yaw - defines the rotation around Y axis
     * @param pitch - defines the rotation around X axis
     * @param roll - defines the rotation around Z axis
     * @param result - defines the target quaternion
     */
    export function rotationYawPitchRoll(yaw: number, pitch: number, roll: number): MutableQuaternion;
    /**
     * Returns a rotation that rotates z degrees around the z axis, x degrees around the x axis, and y degrees around the y axis.
     * @param x - the rotation on the x axis in euler degrees
     * @param y - the rotation on the y axis in euler degrees
     * @param z - the rotation on the z axis in euler degrees
     */
    export function euler(x: number, y: number, z: number): MutableQuaternion;
    /**
     * Gets length of current quaternion
     * @returns the quaternion length (float)
     */
    export function length(q: ReadonlyQuaternion): number;
    /**
     * Gets length of current quaternion
     * @returns the quaternion length (float)
     */
    export function lengthSquared(q: ReadonlyQuaternion): number;
    /**
     * Returns the dot product (float) between the quaternions "left" and "right"
     * @param left - defines the left operand
     * @param right - defines the right operand
     * @returns the dot product
     */
    export function dot(left: ReadonlyQuaternion, right: ReadonlyQuaternion): number;
    /**
     * Returns the angle in degrees between two rotations a and b.
     * @param quat1 - defines the first quaternion
     * @param quat2 - defines the second quaternion
     */
    export function angle(quat1: ReadonlyQuaternion, quat2: ReadonlyQuaternion): number;
    /**
     * The from quaternion is rotated towards to by an angular step of maxDegreesDelta.
     * @param from - defines the first quaternion
     * @param to - defines the second quaternion
     * @param maxDegreesDelta - the interval step
     */
    export function rotateTowards(from: ReadonlyQuaternion, to: ReadonlyQuaternion, maxDegreesDelta: number): MutableQuaternion;
    /**
     * Creates a rotation with the specified forward and upwards directions.
     * @param forward - the direction to look in
     * @param up - the vector that defines in which direction up is
     */
    export function lookRotation(forward: Vector3.ReadonlyVector3, up?: Vector3.ReadonlyVector3): MutableQuaternion;
    /**
     * Normalize in place the current quaternion
     * @returns the current updated quaternion
     */
    export function normalize(q: ReadonlyQuaternion): MutableQuaternion;
    /**
     * Creates a rotation which rotates from fromDirection to toDirection.
     * @param from - defines the first direction Vector
     * @param to - defines the target direction Vector
     */
    export function fromToRotation(from: Vector3.ReadonlyVector3, to: Vector3.ReadonlyVector3, up?: Vector3.ReadonlyVector3): MutableQuaternion;
    /**
     * Creates an identity quaternion
     * @returns - the identity quaternion
     */
    export function Identity(): MutableQuaternion;
    /**
     * Gets or sets the euler angle representation of the rotation.
     * Implemented unity-based calculations from: https://stackoverflow.com/a/56055813
     */
    export function eulerAngles(q: MutableQuaternion): Vector3.MutableVector3;
    /**
     * Creates a new rotation from the given Euler float angles (y, x, z) and stores it in the target quaternion
     * @param yaw - defines the rotation around Y axis
     * @param pitch - defines the rotation around X axis
     * @param roll - defines the rotation around Z axis
     * @param result - defines the target quaternion
     */
    export function rotationYawPitchRollToRef(yaw: number, pitch: number, roll: number, result: Quaternion.MutableQuaternion): void;
    /**
     * Updates the given quaternion with the given rotation matrix values
     * @param matrix - defines the source matrix
     * @param result - defines the target quaternion
     */
    export function fromRotationMatrixToRef(matrix: Matrix.ReadonlyMatrix, result: Quaternion.MutableQuaternion): void;
    /**
     * Interpolates between two quaternions
     * @param left - defines first quaternion
     * @param right - defines second quaternion
     * @param amount - defines the gradient to use
     * @returns the new interpolated quaternion
     */
    export function slerp(left: ReadonlyQuaternion, right: ReadonlyQuaternion, amount: number): MutableQuaternion;
    /**
     * Interpolates between two quaternions and stores it into a target quaternion
     * @param left - defines first quaternion
     * @param right - defines second quaternion
     * @param amount - defines the gradient to use
     * @param result - defines the target quaternion
     */
    export function slerpToRef(left: ReadonlyQuaternion, right: ReadonlyQuaternion, amount: number, result: MutableQuaternion): void;
    /**
     * Multiplies two quaternions
     * @param self - defines the first operand
     * @param q1 - defines the second operand
     * @returns a new quaternion set as the multiplication result of the self one with the given one "q1"
     */
    export function multiply(self: ReadonlyQuaternion, q1: ReadonlyQuaternion): MutableQuaternion;
    /**
     * Sets the given "result" as the the multiplication result of the self one with the given one "q1"
     * @param self - defines the first operand
     * @param q1 - defines the second operand
     * @param result - defines the target quaternion
     * @returns the current quaternion
     */
    export function multiplyToRef(self: ReadonlyQuaternion, q1: ReadonlyQuaternion, result: MutableQuaternion): void;
    export function angleAxis(degress: number, axis: Vector3.ReadonlyVector3): MutableQuaternion;
    /**
     * Returns a zero filled quaternion
     */
    export function Zero(): MutableQuaternion;
}

/**
 * Constant used to convert from radians to Euler degrees
 * @public
 */
declare const RAD2DEG: number;

declare type ReceiveMessage = {
    type: WireMessage.Enum;
    entity: Entity;
    componentId: number;
    timestamp: number;
    transportType?: string;
    data?: Uint8Array;
    messageBuffer: Uint8Array;
};

/**
 * @public
 */
declare type Result<T extends Spec> = ToOptional<{
    [K in keyof T]: T[K] extends EcsType ? ReturnType<T[K]['deserialize']> : T[K] extends Spec ? Result<T[K]> : never;
}>;

/**
 * @public
 */
declare type SdkComponetns = ReturnType<typeof defineSdkComponents>;

/**
 * Defines supported spaces
 * @public
 */
declare enum Space {
    /** Local (object) space */
    LOCAL = 0,
    /** World space */
    WORLD = 1,
    /** Bone space */
    BONE = 2
}

/**
 * @public
 */
declare interface Spec {
    [key: string]: EcsType;
}

declare type SystemId = number;

/**
 * Constant used to convert a value to gamma space
 * @public
 */
declare const ToGammaSpace: number;

/**
 * Constant used to convert a value to linear space
 * @public
 */
declare const ToLinearSpace = 2.2;

declare type ToOptional<T> = OnlyOptionalUndefinedTypes<T> & OnlyNonUndefinedTypes<T>;

/**
 * @public
 */
declare type Transform = {
    position: Vector3.MutableVector3;
    rotation: Quaternion.MutableQuaternion;
    scale: Vector3.MutableVector3;
    parent?: Entity;
};

declare const Transform: EcsType<Transform>;

declare type Transport = {
    type: string;
    send(message: Uint8Array): void;
    onmessage?(message: Uint8Array): void;
    filter(message: Omit<TransportMessage, 'messageBuffer'>): boolean;
};

declare type TransportMessage = Omit<ReceiveMessage, 'data'>;

declare type Uint32 = number;

/**
 * @public
 */
declare type Unpacked<T> = T extends (infer U)[] ? U : T;

/**
 * @public
 */
declare type Update = (dt: number) => void;

/**
 * @public
 */
declare namespace Vector3 {
    /**
     * @public
     */
    export type MutableVector3 = {
        y: number;
        x: number;
        z: number;
    };
    /**
     * @public
     */
    export type ReadonlyVector3 = DeepReadonly<MutableVector3>;
    /**
     * Creates a new Vector3 object from the given x, y, z (floats) coordinates.
     * @param x - defines the first coordinates (on X axis)
     * @param y - defines the second coordinates (on Y axis)
     * @param z - defines the third coordinates (on Z axis)
     */
    export function create(
    /**
     * Defines the first coordinates (on X axis)
     */
    x?: number, 
    /**
     * Defines the second coordinates (on Y axis)
     */
    y?: number, 
    /**
     * Defines the third coordinates (on Z axis)
     */
    z?: number): MutableVector3;
    /**
     * Returns a new Vector3 as the result of the addition of the two given vectors.
     * @param vector1 - the first vector
     * @param vector2 - the second vector
     * @returns the resulting vector
     */
    export function add(vector1: ReadonlyVector3, vector2: ReadonlyVector3): MutableVector3;
    /**
     * Returns a new Vector3 as the result of the substraction of the two given vectors.
     * @returns the resulting vector
     */
    export function subtract(minuend: ReadonlyVector3, subtrahend: ReadonlyVector3): MutableVector3;
    /**
     * Returns a new Vector3 as the result of the substraction of the two given vectors.
     * @returns the resulting vector
     */
    export function subtractToRef(minuend: ReadonlyVector3, subtrahend: ReadonlyVector3, result: MutableVector3): void;
    /**
     * Returns a new Vector3 with the other sign
     * @returns the resulting vector
     */
    export function opposite(value: ReadonlyVector3): MutableVector3;
    /**
     * Copy source into dest
     *
     */
    export function copy(source: ReadonlyVector3, dest: MutableVector3): void;
    /**
     * Returns a new Vector3 with the same value
     * @returns the resulting vector
     */
    export function clone(source: ReadonlyVector3): MutableVector3;
    /**
     * Gets the length of the Vector3
     * @returns the length of the Vecto3
     */
    export function length(vector: ReadonlyVector3): number;
    /**
     * Gets the squared length of the Vector3
     * @returns squared length of the Vector3
     */
    export function lengthSquared(vector: ReadonlyVector3): number;
    /**
     * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale"
     * @param scale - defines the multiplier factor
     * @returns a new Vector3
     */
    export function scaleToRef(vector: ReadonlyVector3, scale: number, result: MutableVector3): void;
    /**
     * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale"
     * @param scale - defines the multiplier factor
     * @returns a new Vector3
     */
    export function scale(vector: ReadonlyVector3, scale: number): MutableVector3;
    /**
     * Normalize the current Vector3 with the given input length.
     * Please note that this is an in place operation.
     * @param len - the length of the vector
     * @returns the current updated Vector3
     */
    export function normalizeFromLength(vector: ReadonlyVector3, len: number): MutableVector3;
    /**
     * Normalize the current Vector3 with the given input length.
     * Please note that this is an in place operation.
     * @param len - the length of the vector
     * @returns the current updated Vector3
     */
    export function normalizeFromLengthToRef(vector: ReadonlyVector3, len: number, result: MutableVector3): void;
    /**
     * Normalize the current Vector3.
     * Please note that this is an in place operation.
     * @returns the current updated Vector3
     */
    export function normalize(vector: ReadonlyVector3): MutableVector3;
    /**
     * Normalize the current Vector3.
     * Please note that this is an in place operation.
     * @returns the current updated Vector3
     */
    export function normalizeToRef(vector: ReadonlyVector3, result: MutableVector3): void;
    /**
     * Returns the dot product (float) between the vectors "left" and "right"
     * @param left - defines the left operand
     * @param right - defines the right operand
     * @returns the dot product
     */
    export function dot(left: ReadonlyVector3, right: ReadonlyVector3): number;
    /**
     * Rotates current Vector3 based on the given quaternion, but applies the rotation to target Vector3.
     * @param q - defines the Quaternion
     * @param result - defines the target Vector3
     * @returns the current Vector3
     */
    export function rotate(vector: ReadonlyVector3, q: Quaternion.ReadonlyQuaternion): MutableVector3;
    /**
     * Returns a new Vector3 located for "amount" (float) on the linear interpolation between the vectors "start" and "end"
     * @param start - defines the start value
     * @param end - defines the end value
     * @param amount - max defines amount between both (between 0 and 1)
     * @returns the new Vector3
     */
    export function lerp(start: ReadonlyVector3, end: ReadonlyVector3, amount: number): MutableVector3;
    /**
     * Sets the given vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end"
     * @param start - defines the start value
     * @param end - defines the end value
     * @param amount - max defines amount between both (between 0 and 1)
     * @param result - defines the Vector3 where to store the result
     */
    export function lerpToRef(start: ReadonlyVector3, end: ReadonlyVector3, amount: number, result: MutableVector3): void;
    /**
     * Returns a new Vector3 as the cross product of the vectors "left" and "right"
     * The cross product is then orthogonal to both "left" and "right"
     * @param left - defines the left operand
     * @param right - defines the right operand
     * @returns the cross product
     */
    export function cross(left: ReadonlyVector3, right: ReadonlyVector3): MutableVector3;
    /**
     * Sets the given vector "result" with the cross product of "left" and "right"
     * The cross product is then orthogonal to both "left" and "right"
     * @param left - defines the left operand
     * @param right - defines the right operand
     * @param result - defines the Vector3 where to store the result
     */
    export function crossToRef(left: ReadonlyVector3, right: ReadonlyVector3, result: MutableVector3): void;
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 0.0)
     * @returns a new empty Vector3
     */
    export function Zero(): MutableVector3;
    /**
     * Returns a new Vector3 set to (1.0, 1.0, 1.0)
     * @returns a new unit Vector3
     */
    export function One(): MutableVector3;
    /**
     * Returns a new Vector3 set tolengthSquared (0.0, 1.0, 0.0)
     * @returns a new up Vector3
     */
    export function Up(): MutableVector3;
    /**
     * Returns a new Vector3 set to (0.0, -1.0, 0.0)
     * @returns a new down Vector3
     */
    export function Down(): MutableVector3;
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 1.0)
     * @returns a new forward Vector3
     */
    export function Forward(): MutableVector3;
    /**
     * Returns a new Vector3 set to (0.0, 0.0, -1.0)
     * @returns a new forward Vector3
     */
    export function Backward(): MutableVector3;
    /**
     * Returns a new Vector3 set to (1.0, 0.0, 0.0)
     * @returns a new right Vector3
     */
    export function Right(): MutableVector3;
    /**
     * Returns a new Vector3 set to (-1.0, 0.0, 0.0)
     * @returns a new left Vector3
     */
    export function Left(): MutableVector3;
}

declare interface Vector3_2 {
    x: number;
    y: number;
    z: number;
}

declare namespace WireMessage {
    enum Enum {
        RESERVED = 0,
        PUT_COMPONENT = 1,
        DELETE_COMPONENT = 2,
        MAX_MESSAGE_TYPE = 3
    }
    /**
     * @param length - Uint32 the length of all message (including the header)
     * @param type - define the function which handles the data
     */
    type Header = {
        length: Uint32;
        type: Uint32;
    };
    const HEADER_LENGTH = 8;
    /**
     * Validate if the message incoming is completed
     * @param buf
     */
    function validate(buf: ByteBuffer): boolean;
    function readHeader(buf: ByteBuffer): Header | null;
}

declare enum YGAlign {
    YGAlignAuto = 0,
    YGAlignFlexStart = 1,
    YGAlignCenter = 2,
    YGAlignFlexEnd = 3,
    YGAlignStretch = 4,
    YGAlignBaseline = 5,
    YGAlignSpaceBetween = 6,
    YGAlignSpaceAround = 7,
    UNRECOGNIZED = -1
}

declare enum YGDirection {
    YGDirectionInherit = 0,
    YGDirectionLTR = 1,
    YGDirectionRTL = 2,
    UNRECOGNIZED = -1
}

declare enum YGDisplay {
    YGDisplayFlex = 0,
    YGDisplayNone = 1,
    UNRECOGNIZED = -1
}

declare enum YGFlexDirection {
    YGFlexDirectionColumn = 0,
    YGFlexDirectionColumnReverse = 1,
    YGFlexDirectionRow = 2,
    YGFlexDirectionRowReverse = 3,
    UNRECOGNIZED = -1
}

declare enum YGJustify {
    YGJustifyFlexStart = 0,
    YGJustifyCenter = 1,
    YGJustifyFlexEnd = 2,
    YGJustifySpaceBetween = 3,
    YGJustifySpaceAround = 4,
    YGJustifySpaceEvenly = 5,
    UNRECOGNIZED = -1
}

declare enum YGOverflow {
    YGOverflowVisible = 0,
    YGOverflowHidden = 1,
    YGOverflowScroll = 2,
    UNRECOGNIZED = -1
}

declare enum YGPositionType {
    YGPositionTypeStatic = 0,
    YGPositionTypeRelative = 1,
    YGPositionTypeAbsolute = 2,
    UNRECOGNIZED = -1
}

declare enum YGUnit {
    YGUnitUndefined = 0,
    YGUnitPoint = 1,
    YGUnitPercent = 2,
    YGUnitAuto = 3,
    UNRECOGNIZED = -1
}

declare enum YGWrap {
    YGWrapNoWrap = 0,
    YGWrapWrap = 1,
    YGWrapWrapReverse = 2,
    UNRECOGNIZED = -1
}


