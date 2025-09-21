import * as SQLite from "expo-sqlite";

export const openDatabase = async () => {
  return await SQLite.openDatabaseAsync("inspection.db");
};

export const createTable = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientName TEXT,
      address TEXT,
      phoneNumber TEXT,
      facadePhotoUri TEXT,
      buildingType TEXT,
      floor TEXT,
      methods TEXT,
      sonarPhotos TEXT,
      inspectionPhotos TEXT,
      cameraPathStart TEXT,
      cameraPathSteps TEXT,
      cameraPathEnd TEXT,
      solutions TEXT,
      date TEXT
    );
  `);
  console.log("✅ Table créée / mise à jour");
};

export const saveInspection = async (
  db,
  clientName,
  address,
  phoneNumber,
  facadePhotoUri,
  buildingType,
  floor,
  methods,
  inspectionPhotos,
  cameraPathStart,
  cameraPathSteps,
  cameraPathEnd,
  sonarPhotos = "[]",
  solutions = "[]"
) => {
  const date = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO inspections 
     (clientName, address, phoneNumber, facadePhotoUri, buildingType, floor, methods, inspectionPhotos, cameraPathStart, cameraPathSteps, cameraPathEnd, sonarPhotos, solutions, date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      clientName,
      address,
      phoneNumber,
      facadePhotoUri,
      buildingType,
      floor,
      methods,
      inspectionPhotos,
      cameraPathStart,
      cameraPathSteps,
      cameraPathEnd,
      sonarPhotos,
      solutions,
      date,
    ]
  );
  return result;
};

export const getAllInspections = async (db) => {
  const result = await db.getAllAsync("SELECT * FROM inspections");
  return result.map((item) => ({
    ...item,
    methods: item.methods ? JSON.parse(item.methods) : {},
    sonarPhotos: item.sonarPhotos ? JSON.parse(item.sonarPhotos) : [],
    solutions: item.solutions ? JSON.parse(item.solutions) : [],
  }));
};

export const resetTable = async (db) => {
  await db.execAsync("DROP TABLE IF EXISTS inspections;");
  await createTable(db);
  console.log("🔄 Table réinitialisée");
};
