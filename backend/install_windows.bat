
@echo off
echo Installing Python dependencies for local development...

REM Upgrade pip first
python -m pip install --upgrade pip

REM Install packages one by one
echo Installing FastAPI and core dependencies...
python -m pip install fastapi==0.104.1
python -m pip install "uvicorn[standard]==0.24.0"
python -m pip install python-multipart==0.0.6

echo Installing Pydantic v1...
python -m pip install pydantic==1.10.12

echo Installing MongoDB drivers...
python -m pip install motor==3.3.2
python -m pip install "pymongo[srv]==4.6.0"

echo Installing document processing...
python -m pip install python-docx==1.1.0
python -m pip install PyPDF2==3.0.1

echo Installing utilities...
python -m pip install python-dotenv==1.0.0
python -m pip install requests==2.31.0
python -m pip install aiofiles==23.2.1

echo Installing AI libraries...
python -m pip install groq==0.4.1
python -m pip install google-generativeai==0.3.2

echo Installing LangChain...
python -m pip install langchain==0.0.350
python -m pip install langchain-google-genai==0.0.6
python -m pip install langchain-community==0.0.2

echo Installing vector processing...
python -m pip install faiss-cpu==1.7.4
python -m pip install numpy==1.24.3
python -m pip install scikit-learn==1.3.0

echo Installation complete!
echo You can now run: python run.py
pause
