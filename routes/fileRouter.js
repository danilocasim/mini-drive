const { Router } = require("express");
const file = require("../controller/fileController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const fileRouter = Router();

fileRouter.post("/addFolder/:folderid", file.addFolder);

fileRouter.get("/folder/:folderid", file.viewFolder);

fileRouter.post("/addDrive", file.addDrive);
fileRouter.post("/addFile/:folderid", upload.single("avatar"), file.addFile);
module.exports = fileRouter;
