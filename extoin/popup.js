
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn");
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openPopup" })
    console.log("hello")
  });
});

document.getElementById("openLinkBtn").addEventListener("click", function() {
  chrome.tabs.create({ url: "https://www.heliusdev.in/" });
});

