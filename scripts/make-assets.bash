#!/usr/bin/env bash

RUSKIN_ROOT=".."
TMP_DIR="$(mktemp -d -t 'ruskin')"

echo "Temporary directory: $TMP_DIR"

mkdir -p ${TMP_DIR}/web

echo "Copying XML"
cp -r ${RUSKIN_ROOT}/_xml/_Completed ${TMP_DIR}/web/xml

echo "Copying PHP and HTML"
cp -r ${RUSKIN_ROOT}/gen/_xml/_Completed ${TMP_DIR}/web/pages
rsync -a ${RUSKIN_ROOT}/gen/_xml/_In_Process/essays/. ${TMP_DIR}/web/pages/essays

cp ${RUSKIN_ROOT}/src/config_production.json.php ${TMP_DIR}/web/pages/config.json.php
cp ${RUSKIN_ROOT}/src/composer.json ${TMP_DIR}/web/pages
cp ${RUSKIN_ROOT}/src/header.inc.php ${TMP_DIR}/web/pages
cp ${RUSKIN_ROOT}/src/style.php ${TMP_DIR}/web/pages
cp -r ${RUSKIN_ROOT}/src/layout_includes ${TMP_DIR}/web/pages

rsync -a ${RUSKIN_ROOT}/_xml/_In_Process/essays/. ${TMP_DIR}/web/xml/essays

echo "Copying images"
cp -r ${RUSKIN_ROOT}/_Resources/images ${TMP_DIR}/web/images
ln -s ../images ${TMP_DIR}/web/pages/images

echo "Copying styles"
cp -r ${RUSKIN_ROOT}/_Resources/css_styles ${TMP_DIR}/web/styles

echo "Copying JavaScript files"
cp -r ${RUSKIN_ROOT}/src/js ${TMP_DIR}/web/pages


rm -rf build
mv ${TMP_DIR} build

echo "All done."
