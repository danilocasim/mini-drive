const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../../generated/prisma");
require("dotenv").config();
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://dmtrxkgcngebdqurydeg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  async renameFolder(id, name, userId) {
    await prisma.folder.update({
      where: {
        id: Number(id),
        userId: userId,
      },
      data: {
        name: name,
      },
    });
  }

  async renameFile(id, name, userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const file = await prisma.file.findUnique({
      where: {
        id: Number(id),
      },
    });

    const { data, error } = await supabase.storage
      .from("drive")
      .move(file.path, `${user.username}/${file.folderId}/${name}`);

    await prisma.file.update({
      where: {
        id: Number(id),
        userId: userId,
      },
      data: {
        name: name,
        path: `${user.username}/${file.folderId}/${name}`,
      },
    });
  }

  async deleteFolder(id, userId) {
    const files = await prisma.file.findMany({
      where: {
        folderId: Number(id),
        userId: userId,
      },
    });

    const filePaths = files.map((file) => file.path);

    const { data, error } = await supabase.storage
      .from("drive")
      .remove([filePaths]);

    const deleteFolder = prisma.folder.delete({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    const deleteFiles = prisma.file.deleteMany({
      where: {
        folderId: Number(id),
        userId: userId,
      },
    });
    const transaction = await prisma.$transaction([deleteFiles, deleteFolder]);
  }

  async deleteFile(id, userId) {
    const file = await prisma.file.findUnique({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    const { data, error } = await supabase.storage
      .from("drive")
      .remove([file.path]);

    const deleteFile = await prisma.file.delete({
      where: {
        id: Number(id),
        userId: userId,
      },
    });
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

  async addFile(path, name, folderId = 0, userId) {
    await prisma.file.create({
      data: {
        path: path,
        name: name,
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
