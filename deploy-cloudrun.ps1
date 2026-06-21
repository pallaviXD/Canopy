# Canopy - GCP Cloud Run Deploy (no Docker required)
# Run from project root: .\deploy-cloudrun.ps1

$PROJECT_ID = "canopy-6c63a"
$REGION     = "asia-south1"
$SERVICE    = "canopy"
$TAG        = (Get-Date -Format "yyyyMMdd-HHmmss")   # unique tag each run
$REGISTRY   = "$REGION-docker.pkg.dev/$PROJECT_ID/$SERVICE/$SERVICE"
$IMAGE      = "$REGISTRY`:$TAG"
$IMAGE_LATEST = "$REGISTRY`:latest"

# Load .env.local
$envFile = Join-Path $PSScriptRoot ".env.local"
Get-Content $envFile | ForEach-Object {
  if ($_ -match "^\s*([A-Z_][^=]+)=(.+)$") {
    Set-Variable -Name $matches[1].Trim() -Value $matches[2].Trim() -Scope Script
  }
}

$gcloud = "gcloud"

Write-Host "Canopy GCP Deploy (tag: $TAG)" -ForegroundColor Green

# 1. Set project
Write-Host "[1/4] Set project" -ForegroundColor Cyan
& $gcloud config set project $PROJECT_ID

# 2. Enable APIs
Write-Host "[2/4] Enable APIs" -ForegroundColor Cyan
& $gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 3. Create repo (ignore if exists)
Write-Host "[3/4] Ensure registry repo" -ForegroundColor Cyan
& $gcloud artifacts repositories create $SERVICE --repository-format=docker --location=$REGION 2>&1 | Out-Null

# 4. Write fresh cloudbuild yaml with unique tag
Write-Host "[4/4] Cloud Build + Deploy (~8 mins)..." -ForegroundColor Cyan

$cbYaml = @"
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID'
      - '--build-arg'
      - 'GEMINI_API_KEY=$GEMINI_API_KEY'
      - '-t'
      - '$IMAGE'
      - '-t'
      - '$IMAGE_LATEST'
      - '.'
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '--all-tags', '$REGISTRY']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - run
      - deploy
      - $SERVICE
      - --image
      - $IMAGE
      - --region
      - $REGION
      - --platform
      - managed
      - --allow-unauthenticated
      - --port
      - '8080'
      - --memory
      - 1Gi
      - --cpu
      - '1'
      - --min-instances
      - '0'
      - --max-instances
      - '5'
      - --set-env-vars
      - NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID,GEMINI_API_KEY=$GEMINI_API_KEY
images:
  - '$IMAGE'
  - '$IMAGE_LATEST'
options:
  machineType: E2_HIGHCPU_8
  logging: CLOUD_LOGGING_ONLY
timeout: '1200s'
"@

$cbYaml | Out-File -FilePath ".\cloudbuild-deploy.yaml" -Encoding ascii

& $gcloud builds submit . --config cloudbuild-deploy.yaml --timeout=20m

# Cleanup
Remove-Item ".\cloudbuild-deploy.yaml" -ErrorAction SilentlyContinue

# Result
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
$URL = & $gcloud run services describe $SERVICE --region $REGION --format="value(status.url)" 2>&1
Write-Host "Live URL: $URL" -ForegroundColor Yellow
Write-Host "Add to Firebase Authorized Domains: $($URL -replace 'https://','')" -ForegroundColor Magenta
