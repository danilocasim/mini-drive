const db = require("../prisma/queries/FileQueries");
require("dotenv").config();

module.exports.addFolder = async (req, res) => {
  const { foldername } = req.body;
  const { folderid } = req.params;
  const { id } = req.user;

  await db.addFolder(foldername, folderid, id);

  return res.redirect("/folder/" + folderid);
};

module.exports.addDrive = async (req, res) => {
  const { foldername } = req.body;
  const { id } = req.user;

  await db.addDrive(foldername, id);

  return res.redirect("/");
};

module.exports.deleteFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;

  const deletedFolder = await db.deleteFolder(folderid, id);
  res.redirect(`/folder/${deletedFolder.parentid}`);
};

module.exports.deleteFile = async (req, res) => {
  const { fileid } = req.params;
  const { id } = req.user;

  const deletedFile = await db.deleteFile(fileid, id);
  res.redirect(`/folder/${deletedFile.folderId}`);
};

module.exports.renameFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;
  const { newname } = req.body;

  const folder = await db.renameFolder(folderid, newname, id);

  res.redirect(`/folder/${folder.parentid}`);
};

module.exports.renameFile = async (req, res) => {
  const { fileid } = req.params;
  const { id } = req.user;
  const { newname } = req.body;

  const renamedFile = await db.renameFile(fileid, newname, id);
  res.redirect(`/folder/${renamedFile.folderId}`);
};

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

  const fileDetails = await db.viewFileDetails(fileid, id);
  res.render("pages/viewFileDetails", { data: fileDetails[0] });
};

module.exports.addFile = async (req, res, next) => {
  const { folderid } = req.params;
  const { username, id } = req.user;
  const file = req.file;
  const path = `${username}/${folderid}/${file.originalname}`;

  await db.addFile(path, req.file.buffer, file, folderid, id);

  res.redirect("/folder/" + folderid);
};
