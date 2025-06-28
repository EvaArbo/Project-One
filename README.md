# 🛡️ Phishing URL Scanner (Frontend + JSON Server)

A phishing detection web app built with **HTML, CSS, JavaScript**, and **JSON Server**, designed to simulate how real-world phishing detection systems work — using a lightweight local JSON API instead of third-party APIs.


## 🌐 Purpose of This Project

This is a **practice project** to:

- Simulate checking if a URL is safe, suspicious, or malicious.
- Show visual feedback (✅ Safe, ⚠️ Suspicious, 🚨 Dangerous).
- Avoid real API complications like CORS and API key restrictions.
- Demonstrate how a frontend can interact with a backend API using **JSON Server**.


## 🧪 Sample URLs You Can Test

| Test Input URL                      | Verdict        |
|------------------------------------|----------------|
| `https://phishingsite.com`         | 🚨 Malicious   |
| `https://unknown-domain.net`       | ⚠️ Suspicious  |
| `https://www.google.com`           | ✅ Safe        |
| `https://badactor.malware.biz`     | 🚨 Malicious   |
| `https://myshop.suspicious.store`  | ⚠️ Suspicious  |


## ❗ Why i Didn't Use a Real API

### 😡 The CORS Problem

**CORS (Cross-Origin Resource Sharing)** is a browser security restriction that blocks frontend JavaScript from accessing APIs unless the server allows it explicitly.

For example:

```js
fetch("https://ipqualityscore.com/api/json/url/KEY/encodedURL")
```

This will likely fail with:

```
Access to fetch at 'https://...' from origin 'null' has been blocked by CORS policy
```

### ❌ No Public API Works Seamlessly

Most phishing detection APIs:

- 🚫 Are blocked by CORS
- 🔐 Require private API keys
- 🧱 Are rate-limited or paid
- ⚠️ Should not be exposed to the public frontend


## ✅ Why i Used `db.json` Instead

To simulate API behavior **without real network risks**, i used `json-server`, which reads from a local `db.json` file and behaves like a REST API.

```json
{
  "urls": [
    { "id": 1, "domain": "phishingsite.com", "verdict": "malicious" },
    { "id": 2, "domain": "unknown-domain.net", "verdict": "suspicious" },
    { "id": 3, "domain": "google.com", "verdict": "safe" }
  ]
}
```

This allows:

- 🚀 Asynchronous fetch requests from JavaScript
- 🔄 URL-based queries like `/urls?domain=google.com`
- 🔐 No risk of exposing sensitive keys
- 🌐 Works locally without CORS issues


## 🧠 How It Works

1. User inputs a URL.
2. `isValidURL()` checks its format.
3. `getDomain()` extracts the hostname.
4. `fetch('http://localhost:3000/urls?domain=...')` searches the local JSON server.
5. Displays results: ✅ Safe, ⚠️ Suspicious, or 🚨 Malicious.


## 🧱 Next Steps (For Real Projects)

To scale this into a production-grade phishing scanner:

- 🛠️ Use a secure backend (Node.js, Flask, etc.)
- 🔐 Store API keys safely on the server
- 📊 Save scan history to a real database
- 👥 Add user login and dashboards


## 👩‍💻 Built By

**Evah** – A passionate software engineering student building real-world tools while mastering frontend and backend development.


## 🔗 Project Link

GitHub Repository: [https://github.com/EvaArbo/Project-One](https://github.com/EvaArbo/Project-One)


## 📖 License

This project is **open-source** and free to use for learning, showcasing, or extension.
