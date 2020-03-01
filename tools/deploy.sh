#!/bin/sh
yarn
yarn build
sudo rm -r /var/www/html/devtomo/*
sudo cp -r dist/pwa/* /var/www/html/devtomo/
