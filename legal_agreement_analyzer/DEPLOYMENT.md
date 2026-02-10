# 🚀 Deployment Checklist

## Pre-Deployment

### Backend Preparation
- [ ] **API Key Security**
  - Create production Google API key
  - Set usage quotas and limits
  - Add API key restrictions

- [ ] **Environment Setup**
  - Create production `.env` file
  - Never commit `.env` to Git
  - Use environment variables on server

- [ ] **Code Review**
  - Test all endpoints
  - Check error handling
  - Review security (CORS, input validation)
  - Load testing with large documents

- [ ] **Dependencies**
  - Update all packages to stable versions
  - Check for security vulnerabilities
  - Document minimum Python version

### Extension Preparation
- [ ] **Icons**
  - Create professional 16x16 icon
  - Create professional 48x48 icon
  - Create professional 128x128 icon
  - Use PNG format with transparency

- [ ] **Manifest Updates**
  - Update version number
  - Add proper description
  - Update permissions if needed
  - Add extension icon paths back

- [ ] **Testing**
  - Test on multiple Chrome versions
  - Test with various PDF formats
  - Test error scenarios
  - User acceptance testing

- [ ] **Documentation**
  - Update README with production URLs
  - Create user guide/tutorial
  - Add screenshots to README
  - Record demo video

---

## Backend Deployment Options

### Option 1: Railway (Recommended - Easy)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables in Railway dashboard
GOOGLE_API_KEY=your_key_here
```

**Pros:** Easy, auto-scaling, cheap
**Cons:** Requires credit card

### Option 2: Render
1. Create account at render.com
2. New Web Service
3. Connect GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GOOGLE_API_KEY`

**Pros:** Free tier available
**Cons:** Cold starts on free tier

### Option 3: AWS EC2
```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip
pip install -r requirements.txt

# Set environment variable
export GOOGLE_API_KEY=your_key

# Run with gunicorn
pip install gunicorn
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Pros:** Full control, scalable
**Cons:** More complex, manual setup

### Option 4: Google Cloud Run
```bash
# Create Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]

# Deploy
gcloud run deploy legal-analyzer \
  --source . \
  --set-env-vars GOOGLE_API_KEY=your_key
```

**Pros:** Serverless, auto-scaling
**Cons:** GCP complexity

---

## Extension Deployment

### Option 1: Chrome Web Store (Full Release)

**Preparation:**
1. Create developer account ($5 one-time fee)
2. Create promotional images (1280x800, 640x400)
3. Write compelling store description
4. Add screenshots (1280x800 or 1920x1080)
5. Create privacy policy (required for extensions)

**Steps:**
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New Item"
3. Upload extension ZIP:
   ```bash
   cd extension
   # Create zip with all files except ICON_README.txt
   ```
4. Fill in store listing:
   - Detailed description
   - Category: Productivity
   - Language: English
   - Add screenshots
   - Add promotional images
5. Set pricing (Free for users)
6. Submit for review (2-3 days)

**Requirements:**
- Professional icons (16, 48, 128)
- Privacy policy URL
- Support email
- Screenshots (at least 1)
- Promotional images

### Option 2: Developer Mode (Testing/Private Use)

**Already done!** Just share the extension folder:
```bash
# Create shareable zip
cd extension
zip -r legal-analyzer-extension.zip .
```

Users install via:
1. `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked

---

## Post-Deployment

### Backend
- [ ] Update extension with production API URL
- [ ] Test live deployment
- [ ] Set up monitoring (uptime, errors)
- [ ] Configure logging
- [ ] Set up SSL/HTTPS
- [ ] Add rate limiting
- [ ] Monitor API usage costs

### Extension
- [ ] Update popup.js with production URL:
  ```javascript
  const API_URL = "https://your-backend.com";
  ```
- [ ] Test with production backend
- [ ] Monitor user feedback
- [ ] Track errors with analytics
- [ ] Prepare update workflow

