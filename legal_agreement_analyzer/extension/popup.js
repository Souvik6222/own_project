const API_URL = "http://localhost:8000";

// DOM Elements
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const docInfo = document.getElementById("docInfo");
const docName = document.getElementById("docName");
const docStats = document.getElementById("docStats");
const deleteBtn = document.getElementById("deleteBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

// New Mode Elements
const modeUpload = document.getElementById("modeUpload");
const modePaste = document.getElementById("modePaste");
const modeTab = document.getElementById("modeTab");

const uploadSection = document.getElementById("uploadSection");
const pasteSection = document.getElementById("pasteSection");
const tabSection = document.getElementById("tabSection");

const pasteText = document.getElementById("pasteText");
const processTextBtn = document.getElementById("processTextBtn");
const processTabBtn = document.getElementById("processTabBtn");

const riskDashboard = document.getElementById("riskDashboard");
const gaugeFill = document.getElementById("gaugeFill");
const riskScore = document.getElementById("riskScore");
const riskLevelLabel = document.getElementById("riskLevel");
const keyRisksList = document.getElementById("keyRisksList");
const detailedAnalysis = document.getElementById("detailedAnalysis");

const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const btnText = document.getElementById("btnText");
const chatDiv = document.getElementById("chat");
const statusDiv = document.getElementById("status");
const errorDiv = document.getElementById("error");

// State
let currentDocumentId = null;
let currentFilename = null;

// Load saved document and analysis from storage
chrome.storage.local.get(['documentId', 'filename', 'analysisData'], (result) => {
    if (result.documentId && result.filename) {
        currentDocumentId = result.documentId;
        currentFilename = result.filename;
        updateUIAfterUpload(result.filename, "Loaded from storage");

        // Check if we have saved analysis
        if (result.analysisData && result.analysisData.documentId === currentDocumentId) {
            displayRiskAnalysis(result.analysisData.data);
        }
    }
});

// Mode Toggles
modeUpload.addEventListener("click", () => {
    setMode("upload");
});

modePaste.addEventListener("click", () => {
    setMode("paste");
});

modeTab.addEventListener("click", () => {
    setMode("tab");
});

function setMode(mode) {
    modeUpload.classList.remove("active");
    modePaste.classList.remove("active");
    modeTab.classList.remove("active");

    uploadSection.style.display = "none";
    pasteSection.style.display = "none";
    tabSection.style.display = "none";

    if (mode === "upload") {
        modeUpload.classList.add("active");
        uploadSection.style.display = "block";
    } else if (mode === "paste") {
        modePaste.classList.add("active");
        pasteSection.style.display = "block";
    } else if (mode === "tab") {
        modeTab.classList.add("active");
        tabSection.style.display = "block";
    }
}

// Upload Area Click
uploadArea.addEventListener("click", () => {
    fileInput.click();
});

// File Selection
fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await uploadDocument(file);
    fileInput.value = ""; // Reset input
});

// Paste Text Process
processTextBtn.addEventListener("click", async () => {
    const text = pasteText.value.trim();
    if (!text) {
        showError("Please enter some text to analyze");
        return;
    }

    await processPastedText(text, "Pasted_Agremeent.txt");
});

// Analyze Current Tab
processTabBtn.addEventListener("click", async () => {
    hideError();
    setLoading(true, "Extracting page content...");

    try {
        if (!chrome.scripting) {
            throw new Error("Scripting API not available. Please reload the extension in chrome://extensions to enable new permissions.");
        }

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            throw new Error("No active tab found");
        }

        // Execute script to get text
        const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // Get visible text, basic cleanup
                return document.body.innerText;
            }
        });

        if (!result || !result[0] || !result[0].result) {
            throw new Error("Failed to extract text from page");
        }

        const pageText = result[0].result;
        const pageTitle = tab.title || "Webpage_Content.txt";

        if (pageText.length < 100) {
            throw new Error("Page content is too short to analyze.");
        }

        await processPastedText(pageText, pageTitle);

    } catch (err) {
        console.error("Tab analysis error:", err);
        showError("Failed to analyze page: " + err.message);
        setLoading(false);
    }
});


