---
title: "Android"
date: 2024-7-27
tags: ["Android", "apk", "decompile", "java", "reversing", "apktool", "adb"]
---

### Unpack .apk file

<div>

```console
# Get .smali files
java -jar apktool_2.9.3.jar d <FILE>
```

```console
# Get .java files
jadx <FILE>
```

</div>

<small>*Ref: [apktool](https://apktool.org/)*</small>
<br>
<small>*Ref: [jadx](https://github.com/skylot/jadx)*</small>


---

### Re-pack .apk file

#### 1. Initial pack

<div>

```console
java -jar apktool_2.9.3.jar b --use-aapt2 <APP> -o <APP>_repacked.apk
```

</div>

#### 2. zip align

<div>

[zipalign](https://www.sisik.eu/zipalign)

</div>

#### 3. Sign the apk

<div>

```console
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

```console
apksigner sign --ks my-release-key.jks --ks-pass pass:'<PASSWORD>' --out <APP>_final.apk <APP>_repacked.apk
```

</div>

<br>

---

### Dynamic Debugging

#### 1. Set up

<div>

```console
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

```console
./adb kill-server
```

```console
./adb connect 127.0.0.1:6555
```

```console
./adb -s 127.0.0.1:6555 install <FILE>
```

</div>

#### 3. Run the app

<div>

```console
+-------------------------+
| Run the app in emulator |
+-------------------------+
```

</div>

#### 4. Get PID and forward to Debugger

<div>

```console
./adb -s 127.0.0.1:6555 shell ps -A | grep <REVERSE_DOMAIN_NAME_NOTATION>
```

```console
./adb -s 127.0.0.1:6555 forward tcp:5005 jdwp:<PID>
```

</div>

#### 5. StartDebugging

<div>

```console
+-------------------------------------------+
| Click the debug icon in IntelliJ Idea IDE |
+-------------------------------------------+
```

</div>

<br>