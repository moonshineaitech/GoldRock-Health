# Demo Account Setup for App Store Review

## Demo Account Credentials

**Email:** appreviewer@goldrock.com  
**Password:** AppReview2025!  
**Status:** Premium Active (Annual Plan)  
**Created:** Pre-configured for App Review

## Account Features

### Pre-Loaded Sample Data

The demo account includes:

1. **Sample Medical Bills (5 bills)**
   - Emergency Room visit - $12,450
   - MRI scan - $3,800
   - Outpatient surgery - $8,900
   - Laboratory tests - $1,250
   - Physical therapy session - $450

2. **AI Analysis Results**
   - Each bill has complete AI analysis
   - Detected overcharges highlighted
   - Reduction strategies generated
   - Dispute templates created

3. **Chat History**
   - Sample conversations with AI
   - Bill negotiation examples
   - Strategy recommendations

4. **Account Settings**
   - Premium subscription active
   - All features unlocked
   - Payment method: Test Stripe card

## Setup Instructions for Development Team

### 1. Create Demo Account

```bash
# Connect to database
psql $DATABASE_URL

# Create demo user
INSERT INTO users (id, email, name, subscription_status, subscription_plan, stripe_customer_id, created_at)
VALUES (
  'demo-reviewer-001',
  'appreviewer@goldrock.com',
  'App Store Reviewer',
  'active',
  'annual',
  'cus_test_reviewer',
  NOW()
);
```

### 2. Load Sample Bills

```sql
-- Sample ER Bill
INSERT INTO medical_bills (id, user_id, bill_name, provider_name, total_amount, bill_date, status, created_at)
VALUES (
  'bill-demo-001',
  'demo-reviewer-001',
  'Emergency Room Visit',
  'Metro General Hospital',
  12450.00,
  '2024-12-15',
  'analyzed',
  NOW()
);

-- Sample MRI Bill
INSERT INTO medical_bills (id, user_id, bill_name, provider_name, total_amount, bill_date, status, created_at)
VALUES (
  'bill-demo-002',
  'demo-reviewer-001',
  'MRI Brain Scan',
  'Radiology Associates',
  3800.00,
  '2024-12-20',
  'analyzed',
  NOW()
);

-- Add more sample bills as needed...
```

### 3. Generate AI Analysis Results

```sql
-- Sample analysis for ER bill
INSERT INTO bill_analysis_results (id, bill_id, total_overcharge_detected, confidence_score, analysis_summary, created_at)
VALUES (
  'analysis-demo-001',
  'bill-demo-001',
  3200.00,
  0.87,
  'Detected potential overcharges in facility fees and supply costs. Recommended negotiation strategies attached.',
  NOW()
);
```

### 4. Create Sample Chat Sessions

```sql
INSERT INTO chat_sessions (id, user_id, bill_id, session_title, created_at)
VALUES (
  'chat-demo-001',
  'demo-reviewer-001',
  'bill-demo-001',
  'ER Bill Reduction Strategy',
  NOW()
);

INSERT INTO chat_messages (id, session_id, user_id, role, content, created_at)
VALUES 
  ('msg-001', 'chat-demo-001', 'demo-reviewer-001', 'user', 'How can I reduce this ER bill?', NOW()),
  ('msg-002', 'chat-demo-001', 'demo-reviewer-001', 'assistant', 'I analyzed your $12,450 ER bill and found $3,200 in potential overcharges. Here are my top 3 reduction strategies...', NOW());
```

### 5. Set Premium Access

```sql
UPDATE users 
SET 
  subscription_status = 'active',
  subscription_plan = 'annual',
  stripe_subscription_id = 'sub_test_reviewer',
  subscription_current_period_end = NOW() + INTERVAL '1 year'
WHERE id = 'demo-reviewer-001';
```

## Testing Checklist for Reviewers

### ✅ Core Features
- [ ] Log in with demo credentials
- [ ] View dashboard with sample bills
- [ ] Click on a sample bill to see AI analysis
- [ ] View reduction strategies and recommendations
- [ ] Access dispute letter templates
- [ ] Test chat interface with AI

### ✅ Bill Upload Flow
- [ ] Tap "Upload Bill" button
- [ ] Test camera capture (use any document as sample)
- [ ] Test photo library selection
- [ ] Verify upload confirmation

### ✅ Premium Features
- [ ] Confirm Premium badge displayed
- [ ] Access unlimited bill uploads
- [ ] View advanced AI coaching features
- [ ] Test priority support chat

### ✅ Privacy & Compliance
- [ ] Verify medical disclaimer on first launch
- [ ] Check Settings → Privacy Policy accessible
- [ ] Check Settings → Terms of Service accessible
- [ ] Test Settings → Account Deletion flow (DO NOT actually delete!)

### ✅ Permissions
- [ ] Camera permission prompt appears when needed
- [ ] Photo library permission prompt appears when needed
- [ ] Push notification permission prompt (optional)
- [ ] Face ID/Touch ID permission (if enabled)

### ✅ Navigation
- [ ] Bottom navigation works correctly
- [ ] All menu items accessible
- [ ] Back buttons function properly
- [ ] Deep links work (if applicable)

## Sample Bill Images for Testing

Sample bill PDFs and images are available in the iOS Photos app on the demo device:

1. `sample-er-bill.pdf` - $12,450 ER visit
2. `sample-mri-bill.jpg` - $3,800 MRI scan
3. `sample-surgery-bill.pdf` - $8,900 outpatient surgery
4. `sample-lab-bill.jpg` - $1,250 lab tests
5. `sample-therapy-bill.pdf` - $450 physical therapy

## Stripe Test Cards for Subscription Testing

**Test Mode Enabled** - Use these cards in sandbox:

- **Success:** 4242 4242 4242 4242
- **Requires Authentication:** 4000 0025 0000 3155
- **Declined:** 4000 0000 0000 9995

**Any future expiry date and any 3-digit CVC**

## Important Notes for Reviewers

1. **Do NOT delete the demo account** - Multiple reviewers may need access
2. **Medical Disclaimer** - This app provides billing education, NOT medical advice
3. **Data Privacy** - All sample data is fictional and for testing only
4. **Subscription** - Premium access is pre-activated, no payment required for review
5. **Support** - Contact support@goldrockhealth.com for review questions

## Emergency Contact

**For urgent review questions:**
- Email: support@goldrockhealth.com
- Phone: +1 (555) 123-4567 (business hours: 9 AM - 5 PM MT)

## Resetting Demo Account

If the demo account needs to be reset:

```sql
-- Delete all user data (preserves account)
DELETE FROM chat_messages WHERE user_id = 'demo-reviewer-001';
DELETE FROM chat_sessions WHERE user_id = 'demo-reviewer-001';
DELETE FROM bill_analysis_results WHERE bill_id IN (SELECT id FROM medical_bills WHERE user_id = 'demo-reviewer-001');
DELETE FROM medical_bills WHERE user_id = 'demo-reviewer-001';

-- Then re-run setup scripts above
```

---

**Last Updated:** January 2025  
**Maintained By:** GoldRock Health Engineering Team