// Drag and Drop
uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "rgba(255, 215, 0, 0.8)";
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "rgba(255, 215, 0, 0.3)";
});

uploadArea.addEventListener("drop", async (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "rgba(255, 215, 0, 0.3)";

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.txt'))) {
        await uploadDocument(file);
    } else {
        showError("Please drop a PDF or TXT file");
    }
});

// Process Pasted Text
async function processPastedText(text, filename = "Pasted_Agreement.txt") {
    hideError();
    setLoading(true, "Processing text...");

    // Clear previous analysis
    riskDashboard.style.display = 'none';
    chrome.storage.local.remove(['analysisData']);

    try {
        const response = await fetch(`${API_URL}/upload_text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                filename: filename
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Processing failed");
        }

        currentDocumentId = data.document_id;
        currentFilename = data.filename;

        // Save to storage
        chrome.storage.local.set({
            documentId: currentDocumentId,
            filename: currentFilename
        });

        updateUIAfterUpload(data.filename, `${data.num_chunks} sections analyzed`);
        analyzeBtn.style.display = 'block';
        addMessage(`Text processed successfully! You can now analyze risks.`, "bot");

        // Switch back to upload mode view generally or just hide paste area?
        // Let's hide the input area to show result is loaded
        pasteText.value = "";

    } catch (err) {
        console.error("Text process error:", err);
        let errorMessage = "Failed to process text.";

        if (err.message.includes("Failed to fetch")) {
            errorMessage = "Server not running! Please start the backend server.";
        } else if (err.message) {
            errorMessage = err.message;
        }

        showError(errorMessage);
    } finally {
        setLoading(false);
    }
}

// Upload Document Function
async function uploadDocument(file) {
    hideError();
    setLoading(true, "Uploading and processing document...");

    // Clear previous analysis
    riskDashboard.style.display = 'none';
    chrome.storage.local.remove(['analysisData']);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Upload failed");
        }

        currentDocumentId = data.document_id;
        currentFilename = data.filename;

        // Save to storage
        chrome.storage.local.set({
            documentId: currentDocumentId,
            filename: currentFilename
        });

        updateUIAfterUpload(data.filename, `${data.num_chunks} sections analyzed`);
        analyzeBtn.style.display = 'block'; // Show analyze button
        addMessage(`Document "${data.filename}" uploaded successfully! You can now ask questions or run a risk analysis.`, "bot");

    } catch (err) {
        console.error("Upload error:", err);
        let errorMessage = "Failed to upload document.";

        if (err.message.includes("Failed to fetch")) {
            errorMessage = "Server not running! Please start the backend server on port 8000.";
        } else if (err.message) {
            errorMessage = err.message;
        }

        showError(errorMessage);
    } finally {
        setLoading(false);
    }
}

// Analyze Risk Button Click
analyzeBtn.addEventListener("click", async () => {
    if (!currentDocumentId) return;

    hideError();
    setLoading(true, "Assessing legal risks...");
    analyzeBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/analyze_risk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                document_id: currentDocumentId,
                question: "start_analysis" // Dummy value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Analysis failed");
        }

        // Display results
        displayRiskAnalysis(data);

        // Save analysis to storage
        chrome.storage.local.set({
            analysisData: {
                documentId: currentDocumentId,
                data: data
            }
        });

        addMessage("📊 Risk analysis complete! Check the dashboard above.", "bot");

    } catch (err) {
        console.error("Analysis error:", err);
        showError("Failed to complete risk analysis. " + err.message);
    } finally {
        setLoading(false);
        analyzeBtn.disabled = false;
    }
});

function displayRiskAnalysis(data) {
    if (!data) return;

    riskDashboard.style.display = "block";
    analyzeBtn.style.display = "none"; // Hide button after analysis

    // Update Gauge
    // Map 0-100 to rotation: -45deg (0%) to 135deg (100%)
    const degree = (data.risk_score / 100) * 180 - 45;
    gaugeFill.style.transform = `rotate(${degree}deg)`;

    // Set color based on score
    let color = "#22c55e"; // Green
    if (data.risk_score > 40) color = "#f59e0b"; // Orange
    if (data.risk_score > 70) color = "#ef4444"; // Red

    gaugeFill.style.borderTopColor = color;
    gaugeFill.style.borderLeftColor = color;
    riskScore.style.color = color;

    // Animate score number
    animateValue(riskScore, 0, data.risk_score, 1500);

    riskLevelLabel.textContent = data.risk_level;

    // Render detailed analysis
    detailedAnalysis.textContent = data.detailed_analysis;

    // Render Key Risks
    keyRisksList.innerHTML = "";
    data.key_risks.forEach(risk => {
        const div = document.createElement("div");
        div.className = `risk-item ${risk.severity.toLowerCase()}`;
        div.innerHTML = `
      <div class="risk-title">${risk.title} <span class="status-badge" style="font-size: 9px; margin-left:6px; background:rgba(255,255,255,0.1)">${risk.severity}</span></div>
      <div class="risk-desc">${risk.description}</div>
    `;
        keyRisksList.appendChild(div);
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + "%";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Update UI After Upload
function updateUIAfterUpload(filename, stats) {
    docName.textContent = filename;
    docStats.textContent = stats;
    docInfo.style.display = "block";
    analyzeBtn.style.display = "block";

    askBtn.disabled = false;
    btnText.textContent = "Ask Question";

    uploadArea.querySelector('.upload-text').textContent = "Upload New Document";
    uploadArea.querySelector('.upload-hint').textContent = "Current: " + filename;
}

// Delete Document
deleteBtn.addEventListener("click", async () => {
    if (!currentDocumentId) return;

    try {
        await fetch(`${API_URL}/documents/${currentDocumentId}`, {
            method: "DELETE"
        });

        // Clear state
        currentDocumentId = null;
        currentFilename = null;
        chrome.storage.local.remove(['documentId', 'filename', 'analysisData']);

        // Reset UI
        docInfo.style.display = "none";
        riskDashboard.style.display = "none";
        askBtn.disabled = true;
        btnText.textContent = "Upload Document First";
        uploadArea.querySelector('.upload-text').textContent = "Click to Upload Agreement";
        uploadArea.querySelector('.upload-hint').textContent = "PDF or TXT files accepted";
        chatDiv.innerHTML = "";

        // Reset gauge
        gaugeFill.style.transform = `rotate(-45deg)`;

        addMessage("Document removed. Upload a new document to continue.", "bot");

    } catch (err) {
        console.error("Delete error:", err);
        showError("Failed to delete document");
    }
});

// Ask Question
askBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    hideError();

    if (!question) {
        showError("Please enter a question");
        return;
    }

    if (!currentDocumentId) {
        showError("Please upload a document first");
        return;
    }

    addMessage(question, "user");
    questionInput.value = "";
    setLoading(true, "Analyzing legal document...");

    try {
        const response = await fetch(`${API_URL}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                document_id: currentDocumentId,
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to get answer");
        }

        addMessage(data.answer, "bot");

    } catch (err) {
        console.error("Question error:", err);
        let errorMessage = "Failed to process question.";

        if (err.message.includes("Failed to fetch")) {
            errorMessage = "Server not running! Please start the backend server.";
        } else if (err.message.includes("Document not found")) {
            errorMessage = "Document expired. Please re-upload.";
            currentDocumentId = null;
            chrome.storage.local.remove(['documentId', 'filename']);
        } else if (err.message) {
            errorMessage = err.message;
        }

        showError(errorMessage);
        addMessage(`Error: ${errorMessage}`, "bot");

    } finally {
        setLoading(false);
    }
});

// Enter to Ask
questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        askBtn.click();
    }
});

// Helper Functions
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = `msg ${type}`;
    msg.innerText = text;
    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function setLoading(isLoading, text = "Processing...") {
    askBtn.disabled = isLoading || !currentDocumentId;
    statusDiv.style.display = isLoading ? "block" : "none";
    statusDiv.innerText = isLoading ? text : "";
}

function showError(message) {
    errorDiv.style.display = "block";
    errorDiv.innerText = message;
}

function hideError() {
    errorDiv.style.display = "none";
    errorDiv.innerText = "";
}
