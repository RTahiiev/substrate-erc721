"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlueprintSubmittableResult = exports.Blueprint = void 0;
exports.extendBlueprint = extendBlueprint;

var _api = require("@polkadot/api");

var _util = require("@polkadot/util");

var _util2 = require("../util");

var _Base = require("./Base");

var _Contract = require("./Contract");

var _util3 = require("./util");

// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
class BlueprintSubmittableResult extends _api.SubmittableResult {
  constructor(result, contract) {
    super(result);
    this.contract = contract;
  }

}

exports.BlueprintSubmittableResult = BlueprintSubmittableResult;

class Blueprint extends _Base.Base {
  /**
   * @description The on-chain code hash for this blueprint
   */
  #tx = {};

  constructor(api, abi, codeHash, decorateMethod) {
    super(api, abi, decorateMethod);
    this.codeHash = this.registry.createType('Hash', codeHash);
    this.abi.constructors.forEach(c => {
      if ((0, _util.isUndefined)(this.#tx[c.method])) {
        this.#tx[c.method] = (0, _util3.createBluePrintTx)(c, (o, p) => this.#deploy(c, o, p));
      }
    });
  }

  get tx() {
    return this.#tx;
  }

  #deploy = (constructorOrId, _ref, params) => {
    let {
      gasLimit = _util.BN_ZERO,
      salt,
      storageDepositLimit = null,
      value = _util.BN_ZERO
    } = _ref;
    const encParams = this.abi.findConstructor(constructorOrId).toU8a(params);
    const encSalt = (0, _util3.encodeSalt)(salt);
    return this.api.tx.contracts.instantiate(value, gasLimit, storageDepositLimit, this.codeHash, encParams, encSalt).withResultTransform(result => new BlueprintSubmittableResult(result, (0, _util2.applyOnEvent)(result, ['Instantiated'], _ref2 => {
      let [record] = _ref2;
      return new _Contract.Contract(this.api, this.abi, record.event.data[1], this._decorateMethod);
    })));
  };
}

exports.Blueprint = Blueprint;

function extendBlueprint(type, decorateMethod) {
  return class extends Blueprint {
    static __BlueprintType = type;

    constructor(api, abi, codeHash) {
      super(api, abi, codeHash, decorateMethod);
    }

  };
}