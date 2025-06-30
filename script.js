// =================== DOM References ===================
const loginScreen = document.getElementById("login-screen");
const mainApp = document.getElementById("main-app");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");
const checkBtn = document.getElementById("check-btn");
const urlInput = document.getElementById("url-input");
const urlTag = document.getElementById("url-tag");
const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");
const spinner = document.getElementById("spinner");
const historyList = document.getElementById("history-list");
const searchInput = document.getElementById("search-history");
const exportBtn = document.getElementById("export-csv");
const clearBtn = document.getElementById("clear-history");
const scrollTopBtn = document.getElementById("scroll-top");
const darkBtn = document.getElementById("dark-btn");
const lightBtn = document.getElementById("light-btn");
const adminPanel = document.getElementById("admin-section");
const totalCount = document.getElementById("total-count");
const safeCount = document.getElementById("safe-count");
const suspiciousCount = document.getElementById("suspicious-count");
const maliciousCount = document.getElementById("malicious-count");
const adminDomainInput = document.getElementById("admin-domain-input");
const adminDomainVerdict = document.getElementById("admin-domain-verdict");
const addDomainBtn = document.getElementById("admin-add-domain");
const adminDomainList = document.getElementById("admin-domain-list");
const loadUsersBtn = document.getElementById("load-users-btn");
const userList = document.getElementById("user-list");
const auditLogList = document.getElementById("audit-log-list");

// =================== Session Management ===================
function storeSession(user) {
  localStorage.setItem("phishUser", JSON.stringify(user));
}

function getSession() {
  return JSON.parse(localStorage.getItem("phishUser"));
}

function checkAdmin() {
  const user = getSession();
  if (user && user.role === "admin") {
    adminPanel.classList.remove("hidden");
    loadDomains();
    loadUsers();
    loadAuditLogs();
  } else {
    adminPanel.classList.add("hidden");
  }
}

function logout() {
  localStorage.removeItem("phishUser");
  mainApp.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

// =================== Helper Functions ===================
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function showResult(message, status) {
  resultBox.className = "fade";
  resultBox.classList.add(`result-${status}`);
  resultBox.classList.remove("hidden");
  resultMessage.textContent = message;
}

function saveHistory(domain, verdict, tag) {
  const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
  history.unshift({ domain, verdict, tag, time: new Date().toLocaleString() });
  localStorage.setItem("urlHistory", JSON.stringify(history));
  renderHistory();
  updateAnalytics();
}

function renderHistory(filter = "") {
  const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
  historyList.innerHTML = "";
  history.filter(h => h.domain.includes(filter) || (h.tag && h.tag.includes(filter)))
    .forEach((item, index) => {
      const badge = item.verdict === "malicious" ? "🚨" : item.verdict === "suspicious" ? "⚠️" : "✅";
      const li = document.createElement("li");
      li.innerHTML = `<span>${badge} ${item.domain} [${item.tag || "No tag"}] - ${item.time}</span>
                      <button onclick="deleteEntry(${index})">🗑️</button>`;
      historyList.appendChild(li);
    });
}

function updateAnalytics() {
  const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
  totalCount.textContent = history.length;
  safeCount.textContent = history.filter(h => h.verdict === "safe").length;
  suspiciousCount.textContent = history.filter(h => h.verdict === "suspicious").length;
  maliciousCount.textContent = history.filter(h => h.verdict === "malicious").length;
}

window.deleteEntry = function(index) {
  const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
  history.splice(index, 1);
  localStorage.setItem("urlHistory", JSON.stringify(history));
  renderHistory(searchInput.value);
  updateAnalytics();
};

// =================== Admin Features ===================

async function loadDomains() {
  const res = await fetch("http://localhost:3000/urls");
  const domains = await res.json();
  adminDomainList.innerHTML = "";
  domains.forEach(domain => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${domain.domain} — <strong>${domain.verdict}</strong></span>
                    <button onclick="deleteDomain(${domain.id})">🗑️</button>`;
    adminDomainList.appendChild(li);
  });
}

window.deleteDomain = async function(id) {
  const res = await fetch(`http://localhost:3000/urls/${id}`, { method: "DELETE" });
  if (res.ok) {
    logAction(`Deleted domain ID ${id}`);
    loadDomains();
  }
};

addDomainBtn.addEventListener("click", async () => {
  const domain = adminDomainInput.value.trim();
  const verdict = adminDomainVerdict.value;
  if (!domain) return alert("Please enter a domain");
  const res = await fetch("http://localhost:3000/urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, verdict })
  });
  if (res.ok) {
    logAction(`Added domain: ${domain} (${verdict})`);
    adminDomainInput.value = "";
    loadDomains();
  } else {
    alert("Failed to add domain");
  }
});

loadUsersBtn.addEventListener("click", loadUsers);

async function loadUsers() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();
  userList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${user.username} (${user.role})</span>
                    <button onclick="deleteUser(${user.id})">🗑️</button>`;
    userList.appendChild(li);
  });
}

window.deleteUser = async function(id) {
  const res = await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
  if (res.ok) {
    logAction(`Deleted user ID ${id}`);
    loadUsers();
  }
};

async function logAction(action) {
  const user = getSession();
  await fetch("http://localhost:3000/auditLogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, by: user.username, time: new Date().toLocaleString() })
  });
  loadAuditLogs();
}

async function loadAuditLogs() {
  const res = await fetch("http://localhost:3000/auditLogs");
  const logs = await res.json();
  auditLogList.innerHTML = "";
  logs.forEach(log => {
    const li = document.createElement("li");
    li.textContent = `${log.time} — ${log.by}: ${log.action}`;
    auditLogList.appendChild(li);
  });
}

// =================== Event Listeners ===================

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
  const users = await res.json();
  if (users.length) {
    storeSession(users[0]);
    loginScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");
    checkAdmin();
  } else {
    alert("Invalid credentials");
  }
});

registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const role = document.getElementById("register-role").value;
  const checkRes = await fetch(`http://localhost:3000/users?username=${username}`);
  const existing = await checkRes.json();
  if (existing.length > 0) return alert("Username already exists");
  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  });
  if (res.ok) alert("Registration successful. Please login.");
});

