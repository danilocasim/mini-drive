const db = require("../prisma/queries/FileQueries");

module.exports.addFolder = async (req, res) => {
  const { foldername } = req.body;
  const { folderid } = req.params;
  const { id } = req.user;
  console.log(folderid);

  await db.addFolder(foldername, folderid, id);

  return res.redirect("/folder/" + folderid);
};

module.exports.addDrive = async (req, res) => {
  const { foldername } = req.body;
  const { id } = req.user;

  await db.addDrive(foldername, id);

  return res.redirect("/");
};

module.exports.viewFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;
  const folder = await db.viewFolder(folderid, id);

  const storedFilesSorted = folder.children
    .concat(folder.files)
    .sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));

  const paths = await db.getPath(folderid, id);

  res.render("pages/viewFolder", {
    folder: folder,
    storage: storedFilesSorted,
    paths: paths,
  });
};

module.exports.addFile = async (req, res, next) => {
  const { folderid } = req.params;
  const { id } = req.user;
  await db.addFile(req.file, folderid, id);

  res.redirect("/folder/" + folderid);
};
