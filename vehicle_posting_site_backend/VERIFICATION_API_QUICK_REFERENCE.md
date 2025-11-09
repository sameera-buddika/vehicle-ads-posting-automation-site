# Verification API - Quick Reference

## 🚀 Quick Start

### 1. Verify a Vehicle
```bash
POST /api/vehicles/{vehicle_id}/verify/
```
**Authentication:** Required (JWT Cookie)  
**Response:**
```json
{
  "success": true,
  "message": "Verification completed successfully",
  "verification_status": "verified",
  "verification_result": {
    "overall_confidence_score": 92.5,
    "verification_passed": true,
    "ai_detected_brand": "Toyota",
    "ai_detected_model": "Camry",
    "discrepancies": [],
    "ai_suggestions": "All details match correctly."
  }
}
```

### 2. Check Status
```bash
GET /api/vehicles/{vehicle_id}/verification-status/
```
**Authentication:** Not required  
**Response:**
```json
{
  "vehicle_id": 1,
  "verification_status": "verified",
  "is_verified": true,
  "verification_score": 92.5,
  "attempts": 1,
  "last_verification": "2025-11-09T14:30:00Z"
}
```

### 3. View History
```bash
GET /api/vehicles/{vehicle_id}/verification-history/
```
**Response:**
```json
{
  "vehicle_id": 1,
  "total_attempts": 2,
  "current_status": "verified",
  "is_verified": true,
  "results": [...]
}
```

## 📋 All Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/vehicles/{id}/verify/` | POST | ✅ | Trigger verification |
| `/api/vehicles/{id}/verification-status/` | GET | ❌ | Get status |
| `/api/vehicles/{id}/verification-history/` | GET | ❌ | Get history |
| `/api/vehicles/{id}/retry-verification/` | POST | ✅ | Retry |
| `/api/vehicles/bulk-verify/` | POST | ✅ | Bulk verify |
| `/api/verification-results/{id}/` | GET | ❌ | Get result details |

## 🎯 Status Values

- `pending` - Not yet verified
- `in_progress` - Currently verifying
- `verified` - Passed verification
- `failed` - Failed verification
- `manual_review` - Needs human review

## ⚙️ Setup

1. Create `.env` file:
```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

2. Run migrations (already done):
```bash
python manage.py migrate
```

3. Start server:
```bash
python manage.py runserver
```

4. Test:
```bash
python test_verification_api.py
```

## ✅ Test Results
```
[OK] Server Connection: PASSED
[OK] Vehicle List with Verification: PASSED
[OK] Vehicle Detail with Verification: PASSED
[OK] Verification Status: PASSED
[OK] Verification History: PASSED

Results: 5/5 tests passed
```

**Status: Ready to Use! 🎉**

