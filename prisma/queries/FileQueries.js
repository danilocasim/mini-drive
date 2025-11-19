const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

class FileQueries {
  async addFolder(name, parentId = null, userId) {
    if (parentId) {
      await prisma.folder.create({
        data: {
          name: name,
          userId: userId,
          parentId: Number(parentId),
        },
      });
    } else {
      if (parentId) {
        await prisma.folder.create({
          data: {
            name: name,
            userId: userId,
          },
        });
      }
    }
  }

  async viewAllFolders(userId) {
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
        parentId: null,
      },
      include: {
        children: true,
      },
    });
    console.dir(folders, { depth: null });
    return folders;
  }

  async viewFolder(id, userId) {
    const folder = await prisma.folder.findUnique({
      where: { id: Number(id), userId: userId },
      include: {
        children: true,
      },
    });
    return folder;
  }

  async addFile(file, folderId = 0, userId) {
    await prisma.file.create({
      data: {
        name: file.originalname,
        folderId: Number(folderId),
        userId: userId,
      },
    });
  }

  async getFilesById(id, userId) {
    const files = await prisma.file.findMany({
      where: {
        folderId: Number(id),
        userId: userId,
      },
    });
    return files;
  }
}

module.exports = new FileQueries();
