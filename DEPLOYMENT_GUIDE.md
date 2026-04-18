# 🚀 DMS Quick Start Deployment Guide

## Prerequisites

Before deploying the Document Management System, ensure you have:

- **Node.js** 20+ LTS
- **Docker** & Docker Compose
- **PostgreSQL** 16+
- **MongoDB** 7+
- **Redis** 7+
- **AWS Account** (for S3 storage)
- **OpenAI API Key** (for AI features)

---

## 🏃 Quick Start (Development)

### 1. Clone and Setup

```bash
# Clone repository
git clone https://github.com/yourcompany/dms-enterprise.git
cd dms-enterprise

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

Create `.env` file in backend directory:

```bash
# Database
DATABASE_URL=postgresql://dms:password@localhost:5432/dms
MONGODB_URL=mongodb://localhost:27017/dms
REDIS_URL=redis://localhost:6379

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=dms-documents-dev
AWS_REGION=us-east-1

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=dms-documents

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@company.com
```

### 3. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### 4. Initialize Database

```bash
# Run migrations
cd backend
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 5. Access the Application

Open your browser and navigate to:
- **Web App**: http://localhost:3001
- **API Docs**: http://localhost:3000/api-docs

**Default Admin Credentials:**
- Email: admin@company.com
- Password: Admin@123 (Change immediately!)

---

## 🐳 Docker Compose Configuration

Full `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://dms:password@postgres:5432/dms
      - MONGODB_URL=mongodb://mongo:27017/dms
      - REDIS_URL=redis://redis:6379
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
      - mongo
      - redis

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=dms
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=dms
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  mongo_data:
  redis_data:
```

---

## ☁️ Production Deployment (AWS)

### Step 1: Prepare Infrastructure

#### Create S3 Buckets
```bash
aws s3 mb s3://dms-documents-prod
aws s3 mb s3://dms-archive-prod

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket dms-documents-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

#### Create RDS PostgreSQL
```bash
aws rds create-db-instance \
  --db-instance-identifier dms-postgres \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 16.1 \
  --master-username dmsadmin \
  --master-user-password <strong-password> \
  --allocated-storage 100 \
  --storage-encrypted \
  --backup-retention-period 7 \
  --vpc-security-group-ids sg-xxxxx
```

#### Create ElastiCache Redis
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id dms-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --num-cache-nodes 1 \
  --engine-version 7.0
```

### Step 2: Build and Push Docker Images

```bash
# Build backend image
cd backend
docker build -t dms-api:latest .

# Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag dms-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/dms-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/dms-api:latest
```

### Step 3: Deploy to Kubernetes (EKS)

```bash
# Create cluster
eksctl create cluster \
  --name dms-production \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.large \
  --nodes 3 \
  --nodes-min 3 \
  --nodes-max 10

# Apply configurations
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Verify deployment
kubectl get pods -n dms-production
kubectl get services -n dms-production
```

### Step 4: Configure DNS and SSL

```bash
# Get Load Balancer URL
kubectl get ingress -n dms-production

# Point your domain to the load balancer
# Example: dms.company.com -> a1234567890.us-east-1.elb.amazonaws.com

# Install cert-manager for automatic SSL
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Apply certificate issuer
kubectl apply -f k8s/cert-issuer.yaml
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Enable MFA for admin accounts
- [ ] Configure WAF (Web Application Firewall)
- [ ] Set up VPC with private subnets
- [ ] Enable database encryption
- [ ] Configure security groups (least privilege)
- [ ] Set up CloudWatch alarms
- [ ] Enable audit logging
- [ ] Configure backup retention
- [ ] Set up disaster recovery plan
- [ ] Conduct penetration testing
- [ ] Review and update secrets management
- [ ] Configure rate limiting
- [ ] Enable HTTPS only
- [ ] Set up monitoring and alerting

---

## 📊 Monitoring Setup

### Prometheus & Grafana

```bash
# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Default credentials: admin / prom-operator
```

### Import DMS Dashboard

1. Login to Grafana (http://localhost:3000)
2. Go to Dashboards → Import
3. Upload `grafana-dashboard.json`
4. Configure data source (Prometheus)

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest/api-test.js
```

---

## 📝 Common Operations

### Database Backup

```bash
# Manual backup
pg_dump -h localhost -U dms -d dms > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * /usr/bin/pg_dump -h localhost -U dms -d dms > /backups/dms_$(date +\%Y\%m\%d).sql
```

### Restore Database

```bash
psql -h localhost -U dms -d dms < backup_20240418.sql
```

### Scale Application

```bash
# Manual scaling
kubectl scale deployment dms-api --replicas=5 -n dms-production

# Horizontal Pod Autoscaler (already configured)
kubectl get hpa -n dms-production
```

### View Logs

```bash
# Kubernetes logs
kubectl logs -f deployment/dms-api -n dms-production

# Docker Compose logs
docker-compose logs -f backend

# Tail logs
tail -f logs/application.log
```

### Update Application

```bash
# Build new image
docker build -t dms-api:v2.0.0 .

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/dms-api:v2.0.0

# Update deployment
kubectl set image deployment/dms-api dms-api=<account-id>.dkr.ecr.us-east-1.amazonaws.com/dms-api:v2.0.0 -n dms-production

# Check rollout status
kubectl rollout status deployment/dms-api -n dms-production

# Rollback if needed
kubectl rollout undo deployment/dms-api -n dms-production
```

---

## 🔧 Troubleshooting

### API not responding

```bash
# Check pod status
kubectl get pods -n dms-production

# Check pod logs
kubectl logs <pod-name> -n dms-production

# Describe pod for events
kubectl describe pod <pod-name> -n dms-production

# Check service
kubectl get svc -n dms-production
```

### Database connection issues

```bash
# Test PostgreSQL connection
psql -h <rds-endpoint> -U dmsadmin -d dms

# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verify connectivity from pod
kubectl exec -it <pod-name> -n dms-production -- nc -zv <db-host> 5432
```

### S3 upload failures

```bash
# Check IAM permissions
aws iam get-role-policy --role-name dms-api-role --policy-name S3Access

# Test S3 access
aws s3 ls s3://dms-documents-prod

# Verify bucket policy
aws s3api get-bucket-policy --bucket dms-documents-prod
```

---

## 📚 Additional Resources

- [Full API Documentation](./API_DOCUMENTATION.md)
- [Database Schema Reference](./DATABASE_SCHEMA.md)
- [Architecture Overview](./DMS_Architecture.md)
- [Security Best Practices](./SECURITY.md)
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)

---

## 💬 Support

For issues and questions:
- **Internal Support**: support@company.com
- **GitHub Issues**: https://github.com/yourcompany/dms-enterprise/issues
- **Documentation**: https://docs.company.com/dms

---

## 📄 License

Internal Use Only - Proprietary Software
© 2024 Your Company Name. All rights reserved.
