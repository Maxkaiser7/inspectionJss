import * as SQLite from 'expo-sqlite';

export const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('inspection.db');
};

export const createTable = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientName TEXT,
      address TEXT,
      photoUri TEXT,
      date TEXT,
      buildingType TEXT,
      floor TEXT,
    );
  `);
  console.log('✅ Table créée');
};

export const saveInspection = async (db, clientName, address, photoUri) => {
  const date = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO inspections (clientName, address, facadePhotoUri, buildingType, floor) VALUES (?, ?, ?, ?, ?)`,
    [clientName, address, facadePhotoUri, buildingType, floor]
  );
  return result;
};

export const getAllInspections = async (db) => {
  const result = await db.getAllAsync('SELECT * FROM inspections');
  return result;
};
