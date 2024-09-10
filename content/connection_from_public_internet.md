---
title: "Connection from Public Internet"
date: 2024-6-26
tags: ["file transfer", "public ip", "ngrok", "serveo", "webhook", "xss", "xxe"]
---

---
### Simply catch HTTP request

<div>

[webhook.site](https://webhook.site)

</div>

<br>

---

### Catch HTTP request and host a web server 

{{< tab set1 tab1 active >}}serveo.net{{< /tab >}}
{{< tab set1 tab2 >}}ngrok{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Start a local HTTP server
python3 -m http.server 3000
```

```bash
# Redirect http request to localhost:3000
ssh -R 80:localhost:3000 serveo.net
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
ngrok http 80
```

<small>*Ref: [ngrok](https://ngrok.com)*</small>
<br>
<small>*Note: ngrok free will show a warning message and require user accpet to proceed*</small>
<br>
<small>*Note: Not good for XSS*</small>

</div>

{{< /tabcontent >}}

<br>