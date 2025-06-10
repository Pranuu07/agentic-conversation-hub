
# PowerShell installation script for Windows
Write-Host "Installing Python dependencies for Windows..." -ForegroundColor Green

# Set environment variables to handle SSL issues
$env:PYTHONHTTPSVERIFY = "0"
$env:PIP_TRUSTED_HOST = "pypi.org,files.pythonhosted.org,pypi.python.org"

# Function to install package with retry
function Install-Package {
    param($PackageName)
    Write-Host "Installing $PackageName..." -ForegroundColor Yellow
    
    $result = python -m pip install $PackageName --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install $PackageName, trying with --no-cache-dir..." -ForegroundColor Red
        python -m pip install $PackageName --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org --no-cache-dir
    }
}

# Upgrade pip first
Write-Host "Upgrading pip..." -ForegroundColor Green
python -m pip install --upgrade pip --trusted-host pypi.org --trusted-host files.pythonhosted.org

# Install wheel and setuptools first
Install-Package "wheel"
Install-Package "setuptools"

# Core FastAPI dependencies
Install-Package "fastapi==0.104.1"
Install-Package "uvicorn[standard]==0.24.0"
Install-Package "python-multipart==0.0.6"

# Pydantic with compatible version
Install-Package "pydantic==2.4.2"

# MongoDB
Install-Package "motor==3.3.2"
Install-Package "pymongo[srv]==4.6.0"

# Document processing
Install-Package "python-docx==1.1.0"
Install-Package "PyPDF2==3.0.1"

# Utilities
Install-Package "python-dotenv==1.0.0"
Install-Package "requests==2.31.0"
Install-Package "aiofiles==23.2.1"

# AI APIs
Install-Package "groq==0.4.1"
Install-Package "google-generativeai==0.3.2"

# LangChain
Install-Package "langchain==0.0.350"
Install-Package "langchain-google-genai==0.0.6"
Install-Package "langchain-community==0.0.2"

# Vector database and embeddings
Install-Package "chromadb==0.4.15"
Install-Package "sentence-transformers==2.2.2"

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "You can now run: python run.py" -ForegroundColor Cyan
