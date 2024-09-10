---
title: "AWS"
date: 2024-7-21
tags: ["aws", "cloud", "s3"]
---

---
### Setup

<div>

```bash
# Install awscli
sudo apt install awscli
```

```bash
# Set config
aws configure
```

```
AWS Access Key ID [None]: test
AWS Secret Access Key [None]: test
Default region name [None]: test
Default output format [None]:
```

</div>

### Default AWS Credential Location

<div>

```bash
~/.aws/credentials
```

</div>

<br>

---

### AWS Services

{{< tab set1 tab1 active >}}S3{{< /tab >}}
{{< tab set1 tab2 >}}dynamodb{{< /tab >}}
{{< tab set1 tab3 >}}lambda{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# List buckets
aws s3 --endpoint-url http://s3.example.com ls
```

```bash
# List bucket
aws s3 --endpoint-url http://s3.example.com ls s3://<BUCKET_NAME>
```

```bash
# Upload to bucket
aws s3 --endpoint-url http://s3.example.com cp <FILE> s3://<BUCKET_NAME>/<FILE>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# List tables
aws --endpoint-url http://s3.example.com dynamodb list-tables
```

```bash
# Dump table
aws --endpoint-url http://s3.example.com dynamodb scan --table-name <TABLE_NAME>
```

```bash
# Create table (e.g. with column 'title' and 'content')
aws --endpoint-url http://s3.example.com dynamodb create-table --table-name <TABLE_NAME> --attribute-definitions AttributeName=title,AttributeType=S AttributeName=content,AttributeType=S --key-schema AttributeName=title,KeyType=HASH AttributeName=content,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5
```

```bash
# Add item to table
aws --endpoint-url http://s3.example.com dynamodb put-item --table-name <TABLE_NAME> --item '{"title":{"S":"<TITLE>"},"content":{"S":"<CONTENT>"}}'
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Basic

<div>

```bash
# List functions
aws lambda list-functions --endpoint-url http://s3.example.com
```

```bash
# Check a function
aws lambda get-function --function-name=<FUNC_NAME> --endpoint-url=http://s3.example.com
```

</div>

#### Create a function (e.g. NodeJS)

<div>

```js
exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  return context.logStreamName
}
```

<br>

```bash
zip index.zip index.js
```

```bash
# Create a function
aws lambda create-function --function-name <FUNC_NAME> --zip-file fileb://index.zip --role arn:aws:iam::123456789012:role/lambda-role --endpoint-url http://s3.example.com --handler index.handler --runtime nodejs12.x
```

```bash
# Invoke function test
aws lambda invoke --function-name <FUNC_NAME> --endpoint-url http://s3.example.com result.json
```

```bash
# Check result
cat result.json
```

</div>

{{< /tabcontent >}}

<br>
