# 🧪 Testing Guide for Legal Agreement Analyzer

## Quick Test (5 minutes)

### 1. Start the Backend
```bash
cd backend
start.bat
```
Wait for: "Application startup complete"

### 2. Load Chrome Extension
1. Chrome → `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked" → select `extension` folder
4. Pin the extension

### 3. Test with Sample Agreement
1. Click the extension icon
2. Upload `sample_agreement.txt` from the project root
3. Wait for "Document uploaded successfully!"

### 4. Ask Test Questions

**Question 1:** What are the payment terms?
**Expected:** Annual license fee of $10,000 USD, interest on late payments at 1.5% per month

**Question 2:** What are the termination conditions?
**Expected:** Either party can terminate for material breach (30 days to cure), insolvency, or bankruptcy

**Question 3:** What is the limitation of liability?
**Expected:** Capped at amounts paid in preceding 12 months, excludes indirect/consequential damages

**Question 4:** What are the confidentiality requirements?
**Expected:** Must maintain confidentiality using reasonable care, limited disclosure to need-to-know parties

**Question 5:** Can the software be modified or reverse engineered?
**Expected:** No - explicitly prohibited under Section 1.2

**Question 6:** What happens if payment is late?
**Expected:** 1.5% monthly interest or maximum legal rate, whichever is lower

**Question 7:** What is the warranty period?
**Expected:** 90 days limited warranty from Effective Date

**Question 8:** Can either party assign this agreement?
**Expected:** No, without prior written consent (except for merger/acquisition/asset sale)

**Question 9:** What law governs this agreement?
**Expected:** Delaware law, disputes resolved through AAA arbitration

**Question 10:** What are the key restrictions on using the software?
**Expected:** No copying, modifying, reverse engineering, or redistribution

## Advanced Testing

### Test Different Document Types

**PDF Upload:**
1. Convert `sample_agreement.txt` to PDF
2. Upload and test same questions

**Custom Documents:**
1. Find your own legal agreement (NDA, lease, employment contract)
2. Upload and test relevant questions

### Stress Testing

**Large Documents:**
- Upload agreements 50+ pages
- Check processing time and accuracy

**Complex Questions:**
- "Compare the obligations of both parties"
- "What are all the financial obligations in this agreement?"
- "List all conditions that could lead to termination"

**Edge Cases:**
- Upload empty file → Should show error
- Ask without uploading → Should prompt to upload
- Upload non-legal document → Should still answer based on content
- Very long question (500+ words) → Should process

### Multi-Session Testing

1. Upload document
2. Ask a question
3. Close and reopen extension
4. Ask another question → Should remember document

### Error Testing

**Backend Offline:**
1. Stop backend server
2. Try to upload → Should show "Server not running"

**Invalid API Key:**
1. Set wrong GOOGLE_API_KEY in .env
2. Try asking question → Should show API error

**No Transcript Available:**
1. Upload unscannable/corrupted PDF
2. Should show extraction error

## Performance Benchmarks

| Metric | Expected | Acceptable |
|--------|----------|------------|
| Upload time (10 pg PDF) | < 3 seconds | < 5 seconds |
| Question response | < 4 seconds | < 8 seconds |
| Extension load | < 1 second | < 2 seconds |
| Memory usage | < 200 MB | < 500 MB |

## Validation Checklist

- [ ] Backend starts without errors
- [ ] Extension loads in Chrome
- [ ] Can upload TXT file
- [ ] Can upload PDF file
- [ ] Drag & drop works
- [ ] Document info displays correctly
- [ ] Chat history shows properly
- [ ] Answers are contextually accurate
- [ ] Error messages are clear
- [ ] Can delete document
- [ ] Document persists across sessions
- [ ] Scrolling works in chat
- [ ] Loading states display
- [ ] Enter key submits question
- [ ] Mobile-responsive (if applicable)

## Common Issues & Solutions

### Issue: "No text could be extracted from PDF"
**Solution:** 
- PDF might be scanned/image-based
- Use OCR tool first or try different PDF

### Issue: Slow responses
**Solution:**
- Check internet connection
- Reduce document size
- Try different Gemini model

### Issue: Inaccurate answers
**Solution:**
- Check document quality
- Make questions more specific
- Review chunk size in api.py

### Issue: Extension won't load
**Solution:**
- Check manifest.json syntax
- Reload extension
- Check browser console (F12)

## API Testing (Optional)

Test backend directly with curl/Postman:

**Upload Document:**
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@sample_agreement.txt"
```

**Ask Question:**
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d "{\"document_id\":\"sample_agreement_txt\",\"question\":\"What are the payment terms?\"}"
```

**List Documents:**
```bash
curl http://localhost:8000/documents
```

## Success Criteria

✅ **Basic Functionality:** Upload works, questions answered accurately
✅ **User Experience:** Smooth, intuitive, error-free
✅ **Performance:** Responses in < 5 seconds
✅ **Reliability:** Handles edge cases gracefully
✅ **Accuracy:** Answers match document content

## Next Steps After Testing

1. **Add Real Icons** - Create professional 16x16, 48x48, 128x128 PNG icons
2. **Deploy Backend** - Host on cloud service (Railway, Render, AWS)
3. **Publish Extension** - Submit to Chrome Web Store
4. **Gather Feedback** - Test with real users and legal documents
5. **Enhance Features** - Add multi-doc comparison, clause extraction, risk scoring

---

**Happy Testing!** 🚀

Report issues or suggestions in the project repository.
