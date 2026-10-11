# AWS Cost Control & Credit Protection Guide ($200 Credit Envelope)

UrbanLoop AI is architected from the ground up for **zero idle compute cost**, specifically designed for student developers and hackathon participants utilizing limited promotional credits.

---

## 1. Zero Idle Cost Architectural Decisions

| Service | Architecture Pattern | Cost When Idle | Cost Under Load |
|---|---|---|---|
| **AWS Lambda** | Event-Driven Node.js 20.x | **$0.00** | Free tier covers 1M requests/mo; then $0.20 per 1M requests. |
| **Amazon API Gateway** | HTTP API (v2) | **$0.00** | $1.00 per million requests (70% cheaper than REST APIs). |
| **Amazon DynamoDB** | `PAY_PER_REQUEST` (On-Demand) | **$0.00** | First 25 GB storage free; reads/writes billed per million. |
| **AWS CloudWatch** | JSON Logs (7-day retention) | **$0.00** | Free tier covers 5 GB log ingestion. |
| **AWS Amplify / S3** | Static Web Hosting | **$0.00 - <$0.05** | Negligible data transfer out during demos. |

### Anti-Patterns Explicitly Avoided
- ❌ **No Amazon EC2 Instances:** No running hourly virtual machines ($15–$60/mo avoided).
- ❌ **No NAT Gateways:** Lambda functions run outside VPC for public DynamoDB access ($32.40/mo per NAT gateway avoided).
- ❌ **No Provisioned Databases (RDS / Aurora):** No $15–$120/mo database cluster idle fees.
- ❌ **No Unmetered Generative AI Inference:** No high Bedrock token consumption fees during core workflow testing.

---

## 2. Resource Teardown & Deletion Commands

When testing or hackathon presentation is complete, execute the following commands to cleanly delete all provisioned AWS CloudFormation resources:

### Delete Backend CloudFormation Stack
```powershell
sam delete --stack-name urbanloop-backend --region us-east-1 --no-prompts
```
*This removes the API Gateway HTTP API, all 8 Lambda functions, and all 4 DynamoDB tables in one automated step.*

### Verify Zero Remaining CloudFormation Stacks
```powershell
aws cloudformation describe-stacks --stack-name urbanloop-backend --region us-east-1
```
*(Should return `Stack with id urbanloop-backend does not exist`)*

### Clear S3 SAM Deployment Buckets
```powershell
aws s3 ls | Select-String "aws-sam-cli-managed"
```

---

## 3. Real-Time Cost Monitoring

To inspect accumulated charges at any point:
```powershell
aws ce get-cost-and-usage `
  --time-period Start=2026-10-01,End=2026-10-31 `
  --granularity DAILY `
  --metrics "UnblendedCost"
```
