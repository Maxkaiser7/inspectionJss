#!/bin/bash
# Script pour builder l'APK tablette avec EAS sans JAVA_HOME local

# 1️⃣ Aller dans le dossier du projet
cd "$(dirname "$0")"

# 2️⃣ Supprimer temporairement JAVA_HOME pour ce build
env -u JAVA_HOME eas build --platform android --profile tablet-test
