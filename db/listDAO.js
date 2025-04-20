import { useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

export const useListDAO = () => {
  const db = useSQLiteContext();

  const addList = useCallback(async (list) => {
    if (!db) {
      console.warn('Database context not available in useListDAO');
      return null;
    }
    try {
      const result = await db.runAsync(
        `INSERT INTO lists (name, color, icon) VALUES (?, ?, ?)`,
        [list.name, list.color, list.icon]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding list:', error);
      return null;
    }
  }, [db]);

  const getLists = useCallback(async () => {
    if (!db) {
      console.warn('Database context not available in useListDAO');
      return [];
    }
    try {
      const result = await db.getAllAsync(`SELECT * FROM lists`);
      return result || [];
    } catch (error) {
      console.error('Error fetching lists:', error);
      return [];
    }
  }, [db]);

  const getListById = useCallback(async (id) => {
    if (!db) {
      console.warn('Database context not available in useListDAO');
      return undefined;
    }
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM lists WHERE id = ?`,
        [id]
      );
      return result || undefined;
    } catch (error) {
      console.error(`Error fetching list with id ${id}:`, error);
      return undefined;
    }
  }, [db]);

  const updateListById = useCallback(async (id, newName, newColor, newIcon) => {
    if (!db) {
      console.warn('Database context not available in useListDAO');
      return false;
    }
    try {
      let query = `UPDATE lists SET name = ?`;
      const params = [newName];

      if (newColor) {
        query += `, color = ?`;
        params.push(newColor);
      }
      if (newIcon) {
        query += `, icon = ?`;
        params.push(newIcon);
      }
      query += ` WHERE id = ?`;
      params.push(id);

      const result = await db.runAsync(query, params);
      return result?.rowsAffected > 0;
    } catch (error) {
      console.error(`Error updating list with id ${id}:`, error);
      return false;
    }
  }, [db]);

  const deleteListById = useCallback(async (id) => {
    if (!db) {
      console.warn('Database context not available in useListDAO');
      return false;
    }
    try {
      const result = await db.runAsync(
        `DELETE FROM lists WHERE id = ?`,
        [id]
      );
      return result?.rowsAffected > 0;
    } catch (error) {
      console.error(`Error deleting list with id ${id}:`, error);
      return false;
    }
  }, [db]);

  return { addList, getLists, getListById, updateListById, deleteListById };
};
