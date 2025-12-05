const uploadValidators = require("../middleware/validators/uploadValidators.js");
const folderValidators = require("../middleware/validators/folderValidators.js");

const db = require("../prisma/queries/FileQueries");
require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const fileValidators = require("../middleware/validators/fileValidators.js");

module.exports.addFolder = [
  folderValidators,
  async (req, res) => {
    const errors = validationResult(req);

    const { foldername } = matchedData(req);
    const { folderid } = req.params;
    const { id } = req.user;

    if (!errors.isEmpty()) {
      const folder = await db.viewFolder(folderid, id);
      const paths = await db.getPath(folderid, id);
      const filesWithDownloadLink = await db.getDownloadLinks(folder.files);
      const storedFilesSorted = folder.children
        .concat(filesWithDownloadLink)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return res.status(400).render("../views/pages/viewFolder", {
        folder: folder,
        storage: storedFilesSorted,
        paths: paths,
        errors: errors.array(),
      });
    }

    await db.addFolder(foldername, folderid, id);

    return res.redirect("/folder/" + folderid);
  },
];

module.exports.addDrive = [
  folderValidators,
  async (req, res) => {
    const { foldername } = matchedData(req);
    const { id } = req.user;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const { id } = req.user;
      const folders = await db.viewAllFolders(id);

      return res.status(400).render("../views/pages/index", {
        errors: errors.array(),
        folders: folders,
      });
    }
    await db.addDrive(foldername, id);

    return res.redirect("/");
  },
];

module.exports.deleteFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;

  const deletedFolder = await db.deleteFolder(folderid, id);
  if (deletedFolder.parentid) res.redirect(`/folder/${deletedFolder.parentid}`);
  else res.redirect("/");
};

module.exports.deleteFile = async (req, res) => {
  const { fileid } = req.params;
  const { id } = req.user;

  const deletedFile = await db.deleteFile(fileid, id);
  res.redirect(`/folder/${deletedFile.folderId}`);
};

module.exports.renameFolder = [
  folderValidators,
  async (req, res) => {
    const errors = validationResult(req);

    const { folderid } = req.params;
    const { foldername } = req.body;

    const { parentid } = await db.viewFolder(folderid);

    if (!errors.isEmpty()) {
      const folder = await db.viewFolder(parentid);
      const paths = await db.getPath(parentid);
      const filesWithDownloadLink = await db.getDownloadLinks(folder.files);
      const storedFilesSorted = folder.children
        .concat(filesWithDownloadLink)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      console.log(folder, storedFilesSorted, paths, errors);

      return res.status(400).render("../views/pages/viewFolder", {
        folder: folder,
        storage: storedFilesSorted,
        paths: paths,
        errors: errors.array(),
      });
    }
    const folder = await db.renameFolder(folderid, foldername);

    res.redirect(`/folder/${folder.parentid}`);
  },
];

module.exports.renameFile = [
  fileValidators,
  async (req, res) => {
    const errors = validationResult(req);

    const { fileid } = req.params;
    const { id } = req.user;
    const { filename } = req.body;

    const file = await db.getFileByName(filename);

    if (!errors.isEmpty()) {
      const folder = await db.viewFolder(file.folderId);
      const paths = await db.getPath(file.folderId);
      const filesWithDownloadLink = await db.getDownloadLinks(folder.files);
      const storedFilesSorted = folder.children
        .concat(filesWithDownloadLink)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      console.log(folder, storedFilesSorted, paths, errors);

      return res.status(400).render("../views/pages/viewFolder", {
        folder: folder,
        storage: storedFilesSorted,
        paths: paths,
        errors: errors.array(),
      });
    }
    const renamedFile = await db.renameFile(fileid, filename, id);
    res.redirect(`/folder/${renamedFile.folderId}`);
  },
];

module.exports.viewFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;
  const folder = await db.viewFolder(folderid, id);
  const paths = await db.getPath(folderid, id);

  const filesWithDownloadLink = await db.getDownloadLinks(folder.files);

  const storedFilesSorted = folder.children
    .concat(filesWithDownloadLink)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  res.render("pages/viewFolder", {
    folder: folder,
    storage: storedFilesSorted,
    paths: paths,
  });
};

module.exports.viewFileDetails = async (req, res) => {
  const { fileid } = req.params;
  const { id } = req.user;

  const { folderId } = await db.getFileById(fileid, id);

  const fileDetails = await db.viewFileDetails(fileid, id);
  res.render("pages/viewFileDetails", {
    data: fileDetails[0],
    folderId: folderId,
  });
};

module.exports.addFile = [
  uploadValidators,
  async (req, res, next) => {
    const errors = validationResult(req);

    const { folderid } = req.params;
    const { username, id } = req.user;
    const file = req.file;

    console.log(file);
    if (!errors.isEmpty()) {
      const folder = await db.viewFolder(folderid, id);
      const paths = await db.getPath(folderid, id);
      const filesWithDownloadLink = await db.getDownloadLinks(folder.files);
      const storedFilesSorted = folder.children
        .concat(filesWithDownloadLink)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return res.status(400).render("../views/pages/viewFolder", {
        folder: folder,
        storage: storedFilesSorted,
        paths: paths,
        errors: errors.array(),
      });
    }

    const path = `${username}/${folderid}/${file.originalname}`;

    await db.addFile(path, file.buffer, file, folderid, id);

    res.redirect("/folder/" + folderid);
  },
];