logoutBtn.addEventListener("click", logout);

checkBtn.addEventListener("click", async () => {
  const inputURL = urlInput.value.trim();
  const tag = urlTag.value.trim();
  if (!isValidURL(inputURL)) return showResult("❌ Invalid URL format", "error");
  const domain = new URL(inputURL).hostname;
  spinner.classList.remove("hidden");
  resultBox.classList.add("hidden");
  const res = await fetch(`http://localhost:3000/urls?domain=${domain}`);
  const data = await res.json();
  spinner.classList.add("hidden");
  const verdict = data.length ? data[0].verdict : "safe";
  const messages = {
    safe: "✅ This URL is considered safe.",
    suspicious: "⚠️ This URL seems suspicious. Be cautious.",
    malicious: "🚨 Malicious URL detected! Avoid clicking it."
  };
  showResult(messages[verdict], verdict === "safe" ? "success" : verdict === "suspicious" ? "warning" : "error");
  saveHistory(domain, verdict, tag);
});

exportBtn.addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("urlHistory")) || [];
  if (!history.length) return alert("Nothing to export");
  let csv = "Domain,Tag,Verdict,Time\n";
  history.forEach(h => csv += `${h.domain},${h.tag || ""},${h.verdict},${h.time}\n`);
  const link = document.createElement("a");
  link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  link.download = "url_history.csv";
  link.click();
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("urlHistory");
  renderHistory();
  updateAnalytics();
});

searchInput.addEventListener("input", () => {
  renderHistory(searchInput.value.trim());
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

darkBtn.addEventListener("click", () => {
  document.body.classList.remove("light");
  localStorage.setItem("theme", "dark");
});

lightBtn.addEventListener("click", () => {
  document.body.classList.add("light");
  localStorage.setItem("theme", "light");
});

// =================== Init ===================
const session = getSession();
if (session) {
  loginScreen.classList.add("hidden");
  mainApp.classList.remove("hidden");
  checkAdmin();
}
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}
renderHistory();
updateAnalytics();