### Documentation
- [ ] Update README with production URLs
- [ ] Create changelog
- [ ] Set up issue tracking
- [ ] Create contributing guidelines

---

## Production Updates

### Updating Backend Code
```bash
# Update version in api.py
# Commit changes
git add .
git commit -m "Update: feature description"

# Deploy (Railway example)
railway up

# Or redeploy on Render/AWS as needed
```

### Updating Extension
```bash
# Update version in manifest.json
# Make code changes
# Test locally
# Create new zip
# Upload to Chrome Web Store
# Wait for review approval
```

---

## Security Best Practices

### Backend
- [ ] Use HTTPS only
- [ ] Restrict CORS to extension ID only:
  ```python
  allow_origins=[
      "chrome-extension://YOUR_EXTENSION_ID"
  ]
  ```
- [ ] Add rate limiting (prevent abuse)
- [ ] Input validation and sanitization
- [ ] Secure API key storage
- [ ] Regular dependency updates

### Extension
- [ ] Minimal permissions requested
- [ ] No inline scripts (CSP compliance)
- [ ] Validate all user inputs
- [ ] Clear privacy policy
- [ ] Don't store sensitive data

---

## Monitoring & Analytics

### Backend Monitoring
```python
# Add to api.py
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    return response
```

### Extension Analytics (Optional)
- Google Analytics for Chrome Extensions
- Track: uploads, questions asked, errors
- Privacy-compliant (anonymous)

---

## Cost Estimation

### Gemini API
- Free tier: $0 for first 50 requests/day
- Paid: ~$0.25 per 1M characters
- Estimate: $10-50/month for moderate use

### Hosting
- **Railway:** $5-20/month
- **Render:** Free tier or $7/month
- **AWS EC2:** $5-50/month (t2.micro to t3.medium)
- **Google Cloud Run:** Pay per request (~$1-10/month light use)

### Chrome Web Store
- One-time: $5 developer fee
- Ongoing: $0

---

## Maintenance Plan

### Weekly
- [ ] Check error logs
- [ ] Monitor API usage
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cost analysis

### Quarterly
- [ ] Major feature updates
- [ ] User survey
- [ ] Competitor analysis
- [ ] Roadmap review

---

## Success Metrics

Track these KPIs:
- **Users:** Daily/Monthly active users
- **Engagement:** Avg questions per session
- **Performance:** Response time, uptime
- **Quality:** User ratings, feedback
- **Costs:** API usage, hosting costs

---

## Emergency Procedures

### Backend Down
1. Check hosting platform status
2. Check logs for errors
3. Restart service
4. Rollback if recent deploy
5. Update extension with status message

### API Limit Exceeded
1. Contact Google for quota increase
2. Add queue system
3. Notify users of delays
4. Consider caching frequent queries

### Security Breach
1. Immediately rotate API keys
2. Review access logs
3. Patch vulnerability
4. Notify users if data affected
5. Update extension and backend

---

## Launch Timeline

**Week 1:**
- [ ] Get Google API key
- [ ] Test thoroughly
- [ ] Create icons

**Week 2:**
- [ ] Deploy backend to Railway/Render
- [ ] Update extension with production URL
- [ ] Final testing

**Week 3:**
- [ ] Create Chrome Web Store assets
- [ ] Write privacy policy
- [ ] Submit to Chrome Web Store

**Week 4:**
- [ ] Review approval
- [ ] Launch announcement
- [ ] Gather feedback

---

## Post-Launch Marketing

### Channels
- Product Hunt launch
- Reddit (r/Chrome, r/LegalAdvice)
- Twitter/LinkedIn announcement
- Blog post about tech stack
- YouTube demo video

### Materials Needed
- Screenshots
- Demo video
- Use case examples
- Comparison with competitors
- Blog post

---

**Ready to deploy?** Follow this checklist step by step! 🚀

For questions, refer to:
- README.md (full docs)
- QUICKSTART.md (setup)
- TESTING.md (testing guide)
