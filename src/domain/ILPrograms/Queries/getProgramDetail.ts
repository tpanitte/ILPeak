import { MongoEventStore } from "@/infra/db/mongoes";
import { programReducer, initialState } from "../reducer";

const eventStore = new MongoEventStore();

/**
 * STRICT CONSISTENCY QUERY
 * Fetches the most current state of a program by replaying events.
 */
export async function getProgramDetail(aggregateID: string) {
  // 1. Fetch all events for this specific program
  // In a real implementation, you'd have a getEvents(id) method on the store
  const events = await eventStore.getEvents(aggregateID); 

  if (!events || events.length === 0) {
    throw new Error("Program not found");
  }

  // 2. Rebuild state on-the-fly using the Reducer
  const state = events.reduce(programReducer, initialState);

  // 3. Return the state plus the latest version for concurrency checks
  return {
    ...state,
    _id: aggregateID,
    _version: events[events.length - 1]._version //
  };
};
