#!/bin/bash

# 🎨 NFT Minting System - Test Scripts
# Usage: bash test-nft-api.sh

API_URL="https://localhost:3001"

echo "========================================="
echo "🧪 Testing NFT Minting API"
echo "========================================="
echo ""

# Test 1: Health check
echo "1️⃣  Testing health endpoint..."
curl -k "${API_URL}/health" | jq .
echo ""
echo ""

# Test 2: List available designs
echo "2️⃣  Listing available NFT designs..."
curl -k "${API_URL}/api/nft/designs" | jq .
echo ""
echo ""

# Test 3: Mint a single NFT
echo "3️⃣  Minting a single NFT..."
echo "⚠️  Replace RECIPIENT_ADDRESS with a real Sui address"
echo ""

# Example recipient address (replace with real one)
RECIPIENT="0xca1f1d74a4f38335c52a45762004670c2410c0afd2b516e46bd2713b21abd946"

curl -k -X POST "${API_URL}/api/nft/mint" \
  -H "Content-Type: application/json" \
  -d "{
    \"imageName\": \"design1.png\",
    \"recipientAddress\": \"${RECIPIENT}\",
    \"name\": \"Purple SUI Test NFT\",
    \"description\": \"This is a test NFT minted from the Purple SUI platform\"
  }" | jq .

echo ""
echo ""

echo "========================================="
echo "✅ Tests completed!"
echo "========================================="
echo ""
echo "📝 Notes:"
echo "- Make sure you have images in apps/api/nft-designs/"
echo "- Update PINATA_API_KEY and PINATA_SECRET_KEY in .env"
echo "- Replace RECIPIENT_ADDRESS with your test wallet"
echo "- Check transaction on: https://suiscan.xyz/testnet/tx/{digest}"
echo ""
