
@echo off
echo Installing Python dependencies for Windows...

REM Set environment variables to handle SSL issues
set PYTHONHTTPSVERIFY=0
set PIP_TRUSTED_HOST=pypi.org files.pythonhosted.org pypi.python.org

REM Upgrade pip first
python -m pip install --upgrade pip --trusted-host pypi.org --trusted-host files.pythonhosted.org

REM Install wheel and setuptools first
python -m pip install wheel setuptools --trusted-host pypi.org --trusted-host files.pythonhosted.org

REM Install packages one by one to better handle errors
echo Installing FastAPI and core dependencies...
python -m pip install fastapi==0.104.1 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install "uvicorn[standard]==0.24.0" --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install python-multipart==0.0.6 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing Pydantic v1 (no Rust required)...
python -m pip install pydantic==1.10.12 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing MongoDB drivers...
python -m pip install motor==3.3.2 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install "pymongo[srv]==4.6.0" --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing document processing...
python -m pip install python-docx==1.1.0 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install PyPDF2==3.0.1 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing utilities...
python -m pip install python-dotenv==1.0.0 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install requests==2.31.0 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install aiofiles==23.2.1 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing AI libraries...
python -m pip install groq==0.4.1 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install google-generativeai==0.3.2 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing LangChain...
python -m pip install langchain==0.0.350 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install langchain-google-genai==0.0.6 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install langchain-community==0.0.2 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installing vector database alternatives (no Rust required)...
python -m pip install faiss-cpu==1.7.4 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install sentence-transformers==2.2.2 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install numpy==1.24.3 --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install scikit-learn==1.3.0 --trusted-host pypi.org --trusted-host files.pythonhosted.org

echo Installation complete!
pause
