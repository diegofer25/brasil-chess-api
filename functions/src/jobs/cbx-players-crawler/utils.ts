import { Player } from "./types";
import { firestore } from "~/services/firebase.service";

interface Operation {
  ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  data: Player
}

export class BigBatchManager {
  private operations: Operation[]
  constructor() {
    this.operations = [];
  }

  async addOperationToBatchQueue(operation: Operation) {
    this.operations.push(operation);
    await this.checkOperations();
  }

  private checkOperations() {
    if (this.operations.length >= 500) {
      return this.commit();
    }

    return Promise.resolve(undefined);
  }

  async commit() {
    const batch = firestore.batch();

    this.operations.forEach((operation) => {
      batch.set(operation.ref, operation.data);
    });
    await batch.commit();
    this.operations.length = 0;
  }
}

export function waitFor(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}
