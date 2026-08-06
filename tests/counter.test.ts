import { BBoardSimulator } from "./bboard-simulator.js";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { describe, it, expect } from "vitest";
import { randomBytes } from "./utils.js";
import { State } from "../managed/bboard/contract/index.js";

setNetworkId("undeployed");

describe("Counter / Bulletin Board Smart Contract Tests", () => {
  // Test Requirement A: Circuit Logic
  it("Circuit logic: computes public key hash and circuit outputs deterministically", () => {
    const key = randomBytes(32);
    const simulator0 = new BBoardSimulator(key);
    const simulator1 = new BBoardSimulator(key);

    const pk0 = simulator0.publicKey();
    const pk1 = simulator1.publicKey();

    expect(pk0).toBeDefined();
    expect(pk0.length).toBe(32);
    expect(pk0).toEqual(pk1);
    expect(simulator0.getLedger()).toEqual(simulator1.getLedger());
  });

  // Test Requirement B: State Transitions
  it("State transitions: updates ledger state from VACANT to OCCUPIED on post and increments sequence on takeDown", () => {
    const key = randomBytes(32);
    const simulator = new BBoardSimulator(key);

    // Initial state check
    const initialLedger = simulator.getLedger();
    expect(initialLedger.state).toEqual(State.VACANT);
    expect(initialLedger.sequence).toEqual(1n);
    expect(initialLedger.message.is_some).toBe(false);

    // State transition 1: VACANT -> OCCUPIED
    const testMessage = "Test message for state transition verification";
    simulator.post(testMessage);

    const occupiedLedger = simulator.getLedger();
    expect(occupiedLedger.state).toEqual(State.OCCUPIED);
    expect(occupiedLedger.message.is_some).toBe(true);
    expect(occupiedLedger.message.value).toEqual(testMessage);
    expect(occupiedLedger.owner).toEqual(simulator.publicKey());

    // State transition 2: OCCUPIED -> VACANT + sequence increment
    simulator.takeDown();

    const vacantLedger = simulator.getLedger();
    expect(vacantLedger.state).toEqual(State.VACANT);
    expect(vacantLedger.sequence).toEqual(2n);
    expect(vacantLedger.message.is_some).toBe(false);
  });

  // Test Requirement C: Privacy Model & Zero-Knowledge Verification
  it("Privacy: private witness input (secret key) is never exposed in public ledger outputs", () => {
    const secretKey = randomBytes(32);
    const simulator = new BBoardSimulator(secretKey);

    const initialPrivateState = simulator.getPrivateState();
    expect(initialPrivateState.secretKey).toEqual(secretKey);

    // Perform post operation
    simulator.post("Confidential message");
    const ledgerState = simulator.getLedger();

    // Verify secret key is private and not present anywhere in public ledger
    expect(initialPrivateState.secretKey).toEqual(secretKey);
    expect(ledgerState.owner).not.toEqual(secretKey);
    const ledgerString = JSON.stringify(ledgerState, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    expect(ledgerString).not.toContain(Buffer.from(secretKey).toString("hex"));

    // Verify private state is preserved after state mutations
    expect(simulator.getPrivateState()).toEqual(initialPrivateState);
  });

  // Additional Test 4: Access Control & Security Assertions
  it("Security: prevents unauthorized user from taking down another user's post", () => {
    const user1Key = randomBytes(32);
    const user2Key = randomBytes(32);
    const simulator = new BBoardSimulator(user1Key);

    simulator.post("User 1 post");

    // Switch to User 2
    simulator.switchUser(user2Key);

    // Attempting takedown as unauthorized user must fail
    expect(() => simulator.takeDown()).toThrow(
      "failed assert: Attempted to take down post, but not the current owner"
    );
  });

  // Additional Test 5: Single Post Constraint Assertion
  it("Constraint enforcement: prevents posting twice to an already occupied board", () => {
    const simulator = new BBoardSimulator(randomBytes(32));
    simulator.post("First message");

    expect(() => simulator.post("Second message")).toThrow(
      "failed assert: Attempted to post to an occupied board"
    );
  });
});
