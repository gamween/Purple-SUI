# Purple SUI

## Built for DeVinci Sui Hackathon 2025

Purple SUI was developed as part of the DeVinci Sui Hackathon 2025, a competition focused on building practical onchain applications on Sui. We wanted to focus on building innovative creator economy applications. The hackathon challenges developers to leverage Sui's unique capabilities: parallel execution, low latency, and programmable objects; to create real-world solutions. Purple SUI addresses the fundamental problem of creator monetization by making viewer engagement directly rewarding through blockchain-native bounties and NFT rewards.

Beyond creator monetization, Purple SUI serves as a discovery platform for the Sui ecosystem—showcasing promising dApps and GameFi projects through hosted live streams. Each stream highlights Sui-native applications, driving organic traffic and user adoption while educating viewers about Web3 gaming and DeFi opportunities.

## The problem Purple SUI solves

Purple SUI solves the core problem of creator monetization without adding layers of complexity or intermediaries. Most platforms require manual tipping, subscription paywalls, or ad revenue sharing that takes weeks to settle and involves multiple middlemen. Purple SUI is intentionally streamlined: streamers create bounties once (watch milestones, participation goals, chat engagement), and viewers automatically earn NFT rewards when they meet those goals—all settled instantly on-chain with 400ms finality. No payment processors, no revenue share cuts, no manual payouts, no waiting periods. The reward becomes invisible because it is built into the viewing experience itself.

Viewers don't need to understand blockchain—they just watch, engage, and receive collectible NFTs that prove their support and unlock exclusive perks. Streamers get direct funding from their community without platform fees eating into their revenue. Built on Sui's object-centric architecture using Move smart contracts, the platform leverages zkLogin for passwordless onboarding and IPFS (via Pinata) for decentralized NFT metadata storage.

## Challenges we ran into

Building a full-stack Web3 streaming platform with Sui integration presented several learning curves:

- **Sui Smart Contracts**: Learning Move language and Sui's object-centric model for NFT minting and bounty management
- **Twitch Integration**: Implementing OAuth2 Implicit Flow without backend secrets while maintaining security
- **IPFS Metadata**: Orchestrating NFT metadata uploads to Pinata with proper error handling and fallbacks
- **Real-time Verification**: Detecting live stream status from Twitch thumbnails to show accurate "LIVE" badges
- **Wallet UX**: Making zkLogin and traditional wallet connections seamless for non-crypto-native users
- **Transaction Flow**: Coordinating user authentication → wallet connection → NFT minting → on-chain confirmation

The hardest piece was the NFT minting service: creating a backend (Node.js + Express + TypeScript) that securely holds a funded Sui wallet, uploads images to IPFS, generates proper metadata, and mints NFTs to viewer addresses—all while handling errors gracefully and providing clear feedback to users.

## Link to the GitHub Repo

https://github.com/gamween/Purple-SUI

## Live URL

https://purplesui.vercel.app/

## Video presentation

https://youtu.be/qsJLkoj44cQ

## Other Useful Links

- **Twitch Developer Console**: https://dev.twitch.tv/console/apps (Get API credentials for OAuth integration)
- **Pinata IPFS Dashboard**: https://app.pinata.cloud (Manage NFT image hosting and metadata)
- **Sui Testnet Explorer**: https://suiscan.xyz/testnet/home (View transactions and verify NFT mints)

## What is Purple SUI's unique value proposition?

Purple SUI turns any Twitch stream into a direct reward engine powered by Sui blockchain. Streamers define engagement goals once (watch 30min → Bronze NFT, participate in poll → Silver NFT), viewers earn automatically as they engage, and NFTs mint instantly on-chain with full transparency. Unlike platforms that require manual tipping, custody services, or post-stream settlements, Purple SUI is:

- **Trustless**: Move smart contracts execute rewards automatically via Sui's parallel execution model
- **Instant**: 400ms finality means NFTs arrive in seconds, 1000x cheaper than Ethereum ($0.0003 per mint)
- **Transparent**: All bounties and mints are auditable on SuiScan with permanent on-chain ownership
- **Creator-first**: 0% platform fees, direct wallet-to-wallet transfers using zkLogin or traditional Sui wallets
- **Ecosystem amplifier**: Hosted streams spotlight Sui dApps and GameFi projects, driving discovery and adoption

The product proves it end-to-end: connect Twitch via OAuth2, create bounty, viewers watch, NFTs mint to their Sui address, and ownership is permanent—no intermediaries, no revenue share, no waiting. The React + Vite frontend communicates with an Express.js backend that orchestrates Sui transactions and IPFS uploads, creating a seamless Web2-to-Web3 bridge.

**Dual Mission:**
1. **Creator Economy**: Monetize streams with blockchain-native rewards
2. **Sui Ecosystem Growth**: Showcase Sui GameFi and dApps through curated live content, educating viewers while they earn

## Who is the target customer?

**Primary**: Mid-tier Twitch streamers (500-10K concurrent viewers) who want direct community monetization without platform cuts. These creators have engaged audiences but earn little from ads or subscriptions.

**Secondary**: 
- Viewers who want proof-of-support collectibles (like concert tickets or event badges)
- Gaming communities organizing tournaments with NFT prizes
- Educational streamers rewarding students for participation
- Brand sponsors wanting transparent ROI on streamer partnerships
- **Sui dApp developers**: Projects seeking user acquisition through Purple SUI's hosted discovery streams

## Who are the closest competitors and how is Purple SUI different?

Closest competitors include:
- **StreamElements/Nightbot**: Loyalty points systems (off-chain, no ownership)
- **Rally.io**: Creator coins (centralized, high fees)
- **Audius (music)**: Streaming + crypto (music-only, no live interaction)

Purple SUI is different because:
1. **On-chain from day 1**: NFTs are real assets stored on Sui, not platform points in a database
2. **0% platform fees**: Direct creator-to-viewer transactions via Sui's native transfer
3. **Live rewards**: Minted during stream using backend-held wallet, not post-event
4. **Multi-platform ready**: Twitch first (via Helix API), but architected for YouTube/Kick/Discord
5. **Ecosystem accelerator**: Only platform doubling as a Sui dApp discovery engine

Where others add crypto *on top of* existing platforms, Purple SUI makes the reward *part of* the viewing experience—invisible to users who don't care about blockchain, valuable to those who do. The Twitch OAuth Implicit Flow ensures non-crypto users onboard in seconds.

## What is the distribution strategy and why?

**Community-first via Twitch streamers:**
1. **Onboard 10 beta streamers** in gaming/art niches with 1K-5K viewers
2. **Viewers discover organically**: One viewer earning NFT → shares in Discord → viral loop
3. **Cross-promote on Farcaster**: Sui ecosystem has strong Farcaster presence
4. **Streamer referrals**: Pay 10% of bounty pool to streamers who refer other streamers
5. **Sui dApp partnerships**: Host bi-weekly "GameFi Spotlight" streams featuring new Sui projects

No paid ads needed—once a viewer earns an NFT, they become an advocate. Network effects are built into the product: every bounty is a billboard for Purple SUI. Hosted discovery streams create a flywheel: viewers earn NFTs → try featured dApps → become Sui users → return for more streams.

**Why Sui?**
- **Speed**: 400ms finality = instant gratification (critical for live streams)
- **Cost**: Sub-cent transactions enable micro-rewards (Bronze/Silver/Gold tiers)
- **zkLogin**: Non-crypto users can participate with Google auth, no seed phrases
- **Ecosystem growth**: Sui is funding builders, positioning for mainstream adoption—Purple SUI accelerates this by converting Twitch viewers into Sui users
