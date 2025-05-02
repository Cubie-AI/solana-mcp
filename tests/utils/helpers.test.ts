import { describe, expect, it } from "@jest/globals";
import { PublicKey } from "@solana/web3.js";

import { getPublicKey } from "../../src/utils/helpers";
describe("utils/helpers", () => {
  it("should return a PublicKey", () => {
    const address = "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump";
    const publicKey = new PublicKey(address);
    expect(getPublicKey(address).toBase58()).toEqual(publicKey.toBase58());
  });

  it("should return an error for invalid PublicKey", () => {
    const invalidAddress = "invalidPublicKey";
    expect(() => getPublicKey(invalidAddress)).toThrowError(
      "Invalid public key"
    );
  });
});
