import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export const useReminderDAO = () => {
  const db = useSQLiteContext();

  const addReminder = useCallback(
    async (reminder) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return null;
      }
      try {
        const result = await db.runAsync(
          `INSERT INTO reminders (list_id, title, note, date, time, location, priority, flag, whenMessaging, imageUri, url, isCompleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reminder.list_id,
            reminder.title,
            reminder.note,
            reminder.date,
            reminder.time,
            reminder.location,
            reminder.priority,
            reminder.flag ? 1 : 0,
            reminder.whenMessaging ? 1 : 0,
            reminder.imageUri,
            reminder.url,
            reminder.isCompleted ? 1 : 0,
          ]
        );
        return result.insertId;
      } catch (error) {
        console.error("Error adding reminder:", error);
        return undefined;
      }
    },
    [db]
  );

  const getRemindersByListId = useCallback(
    async (listId) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return [];
      }
      try {
        const result = await db.getAllAsync(
          `SELECT * FROM reminders WHERE list_id = ?`,
          [listId]
        );
        return result || [];
      } catch (error) {
        console.error("Error fetching reminders:", error);
        return [];
      }
    },
    [db]
  );

  const getAllReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return [];
    }
    try {
      const result = await db.getAllAsync(`SELECT * FROM reminders`);
      return result || [];
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return [];
    }
  }, [db]);

  const getReminderById = useCallback(
    async (id) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return undefined;
      }
      try {
        const result = await db.getFirstAsync(
          `SELECT * FROM reminders WHERE id = ?`,
          [id]
        );
        return result || undefined;
      } catch (error) {
        console.error("Error fetching reminders:", error);
        return null;
      }
    },
    [db]
  );

  const deleteReminderById = useCallback(
    async (id) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return null;
      }
      try {
        const result = await db.runAsync(`DELETE FROM reminders WHERE id = ?`, [
          id,
        ]);
        return result?.rowsAffected > 0;
      } catch (error) {
        console.error(`Error deleting reminder with id ${id}:`, error);
        return false;
      }
    },
    [db]
  );

  const updateReminder = useCallback(
    async (reminder) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return null;
      }
      try {
        const result = await db.runAsync(
          `UPDATE reminders SET list_id = ?, title = ?, note = ?, date = ?, time = ?, location = ?, priority = ?, flag = ?, whenMessaging = ?, imageUri = ?, url = ?, isCompleted = ? WHERE id = ?`,
          [
            reminder.list_id,
            reminder.title,
            reminder.note,
            reminder.date,
            reminder.time,
            reminder.location,
            reminder.priority,
            reminder.flag ? 1 : 0,
            reminder.whenMessaging ? 1 : 0,
            reminder.imageUri,
            reminder.url,
            reminder.isCompleted ? 1 : 0,
            reminder.id,
          ]
        );
        return result?.rowsAffected > 0;
      } catch (error) {
        console.error(`Error updating reminder with id ${reminder.id}:`, error);
        return false;
      }
    },
    [db]
  );

  const markReminderAsDone = useCallback(
    async (reminderId) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return null;
      }
      try {
        const result = await db.runAsync(
          `UPDATE reminders SET isCompleted = 1 WHERE id = ?`,
          [reminderId]
        );
        return result?.rowsAffected > 0;
      } catch (error) {
        console.error(
          `Error marking reminder with id ${reminderId} as done:`,
          error
        );
        return false;
      }
    },
    [db]
  );

  const getAllIncompleteReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return [];
    }
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM reminders WHERE isCompleted = 0`
      );
      return result || [];
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return [];
    }
  }, [db]);

  const getIncompleteRemindersByListId = useCallback(
    async (listId) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return [];
      }
      try {
        const result = await db.getAllAsync(
          `SELECT * FROM reminders WHERE list_id = ? AND isCompleted = 0`,
          [listId]
        );
        return result || [];
      } catch (error) {
        console.error("Error fetching reminders:", error);
        return [];
      }
    },
    [db]
  );

  const getCompletedReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return [];
    }
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM reminders WHERE isCompleted = 1`
      );
      return result || [];
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return [];
    }
  }, [db]);

  const getFlaggedReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return [];
    }
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM reminders WHERE flag = 1`
      );
      return result || [];
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return [];
    }
  }, [db]);

  const markAsFlagged = useCallback(
    async (reminderId) => {
      if (!db) {
        console.warn("Database context not available in useReminderDAO");
        return null;
      }
      try {
        const result = await db.runAsync(
          `UPDATE reminders SET flag = 1 WHERE id = ?`,
          [reminderId]
        );
        return result?.rowsAffected > 0;
      } catch (error) {
        console.error(
          `Error marking reminder with id ${reminderId} as done:`,
          error
        );
        return false;
      }
    },
    [db]
  );


  // count all incomplete reminders in a list
  const countIncompleteRemindersByListId = useCallback(async (listId) => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return 0;
    }
    try {
      const result = await db.getAllAsync(
        `SELECT COUNT(*) as count FROM reminders WHERE list_id = ? AND isCompleted = 0`,
        [listId]
      );
      return result[0]?.count ?? 0;
    } catch (error) {
      console.error("Error counting reminders:", error);
      return 0;
    }
  }, [db]);

  // count all completed reminders 
  const countCompletedReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return 0;
    }
    try {
      const result = await db.getAllAsync(
        `SELECT COUNT(*) as count FROM reminders WHERE isCompleted = 1`
      );
      return result[0]?.count ?? 0;
    } catch (error) {
      console.error("Error counting reminders:", error);
      return 0;
    }
  }, [db]);

  // count all flagged reminders 
  const countFlaggedReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return 0;
    }
    try {
      const result = await db.getAllAsync(
        `SELECT COUNT(*) as count FROM reminders WHERE flag = 1`
      );
      return result[0]?.count ?? 0; 
    } catch (error) {
      console.error("Error counting reminders:", error);
      return 0;
    }
  }, [db]);

  // count all reminders incompleted remidners
  const countAllIncompleteReminders = useCallback(async () => {
    if (!db) {
      console.warn("Database context not available in useReminderDAO");
      return 0;
    }
    try {
      const result = await db.getAllAsync(
        `SELECT COUNT(*) as count FROM reminders WHERE isCompleted = 0`
      );
      return result[0]?.count ?? 0;
    } catch (error) {
      console.error("Error counting reminders:", error);
      return 0;
    }
  }, [db]);

  return {
    addReminder,
    getRemindersByListId,
    getAllReminders,
    getReminderById,
    deleteReminderById,
    updateReminder,
    markReminderAsDone,
    getIncompleteRemindersByListId,
    getAllIncompleteReminders,
    getCompletedReminders,
    getFlaggedReminders,
    markAsFlagged,
    countIncompleteRemindersByListId,
    countCompletedReminders,
    countFlaggedReminders,
    countAllIncompleteReminders
  };
};
