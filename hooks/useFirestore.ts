import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, DocumentData, QueryConstraint } from 'firebase/firestore';

export function useCollection<T = DocumentData>(collectionName: string, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: T[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as unknown as T);
      });
      setData(results);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryConstraints)]); // Simple dependency check

  return { data, loading, error };
}