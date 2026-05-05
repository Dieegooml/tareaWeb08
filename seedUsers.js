import db from "./models/index.js";
import bcrypt from "bcryptjs";

const Role = db.role;
const User = db.user;

async function seed() {
  try {
    await db.sequelize.sync();

    // Crear roles si no existen
    const roles = ["user", "admin", "moderator"];
    for (const roleName of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: { name: roleName }
      });
      if (created) {
        console.log(`Rol creado: ${roleName}`);
      }
    }

    // Crear usuario Admin
    const adminPassword = await bcrypt.hash("admin123", 8);
    const [adminUser, createdAdmin] = await User.findOrCreate({
      where: { username: "admin" },
      defaults: {
        username: "admin",
        email: "admin@example.com",
        password: adminPassword
      }
    });

    if (createdAdmin) {
      const adminRole = await Role.findOne({ where: { name: "admin" } });
      await adminUser.setRoles([adminRole]);
      console.log("Usuario Admin creado");
    } else {
      console.log("El usuario Admin ya existe");
    }

    // Crear usuario Moderador
    const modPassword = await bcrypt.hash("mod123", 8);
    const [modUser, createdMod] = await User.findOrCreate({
      where: { username: "moderator" },
      defaults: {
        username: "moderator",
        email: "moderator@example.com",
        password: modPassword
      }
    });

    if (createdMod) {
      const modRole = await Role.findOne({ where: { name: "moderator" } });
      await modUser.setRoles([modRole]);
      console.log("Usuario Moderador creado");
    } else {
      console.log("El usuario Moderador ya existe");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
    process.exit(1);
  }
}

seed();
