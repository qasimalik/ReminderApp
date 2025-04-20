import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

export const useSchemaReady = () => {
 const db = useSQLiteContext();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    if (!db) {
      setError("Database context is not available.");
      return;
    }

    const initializeDatabase = async () => {
      try {
        // await db.execAsync(`DROP TABLE IF EXISTS reminders;`);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT NOT NULL DEFAULT '#007AFF',
            icon TEXT NOT NULL DEFAULT 'list-bulleted',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER,
            title TEXT,
            note TEXT,
            date TEXT,
            time TEXT,
            location TEXT,
            priority TEXT,
            flag INTEGER,
            whenMessaging INTEGER,
            imageUri TEXT,
            url TEXT,
            isCompleted INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (list_id) REFERENCES lists(id)
          );
          CREATE TABLE IF NOT EXISTS sub_reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_id INTEGER,
            title TEXT,
            isDone INTEGER DEFAULT 0,
            FOREIGN KEY (parent_id) REFERENCES reminders(id)
          );
        `);
        setIsReady(true);
      } catch (err) {
        setError("Failed to initialize database schema: " + err.message);
        setIsReady(false);
        console.error("Database initialization error:", err); // Keep the console.error
      }
    };

    initializeDatabase();
  }, [db]);

  return { isReady, error }; // Return both isReady and error
};
