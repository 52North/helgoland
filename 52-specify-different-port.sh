#!/bin/sh
#
# This script changes the port in the nginx configuration. MUST be in sync with the exposed port.
#
set -e
#
if [ -z "${PORT}" ]; then
   echo "ENV PORT not set. Using default: '80'"
   PORT=80
fi
sed --in-place "s/PORT/$PORT/g" /etc/nginx/conf.d/default.conf
