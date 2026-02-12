const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // tu archivo descargado

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminRole(uid) {
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log("Rol admin asignado al usuario:", uid);
}

// Reemplazá con tu UID (lo viste en la consola de usuarios)
setAdminRole("ZqZTYU9x5XasnFXJXCzj3aoY0JH2");
