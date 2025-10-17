// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegura que .wasm sea tratado como asset (no como código)
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];

module.exports = config;
