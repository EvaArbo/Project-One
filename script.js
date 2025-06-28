document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("check-btn");
  const urlInput = document.getElementById("url-input");
  const resultBox = document.getElementById("result-box");
  const resultMessage = document.getElementById("result-message");

  checkBtn.addEventListener("click", async () => {
    const inputURL = urlInput.value.trim();
    if (!isValidURL(inputURL)) {
      showResult("❌ Invalid URL format. Please enter a valid link.", "error");
      return;
    }

    showResult("🔍 Checking the URL...", "neutral");

    const domain = getDomain(inputURL);

    try {
      const response = await fetch(`http://localhost:3000/urls?domain=${domain}`);
      const data = await response.json();

      if (data.length === 0) {
        showResult("🟢 No known phishing activity. The URL appears safe.", "success");
      } else {
        const verdict = data[0].verdict;
        if (verdict === "malicious") {
          showResult("🚨 Warning! This domain has been reported as MALICIOUS.", "error");
        } else {
          showResult(`⚠️ Caution: Verdict - ${verdict}.`, "warning");
        }
      }
    } catch (err) {
      console.error(err);
      showResult("❌ Error checking the link. Please try again later.", "error");
    }
  });

  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function getDomain(url) {
    const parsed = new URL(url);
    return parsed.hostname;
  }

  function showResult(message, status) {
    resultBox.classList.remove("hidden", "result-success", "result-warning", "result-error");

    if (status === "success") {
      resultBox.classList.add("result-success");
    } else if (status === "warning") {
      resultBox.classList.add("result-warning");
    } else if (status === "error") {
      resultBox.classList.add("result-error");
    }

    resultMessage.textContent = message;
  }
});
