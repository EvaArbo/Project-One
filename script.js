const checkBtn = document.getElementById("check-btn");
const urlInput = document.getElementById("url-input");
const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");

// ✅ Use your IPQualityScore API key here
const API_KEY = "0NY03yKIwJF99zilIfD8yaZUuEo1D5Hc";

// 👂 Main event handler
checkBtn.addEventListener("click", async () => {
  const inputURL = urlInput.value.trim();

  if (!isValidURL(inputURL)) {
    showResult("❌ Invalid URL format. Please enter a valid link.", "error");
    return;
  }

  showResult("🔍 Checking the URL...", "neutral");

  try {
    const scanResult = await fetchURLScanReport(inputURL);
    const riskScore = scanResult.risk_score;
    const unsafe = scanResult.unsafe;

    if (unsafe) {
      showResult(`🚨 Warning! This link is UNSAFE. Risk Score: ${riskScore}/100`, "error");
    } else if (riskScore > 40) {
      showResult(`⚠️ Caution: Moderate risk. Score: ${riskScore}/100`, "warning");
    } else {
      showResult("🟢 This URL appears safe to visit.", "success");
    }
  } catch (err) {
    console.error(err);
    showResult("❌ Error checking the link. Please try again later.", "error");
  }
});

/**
 * ✅ Validate URL structure
 */
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 🔍 Fetch scan report from IPQualityScore API
 */
async function fetchURLScanReport(url) {
  const encodedURL = encodeURIComponent(url);
  const endpoint = `https://ipqualityscore.com/api/json/url/${API_KEY}/${encodedURL}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch scan results");
  }

  const data = await response.json();
  return data;
}

/**
 * 🎯 Display result with color/status
 */
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
