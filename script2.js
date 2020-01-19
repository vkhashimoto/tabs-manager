var chromePages = [];
var result = [];
var selectedRow = 0;

const pagesList = document.getElementById("pages-list-id");


const input = document.getElementById("searchBar");

// update the list every input made by the user
input.addEventListener("input", (e) => {
  selectedRow = 0;
  clearList();
  let searchTerm = e.target.value.toUpperCase();
  populate(chromePages.filter(page => page.pageTitle.toUpperCase().includes(searchTerm)));
});

// pressed enter
document.addEventListener('keyup', (e) => {
  switch (e.keyCode) {
    case 13:
      getTabFocus(result[selectedRow]);
      break;
    case 38:
      rowSelector("up");
      break;
    case 40:
      rowSelector("down");
      break
    case 27:
      closePopupWindows();
      break;
  }
});

function rowSelector(dir) {
  let rowCount = document.getElementsByTagName("li").length - 1;
  let lastSelected = selectedRow;
  if (dir === "up") {
    if (selectedRow == 0) selectedRow = rowCount;
    else selectedRow--;
  } else if (dir === "down") {
    if (selectedRow == rowCount) selectedRow = 0;
    else selectedRow++;
  }

  selectRow(selectedRow, lastSelected);
}

function selectRow(index, lastSelected) {
  let rows = document.getElementsByTagName("li");
  rows[lastSelected].classList.remove("select");
  rows[index].classList.add("select");
}

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
  // when open the popup, the first item is selected
  selectRow(selectedRow, 1);
});

function createListItem({ pageTitle, icon, link }, resultIndex) {
  var li = document.createElement("LI");
  li.innerHTML = `
        <div class='img' style='background-image: url(${icon});'></div> 
        <div>
            <h3>${pageTitle}</h3>
            <h4>${link}</h4>
         </div>`;
  li.addEventListener('click', function (event) {
    openOnClick(resultIndex);
  });
  pagesList.appendChild(li);
}

function clearList() {
  pagesList.innerHTML = "";
}

function populate(pages) {
  result = pages;
  pages.forEach((page, index) => createListItem(page, index));
}

function openOnClick(resultIndex) {
  getTabFocus(result[resultIndex]);
}