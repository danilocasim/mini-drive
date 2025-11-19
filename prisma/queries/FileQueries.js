const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

class FileQueries {
  async addFolder(name, parentId = null, userId) {
    await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
        parentId: Number(parentId),
        type: "FOLDER",
      },
    });
  }

  async addDrive(name, userId) {
    await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
        type: "FOLDER",
      },
    });
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
    return folders;
  }

  async viewFolder(id, userId) {
    console.log(id);
    const folder = await prisma.folder.findUnique({
      where: { id: Number(id), userId: userId },
      include: {
        children: true,
        files: true,
      },
    });

    console.log(folder);
    return folder;
  }

  async addFile(file, folderId = 0, userId) {
    await prisma.file.create({
      data: {
        name: file.originalname,
        folderId: Number(folderId),
        userId: userId,
        type: "FILE",
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

  async getPath(id, userId) {
    const paths = [];
    let parentId = id;

    while (parentId !== null) {
      const folder = await prisma.folder.findUnique({
        where: {
          userId: userId,
          id: Number(parentId),
        },
      });
      paths.unshift({ name: folder.name, id: folder.id });

      parentId = folder.parentId;
    }

    return paths;
  }
}

module.exports = new FileQueries();
