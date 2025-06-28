const checkBtn = document.getElementById("check-btn");
const urlInput = document.getElementById("url-input");
const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");

const API_KEY = "0197b69c-0d80-75f5-a2e4-c0a180aa2183"; 

checkBtn.addEventListener("click", async () => {
  const inputURL = urlInput.value.trim();
  if (!isValidURL(inputURL)) {
    showResult("❌ Invalid URL format. Please enter a valid link.", "error");
    return;
  }

  showResult("🔍 Submitting the URL for scanning...", "neutral");

  try {
    const scanResult = await fetchURLScanReport(inputURL);

    const verdicts = scanResult.verdicts?.overall?.categories || [];

    if (verdicts.includes("malicious")) {
      showResult(`🚨 Warning! This domain has been marked as MALICIOUS.`, "error");
    } else if (verdicts.length > 0) {
      showResult(`⚠️ Caution: Verdict - ${verdicts.join(", ")}.`, "warning");
    } else {
      showResult("🟢 No malicious activity detected. The URL appears safe.", "success");
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


async function fetchURLScanReport(url) {

  const response = await fetch("https://urlscan.io/api/v1/scan/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": API_KEY
    },
    body: JSON.stringify({ url, public: "on" })
  });

  const data = await response.json();
  const resultApiUrl = data.api;


  await new Promise(resolve => setTimeout(resolve, 8000));

  const resultResponse = await fetch(resultApiUrl);
  const resultData = await resultResponse.json();
  return resultData;
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
