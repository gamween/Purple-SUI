module creator_seal::donation_split {
    use sui::coin::{Coin, value, split};
    use sui::sui::SUI;
    use sui::event;

    public struct DonationSplitEvent has copy, drop, store {
        donor: address,
        streamer: address,
        dev: address,
        amount: u64,
        split_ratio: u64,
    }

    /// Effectue le split donation et attribue l'événement au viewer.
    public fun donate_and_split(
        streamer: address,
        dev: address,
        split_ratio: u64,
        mut donation_coin: Coin<SUI>,
        _ctx: &mut sui::tx_context::TxContext
    ) {
        let total = value(&donation_coin);
        let amt_dev = total * split_ratio / 10_000;
        let dev_coin = split(&mut donation_coin, amt_dev, _ctx);

        sui::transfer::public_transfer(dev_coin, dev);
        sui::transfer::public_transfer(donation_coin, streamer);

        event::emit(DonationSplitEvent {
            donor: sui::tx_context::sender(_ctx),
            streamer,
            dev,
            amount: total,
            split_ratio,
        });
    }
}
