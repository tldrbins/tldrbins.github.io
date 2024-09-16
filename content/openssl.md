---
title: "Openssl"
date: 2024-7-9
tags: ["openssl", "base64", "cert", "ssl", "certificate signing request", "csr", "pem", "p12", "key", "crt"]
---

### Show TLS Certificate from HTTPS web server

```console
echo | openssl s_client -showcerts -servername <TARGET> -connect <TARGET>:443 2>/dev/null | openssl x509 -inform pem -noout -text
```

### Show content of a CSR

```console
openssl req -in request.csr -noout -text
```

### Create Client Certificate

#### 1. Generate a user key

```console
openssl genrsa -out username.key 2048                                                      
```

#### 2. Create a CSR

```console
openssl req -new -key username.key -out username.csr
```

<br>

```console
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
| Common Name (e.g. server FQDN or YOUR name) []:username                     |
| Email Address []:                                                           |
|                                                                             |
| Please enter the following 'extra' attributes                               |
| to be sent with your certificate request                                    |
| A challenge password []:                                                    |
| An optional company name []:                                                |
+-----------------------------------------------------------------------------+
```

#### 3. Sign the .csr with a valid key and cert pair

```console
openssl x509 -req -in username.csr -CA <CERT_PEM_FILE> -CAkey <CERT_KEY_FILE> -CAcreateserial -out username.pem -days 1024
```

#### 4. Use the pfx file

{{< tab set1 tab1 active >}}firefox{{< /tab >}}
{{< tab set1 tab2 >}}curl{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Convert to pfx that Firefox can import
openssl pkcs12 -export -out username.pfx -inkey username.key -in username.pem -certfile company.cert.pem
```

```console
# Settings
+------------------------------------+
| Enter Export Password:             |
| Verifying - Enter Export Password: |
+------------------------------------+
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
curl -k --cert username.pem --key username.key <TARGET>
```

{{< /tabcontent >}}

### Convert .p12 to .key and .crt

```console
# Create cert.key
openssl pkcs12 -in cert.p12 -nocerts -out cert.key
```

```console
# Create cert.crt
openssl pkcs12 -in cert.p12 -clcerts -nokeys -out cert.crt
```

### Base64 Encode/Decode

```console
# base64 encode a file
openssl base64 -in ./file
```

```console
# base64 decode a file and output to a file
cat b64_file | openssl enc -d -base64 -out ./file
```
