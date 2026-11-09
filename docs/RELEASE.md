# คู่มือปล่อยเวอร์ชันใหม่ (Release Guide)

แอปมีตัวอัปเดต 2 แบบ เลือกใช้ให้ถูกต้องตามประเภทการเปลี่ยนแปลง

| ประเภทการเปลี่ยนแปลง | วิธีอัปเดต | ต้องลง APK ใหม่ไหม |
|---|---|---|
| แก้ไขเว็บ (React, UI, ซับไตเติล, ข้อมูลคำศัพท์, วิดีโอ) | OTA Web Bundle ในแอป | ไม่ต้อง |
| แก้ไขโค้ด Android / เพิ่มหรือเปลี่ยน Capacitor plugin / สิทธิ์ / Gradle | APK ใหม่ | ต้องลง 1 ครั้ง |

## 1. ปล่อยอัปเดตเฉพาะส่วนเว็บ (Web-only OTA)

1. เพิ่มเลขเวอร์ชันใน `src/config/version.ts`
   - `APP_VERSION_NAME` เช่น `'1.0.8'`
   - `APP_BUILD` เพิ่มขึ้น เช่น `108`
   - `APP_VERSION_BASE` เช่น `'v1.0.8'`
   - ไม่ต้องแก้ `NATIVE_BUILD` ถ้าไม่ได้แก้โค้ด Android
2. สร้างไฟล์ bundle:
   ```bash
   npm run bundle
   ```
   คำสั่งนี้จะ build ก่อนแล้วสร้างไฟล์ `release/web-bundle-<version>.zip` โดยไฟล์ `index.html` อยู่ที่ root ของ zip
   พร้อมคำนวณ SHA-256 ของไฟล์ zip แล้วเขียนลง `public/live_catalog.json` เป็น `checksum` ให้อัตโนมัติ (และตั้ง `version`, `build`, `bundle_url`)
   ทุกแมนิเฟสต์ OTA ต้องมี `checksum` เสมอ เพราะ `@capgo/capacitor-updater` จะปฏิเสธการดาวน์โหลดที่ไม่มี checksum (ถ้าไม่มี แอปจะไม่เสนออัปเดตนั้น)
3. สร้าง GitHub Release ใหม่ชื่อแท็ก `v<version>` (เช่น `v1.0.8`) แล้วอัปโหลดไฟล์ `release/web-bundle-<version>.zip` เป็น asset
4. แก้ไข `public/live_catalog.json` บน branch `main`
   - `version` และ `build` ให้ตรงกับเวอร์ชันใหม่
   - `bundle_url` ให้ชี้ไปที่ไฟล์ zip ใน Release (เช่น `https://github.com/MosStep/umami-japanese/releases/download/v1.0.8/web-bundle-1.0.8.zip`)
   - `min_native_build` คงค่าเดิมไว้ (ต้องไม่มากกว่า `NATIVE_BUILD` ของแอปที่ผู้ใช้ลงอยู่)
   - `release_notes` และ `announcement` เป็นภาษาไทย
5. push การเปลี่ยนแปลงขึ้น `main` ผู้ใช้จะได้รับอัปเดตตอนเปิดแอปครั้งถัดไป

ระบบจะดาวน์โหลด bundle เบื้องหลัง และเริ่มใช้งานเวอร์ชันใหม่ตั้งแต่การเปิดแอปครั้งถัดไป หรือกดปุ่ม "รีสตาร์ทเลย" ในแถบแจ้งเตือนเพื่อใช้ทันที

## 2. เมื่อไหร่ต้องเพิ่ม `NATIVE_BUILD` และปล่อย APK

ต้องเพิ่ม `NATIVE_BUILD` ใน `src/config/version.ts` และปล่อย APK ใหม่ เมื่อมีการเปลี่ยนแปลงในโฟลเดอร์ `android/` หรือ Capacitor plugin ที่ต้องมีโค้ด native เช่น:

- เพิ่ม/อัปเดต Capacitor plugin หรือ `@capgo/capacitor-updater` เวอร์ชันที่มีโค้ด native ใหม่
- เปลี่ยนสิทธิ์ใน `AndroidManifest.xml` หรือ Gradle
- เปลี่ยน `appId`, `appName` หรือ `capacitor.config.ts` ที่กระทบฝั่ง native

ขั้นตอน:

