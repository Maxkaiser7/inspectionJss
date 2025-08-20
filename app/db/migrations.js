// db/migrations.js
export const runMigrations = async (db) => {
    console.log("🚀 Vérification des migrations...");
  
    // Vérifie si la colonne phoneNumber existe déjà
    const result = await db.getAllAsync(`
      PRAGMA table_info(inspections);
    `);
  
    const columns = result.map(col => col.name);
  
    if (!columns.includes("phoneNumber")) {
      console.log("⚡ Ajout de la colonne phoneNumber...");
      await db.execAsync("ALTER TABLE inspections ADD COLUMN phoneNumber TEXT;");
    }
  
    if (!columns.includes("sonarPhotos")) {
      console.log("⚡ Ajout de la colonne sonarPhotos...");
      await db.execAsync("ALTER TABLE inspections ADD COLUMN sonarPhotos TEXT;");
    }
  
    console.log("✅ Migrations terminées");
  };
  