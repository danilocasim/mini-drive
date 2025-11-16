const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

class UserQueries {
  async getEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async getUser(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  async addUser({ fullname, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        fullname: fullname,
        email: email,
        password: hashedPassword,
      },
    });
  }
}

module.exports = new UserQueries();
