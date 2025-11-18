## การตั้งค่า AWS Cognito MFA & SMS

บทความนี้แบ่งเป็นสองส่วนหลัก ๆ ครับ:

1. วิธีออกจากโหมด SMS Sandbox ของ AWS SNS เพื่อส่งข้อความไปยังเบอร์ผู้ใช้จริง (ที่ไม่ได้เพิ่มเป็นเบอร์ทดสอบ)
2. การตั้งค่า Amazon Cognito ให้รองรับ MFA แบบเลือกใช้งาน (Optional) ทั้งแอป Authenticator (TOTP) และ SMS พร้อมฟีเจอร์จำเครื่อง (Trusted Device)

---

## 1. ออกจาก AWS SMS Sandbox

ถ้าอยากส่ง SMS ถึงผู้ใช้ทั่วไป (เบอร์ที่ไม่ได้ Verify) ต้องออกจาก Sandbox ก่อนครับ

![SMS Sandbox Exit Screen](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g5t90efdryjyh4nxavwp.png)

หลังจากกด "Exit Sandbox" จะมีฟอร์มคำขอขึ้นมาแบบตัวอย่างด้านล่าง:

![Exit Sandbox Request Form](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jblyxnpzzdam796ojvv6.png)

กรอกข้อมูลให้ครบและตรงตามจริง ถ้า AWS ต้องการรายละเอียดเพิ่ม เขาอาจถามประมาณนี้ เตรียมตอบไว้ล่วงหน้าจะเร็วขึ้นครับ:

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

ตัวอย่างอีเมลตอบรับเมื่ออนุมัติ

```
Thank you for submitting your request to increase your SMS monthly spending limits. Your new SMS monthly spending limit of $50 USD was implemented in Asia Pacific (Singapore) region…
```

---

## 2. ตั้งค่า Cognito สำหรับ MFA แบบเลือกใช้ (TOTP + SMS)

### เป้าหมาย

ให้ผู้ใช้เปิด MFA เพิ่มเองได้ จะใช้แอป Authenticator หรือ SMS ก็ได้ อัปเดต `phone_number` ได้ และเครื่องที่เคยยืนยันสำเร็จครั้งหนึ่งสามารถข้าม MFA รอบต่อไปได้ (Trusted Device) ลด friction ครับ

### สิ่งที่ควรมีพร้อม (Prerequisites)

- สร้าง User Pool ไว้แล้ว
- มี IAM Role ที่มีสิทธิ์ `sns:Publish` (สำหรับส่ง SMS) หรือเตรียมจะสร้างใหม่

### ขั้นตอนที่ 1: เปิดสิทธิ์ Attribute `phone_number`

1. ไปที่: User Pool → App clients → เลือก client ของคุณ
2. คลิก: "Set attribute read and write permissions"
3. เปิด:
   - Read: `phone_number`
   - Write: `phone_number`

เพื่อให้ frontend อ่านและแก้ไขเบอร์โทรของผู้ใช้สำหรับการลงทะเบียนรับ SMS ครับ

![App Client Attribute Permissions](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3ajmr3mkufqpqf8e3iqw.png)

### ขั้นตอนที่ 2: ตั้งค่า SMS Settings

1. ไปที่: Authentication → Authentication methods → SMS
2. เลือก IAM role ที่มีสิทธิ์ `sns:Publish` (หรือสร้างใหม่)
3. กด Save

![SMS Settings](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4o84ujkynq77a8nfpc8j.png)

### ขั้นตอนที่ 3: เปิด Optional MFA

1. ไปที่: Authentication → Sign-in → Multi-factor authentication
2. ตั้งค่า MFA configuration: Optional
3. เลือกประเภท MFA:
   - Authenticator Apps (TOTP)
   - SMS message

![MFA Configuration](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/irbdepkjt8gwhymfvjar.png)

### ขั้นตอนที่ 4: เปิด Device Tracking & Trusted Devices

1. ไปที่: Authentication → Sign-in → Device tracking
2. ตั้งค่า Tracking: Always remember
3. เปิด: "Allow users to bypass MFA for trusted devices"

ผลลัพธ์: เครื่องที่ผ่าน MFA สำเร็จแล้ว ครั้งถัดไปสามารถข้ามได้ (ถ้าไม่มีการ reset หรือ revoke) ช่วยให้ประสบการณ์ดีขึ้นครับ

---

## 3. สรุป / เช็กลิสต์ตรวจสอบ

- ออกจาก SMS Sandbox และได้วงเงินส่ง SMS แล้ว
- App client เปิด Read/Write ให้ `phone_number`
- ตั้งค่า SMS พร้อม IAM role ถูกต้อง
- MFA เป็น Optional และเลือก TOTP + SMS
- Device tracking เปิด และ Trusted bypass ทำงาน

ตอนนี้ผู้ใช้สามารถเลือกเปิด MFA จะใช้ Authenticator หรือ SMS ก็ได้ และเครื่องที่เชื่อถือช่วยลดการถาม MFA ซ้ำ ๆ ครับ

**แหล่งอ้างอิง (References):**

- [AWS Cognito User Pool Creation Guide](https://docs.aws.amazon.com/cognito/)
- [AWS SNS SMS Sandbox Exit Process](https://docs.aws.amazon.com/sns/)
