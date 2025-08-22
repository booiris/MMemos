#!/bin/bash

# https://github.com/usememos/memos/blob/v0.24.4/proto/gen/apidocs.swagger.yaml
pnpm dlx swagger-typescript-api generate -p src/api/schema/apiv1activity_serviceproto.yaml -o src/api/schema -n api.ts --add-readonly --single-http-client --unwrap-response-data

rm -rf ./src-tauri/src/api/*

pnpm dlx @openapitools/openapi-generator-cli generate \
  -i src/api/schema/apiv1activity_serviceproto.yaml \
  -g rust \
  -o ./src-tauri/src/api/ \
  --global-property modelDocs=false,apiDocs=false,apiTests=false,modelTests=false,models \
  --skip-validate-spec \
  --additional-properties=packageName=memos_api,packageVersion=1.0.0

mv ./src-tauri/src/api/src/models ./src-tauri/src/api
rm -rf ./src-tauri/src/api/src/

# Replace "use crate::models;" with "use super::super::models;" in all .rs files
echo "Replacing 'use crate::models;' with 'use super::super::models;' in all .rs files..."
find ./src-tauri/src/api -name "*.rs" -type f | while read -r file; do
    # Replace the line containing "use crate::models;" with "use super::super::models;"
    sed -i '' 's/use crate::models;/use super::super::models;/g' "$file"
done

# Generate mod.rs file for models
echo "Generating mod.rs file for models..."

MODELS_DIR="./src-tauri/src/api/models"
MOD_RS_FILE="$MODELS_DIR/mod.rs"

# Remove .rs extension and create pub use statements
echo "// Auto-generated mod.rs file" > "$MOD_RS_FILE"
echo "" >> "$MOD_RS_FILE"

# Find all .rs files in models directory and generate pub use statements
find "$MODELS_DIR" -name "*.rs" -type f | while read -r file; do
    # Get just the filename without path and extension
    filename=$(basename "$file" .rs)
    
    # Skip mod.rs itself
    if [ "$filename" != "mod" ]; then
        echo "pub mod $filename;" >> "$MOD_RS_FILE"
        echo "pub use self::$filename::*;" >> "$MOD_RS_FILE"
    fi
done

echo "#![allow(dead_code)]
#![allow(unused_imports)]
#![allow(clippy::empty_docs)]
#![allow(non_snake_case)]
pub mod models;" >> "./src-tauri/src/api/mod.rs"

echo "mod.rs file generated successfully at: $MOD_RS_FILE"

