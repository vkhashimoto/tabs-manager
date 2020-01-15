var chromePages = [];
var result = [];

const pagesList = document.getElementById("pages-list-id");


const input = document.getElementById("searchBar");

// update the list every input made by the user
input.addEventListener("input", (e) => {
  clearList();
  let searchTerm = e.target.value.toUpperCase();
  result = chromePages.filter(page => page.pageTitle.toUpperCase().includes(searchTerm));
  populate(result);
});

// pressed enter
document.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    if (result.length == 1) {
      getTabFocus(result[0]);
    }
  }
});


function getTabFocus({ tabId, windowId }) {
  chrome.tabs.update(parseInt(tabId), { active: true });
  chrome.windows.update(parseInt(windowId), { focused: true });
  closePopupWindows();
}

function closePopupWindows() {
  chrome.storage.local.get(["popupWindowId"], function (result) {
    chrome.storage.local.remove(["popupWindowId"]);
    chrome.windows.remove(parseInt(result.popupWindowId));
  });
}
chrome.windows.getAll({ populate: true }, function (windows) {
  windows.forEach((window) => {
    window.tabs.forEach((tab) => {
      chromePages.push({
        "pageTitle": tab.title,
        "link": tab.url,
        "icon": tab.favIconUrl,
        "tabId": tab.id,
        "windowId": tab.windowId
      });
    });
  });
  populate(chromePages);
});

function createListItem({ pageTitle, icon, link }) {
  var li = document.createElement("LI");
  li.innerHTML = `
        <div class='img' style='background-image: url(${icon});'></div> 
        <div>
            <h3>${pageTitle}</h3>
            <h4>${link}</h4>
         </div>`;
  pagesList.appendChild(li);
}

function clearList() {
  pagesList.innerHTML = "";
}

function populate(pages) {
  pages.forEach(page => createListItem(page));

}