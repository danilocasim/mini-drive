const dialogs = document.querySelectorAll("dialog");
const dialogButtons = document.querySelectorAll(
  "dialog + button, dialog + div input[type='image']"
);
const exitDialogs = document.querySelectorAll(".exit-dialog");

dialogs.forEach((dialog, index) => {
  dialogButtons[index].addEventListener("click", () => {
    dialog.showModal();
  });

  exitDialogs[index].addEventListener("click", () => {
    dialog.close();
  });
});
