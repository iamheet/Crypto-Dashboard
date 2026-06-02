# 🚀 CryptoNexus Deployment Guide

## 📋 Production-Grade DevOps Practices Implemented

### ✅ Security Checklist
- [x] No `.env` files in Git repository
- [x] No `.env` files in Docker images
- [x] All secrets injected at runtime
- [x] JWT secrets use environment variables
- [x] `.env.example` files for documentation only
- [x] `.dockerignore` blocks all environment files
- [x] `.gitignore` blocks all environment files

---

## 🔧 Setup Instructions

### 1. Local Development Setup

```bash
# Backend setup
cd my-next-app/backend
cp .env.example .env
# Edit .env and fill in your values:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_strong_secret_key
# PORT=5000

# Frontend setup
cd ..
cp .env.example .env.local
# Edit .env.local and fill in your values:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx

# Install dependencies
cd backend && npm install
cd .. && npm install

# Run locally
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm run dev
```

---

## 🐳 Docker Deployment

### Option 1: Using --env-file (Recommended)

#### Create environment files (NOT committed to Git):

**backend/.env.production**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
JWT_SECRET=strong_production_secret_here
PORT=5000
```

**frontend.env.production** (in project root)
```env
NEXT_PUBLIC_API_URL=http://35.154.139.232:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
```

#### Build and Run:

```bash
# Build backend
cd my-next-app/backend
docker build -t crypto-backend .

# Build frontend (env vars passed at BUILD time for Next.js)
cd ..
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://35.154.139.232:5000 \
  --build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx \
  -t crypto-dashboard .

# Run backend with env file
docker run -d -p 5000:5000 \
  --env-file backend/.env.production \
  --name crypto-backend \
  --restart unless-stopped \
  crypto-backend

# Run frontend
docker run -d -p 3000:3000 \
  --name crypto-frontend \
  --restart unless-stopped \
  crypto-dashboard
```

---

### Option 2: Using -e flags (CI/CD friendly)

```bash
# Backend
docker run -d -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e JWT_SECRET="strong_secret" \
  -e PORT=5000 \
  --name crypto-backend \
  --restart unless-stopped \
  crypto-backend

# Frontend (built with args)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=$API_URL \
  --build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=$RAZORPAY_KEY \
  -t crypto-dashboard .

docker run -d -p 3000:3000 \
  --name crypto-frontend \
  --restart unless-stopped \
  crypto-dashboard
```

---

## ☁️ AWS EC2 Production Deployment

### Step 1: SSH into EC2
```bash
ssh -i your-key.pem ubuntu@35.154.139.232
```

### Step 2: Clone Repository
```bash
git clone https://github.com/iamheet/Crypto-Dashboard.git
cd Crypto-Dashboard/my-next-app
```

### Step 3: Create Production Environment Files

**IMPORTANT: Never commit these files!**

```bash
# Backend env
cat > backend/.env.production << EOF
MONGO_URI=mongodb+srv://iamheetchokshi_db_user:S6IjhHTtO7rLUw2a@cryptonexus.fx9fte6.mongodb.net/?appName=Cryptonexus
JWT_SECRET=cryptonexus_production_secret_key_strong_2024
PORT=5000
EOF

# Frontend env (for reference, but passed as build args)
export NEXT_PUBLIC_API_URL=http://35.154.139.232:5000
export NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key
```

### Step 4: Build Docker Images
```bash
# Backend
cd backend
docker build -t crypto-backend .
cd ..

# Frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
  --build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID \
  -t crypto-dashboard .
```

### Step 5: Run Containers
```bash
# Backend
docker run -d -p 5000:5000 \
  --env-file backend/.env.production \
  --name crypto-backend \
  --restart unless-stopped \
  crypto-backend

# Frontend
docker run -d -p 3000:3000 \
  --name crypto-frontend \
  --restart unless-stopped \
  crypto-dashboard
```

### Step 6: Configure Security Groups
Ensure EC2 security group allows:
- Port 3000 (Frontend)
- Port 5000 (Backend API)
- Port 22 (SSH)

---

## 🔍 Verification Commands

```bash
# Check running containers
docker ps

# View logs
docker logs crypto-backend
docker logs crypto-frontend

# Test backend health
curl http://localhost:5000/api/pricing

# Test frontend
curl http://localhost:3000

# Stop containers
docker stop crypto-backend crypto-frontend

# Remove containers
docker rm crypto-backend crypto-frontend

# Remove images
docker rmi crypto-backend crypto-dashboard
```

---

## 🔐 Security Best Practices

### ✅ What We Did Right:
1. **No secrets in Git** - All `.env*` files are gitignored
2. **No secrets in Docker images** - `.dockerignore` blocks all env files
3. **Runtime injection** - Secrets passed via `-e` or `--env-file`
4. **Environment-agnostic code** - Same code runs everywhere
5. **JWT secrets from env** - No hardcoded secrets in code
6. **Example files only** - `.env.example` has no real values

### ⚠️ Important Notes:
1. **Frontend env vars** must be passed at BUILD time (Next.js requirement)
2. **Backend env vars** are injected at RUN time
3. **Never commit** `.env`, `.env.local`, `.env.production` files
4. **Always use** strong, unique JWT secrets in production
5. **Rotate secrets** regularly in production

---

## 🔄 CI/CD Integration

### GitHub Actions Example:
```yaml
- name: Build Frontend
  run: |
    docker build \
      --build-arg NEXT_PUBLIC_API_URL=${{ secrets.API_URL }} \
      --build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=${{ secrets.RAZORPAY_KEY }} \
      -t crypto-dashboard .

- name: Run Backend
  run: |
    docker run -d \
      -e MONGO_URI=${{ secrets.MONGO_URI }} \
      -e JWT_SECRET=${{ secrets.JWT_SECRET }} \
      -e PORT=5000 \
      crypto-backend
```

---

## 📞 Support

For issues or questions:
- GitHub: https://github.com/iamheet/Crypto-Dashboard
- Email: iamheetchokshi@gmail.com

---

**Built with security-first DevOps practices** 🔒
