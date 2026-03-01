# SWA

```
# build
cd frontend
npm run build

swa deploy ./dist --env production --deployment-token <YOUR_TOKEN>
```

# App
```
# zip
cd backend
zip -r ../backend.zip . -x ".venv/*" "__pycache__/*" "*.pyc"

cd ..

az webapp deploy -g rg-xxxx -n xxxx-app --src-path ./backend.zip --type zip

az webapp config appsettings set -g rg-txxx -n webapp-xxx --settings \
  GEMINI_API_KEY="<YOUR_GEMINI_API_KEY>" \
  GEMINI_MODEL="gemini-2.5-flash"

az webapp config set \
  --resource-group rg-xxx \
  --name test-app \
  --startup-file "gunicorn -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app"

az webapp config appsettings set -g rg-xxx --name xxxx-app --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```