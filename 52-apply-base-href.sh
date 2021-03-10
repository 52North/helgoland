#!/bin/sh
#
# Script to move the helgoland code into the correct subfolder to match
# the required base href.
#
set -e
DEFAULT_BASE_HREF=/
if [ -z "${BASE_HREF}" ]; then
   echo "ENV BASE_HREF not set. Using default: '$DEFAULT_BASE_HREF'"
   exit 0
fi
if [ "${BASE_HREF}" = "${DEFAULT_BASE_HREF}" ]; then
    echo "Base Href is default '${BASE_HREF}'"
    exit 0
fi
if [ -d "/usr/share/nginx/html${BASE_HREF}" ]; then
    echo "Base href '${BASE_HREF}' already applied: '/usr/share/nginx/html${BASE_HREF}'"
    exit 0
fi
echo "Base Href is not default and not applied"
# TODO
# check for "/" at beginning and end
echo "Using configured base href: '${BASE_HREF}'"
mv --verbose /usr/share/nginx/html /tmp/helgo
mkdir --verbose --parents /usr/share/nginx/html
mv --verbose /tmp/helgo "/usr/share/nginx/html${BASE_HREF}"
sed --in-place "s@base href=\"/\"@base href=\"${BASE_HREF}\"@g" "/usr/share/nginx/html${BASE_HREF}index.html"
echo "Base href application done"
