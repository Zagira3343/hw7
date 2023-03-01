const cardsListElement = document.querySelector(".cards-wrapper");
const headerTitleElement = document.querySelector(".header-title")

cardsListElement.addEventListener("click", onCardListHandler);

getPosts().then(getAllPosts);

async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return await response.json();
}

async function getPost(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return await response.json();
}

async function getCommentsFromPost(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  return await response.json();
}

function onCardListHandler(e) {
  e.preventDefault();
  if (e.target.dataset.postId) {
    cardsListElement.innerHTML = "";
    headerTitleElement.textContent = `Post ${e.target.dataset.postId}`
    getPost(e.target.dataset.postId)
      .then((post) => {
        const renderedPost = renderPost(post);
        cardsListElement.insertAdjacentHTML("afterbegin", renderedPost);
        return getCommentsFromPost(e.target.dataset.postId);
      })
      .then((comments) => {
        comments.forEach((comment) => {
          const renderedComment = renderComment(comment);
          cardsListElement.insertAdjacentHTML("beforeend", renderedComment);
        });
      });
  } else if (e.target.classList.contains("btn-back")) {
    cardsListElement.innerHTML = ""
    headerTitleElement.textContent = "All Posts"
    getPosts().then(getAllPosts);
    
  }
}

function getAllPosts(posts) {
  let fragment = "";
  posts.forEach((post) => {
    fragment += renderPosts(post);
  });
  cardsListElement.insertAdjacentHTML("afterbegin", fragment);
}

function renderPosts({ id, title, body }) {
  return `<div class="card m-5">
    <div class="card-body">
      <h5 class="card-title">${id} ${title}</h5>
      <p class="card-text">${body}</p>
      <a href="#" class="btn btn-primary" data-post-id="${id}">Comments</a>
    </div>
  </div>`;
}

function renderPost({ id, title, body }) {
  return `<div class="card m-5">
    <div class="card-body">
      <h5 class="card-title">${id} ${title}</h5>
      <p class="card-text">${body}</p>
      <div class="d-flex justify-content-between">
        <a href="#" class="btn btn-primary" data-post-id="${id}">Comments</a>
        <a href="#" class="btn btn-danger btn-back">Back to all Posts</a>
      </div>
    </div>
  </div>`;
}

function renderComment(comment) {
  return `
  <div class="card m-5">
  <h5 class="card-header">Email: ${comment.email}</h5>
  <div class="card-body">
    <h5 class="card-title">Name: ${comment.name}</h5>
    <p class="card-text">${comment.body}</p>
  </div>
</div>`;
}