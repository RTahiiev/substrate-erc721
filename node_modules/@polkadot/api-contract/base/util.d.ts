import type { SubmittableResult } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ApiTypes } from '@polkadot/api/types';
import type { AbiConstructor, AbiMessage, BlueprintOptions } from '../types';
import type { BlueprintDeploy, ContractGeneric } from './types';
export declare const EMPTY_SALT: Uint8Array;
export declare function withMeta<T extends {
    meta: AbiMessage;
}>(meta: AbiMessage, creator: Omit<T, 'meta'>): T;
export declare function createBluePrintTx<ApiType extends ApiTypes, R extends SubmittableResult>(meta: AbiMessage, fn: (options: BlueprintOptions, params: unknown[]) => SubmittableExtrinsic<ApiType, R>): BlueprintDeploy<ApiType>;
export declare function createBluePrintWithId<T>(fn: (constructorOrId: AbiConstructor | string | number, options: BlueprintOptions, params: unknown[]) => T): ContractGeneric<BlueprintOptions, T>;
export declare function encodeSalt(salt?: Uint8Array | string | null): Uint8Array;
