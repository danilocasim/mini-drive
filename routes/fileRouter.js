const { Router } = require("express");
const file = require("../controller/fileController");
const multer = require("multer");

const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const fileRouter = Router();

fileRouter.post("/addFolder/:folderid", file.addFolder);

fileRouter.get("/folder/:folderid", file.viewFolder);
fileRouter.post("/deleteFolder/:userid/:folderid", file.deleteFolder);
fileRouter.post("/deleteFile/:userid/:fileid", file.deleteFile);
fileRouter.post("/updateFolder/:userid/:folderid", file.renameFolder);
fileRouter.post("/updateFile/:userid/:fileid", file.renameFile);
fileRouter.post("/viewFileDetails/:userid/:fileid", file.viewFileDetails);
fileRouter.post("/addDrive", file.addDrive);
fileRouter.post("/addFile/:folderid", upload.single("avatar"), file.addFile);
module.exports = fileRouter;
