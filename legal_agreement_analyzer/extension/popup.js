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

// Initial Entry Animation
document.addEventListener('DOMContentLoaded', () => {
    anime({
        targets: ['.header', '.toggle-container', '.glass-panel'],
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        duration: 1200
    });
});

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
modeUpload.addEventListener("click", () => setMode("upload"));
modePaste.addEventListener("click", () => setMode("paste"));
modeTab.addEventListener("click", () => setMode("tab"));

function setMode(mode) {
    const modes = {
        upload: { btn: modeUpload, section: uploadSection },
        paste: { btn: modePaste, section: pasteSection },
        tab: { btn: modeTab, section: tabSection }
    };

    // Update Buttons
    Object.values(modes).forEach(m => m.btn.classList.remove("active"));
    modes[mode].btn.classList.add("active");

    // Animate Sections
    const currentVisible = [uploadSection, pasteSection, tabSection].find(s => s.style.display !== 'none' && !s.classList.contains('hidden'));
    const nextSection = modes[mode].section;

    if (currentVisible === nextSection) return;

    if (currentVisible) {
        anime({
            targets: currentVisible,
            opacity: 0,
            translateY: -10,
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                currentVisible.style.display = 'none';
                currentVisible.classList.add('hidden');

                nextSection.style.display = 'block';
                nextSection.classList.remove('hidden');
                anime({
                    targets: nextSection,
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 400,
                    easing: 'easeOutQuad'
                });
            }
        });
    } else {
        // First load fallback
        Object.values(modes).forEach(m => {
            m.section.style.display = 'none';
            m.section.classList.add('hidden');
        });
        nextSection.style.display = 'block';
        nextSection.classList.remove('hidden');
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
    fileInput.value = "";
});

// Paste Text Process
processTextBtn.addEventListener("click", async () => {
    const text = pasteText.value.trim();
    if (!text) {
        showError("Please enter some text to analyze");
        return;
    }
    await processPastedText(text, "Pasted_Agreement.txt");
});

// Analyze Current Tab
processTabBtn.addEventListener("click", async () => {
    hideError();
    setLoading(true, "Extracting page content...");

    try {
        if (!chrome.scripting) {
            throw new Error("Scripting API missing. Please reload extension.");
        }

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found");

        const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.body.innerText
        });

        if (!result || !result[0] || !result[0].result) throw new Error("Failed to extract text");

        const pageText = result[0].result;
        const pageTitle = tab.title || "Webpage_Content.txt";

        if (pageText.length < 100) throw new Error("Page content is too short to analyze.");

        await processPastedText(pageText, pageTitle);

    } catch (err) {
        console.error("Tab analysis error:", err);
        showError("Failed to analyze page: " + err.message);
        setLoading(false);
    }
});

// Drag and Drop Animations
uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    anime({ targets: uploadArea, scale: 1.02, borderColor: '#8b5cf6', duration: 200, easing: 'easeOutQuad' });
});

uploadArea.addEventListener("dragleave", () => {
    anime({ targets: uploadArea, scale: 1, borderColor: 'rgba(139, 92, 246, 0.3)', duration: 200, easing: 'easeOutQuad' });
});

uploadArea.addEventListener("drop", async (e) => {
    e.preventDefault();
    anime({ targets: uploadArea, scale: 1, borderColor: 'rgba(139, 92, 246, 0.3)', duration: 200, easing: 'easeOutQuad' });

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.txt'))) {
        await uploadDocument(file);
    } else {
        showError("Please drop a PDF or TXT file");
        anime({ targets: uploadArea, translateX: [0, -10, 10, -10, 10, 0], duration: 400, easing: 'easeInOutSine' });
    }
});

