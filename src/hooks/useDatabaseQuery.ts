import { useEffect, useState } from "react";
import {
  getAll,
  subscribeToDatabase,
  type DatabaseSchema,
  type StoreName,
} from "../services/productionDb";
// Read-only subscriptions never echo admin updates back into the database.
export function useDatabaseQuery<K extends StoreName>(store: K) {
  const [rows, setRows] = useState<DatabaseSchema[K][]>([]);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    let generation = 0;
    const refresh = async () => {
      const current = ++generation;
      try {
        const records = await getAll(store);
        if (active && current === generation) {
          setRows(records);
          setError("");
        }
      } catch {
        if (active) setError("Lecture impossible. Réessayez.");
      }
    };
    void refresh();
    const unsubscribe = subscribeToDatabase((changed) => {
      if (changed === store) void refresh();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [store, revision]);
  return { rows, error, retry: () => setRevision((value) => value + 1) };
}
