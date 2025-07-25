---
title: "Android"
date: 2025-7-25
tags: ["Android", "Apk", "Decompile", "Java", "Reversing", "Apktool", "Adb", "Mobile App"]
---

### Unpack .apk File

```console
# Get .smali files
java -jar apktool_2.9.3.jar d <FILE>
```

```console
# Get .java files
jadx <FILE>
```

<small>*Ref: [apktool](https://apktool.org/)*</small>
<br>
<small>*Ref: [jadx](https://github.com/skylot/jadx)*</small>

---

### Re-pack .apk File

#### 1. Initial Pack

```console
java -jar apktool_2.9.3.jar b --use-aapt2 <APP> -o <APP>_repacked.apk
```

#### 2. Zip Align

[zipalign](https://www.sisik.eu/zipalign)

#### 3. Sign the Apk

```console
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

```console
apksigner sign --ks my-release-key.jks --ks-pass pass:'<PASSWORD>' --out <APP>_final.apk <APP>_repacked.apk
```

---

### Dynamic Debugging

#### 1. Set up

```console
+--------------------------------------------------------------------+
| 1. Open genymotion and boot up Galaxy S9 (Random Pick)             |
| 2. Open IntelliJ Idea IDE                                          |
| 3. Open -> app (The folder just unpacked using apktool)            |
| 4. Run -> Edit Config -> JVM Remote Debug -> OK                    |
| 5. File -> Project Structure -> Project -> SDK -> OpenSDK 20 -> OK |
+--------------------------------------------------------------------+
```

#### 2. Connect

```console
./adb kill-server
```

```console
./adb connect 127.0.0.1:6555
```

```console
./adb -s 127.0.0.1:6555 install <FILE>
```

#### 3. Run the App

```console
+-------------------------+
| Run the app in emulator |
+-------------------------+
```

#### 4. Get PID and Forward to Debugger

```console
./adb -s 127.0.0.1:6555 shell ps -A | grep <REVERSE_DOMAIN_NAME_NOTATION>
```

```console
./adb -s 127.0.0.1:6555 forward tcp:5005 jdwp:<PID>
```

#### 5. Start Debugging

```console
+-------------------------------------------+
| Click the debug icon in IntelliJ Idea IDE |
+-------------------------------------------+
```
