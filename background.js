chrome.commands.onCommand.addListener(async function (command) {
  if (command === 'search-tabs') {
    await chrome.storage.local.get(["popupWindowId"], function (result) {
      if (result) {
        let windowId = parseInt(result.popupWindowId);
        if (typeof windowId !== "number" || Number.isNaN(windowId)) {
          chrome.storage.local.remove(["popupWindowId"]);
          newWindow();
        } else {
          chrome.windows.get(windowId, (window) => {
            if (window)
              chrome.windows.update(parseInt(result.popupWindowId), { focused: true });
            else newWindow()
          });
        }
      }
    });
  }
});


function newWindow() {
  var maxWidth = window.screen.availWidth;
  var maxHeight = window.screen.availHeight;

  createData = {
    url: "popup.html",
    type: "popup",
    left: Math.round(maxWidth / 4),
    top: Math.round(maxHeight / 4),
    width: Math.round(maxWidth / 2),
    height: Math.round(maxHeight / 2),
    focused: true
  };
  chrome.windows.create(createData, (window) => {
    chrome.storage.local.set({ "popupWindowId": window.id });
    chrome.windows.onRemoved.addListener((windowId) => {
      if (windowId === window.id) {
        chrome.storage.local.remove(["popupWindowId"]);
      }
    })
  });
}