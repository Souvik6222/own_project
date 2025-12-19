document.addEventListener('DOMContentLoaded', () => {
  const askBtn = document.getElementById("ask");
  const resultArea = document.getElementById("result-area");
  const responseText = document.getElementById("response-text");
  const statusMsg = document.getElementById("status");
  const loader = document.querySelector(".loader");
  const btnText = document.querySelector(".btn-text");
  const replayBtn = document.getElementById("replay");
  const stopBtn = document.getElementById("stop");

  let currentUtterance = null;

  askBtn.addEventListener("click", async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get selected text from active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error("No active tab found");

      const execution = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });

      const selectedText = execution[0].result;

      if (!selectedText || !selectedText.trim()) {
        throw new Error("Please select some text on the page first!");
      }

      // 2. Send to backend
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: selectedText })
      });

      if (!response.ok) {
        if (response.status === 405) {
          throw new Error("Method Not Allowed (405). Check CORS configuration.");
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.reply) {
        throw new Error("Invalid response from server");
      }

      // 3. Show result and speak
      showResult(data.reply);
      speak(data.reply);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  });

  replayBtn.addEventListener("click", () => {
    const text = responseText.textContent;
    if (text) speak(text);
  });

  stopBtn.addEventListener("click", () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  });

  function speak(text) {
    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Optional: Select a better voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Female"));
    if (preferredVoice) utterance.voice = preferredVoice;

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function setLoading(isLoading) {
    if (isLoading) {
      askBtn.disabled = true;
      loader.classList.remove("hidden");
      btnText.textContent = "Processing...";
      resultArea.classList.add("hidden");
    } else {
      askBtn.disabled = false;
      loader.classList.add("hidden");
      btnText.textContent = "Process Selection";
    }
  }

  function setError(msg) {
    if (msg) {
      statusMsg.textContent = msg;
      statusMsg.classList.remove("hidden", "status-error"); // Reset classes
      statusMsg.classList.add("status-error");
      statusMsg.classList.remove("hidden");
    } else {
      statusMsg.classList.add("hidden");
    }
  }

  function showResult(text) {
    responseText.textContent = text;
    resultArea.classList.remove("hidden");
  }
});
