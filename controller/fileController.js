const db = require("../prisma/queries/FileQueries");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://dmtrxkgcngebdqurydeg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  await db.deleteFolder(folderid, id);
  res.redirect("/");
};

module.exports.deleteFile = async (req, res) => {
  const { fileid } = req.params;
  const { id } = req.user;

  await db.deleteFile(fileid, id);
  res.redirect("/");
};

module.exports.renameFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;
  const { newname } = req.body;

  await db.renameFolder(folderid, newname, id);

  res.redirect(`/`);
};

module.exports.renameFile = async (req, res) => {
  const { fileid } = req.params;
  const { id } = req.user;
  const { newname } = req.body;

  await db.renameFile(fileid, newname, id);
  res.redirect("/");
};

module.exports.viewFolder = async (req, res) => {
  const { folderid } = req.params;
  const { id } = req.user;
  const folder = await db.viewFolder(folderid, id);

  const storedFilesSorted = folder.children
    .concat(folder.files)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const paths = await db.getPath(folderid, id);
  res.render("pages/viewFolder", {
    folder: folder,
    storage: storedFilesSorted,
    paths: paths,
  });
};

// FIX
module.exports.addFile = async (req, res, next) => {
  const { folderid } = req.params;
  const { username, id } = req.user;
  const { originalname } = req.file;
  const path = `${username}/${folderid}/${originalname}`;
  supabase.storage
    .from("drive")
    .upload(path, req.file, {
      cacheControl: "3600",
      upsert: false,
    })
    .then((data) => {
      console.log(data);
    });

  await db.addFile(path, originalname, folderid, id);

  res.redirect("/folder/" + folderid);
};
