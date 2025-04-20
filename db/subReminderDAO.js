import { useSQLiteContext } from "expo-sqlite";

export const useSubReminderDAO = () => {
  const db = useSQLiteContext();

  // Add a new sub-reminder
  const addSubReminder = async (parent_id, title) => {
    return new Promise((resolve, reject) => {
      db.runAsync(
        `INSERT INTO sub_reminders (parent_id, title) VALUES (?, ?)`,
        [parent_id, title]
      )
        .then(resolve)
        .catch(reject);
    });
  };

  // Get sub-reminders for a specific reminder
  const getSubReminders = async (parent_id) => {
    return new Promise((resolve, reject) => {
      db.getAllAsync(`SELECT * FROM sub_reminders WHERE parent_id = ?`, [
        parent_id,
      ])
        .then(resolve)
        .catch(reject);
    });
  };

  // Delete a sub-reminder by ID
  const deleteSubReminderById = async (id) => {
    return new Promise((resolve, reject) => {
      db.runAsync(`DELETE FROM sub_reminders WHERE id = ?`, [id])
        .then(resolve)
        .catch(reject);
    });
  };

  // Update a sub-reminder by ID
  const updateSubReminderById = async (id, title) => {
    return new Promise((resolve, reject) => {
      db.runAsync(
        `UPDATE sub_reminders SET title = ? WHERE id = ?`,
        [title, id]
      )
        .then(resolve)
        .catch(reject);
    });
  };

  return {
    addSubReminder,
    getSubReminders,
    deleteSubReminderById,
    updateSubReminderById,
  };
};
