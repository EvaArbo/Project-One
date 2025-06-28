
# 🛡️ Phishing URL Scanner (Frontend-Only Project)

A fully frontend-based **Phishing Link Checker** built with **HTML, CSS, and JavaScript**, designed to simulate how real-world phishing detection works — but **without needing a backend or real API**.


## 🌐 Purpose of This Project

This is a **practice project** to:

- Simulate checking if a URL is safe, suspicious, or malicious.
- Show visual feedback (✅ Safe, ⚠️ Suspicious, 🚨 Dangerous).
- Understand frontend limitations like **CORS**.
- Provide a great base for building an actual phishing detection tool.


## 🧪 Sample URLs You Can Test

| Test Input URL                      | Verdict        |
|------------------------------------|----------------|
| `https://phishingsite.com`         | 🚨 Malicious   |
| `https://unknown-domain.net`       | ⚠️ Suspicious  |
| `https://www.google.com`           | ✅ Safe        |
| `https://badactor.malware.biz`     | 🚨 Malicious   |
| `https://myshop.suspicious.store`  | ⚠️ Suspicious  |


## ❗ Why We Didn't Use a Real API

### 😡 The CORS Problem

**CORS (Cross-Origin Resource Sharing)** is a browser security policy that prevents JavaScript running in a web browser from calling external APIs unless the server explicitly allows it.

For example:

```js
fetch("https://ipqualityscore.com/api/json/url/KEY/encodedURL")
```

Will result in a CORS error like:

```
Access to fetch at 'https://...' from origin 'null' has been blocked by CORS policy
```

There is **no public phishing detection API** (such as IPQualityScore, Google Safe Browsing, VirusTotal, etc.) that can be used **directly from a browser** due to these limitations:

- 🚫 Blocked by CORS
- 🔐 Requires a secret API key, which must never be exposed in frontend code
- 🛑 Rate-limited or paid plans
- ⚠️ Security-sensitive – exposing such APIs directly is a misuse risk

## ✅ Why We Used a Simulated API Instead

To **bypass CORS restrictions** and still demonstrate how a phishing scanner works, we used a **fake API simulation function** like this:

```js
async function fetchDomainReport(domain) {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (domain.includes("phish") || domain.includes("malware") || domain.includes("bad")) {
    return { results: [{ verdict: "malicious" }] };
  } else if (domain.includes("unknown") || domain.includes("suspicious")) {
    return { results: [{ verdict: "suspicious" }] };
  } else {
    return { results: [] }; // Safe
  }
}
```

## 🧠 How It Works

1. User inputs a URL in the text field.
2. `isValidURL()` validates the format.
3. `getDomain()` extracts the domain from the full URL.
4. `fetchDomainReport(domain)` simulates a domain scan and returns a verdict.
5. `showResult()` displays the result using visual styling (color + message).


## 🧱 Next Steps (For Real Projects)

To build a production-ready phishing scanner:

- 🛠️ Use a Node.js proxy server to call phishing APIs securely.
- 🔐 Store API keys on the server-side only.
- 📊 Log scan results to a database.
- 👥 Add authentication and history tracking.


## 👩‍💻 Built By

**Evah** – A passionate software engineering student building real-world tools while mastering frontend and backend development.

## 🔗 Project Link

GitHub Repository: [https://github.com/your-username/phishing-url-scanner](https://github.com/your-username/phishing-url-scanner)


## 📖 License

This project is **open-source** and free to use for learning, showcasing, or extension.
