// --- Signup Function ---
const signupBtn = document.getElementById("signup-btn");
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const pass = document.getElementById("signup-password").value;

    if (!name || !email || !pass) return alert("All fields required!");

    localStorage.setItem("luxoraUser", JSON.stringify({ name, email, pass }));

    alert("Signup Successful! Redirecting to Login...");
    window.location.href = "index.html";
  });
}

// --- Login Function ---
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-password").value;

    const user = JSON.parse(localStorage.getItem("luxoraUser"));

    if (!user) return alert("No user found! Please Signup first.");

    if (email === user.email && pass === user.pass) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "home.html";
    } else {
      alert("Incorrect email or password!");
    }
  });
}

// --- Redirect Protection ---
if (window.location.pathname.includes("home.html")) {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

// --- Show Username on Home ---
const userDisplay = document.getElementById("user-display");
if (userDisplay) {
  const user = JSON.parse(localStorage.getItem("luxoraUser"));
  userDisplay.textContent = `Hi, ${user.name}`;
}

if (userDisplay && user) {
  userDisplay.textContent = `Hi, ${user.name}`;
}

// --- Logout ---
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });
}

// --- Post System ---
let posts = JSON.parse(localStorage.getItem("luxPosts")) || [];

const postBtn = document.getElementById("post-btn");
if (postBtn) {
  postBtn.addEventListener("click", () => {
    const text = document.getElementById("post-text").value;
    const image = document.getElementById("post-image").value;

    if (!text) return alert("Post text is required!");

    const newPost = {
      id: Date.now(),
      text,
      image,
      likes: 0,
      time: new Date().toLocaleString(),
    };

    posts.unshift(newPost);
    localStorage.setItem("luxPosts", JSON.stringify(posts));
    renderPosts();
  });
}

// --- Render Posts ---
function renderPosts() {
  const feed = document.getElementById("posts-feed");
  if (!feed) return;

  feed.innerHTML = "";

  posts.forEach((p) => {
    feed.innerHTML += `
      <div class="post">
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}" />` : ""}
        <small>${p.time}</small>

        <div class="post-actions">
          <span class="like-btn" onclick="toggleLike(${p.id})">❤️ ${p.likes}</span>
          <span class="delete-btn" onclick="deletePost(${p.id})">Delete</span>
        </div>
      </div>
    `;
  });
}
renderPosts();

// --- Like Toggle ---
function toggleLike(id) {
  posts = posts.map((p) => {
    if (p.id === id) p.likes = p.likes + 1;
    return p;
  });
  localStorage.setItem("luxPosts", JSON.stringify(posts));
  renderPosts();
}

// --- Delete Post ---
function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  posts = posts.filter((p) => p.id !== id);
  localStorage.setItem("luxPosts", JSON.stringify(posts));
  renderPosts();
}

// --- Search ---
const searchBar = document.getElementById("search-bar");
if (searchBar) {
  searchBar.addEventListener("input", () => {
    const term = searchBar.value.toLowerCase();
    const filtered = posts.filter((p) => p.text.toLowerCase().includes(term));
    renderFiltered(filtered);
  });
}

function renderFiltered(list) {
  const feed = document.getElementById("posts-feed");
  feed.innerHTML = "";
  list.forEach((p) => {
    feed.innerHTML += `
      <div class="post">
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}" />` : ""}
        <small>${p.time}</small>
        <div class="post-actions">
          <span class="like-btn" onclick="toggleLike(${p.id})">❤️ ${p.likes}</span>
          <span class="delete-btn" onclick="deletePost(${p.id})">Delete</span>
        </div>
      </div>
    `;
  });
}

// --- Sorting ---
const sortSelect = document.getElementById("sort-select");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const type = sortSelect.value;

    if (type === "latest") posts.sort((a, b) => b.id - a.id);
    if (type === "oldest") posts.sort((a, b) => a.id - b.id);
    if (type === "liked") posts.sort((a, b) => b.likes - a.likes);

    renderPosts();
  });
}