1. เพิ่มเลขเวอร์ชันใน `src/config/version.ts`
   - `APP_VERSION_NAME` และ `APP_VERSION_BASE` เช่น `'1.0.8'` / `'v1.0.8'`
   - `APP_BUILD` และ `NATIVE_BUILD` เพิ่มขึ้น เช่น `108`
2. เพิ่ม `versionCode` และ `versionName` ใน `android/app/build.gradle` ทุกครั้งที่ปล่อย APK
   - `versionCode` ต้องเท่ากับ `NATIVE_BUILD` (เช่น `108`) เพราะ `resetWhenUpdate` ของ plugin อาศัยการเปลี่ยนแปลงของเวอร์ชัน native
   - `versionName` ต้องเท่ากับ `APP_VERSION_NAME` (เช่น `"1.0.8"`)
3. ตั้ง `min_native_build` ใน `public/live_catalog.json` เป็นค่า `NATIVE_BUILD` ใหม่ เพื่อบังคับให้ผู้ใช้ติดตั้ง APK
4. ปล่อย APK (`umami-app-debug.apk`) ใน GitHub Release `v<version>` ถ้าไม่ระบุ `apk_url` ในแมนิเฟสต์ แอปจะใช้ URL มาตรฐานตามเวอร์ชันนั้น
5. ผู้ใช้ที่มีแอปเวอร์ชัน native เก่าจะเห็นข้อความ "ต้องติดตั้ง APK ครั้งเดียว" และปุ่มติดตั้ง APK ในหน้าอัปเดต

หมายเหตุ: ถ้า `min_native_build` มากกว่า `NATIVE_BUILD` ของแอปที่ผู้ใช้ลงอยู่ ระบบจะไม่ดาวน์โหลด OTA bundle และจะให้ติดตั้ง APK แทน เพื่อป้องกันเว็บกับโค้ด native ไม่ตรงกัน

## 3. กฎสำคัญก่อนปล่อยทุกครั้ง

### 3.0 ห้ามแก้ `checksum` ด้วยมือ และห้ามแก้ zip หลังสร้างแล้ว

- `checksum` ใน `public/live_catalog.json` ต้องเป็น SHA-256 (hex ตัวพิมพ์เล็ก 64 ตัว) ของไฟล์ `release/web-bundle-<version>.zip` ที่อัปโหลดขึ้น Release เท่านั้น ให้ใช้ค่าที่ `npm run bundle` เขียนให้
- ถ้า zip กับ `checksum` ไม่ตรงกัน การดาวน์โหลดจะล้มเหลวด้วยข้อความ "Failed to download"

### 3.1 เวอร์ชันที่ล้มเหลวจะถูกบล็อกถาวรบนเครื่องผู้ใช้

- ถ้า bundle เวอร์ชันหนึ่งติดตั้งไม่สำเร็จ หรือแอปเปิดแล้วไม่ผ่าน `notifyAppReady` เครื่องจะจำเลขเวอร์ชันนั้นไว้ (`umami_ota_failed_versions`) และจะไม่ดาวน์โหลดซ้ำอัตโนมัติ
- ดังนั้น **ห้ามอัปโหลด zip ทับเลขเวอร์ชันเดิม** และห้ามลบ/แทนที่ไฟล์ใน Release ที่เผยแพร่แล้ว
- เมื่อแก้บั๊ก ให้ใช้ **เลขเวอร์ชันใหม่เสมอ** (เช่น `1.0.8` → `1.0.9`) แล้วปล่อยเป็น Release ใหม่

### 3.2 แนบ APK ทุก Release ระหว่างที่ยังมีผู้ใช้เวอร์ชัน 1.0.6

- ระหว่างที่ยังมีเครื่องที่ใช้ native เวอร์ชัน 1.0.6 ให้แนบ `umami-app-debug.apk` (APK native ล่าสุด) ไว้ใน GitHub Release **ทุกครั้ง**
- ขึ้นต้นเนื้อหา (body) ของ Release ด้วยข้อความเตือนนี้:

  > ⚠️ **ถ้าใช้แอปเวอร์ชัน 1.0.6:** กดปุ่ม "📦 ติดตั้งไฟล์ APK ใหม่" (ไม่ใช่ "⚡ อัปเดตในแอพทันที") แล้วติดตั้งไฟล์ `umami-app-debug.apk` ที่แนบใน Release นี้

- เหตุผล: เครื่อง 1.0.6 ไม่สามารถรับ OTA web bundle ได้ ต้องลง APK ใหม่ก่อน
