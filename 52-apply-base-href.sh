#!/bin/sh
#
# Script to move the helgoland code into the correct subfolder to match
# the required base href.
#
set -e
DEFAULT_BASE_HREF=/
LOCK_FILE=/base_href_applied
if [ -f "${LOCK_FILE}" ]; then
    echo "Base href already applied. Updates are not possible"
    exit 0
fi
if [ -z "${BASE_HREF}" ] || [ "${BASE_HREF}" = "${DEFAULT_BASE_HREF}" ]; then
   echo "Using default base href: '$DEFAULT_BASE_HREF'"
   BASE_HREF=$DEFAULT_BASE_HREF
   sed --in-place "s@BASE_HREF@${BASE_HREF}@g" "/etc/nginx/conf.d/default.conf"
   exit 0
fi
echo "Base Href '${BASE_HREF}' is not default and not applied"
# TODO
# check for "/" at beginning and end
mv --verbose /usr/share/nginx/html /tmp/helgo
mkdir --verbose --parents /usr/share/nginx/html
mv --verbose /tmp/helgo "/usr/share/nginx/html${BASE_HREF}"
sed --in-place "s@base href=\"/\"@base href=\"${BASE_HREF}\"@g" "/usr/share/nginx/html${BASE_HREF}index.html"
sed --in-place "s@BASE_HREF@${BASE_HREF}@g" "/etc/nginx/conf.d/default.conf"
touch ${LOCK_FILE}
echo "Base href application done"
