import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAll,
  saveRecords,
  subscribeToDatabase,
  type DatabaseSchema,
  type StoreName,
} from "../services/productionDb";

// IndexedDB is authoritative. The previous localStorage keys remain a migration
// and compatibility cache; no write runs before hydration has completed.
export function useProductionStore<K extends StoreName>(
  store: K,
  legacyKey: string,
  initial: DatabaseSchema[K][],
) {
  const [items, setItems] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const pending = useRef(new Map<string, DatabaseSchema[K]>());
  const deletions = useRef(new Set<string>());
  const previous = useRef(new Map<string, string>());
  const queue = useRef(Promise.resolve());
  const revision = useRef(0);
  const rendered = useRef(items);
  const failed = useRef(false);
  if (rendered.current !== items) {
    rendered.current = items;
    revision.current += 1;
  }
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const version = revision.current;
        await queue.current;
        if (failed.current) return;
        const rows = await getAll(store);
        if (!active || version !== revision.current) return;
        previous.current = new Map(
          rows.map((row) => [row.id, JSON.stringify(row)]),
        );
        setItems(rows);
        setReady(true);
        setError("");
      } catch {
        if (active)
          setError(
            "Le stockage est indisponible. Réessayez après avoir libéré de l’espace ou autorisé le stockage du navigateur.",
          );
      }
    };
    void load();
    const unsubscribe = subscribeToDatabase((changed) => {
      if (changed === store) void load();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [store]);
  useEffect(() => {
    if (!ready) return;
    const changed = items.filter(
      (item) => previous.current.get(item.id) !== JSON.stringify(item),
    );
    const ids = new Set(items.map((item) => item.id));
    const removed = [...previous.current.keys()].filter((id) => !ids.has(id));
    previous.current = new Map(
      items.map((item) => [item.id, JSON.stringify(item)]),
    );
    try {
      localStorage.setItem(legacyKey, JSON.stringify(items));
    } catch {
      /* IndexedDB remains authoritative. */
    }
    for (const item of changed) {
      pending.current.set(item.id, item);
      deletions.current.delete(item.id);
    }
    for (const id of removed) {
      pending.current.delete(id);
      deletions.current.add(id);
    }
    if (!pending.current.size && !deletions.current.size) return;
    queue.current = queue.current
      .then(async () => {
        const records = [...pending.current.values()];
        const deleted = [...deletions.current];
        if (!records.length && !deleted.length) return;
        await saveRecords(store, records, deleted);
        for (const record of records)
          if (pending.current.get(record.id) === record)
            pending.current.delete(record.id);
        for (const id of deleted) deletions.current.delete(id);
      })
      .then(() => {
        failed.current = false;
        setError("");
      })
      .catch(() => {
        failed.current = true;
        setError(
          "La sauvegarde a échoué. Gardez cet onglet ouvert et réessayez.",
        );
      });
  }, [items, ready, store, legacyKey, attempt]);
  return [items, setItems, ready, error, retry] as const;
}
