#!/bin/bash
cd /home/kavia/workspace/code-generation/accessory-delivery-platform-209640-209651/frontend_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

