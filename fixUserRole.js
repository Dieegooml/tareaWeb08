import db from "./models/index.js";

async function fixUserRole(username, roleName) {
  try {
    const user = await db.user.findOne({ where: { username } });
    if (!user) {
      console.log(`Usuario ${username} no encontrado`);
      process.exit(1);
    }

    const role = await db.role.findOne({ where: { name: roleName } });
    if (!role) {
      console.log(`Rol ${roleName} no encontrado`);
      process.exit(1);
    }

    await user.setRoles([role]);
    console.log(`Rol ${roleName} asignado correctamente a ${username}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Argumentos: node fixUserRole.js <username> <roleName>
const username = process.argv[2] || "diegomod13";
const roleName = process.argv[3] || "moderator";

fixUserRole(username, roleName);
