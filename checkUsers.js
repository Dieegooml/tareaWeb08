import db from "./models/index.js";

async function checkUsers() {
  try {
    const users = await db.user.findAll({
      include: {
        model: db.role,
        as: "roles",
        attributes: ["name"],
        through: { attributes: [] }
      }
    });

    console.log("Usuarios en la base de datos:");
    users.forEach(user => {
      console.log(`- Usuario: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Roles: ${user.roles.map(r => r.name).join(", ")}`);
      console.log("--------------------");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkUsers();
