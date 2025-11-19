const db = require("../prisma/queries/FileQueries");

module.exports.addFolder = async (req, res) => {
  const { foldername } = req.body;
  const { folderid } = req.params;
  const { id } = req.user;
  await db.addFolder(foldername, folderid, id);

  res.redirect("/");
};

module.exports.viewFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;
  const folder = await db.viewFolder(folderid, id);
  res.render("pages/viewFolder", { folder: folder, folders: folder.children });
};

module.exports.addFile = async (req, res, next) => {
  const { folderid } = req.params;
  const { id } = req.user;
  await db.addFile(req.file, folderid, id);

  res.redirect("/folder/" + folderid);
};
