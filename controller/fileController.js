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

// FIX
module.exports.addFile = async (req, res, next) => {
  require("dotenv").config();
  const { createClient } = require("@supabase/supabase-js");

  const supabaseUrl = "https://dmtrxkgcngebdqurydeg.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  supabase.storage
    .from("obj")
    .upload("public/avatar1.pdf", req.file, {
      cacheControl: "3600",
      upsert: false,
    })
    .then((data) => {
      console.log(data);
    });

  supabase.storage
    .from("obj")
    .list()
    .then((data) => {
      console.log(data);
    });
  console.log(req.file);

  const { folderid } = req.params;
  const { id } = req.user;
  await db.addFile(req.file, folderid, id);

  res.redirect("/folder/" + folderid);
};
