#!/bin/bash

# https://memos.apidocumentation.com/reference -> Download OpenAPI Document
npx swagger-typescript-api generate -p src/api/schema/apiv1activity_serviceproto.yaml -o src/api/schema -n api.ts --add-readonly --single-http-client --unwrap-response-data