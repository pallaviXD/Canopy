# ============================================================
# Canopy — GCP Cloud Run Deploy Script (PowerShell)
# Run this from the project root: .\deploy.ps1
# ============================================================

# ── CONFIG — edit these if needed ──
$PROJECT_ID  = "canopy-6c63a"        # your GCP project ID (matches Firebase)
$REGION      = "asia-south1"         # Mumbai — closest to India
$SERVICE     = "canopy"
$REGISTRY    = "asia-south1-docker.pkg.dev"
$IMAGE       = "$REGISTRY/$PROJECT_ID/canopy/canopy"

# ── Firebase values — read from .env.local automatically ──
# These are loaded from your .env.local file so no secrets are hardcoded here.
# Make sure .env.local is populated before running this script.
$envFile = Join-Path $PSScriptRoot ".env.local"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+)=(.+)$") {
      [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
    }
  }
}

$FB_API_KEY     = $env:NEXT_PUBLIC_FIREBASE_API_KEY
$FB_AUTH_DOMAIN = $env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
$FB_PROJECT_ID  = $env:NEXT_PUBLIC_FIREBASE_PROJECT_ID
$FB_BUCKET      = $env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
$FB_SENDER_ID   = $env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
$FB_APP_ID      = $env:NEXT_PUBLIC_FIREBASE_APP_ID
$GEMINI_KEY     = $env:GEMINI_API_KEY

Write-Host "`n🌿 Canopy GCP Deploy`n" -ForegroundColor Green

# ── Step 1: Set project ──
Write-Host "Step 1/6 — Setting GCP project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# ── Step 2: Enable APIs ──
Write-Host "`nStep 2/6 — Enabling required APIs (may take ~1 min first time)..." -ForegroundColor Cyan
gcloud services enable `
  run.googleapis.com `
  artifactregistry.googleapis.com `
  cloudbuild.googleapis.com

# ── Step 3: Create Artifact Registry repo ──
Write-Host "`nStep 3/6 — Creating Artifact Registry repo..." -ForegroundColor Cyan
gcloud artifacts repositories create canopy `
  --repository-format=docker `
  --location=$REGION `
  --description="Canopy app images" 2>&1 | Out-Null
Write-Host "  (repo already exists or created)" -ForegroundColor Gray

# ── Step 4: Auth Docker ──
Write-Host "`nStep 4/6 — Authenticating Docker with Artifact Registry..." -ForegroundColor Cyan
gcloud auth configure-docker $REGISTRY --quiet

# ── Step 5: Build & Push image ──
Write-Host "`nStep 5/6 — Building Docker image (this takes ~3-5 mins)..." -ForegroundColor Cyan
docker build `
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=$FB_API_KEY `
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FB_AUTH_DOMAIN `
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FB_PROJECT_ID `
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FB_BUCKET `
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FB_SENDER_ID `
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=$FB_APP_ID `
  --build-arg GEMINI_API_KEY=$GEMINI_KEY `
  -t "${IMAGE}:latest" `
  .

Write-Host "`n  Pushing image..." -ForegroundColor Cyan
docker push "${IMAGE}:latest"

# ── Step 6: Deploy to Cloud Run ──
Write-Host "`nStep 6/6 — Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE `
  --image "${IMAGE}:latest" `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 1Gi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 5 `
  --set-env-vars "NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_FIREBASE_API_KEY=$FB_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FB_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FB_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FB_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FB_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID=$FB_APP_ID,GEMINI_API_KEY=$GEMINI_KEY"

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Get your URL with: gcloud run services describe $SERVICE --region $REGION --format='value(status.url)'" -ForegroundColor Yellow
