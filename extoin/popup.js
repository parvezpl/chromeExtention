document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn");
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openPopup" })
    console.log("hello")
    console.log("exucute excelmanager")
  });
});

