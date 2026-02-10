// src/infra/db/mongoes.ts

import "server-only";
import { IEventStore, IEvent } from "atomservices";
import clientPromise from "./mongodb";

export class MongoEventStore implements IEventStore {
  private collectionName = "Events";
  private dbName = "ILPeak_Events";
  private isInitialized = false;

  private async getDB() {
    const client = await clientPromise;
    return client.db(this.dbName);
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    const db = await this.getDB();
    const collection = db.collection(this.collectionName);

    // Concurrency Guard Index
    await collection.createIndex(
      { aggregateID: 1, _version: 1 },
      { unique: true, name: "idx_concurrency_guard" }
    );

    // Projection Performance Index
    await collection.createIndex(
      { aggregateType: 1, _id: 1 },
      { name: "idx_aggregate_type_scan" }
    );

    console.log("✅ MongoEventStore Initialized (Indexes Ensured)");
    this.isInitialized = true;
  }

  async getEvents(aggregateID: string): Promise<IEvent[]> {
    if (!this.isInitialized) await this.init();

    const db = await this.getDB();
    const result = await db
      .collection(this.collectionName)
      .find({ aggregateID })
      .sort({ _version: 1 })
      .toArray();

    return result as unknown as IEvent[];
  }

  async append(event: IEvent): Promise<void> {
    const db = await this.getDB();

    try {
      await db.collection(this.collectionName).insertOne({
        ...event,
        _id: event._id as any,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error(`Concurrency Error: Stream ${event.aggregateID} was modified.`);
      }
      throw error;
    }
  }
}
