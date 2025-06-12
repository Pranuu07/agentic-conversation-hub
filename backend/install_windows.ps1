
# Simple PowerShell installation script for local development
Write-Host "Installing Python dependencies for local development..." -ForegroundColor Green

# Upgrade pip first
python -m pip install --upgrade pip

# Install packages directly without SSL complications
Write-Host "Installing core dependencies..." -ForegroundColor Yellow

# Install packages one by one for better error handling
$packages = @(
    "fastapi==0.104.1",
    "uvicorn[standard]==0.24.0",
    "python-multipart==0.0.6",
    "pydantic==1.10.12",
    "motor==3.3.2",
    "pymongo[srv]==4.6.0",
    "langchain==0.0.350",
    "langchain-google-genai==0.0.6",
    "langchain-community==0.0.2",
    "python-docx==1.1.0",
    "PyPDF2==3.0.1",
    "python-dotenv==1.0.0",
    "groq==0.4.1",
    "google-generativeai==0.3.2",
    "faiss-cpu==1.7.4",
    "requests==2.31.0",
    "aiofiles==23.2.1",
    "numpy==1.24.3",
    "scikit-learn==1.3.0"
)

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Cyan
    python -m pip install $package
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install $package" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "You can now run: python run.py" -ForegroundColor Cyan
