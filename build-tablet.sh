#!/bin/bash
# Script pour builder l'APK tablette sans JAVA_HOME
env -u JAVA_HOME eas build --platform android --profile tablet-test
chmod +x build-tablet.sh
