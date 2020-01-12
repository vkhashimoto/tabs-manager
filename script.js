var foundTabs = [];
var input = document.getElementById("searchBar");

var selectedRow = 0;

input.addEventListener('input', searchTab);
document.addEventListener('keyup', function onEvent(e) {
  if (e.keyCode === 13) {
    goToTab();
  }
});

document.addEventListener('keyup', function (e) {
  let dir;
  if (e.keyCode === 38 || e.keyCode === 40) {
    if (e.keyCode === 38) { // up
      dir = "up";
    } else if (e.keyCode === 40) { //down
      dir = "down";
    }
    selectRow(dir);
  }
});

function goToTab() {
  let table = document.getElementById("table");
  let trs = table.getElementsByClassName("tab-exists");
  console.log("Going to row: " + selectedRow);

  if (trs.length == 1) {
    let tabId = trs[0].getElementsByTagName("td")[0].innerText;
    let windowId = trs[0].getElementsByTagName("td")[3].innerText
    chrome.tabs.update(parseInt(tabId), { active: true });
    chrome.windows.update(parseInt(windowId), { focused: true });
    selectedRow = 0;
  } else {
    let tabId = trs[selectedRow].getElementsByTagName("td")[0].innerText;
    let windowId = trs[selectedRow].getElementsByTagName("td")[3].innerText
    chrome.tabs.update(parseInt(tabId), { active: true });
    chrome.windows.update(parseInt(windowId), { focused: true });
  }
}

function selectRow(direction) {
  let maxLenght = document.getElementById("table").getElementsByClassName("tab-exists").length;
  let lastRow = selectedRow;
  if (direction === "up") {
    if (selectedRow === 0) {
      selectedRow = maxLenght - 1;
    } else {
      selectedRow--;
    }
  } else if (direction === "down") {
    if (selectedRow === maxLenght - 1) {
      selectedRow = 0;
    } else {
      selectedRow++;
    }
  }
  let tr = document.getElementById("table").getElementsByClassName("tab-exists")[selectedRow];
  clearPreviousSelection(lastRow);
  tr.style.backgroundColor = "red";
}

function clearPreviousSelection(lastRow) {
  document.getElementById("table").getElementsByClassName("tab-exists")[lastRow].style.backgroundColor = "";
}

function searchTab(e) {
  let searchTerm = e.target.value.toUpperCase();
  let table = document.getElementById("table");
  let trs = table.getElementsByTagName("tr");
  let td, tds;
  let tdText;

  for (let index = 0; index < trs.length; index++) {
    tds = trs[index].getElementsByTagName("td");
    for (let tdIndex = 0; tdIndex < tds.length; tdIndex++) {
      td = tds[tdIndex];
      if (td) {
        tdText = td.textContent || td.innerText;
        tdText = tdText.toUpperCase();
        if (tdText.includes(searchTerm)) {
          trs[index].style.display = "";
          trs[index].classList.add("tab-exists");
          break;
        } else {
          trs[index].style.display = "none";
          trs[index].classList.remove("tab-exists");
          continue;
        }
      }
    }
  }

}

chrome.windows.getAll({ populate: true }, function (windows) {
  cleanTable();
  windows.forEach(function (window) {
    populate(window.id, window.tabs);
  });
});

function populate(windowId, tabs) {

  let table = document.getElementById("table");

  tabs.forEach(tab => {
    var tr = document.createElement('tr');
    tr.classList.add("tab-exists");
    var td = document.createElement('td');
    let id = tab.id;
    let title = tab.title;
    let url = tab.url;
    foundTabs.push({ id, title, url });
    td.appendChild(document.createTextNode(id));
    td.classList.add("id");
    tr.appendChild(td);
    td = document.createElement('td');
    td.appendChild(document.createTextNode(title));
    td.classList.add("title");
    tr.appendChild(td);
    td = document.createElement('td');
    td.appendChild(document.createTextNode(url));
    td.classList.add("url");
    tr.appendChild(td);

    // window id
    td = document.createElement("td");
    td.appendChild(document.createTextNode(windowId));
    tr.appendChild(td);

    table.querySelector("#tableBody").appendChild(tr);
  });
  if (foundTabs.length > 0) {
    let tr = document.getElementById("table").getElementsByClassName("tab-exists")[0];
    tr.style.backgroundColor = "red";
  }
}

function cleanTable() {
  let existingTable = document.getElementById("table");
  let newTable = generateNewTable();
  existingTable.replaceWith(newTable);
}

function generateNewTable() {
  let newTable = document.createElement("table");
  newTable.id = "table";
  let newTableBody = document.createElement("tbody");
  newTableBody.id = "tableBody";

  let tr = document.createElement("tr");

  // ID Column
  let th = document.createElement("th");
  th.appendChild(document.createTextNode("ID"));
  tr.appendChild(th);

  // Title Column
  th = document.createElement("th");
  th.appendChild(document.createTextNode("Title"));
  tr.appendChild(th);

  // URL Column
  th = document.createElement("th");
  th.appendChild(document.createTextNode("URL"));
  tr.appendChild(th);


  newTableBody.appendChild(tr);
  newTable.appendChild(newTableBody);

  return newTable;
}