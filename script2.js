var database = [{"pageTitle": "Google"},{"pageTitle": "Youtube"},{"pageTitle": "Batata doce"},{"pageTitle": "Medium - Artigo"},];
const pagesList = document.getElementById("pages-list-id");


database.map(object => createListItem(object.pageTitle));

// database.filter(a => a.pageTitle === 'Google');

function createListItem(pageTitle) {
    var li = document.createElement("LI");
    li.innerHTML = `
        <div class='img' style='background-image: url(icon.png);'></div> 
        <div>
            <h3>${pageTitle}</h3>
            <h4>www.google.com.br/vini-otariohasuhsahuhdhsaudhduadsadh</h4>
         </div>`;
    pagesList.appendChild(li);
}



// document.getElementById("pages-list-id").innerHTML = "<li> <div class='img' style='background-image: url(icon.png);'></div> <div><h3>Page Title</h3><h4>www.google.com.br/vini-otariohasuhsahuhdhsaudhduadsadh</h4></div></li>"