// Process Pasted Text
async function processPastedText(text, filename = "Pasted_Agreement.txt") {
    hideError();
    setLoading(true, "Processing text...");

    // Anime out risk dashboard if visible
    if (riskDashboard.style.display !== 'none') {
        anime({ targets: riskDashboard, opacity: 0, translateY: 10, duration: 300, complete: () => riskDashboard.style.display = 'none' });
    }
    chrome.storage.local.remove(['analysisData']);

    try {
        const response = await fetch(`${API_URL}/upload_text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, filename: filename })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Processing failed");

        currentDocumentId = data.document_id;
        currentFilename = data.filename;

        chrome.storage.local.set({ documentId: currentDocumentId, filename: currentFilename });

        updateUIAfterUpload(data.filename, `${data.num_chunks} sections analyzed`);
        analyzeBtn.style.display = 'flex'; // Use flex for centering
        addMessage(`Text processed successfully! You can now analyze risks.`, "bot");
        pasteText.value = "";

    } catch (err) { handleApiError(err, "Failed to process text."); }
    finally { setLoading(false); }
}

// Upload Document
async function uploadDocument(file) {
    hideError();
    setLoading(true, "Uploading document...");

    if (riskDashboard.style.display !== 'none') {
        riskDashboard.style.display = 'none';
    }
    chrome.storage.local.remove(['analysisData']);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Upload failed");

        currentDocumentId = data.document_id;
        currentFilename = data.filename;
        chrome.storage.local.set({ documentId: currentDocumentId, filename: currentFilename });

        updateUIAfterUpload(data.filename, `${data.num_chunks} sections analyzed`);
        analyzeBtn.style.display = 'flex';
        addMessage(`Document "${data.filename}" uploaded! You can now run a risk analysis.`, "bot");

    } catch (err) { handleApiError(err, "Failed to upload document."); }
    finally { setLoading(false); }
}

// Analyze Risk
analyzeBtn.addEventListener("click", async () => {
    if (!currentDocumentId) return;

    hideError();
    setLoading(true, "Assessing legal risks...");
    analyzeBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/analyze_risk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ document_id: currentDocumentId, question: "start_analysis" })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Analysis failed");

        displayRiskAnalysis(data);
        chrome.storage.local.set({ analysisData: { documentId: currentDocumentId, data: data } });
        addMessage("📊 Risk analysis complete! Check the dashboard above.", "bot");

    } catch (err) {
        console.error("Analysis error:", err);
        showError("Failed to complete analysis. " + err.message);
    } finally {
        setLoading(false);
        analyzeBtn.disabled = false;
    }
});

function displayRiskAnalysis(data) {
    if (!data) return;

    riskDashboard.style.display = "block";
    riskDashboard.style.opacity = 0;

    anime({
        targets: riskDashboard,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo'
    });

    analyzeBtn.style.display = "none";

    // Gauge Animation
    const degree = (data.risk_score / 100) * 180 - 45;
    anime({
        targets: gaugeFill,
        rotate: [-45, degree],
        duration: 2000,
        easing: 'easeOutElastic(1, .5)'
    });

    let color = "#10b981"; // Green
    if (data.risk_score > 40) color = "#f59e0b"; // Orange
    if (data.risk_score > 70) color = "#ef4444"; // Red

    gaugeFill.style.borderTopColor = color;
    gaugeFill.style.borderLeftColor = color;
    riskScore.style.color = color;

    // Count Up Animation
    let scoreObj = { val: 0 };
    anime({
        targets: scoreObj,
        val: data.risk_score,
        round: 1,
        duration: 1500,
        easing: 'easeOutExpo',
        update: () => riskScore.innerHTML = scoreObj.val + "%"
    });

    riskLevelLabel.textContent = data.risk_level;
    detailedAnalysis.textContent = data.detailed_analysis;

    // Render Key Risks with Stagger
    keyRisksList.innerHTML = "";
    data.key_risks.forEach((risk, i) => {
        const div = document.createElement("div");
        div.className = `risk-item ${risk.severity.toLowerCase()}`;
        div.style.opacity = 0; // Prepare for stagger
        div.innerHTML = `
      <div class="risk-title">${risk.title} <span class="status-badge" style="font-size: 9px; margin-left:6px; background:rgba(255,255,255,0.1)">${risk.severity}</span></div>
      <div class="risk-desc">${risk.description}</div>
    `;
        keyRisksList.appendChild(div);
    });

    anime({
        targets: '.risk-item',
        opacity: [0, 1],
        translateX: [20, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuad'
    });
}

// Update UI After Upload
function updateUIAfterUpload(filename, stats) {
    docName.textContent = filename;
    docStats.textContent = stats;

    docInfo.style.display = "block";
    anime({ targets: docInfo, opacity: [0, 1], translateY: [-10, 0], duration: 400, easing: 'easeOutQuad' });

    analyzeBtn.style.display = "flex";
    askBtn.disabled = false;
    btnText.textContent = "Ask Question";

    // Smoothly update text
    const uploadText = uploadArea.querySelector('.upload-text');
    uploadText.style.opacity = 0;
    setTimeout(() => {
        uploadText.textContent = "Upload New Document";
        uploadText.style.opacity = 1;
    }, 200);

    uploadArea.querySelector('.upload-hint').textContent = "Current: " + filename;
}

// Delete Document
deleteBtn.addEventListener("click", async () => {
    if (!currentDocumentId) return;

    // Click animation
    anime({ targets: deleteBtn, scale: [0.95, 1], duration: 100 });

    try {
        await fetch(`${API_URL}/documents/${currentDocumentId}`, { method: "DELETE" });
        currentDocumentId = null;
        currentFilename = null;
        chrome.storage.local.remove(['documentId', 'filename', 'analysisData']);

        // Animate elements out
        anime({
            targets: [docInfo, riskDashboard],
            opacity: 0,
            scale: 0.95,
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                docInfo.style.display = "none";
                riskDashboard.style.display = "none";
                // Reset styles
                docInfo.style.opacity = 1;
                docInfo.style.scale = 1;
                riskDashboard.style.opacity = 1;
                riskDashboard.style.scale = 1;
            }
        });

        askBtn.disabled = true;
        btnText.textContent = "Upload Document First";
        uploadArea.querySelector('.upload-text').textContent = "Click to Upload Agreement";
        uploadArea.querySelector('.upload-hint').textContent = "PDF or TXT files accepted";
        chatDiv.innerHTML = "";
        gaugeFill.style.transform = `rotate(-45deg)`;
        addMessage("Document removed.", "bot");

    } catch (err) {
        console.error("Delete error:", err);
        showError("Failed to delete document");
    }
});

// Ask Question
askBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    hideError();

    if (!question || !currentDocumentId) {
        showError(question ? "Please upload a document first" : "Please enter a question");
        anime({ targets: question ? uploadArea : questionInput, translateX: [0, -5, 5, 0], duration: 300 });
        return;
    }

    addMessage(question, "user");
    questionInput.value = "";
    setLoading(true, "Thinking...");

    try {
        const response = await fetch(`${API_URL}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ document_id: currentDocumentId, question: question })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Failed to get answer");

        addMessage(data.answer, "bot");

    } catch (err) { handleApiError(err, "Failed to process question."); }
    finally { setLoading(false); }
});

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
    msg.style.opacity = 0;
    msg.style.transform = 'translateY(10px)';

    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;

    anime({
        targets: msg,
        opacity: 1,
        translateY: 0,
        duration: 400,
        easing: 'easeOutQuad'
    });
}

function setLoading(isLoading, text = "Processing...") {
    askBtn.disabled = isLoading || !currentDocumentId;
    statusDiv.style.display = isLoading ? "block" : "none";
    statusDiv.innerText = text;

    if (isLoading) {
        anime({ targets: statusDiv, opacity: [0.5, 1], loop: true, direction: 'alternate', duration: 800 });
    } else {
        anime.remove(statusDiv);
    }
}

function showError(message) {
    errorDiv.style.display = "block";
    errorDiv.innerText = message;
    anime({ targets: errorDiv, translateX: [0, -5, 5, -5, 5, 0], duration: 400 });
}

function hideError() {
    errorDiv.style.display = "none";
}

function handleApiError(err, defaultMsg) {
    console.error(err);
    let msg = defaultMsg;
    if (err.message.includes("Failed to fetch")) msg = "Server not running! Please start the backend.";
    else if (err.message) msg = err.message;
    showError(msg);
}
