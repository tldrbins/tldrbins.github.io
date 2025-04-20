---
title: "Openssl"
date: 2024-7-9
tags: ["Web Exploitation", "OpenSSL", "Certificate", "Certificate Signing Request", "TLS", "CSR", "PEM", "P12", "Key", "CRT", "RSA", "PFX"]
---

### Basics

#### Show TLS Certificate of a HTTPS Web Server

```console
echo | openssl s_client -showcerts -servername <TARGET> -connect <TARGET>:443 2>/dev/null | openssl x509 -inform pem -noout -text
```

#### Decrypt a Password Protected Private Key

```console
openssl rsa -in <KEY_FILE> -out decrypted_<KEY_FILE>   
```

#### Create a Personal Information Exchange File (.pfx)

```console
openssl pkcs12 -export -out <PFX_FILE> -inkey <KEY_FILE> -in <CRT_FILE>
```

#### View RSA Private Key (.key)

```console
openssl rsa -in <KEY_FILE> -noout -text
```

#### View Certificate (.crt)

```console
openssl x509 -in <CRT_FILE> -noout -text
``` 

#### View Personal Information Exchang (.pfx)

```console
openssl pkcs12 -in <PFX_FILE> -info -nodes
```

#### View Certificate Signing Request (.csr)

```console
openssl req -in <CSR_FILE> -noout -text
```

<br>

---

### Create a Client Certificate

#### 1. Generate a Private Key

```console
openssl genrsa -out <KEY_FILE> 2048                                                      
```

#### 2. Create a Certificate Signing Request 

```console
openssl req -new -key <KEY_FILE> -out <CSR_FILE>
```

```console {class="sample-code"}
# Settings
+-----------------------------------------------------------------------------+
| You are about to be asked to enter information that will be incorporated    |
| into your certificate request.                                              |
| What you are about to enter is what is called a Distinguished Name or a DN. |
| There are quite a few fields but you can leave some blank                   |
| For some fields there will be a default value,                              |
| If you enter '.', the field will be left blank.                             |
| -----                                                                       |
| Country Name (2 letter code) [AU]:US                                        |
| State or Province Name (full name) [Some-State]:                            |
| Locality Name (eg, city) []:                                                |
| Organization Name (eg, company) [Internet Widgits Pty Ltd]:COMPANY_NAME     |
| Organizational Unit Name (eg, section) []:COMPANY_NAME                      |
| Common Name (e.g. server FQDN or YOUR name) []:USER                         |
| Email Address []:EMAIL                                                      |
|                                                                             |
| Please enter the following 'extra' attributes                               |
| to be sent with your certificate request                                    |
| A challenge password []:                                                    |
| An optional company name []:                                                |
+-----------------------------------------------------------------------------+
```

#### 3. Sign the Request with a Valid Key and Certificate Pair

```console
openssl x509 -req -in <CSR_FILE> -CA <CERT_PEM_FILE> -CAkey <CERT_KEY_FILE> -CA createserial -out <PEM_FILE> -days 1024
```

#### 4. Usages

{{< tab set1 tab1 >}}firefox{{< /tab >}}
{{< tab set1 tab2 >}}curl{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Convert pem to pfx that Firefox can import
openssl pkcs12 -export -out <PFX_FILE> -inkey <KEY_FILE> -in <PEM_FILE> -certfile <CERT_PEM_FILE>
```

```console {class="sample-code"}
# Settings
+------------------------------------+
| Enter Export Password:             |
| Verifying - Enter Export Password: |
+------------------------------------+
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
curl -k --cert <PEM_FILE> --key <KEY_FILE> <TARGET>
```

{{< /tabcontent >}}

---

### Convert .p12 to .key and .crt

```console
# Create cert.key
openssl pkcs12 -in <P12_FILE> -nocerts -out <KEY_FILE>
```

```console
# Create cert.crt
openssl pkcs12 -in <P12_FILE> -clcerts -nokeys -out <CRT_FILE>
```

<br>

---

### Base64 Encode/Decode

```console
# base64 encode a file
openssl base64 -in <FILE>
```

```console
# base64 decode a file and output to a file
cat <BASE64_ENCODED_FILE> | openssl enc -d -base64 -out <FILE>
```
