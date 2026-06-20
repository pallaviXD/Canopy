# Canopy — GCP Deployment Guide

## Quick Deploy to Cloud Run

### Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated
- Docker installed
- A GCP project with billing enabled

---

## 1. One-time GCP Setup

```bash
# Set your project
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com

# Create Artifact Registry repo
gcloud artifacts repositories create canopy \
  --repository-format=docker \
  --location=us-central1 \
  --description="Canopy app images"
```

---

## 2. Store Secrets in Secret Manager

```bash
# Gemini API Key (server-side only — secure)
echo -n "your_gemini_api_key" | \
  gcloud secrets create GEMINI_API_KEY --data-file=-

# Firebase keys (used as Docker build args)
echo -n "your_firebase_api_key" | \
  gcloud secrets create FIREBASE_API_KEY --data-file=-

echo -n "your_project.firebaseapp.com" | \
  gcloud secrets create FIREBASE_AUTH_DOMAIN --data-file=-

echo -n "your_project_id" | \
  gcloud secrets create FIREBASE_PROJECT_ID --data-file=-

echo -n "your_project.appspot.com" | \
  gcloud secrets create FIREBASE_STORAGE_BUCKET --data-file=-

echo -n "your_sender_id" | \
  gcloud secrets create FIREBASE_SENDER_ID --data-file=-

echo -n "your_app_id" | \
  gcloud secrets create FIREBASE_APP_ID --data-file=-
```

---

## 3. Manual Docker Deploy (no CI/CD)

```bash
# Authenticate Docker with Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build the image
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  -t us-central1-docker.pkg.dev/$PROJECT_ID/canopy/canopy:latest .

# Push
docker push us-central1-docker.pkg.dev/$PROJECT_ID/canopy/canopy:latest

# Deploy to Cloud Run
gcloud run deploy canopy \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/canopy/canopy:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

---

## 4. Automated CI/CD with Cloud Build

```bash
# Update cloudbuild.yaml — replace YOUR_PROJECT_ID with your actual project ID
# Then connect your GitHub repo in Cloud Build console and set trigger on push to main.

# Or trigger manually:
gcloud builds submit --config cloudbuild.yaml .
```

---

## 5. Test Locally with Docker

```bash
docker build -t canopy-local .
docker run -p 3000:8080 \
  -e GEMINI_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  canopy-local
# Open http://localhost:3000
```

---

## Architecture on GCP

```
GitHub → Cloud Build → Artifact Registry → Cloud Run
                              ↑
                       Secret Manager (API keys)
                              ↑
                    Firebase (Auth + Firestore)
```

## Environment Variables Reference

| Variable | Where | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Cloud Run secret | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_*` | Docker build args | Optional (for auth/persistence) |
| `NODE_ENV` | Cloud Run env | Auto-set |
| `PORT` | Cloud Run | Auto-injected (8080) |
