// db-test.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "Vestiary",     // database
  "sa",            // username
  "Passw0rd",      // password
  {
    host: "localhost",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    logging: (msg) => console.log("[SQL]", msg)
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB bağlantısı başarılı!");
  } catch (err) {
    console.error("❌ DB bağlantı hatası:", err);
  } finally {
    await sequelize.close();
  }
})();
