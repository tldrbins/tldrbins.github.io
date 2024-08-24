---
title: "Connection from Public Internet"
date: 2024-6-26
tags: ["file transfer", "public ip", "ngrok", "serveo", "webhook", "xss", "xxe"]
---

---
### Simply catch HTTP request

[webhook.site](https://webhook.site)

---

### Catch HTTP request and host a web server 

#### serveo.net

```bash
# Start a local HTTP server
python3 -m http.server 3000
```

```bash
# Redirect http request to localhost:3000
ssh -R 80:localhost:3000 serveo.net
```

#### ngrok

[Download ngrok](https://ngrok.com)

```bash
ngrok http 80
```

<small>*Note: ngrok free will show a warning message and require user accpet to proceed*</small>
<br>
<small>*Note: Not good for XSS*</small>