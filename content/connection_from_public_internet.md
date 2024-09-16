---
title: "Connection from Public Internet"
date: 2024-6-26
tags: ["file transfer", "public ip", "ngrok", "serveo", "webhook", "xss", "xxe"]
---

### Simply catch HTTP request

[webhook.site](https://webhook.site)

---

### Catch HTTP request and host a web server 

{{< tab set1 tab1 active >}}serveo.net{{< /tab >}}
{{< tab set1 tab2 >}}ngrok{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Start a local HTTP server
python3 -m http.server <LOCAL_PORT>
```

```console
# Redirect http request to localhost:<LOCAL_PORT>
ssh -R 80:localhost:<LOCAL_PORT> serveo.net
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
ngrok http 80
```

<small>*Ref: [ngrok](https://ngrok.com)*</small>
<br>
<small>*Note: ngrok free will show a warning message and require user accpet to proceed*</small>
<br>
<small>*Note: Not good for XSS*</small>

{{< /tabcontent >}}
