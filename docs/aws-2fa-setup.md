## AWS Cognito MFA & SMS Setup

This guide covers two parts:

1. Exiting the AWS SNS SMS Sandbox so you can send messages to real (unverified) numbers in production.
2. Configuring Amazon Cognito for optional Multi‑Factor Authentication (MFA) using both Authenticator Apps (TOTP) and SMS, with trusted device support.

---

## 1. Exit the AWS SMS Sandbox

You must exit the SMS Sandbox to send SMS to users beyond test numbers.

![SMS Sandbox Exit Screen](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g5t90efdryjyh4nxavwp.png)

After clicking "Exit Sandbox" you will see a request form similar to the one below:

![Exit Sandbox Request Form](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jblyxnpzzdam796ojvv6.png)

Fill the form accurately. If AWS needs more information they may ask the following; prepare answers up front:

```
Before we can evaluate your case, please reply and provide the following additional details:
- Company name:
- Company URL:
- AWS region:
- Requested Monthly spend (USD) [1]:
- SMS Service use-case information
    SMS service or program name:
    Company relationship to the SMS service (purpose & how users opt in):
    SMS service or program website URL:
    Service opt-in location and process (app / website / form):
    Desired launch date:
    Origination identity to be used [2] (SenderID / LongCode / ShortCode / 10DLC):
        Is the identity registered or unregistered?
    Destination country/countries [3]:
    Message type (transactional / promotional):
    Expected messages per day:
    Expected messages per second [4]:
    Message templates (one per use case):
    URLs that will appear in messages (one per use case):
    If domains differ between your AWS account and the URLs used, explain the relationship:
```

Typical approval response (example):

```
Thank you for submitting your request to increase your SMS monthly spending limits. Your new SMS monthly spending limit of $50 USD was implemented in Asia Pacific (Singapore) region…
```

---

## 2. Configure Cognito for Optional MFA (TOTP + SMS)

### Objective

Provide users with optional MFA via authenticator apps or SMS, allow updating `phone_number`, and let trusted devices bypass MFA after first success.

### Prerequisites

- User Pool created.
- IAM role with `sns:Publish` permission (for SMS sending) or permissions to create one.

### Step 1: Allow `phone_number` Attribute Access

1. Navigate: User Pool → App clients → select your client.
2. Click: "Set attribute read and write permissions".
3. Enable:
   - Read: `phone_number`
   - Write: `phone_number`

This lets the frontend read and update user phone numbers required for SMS enrollment.

![App Client Attribute Permissions](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3ajmr3mkufqpqf8e3iqw.png)

### Step 2: Configure SMS Settings

1. Navigate: Authentication → Authentication methods → SMS.
2. Choose existing IAM role (or create new) granting `sns:Publish`.
3. Save configuration.

![SMS Settings](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4o84ujkynq77a8nfpc8j.png)

### Step 3: Enable Optional MFA

1. Navigate: Authentication → Sign-in → Multi-factor authentication.
2. Set MFA configuration: Optional.
3. Select MFA types:
   - Authenticator Apps (TOTP)
   - SMS message

![MFA Configuration](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/irbdepkjt8gwhymfvjar.png)

### Step 4: Enable Device Tracking & Trusted Devices

1. Navigate: Authentication → Sign-in → Device tracking.
2. Set tracking: Always remember.
3. Enable: "Allow users to bypass MFA for trusted devices".

Result: After successful MFA once on a device, subsequent logins can skip MFA (unless reset or revoked).

---

## 3. Summary / Validation Checklist

- Sandbox exited and spending limit approved.
- App client has read/write for `phone_number`.
- SMS settings saved with valid IAM role.
- MFA set to Optional with TOTP + SMS selected.
- Device tracking enabled; trusted bypass active.

Users can now choose either an authenticator app or SMS; trusted devices reduce friction while maintaining security.

**References:**

- [AWS Cognito User Pool Creation Guide](https://docs.aws.amazon.com/cognito/)
- [AWS SNS SMS Sandbox Exit Process](https://docs.aws.amazon.com/sns/)
- [Internal Setup Guide: AWS Cognito 2FA Configuration](aws-2fa-setup.md)
