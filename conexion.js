const { Database } = require("@sqlitecloud/drivers");

const connectionString = "sqlitecloud://czozsqiyhk.g3.sqlite.cloud:8860/chinook.sqlite?apikey=vTYUwbvxvi1mBtJlwMtwCiXzkYdHCrudykTn8vogTvY";

const db = new Database(connectionString);

(async () => {
  try {
    const resultado = await db.sql("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Conexión exitosa. Tablas disponibles:", resultado);
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
  } finally {
    db.close();
  }
})();
