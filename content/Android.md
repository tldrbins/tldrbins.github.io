---
title: "Android"
date: 2024-7-27
tags: ["Android", "apk", "decompile", "java", "reversing", "apktool", "adb"]
---

---
### Unpack .apk file

<div>

```bash
# Get .smali files
java -jar apktool_2.9.3.jar d app.apk
```

```bash
# Get .java files
jadx app.apk
```

</div>

<small>*Ref: [apktool](https://apktool.org/)*</small>
<br>
<small>*Ref: [jadx](https://github.com/skylot/jadx)*</small>


---

### Re-pack .apk file

#### 1. Initial pack

<div>

```bash
java -jar apktool_2.9.3.jar b --use-aapt2 app -o app_repacked.apk
```

</div>

#### 2. zip align

<div>

[zipalign](https://www.sisik.eu/zipalign)

</div>

#### 3. Sign the apk

<div>

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

```bash  
apksigner sign --ks my-release-key.jks --ks-pass pass:<PASSWORD> --out app_final.apk app_repacked.apk
```

</div>

<br>

---

### Dynamic Debugging

#### 1. Set up

<div>

```
+--------------------------------------------------------------------+
| 1. Open genymotion and boot up Galaxy S9 (Random Pick)             |
| 2. Open IntelliJ Idea IDE                                          |
| 3. Open -> app (The folder just unpacked using apktool)            |
| 4. Run -> Edit Config -> JVM Remote Debug -> OK                    |
| 5. File -> Project Structure -> Project -> SDK -> OpenSDK 20 -> OK |
+--------------------------------------------------------------------+
```

</div>

#### 2. Connect

<div>

```bash
./adb kill-server
```

```bash                                               
./adb connect 127.0.0.1:6555
```

```bash   
./adb -s 127.0.0.1:6555 install app.apk
```

</div>

#### 3. Run the app

<div>

```
+-------------------------+
| Run the app in emulator |
+-------------------------+
```

</div>

#### 4. Get PID and forward to Debugger

<div>

```bash
./adb -s 127.0.0.1:6555 shell ps -A | grep <com.example.app>
```

```bash 
./adb -s 127.0.0.1:6555 forward tcp:5005 jdwp:<PID>
```

</div>

#### 5. StartDebugging

<div>

```
+-------------------------------------------+
| Click the debug icon in IntelliJ Idea IDE |
+-------------------------------------------+
```

</div>

<br>