const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let albumsDivEl;
let loadButtonEl;
let albumsBackButtonEl;

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        // Creating comment nav stuff
        const comAttr = document.createAttribute("data-post-id");
        comAttr.value = post.id;
        liEl.setAttributeNode(comAttr);
        
        liEl.addEventListener('click', onLoadComments);


        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');

    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    

    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');
    const buttonEl = document.getElementById('albums-button');
    buttonEl.setAttribute('data-user-id', userId);
    buttonEl.addEventListener('click', onLoadAlbums);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');

    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

function onLoadComments() {
    const el = this;
    const postId = el.getAttribute('data-post-id');
    
    const commentsEl = removeAndCreateNew(this, 'comments', 'div');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function onCommentsReceived() {
    const cmEl = document.getElementById("comments");
    
    const comments = JSON.parse(this.responseText);

    for (let i = 0; i < comments.length; i++) {
        const singleCommentEl = document.createElement('p');

        const nameEl = document.createElement('div');
        nameEl.textContent = 'name: ' + comments[i].name;

        const emailEl = document.createElement('div');
        emailEl.textContent = 'e-mail: ' + comments[i].email;

        const bodyEl = document.createElement('div');
        bodyEl.textContent = comments[i].body;

        cmEl.appendChild(singleCommentEl);
        singleCommentEl.appendChild(nameEl);
        singleCommentEl.appendChild(emailEl);
        singleCommentEl.appendChild(bodyEl);
        
    }
    
}

function onLoadAlbums() {
    let userId = this.getAttribute('data-user-id');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

function onAlbumsReceived() {
    postsDivEl.style.display = 'none';
    albumsDivEl.style.display = 'block';
    const text = this.responseText;
    const albums = JSON.parse(text);
    let albumsContentEl = document.getElementById('albums-content');
    while (albumsContentEl.firstChild) {
        albumsContentEl.removeChild(albumsContentEl.firstChild);
    }
    albumsContentEl.appendChild(createAlbumsTable(albums));
}

function createAlbumsTable(albums) {
    tabEl = document.createElement('div');
    for (let i = 0; i < albums.length; i++) {
        let titleEl = document.createElement('td');
        titleEl.textContent = albums[i].title;
        titleEl.setAttribute('data-album-id', albums[i].id);
        titleEl.addEventListener('click', onLoadPictures);

        let rowEl = document.createElement('tr');
        rowEl.appendChild(titleEl);
        tabEl.appendChild(rowEl);
        
    }
    return tabEl;
}

function onLoadPictures() {
    const el = this;
    const albumId = this.getAttribute('data-album-id');

    const picturesEl = removeAndCreateNew(this, 'pictures', 'div');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPicturesReceived);
    xhr.open('GET', BASE_URL + '/photos?albumId=' + albumId);
    xhr.send();

}

function onPicturesReceived() {
    const text = this.responseText;
    const pictures = JSON.parse(text);
    const picturesEl = document.getElementById('pictures');
    picturesEl.appendChild(createPictureTable(pictures));
}

function createPictureTable(pictures) {
    const picturesEl = document.createElement('p');
    for (let i = 0; i < pictures.length; i++) {
        const imgDivEl = document.createElement('div');
        const imgTextEl = document.createElement('p');
        imgTextEl.textContent = pictures[i].title;
        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', pictures[i].url);

        imgDivEl.appendChild(imgTextEl);
        imgDivEl.appendChild(imgEl);
        picturesEl.appendChild(imgDivEl);
    }
    return picturesEl;
}

function removeAndCreateNew(parentEl, id, tag) {
    const oldEl = document.getElementById(id);
    if (oldEl != null) {
        oldEl.remove();

    }

    const newEl = document.createElement(tag);
    newEl.setAttribute('id', id);

    parentEl.appendChild(newEl)
    return newEl;
}

function onAlbumsBack() {
    albumsDivEl.style.display = 'none';
    postsDivEl.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    albumsDivEl = document.getElementById('albums');
    albumsBackButtonEl = document.getElementById('albums-back-button');

    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
    loadButtonEl.addEventListener('click', onLoadUsers);
    albumsBackButtonEl.addEventListener('click', onAlbumsBack);
});