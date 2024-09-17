---
title: "Connection from Public Internet"
date: 2024-6-26
tags: ["Web Exploitation", "Http File Transfer", "Remote File Inclusion", "XSS", "File Transfer", "Public Ip", "Ngrok", "Serveo", "Webhook", "XXE"]
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
