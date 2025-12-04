const { PrismaClient } = require("../../generated/prisma");
require("dotenv").config();
const { getNestedFolders } = require("../../generated/prisma/sql");

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://dmtrxkgcngebdqurydeg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class FileQueries {
  async addFolder(name, parentid = null, userId) {
    await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
        parentid: Number(parentid),
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
        parentid: null,
      },
    });
  }

  async viewAllFolders(userId) {
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
        parentid: null,
      },
      include: {
        children: true,
      },
    });
    return folders;
  }

  async renameFolder(id, name, userId) {
    return await prisma.folder.update({
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

    const renamedFile = await prisma.file.update({
      where: {
        id: Number(id),
        userId: userId,
      },
      data: {
        name: name,
        path: `${user.username}/${file.folderId}/${name}`,
      },
    });
    return renamedFile;
  }

  async deleteFolder(id, userId) {
    const nested = await prisma.$queryRawTyped(getNestedFolders(Number(id)));

    nested.forEach(async (folder) => {
      const files = await prisma.file.findMany({
        where: {
          folderId: Number(folder.id),
          userId: userId,
        },
      });
      const filePaths = files.map((file) => file.path);

      const { data, error } = await supabase.storage
        .from("drive")
        .remove([filePaths]);
    });

    const deleteFiles = await prisma.file.deleteMany({
      where: {
        folderId: Number(id),
        userId: userId,
      },
    });
    const deleteFolder = await prisma.folder.delete({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    return deleteFolder;
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

    return deleteFile;
  }
  async viewFolder(id, userId) {
    const folder = await prisma.folder.findUnique({
      where: { id: Number(id), userId: userId },
      include: {
        children: true,
        files: true,
      },
    });

    return folder;
  }

  async addFile(path, file, fileDetails, folderId = 0, userId) {
    const { data, error } = await supabase.storage
      .from("drive")
      .upload(path, file, {
        cacheControl: "3600",
        contentType: fileDetails.mimetype,
        upsert: true,
      });

    await prisma.file.create({
      data: {
        path: path,
        name: fileDetails.originalname,
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

  async getFileById(id, userId) {
    const file = await prisma.file.findUnique({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    return file;
  }

  async viewFileDetails(id, userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const file = await prisma.file.findUnique({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    const { data, error } = await supabase.storage
      .from("drive")
      .list(`${user.username}/${file.folderId}`, {
        search: file.name,
      });

    return data;
  }

  async getPath(id, userId) {
    const paths = [];
    let parentid = id;

    while (parentid !== null) {
      const folder = await prisma.folder.findUnique({
        where: {
          userId: userId,
          id: Number(parentid),
        },
      });
      paths.unshift({ name: folder.name, id: folder.id });

      parentid = folder.parentid;
    }

    return paths;
  }

  async getDownloadLinks(files) {
    const allFiles = files.map(async (file) => {
      const { data } = await supabase.storage
        .from("drive")
        .getPublicUrl(file.path, { download: true });
      return { ...file, downloadLink: data.publicUrl };
    });

    const returnedFiles = await Promise.all(allFiles);

    return returnedFiles;
  }
}

module.exports = new FileQueries();
