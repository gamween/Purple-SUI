module creator_seal::bounty {
    use sui::coin::{Coin, split, value};
    use sui::sui::SUI;
    use sui::event;

    public struct Bounty has key, store {
        id: UID,
        bounty_id: u64, // ID métier pour référence frontend
        dev: address,
        streamer: address,
        reward: u64,
        state: u8,
    }

    public struct BountyAcceptedEvent has copy, drop, store {
        bounty_id: u64,
        streamer: address,
    }

    public struct BountyCompletedEvent has copy, drop, store {
        bounty_id: u64,
        dev: address,
        streamer: address,
    }

    /// Crée un bounty
    public fun create_bounty(
        bounty_id: u64,
        dev: address,
        streamer: address,
        reward: Coin<SUI>,
        ctx: &mut TxContext
    ): Bounty {
        let amount = value(&reward);
        sui::transfer::public_transfer(reward, dev);
        Bounty { 
            id: object::new(ctx),
            bounty_id, 
            dev, 
            streamer, 
            reward: amount, 
            state: 0 
        }
    }

    /// Accepte un bounty
    public fun accept_bounty(
        bounty: &mut Bounty,
        streamer: address
    ) {
        assert!(bounty.streamer == streamer, 1);
        bounty.state = 1;
        event::emit(BountyAcceptedEvent {
            bounty_id: bounty.bounty_id,
            streamer
        });
    }

    /// Complète un bounty avec paiement
    public fun complete_bounty(
        bounty: &mut Bounty,
        dev: address,
        coin_vault: &mut Coin<SUI>,
        streamer: address,
        _ctx: &mut sui::tx_context::TxContext
    ) {
        assert!(bounty.state == 1, 42);
        assert!(bounty.dev == dev && bounty.streamer == streamer, 43);

        bounty.state = 2;
        let reward_coin = split(coin_vault, bounty.reward, _ctx);
        sui::transfer::public_transfer(reward_coin, streamer);
        event::emit(BountyCompletedEvent {
            bounty_id: bounty.bounty_id,
            dev,
            streamer
        });
    }
}
