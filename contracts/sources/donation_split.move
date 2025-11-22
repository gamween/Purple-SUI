module creator_seal::donation_split {
    use sui::coin::{Coin, value, split};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::event;
    use sui::tx_context;

    public struct DonationSplitEvent has copy, drop, store {
        donor: address,
        streamer: address,
        dev: address,
        amount: u64,
        split_ratio: u64,
    }

    public struct SupporterNFT has store {
        owner: address,
        streamer: address,
        amount: u64,
    }

    /// Effectue le split donation et attribue l'événement + base NFT au viewer.
    public entry fun donate_and_split(
        streamer: address,
        dev: address,
        split_ratio: u64,
        donation_coin: Coin<SUI>,
        ctx: &mut tx_context::TxContext
    ) {
        let total = value(&donation_coin);
        let amt_dev = total * split_ratio / 10_000;
        let dev_coin = split(&mut donation_coin, amt_dev);

        transfer::public_transfer(dev_coin, dev);
        transfer::public_transfer(donation_coin, streamer);

        event::emit(DonationSplitEvent {
            donor: tx_context::sender(ctx),
            streamer,
            dev,
            amount: total,
            split_ratio,
        });

        let nft = SupporterNFT {
            owner: tx_context::sender(ctx),
            streamer,
            amount: total,
        };
        // Option: stocker/mint NFT, ici tu ne le publishes pas encore sur-chain
        // pour le mint réel, tu peux utiliser un vecteur, table, ou le publier depuis un module NFT externe
    }
}
