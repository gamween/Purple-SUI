module counter::streaming {
    use std::option::Option;
    use sui::event::emit;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    public struct Creator has store { // info about a content creator
        creator_address: address,
        username: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        total_streams: u64
    }

    public struct LiveStreaming has store { // info about a live streaming session
        id: u64,
        creator_address: address,
        started_at: u64,
        ended_at: Option<u64>,
        viewers: u64,
        ipfs_cid: vector<u8>
    }

    public struct CreatorRegistry has key { // to store all creators
        creators: vector<Creator>,
        sessions: vector<LiveStreaming>,
    }

    public struct RegisterCreatorEvent has copy, drop { // event emitted when a creator registers
        creator_address: address,
        username: vector<u8>
    }

    public struct LiveEvent has copy, drop { // event emitted when a live starts or ends
        creator_address: address,
        session_id: u64,
        event_type: u8  // 0=start, 1=end
    }

    public fun init(ctx: &mut TxContext) { // initialize the module for an account
        let registry = CreatorRegistry { 
            creators: vector::empty<Creator>(), 
            sessions: vector::empty<LiveStreaming>() 
        };
        transfer::share_object(registry);
    }

    public entry fun register_creator( // register as a content creator
        registry: &mut CreatorRegistry,
        username : vector<u8>,
        bio : vector<u8>,
        avatar_url : vector<u8>,
        ctx: &mut TxContext
    ){
        let creator_address = tx_context::sender(ctx);
        let  creator = Creator {
            creator_address,
            username,
            bio,
            avatar_url,
            total_streams: 0
        };
        vector::push_back(&mut registry.creators, creator);

        emit(RegisterCreatorEvent {
            creator_address,
            username,
        });
    }

    public entry fun start_live( // start a live streaming session
        registry: &mut CreatorRegistry,
        ipfs_cid : vector<u8>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext
    ){
        let creator_address = tx_context::sender(ctx);
        let session_id = vector::length(&registry.sessions);
        let session = LiveStreaming {
            id : session_id,
            creator_address,
            started_at: sui::clock::timestamp_ms(clock),
            ended_at : std::option::none(),
            viewers : 0,
            ipfs_cid
        };
        vector::push_back(&mut registry.sessions, session);

        emit(LiveEvent {
            creator_address,
            session_id,
            event_type: 0,
        });
    }

    public entry fun end_live( // end a live streaming session
        registry: &mut CreatorRegistry,
        session_id : u64,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext
    ){
        let creator_address = tx_context::sender(ctx);
        let session = vector::borrow_mut(&mut registry.sessions, session_id);
        session.ended_at = std::option::some(sui::clock::timestamp_ms(clock));

        emit(LiveEvent {
            creator_address,
            session_id,
            event_type: 1,
        });
    }

    public entry fun track_watch_time( // track watch time for a viewer
        _viewer: address,
        _session_id: u64,
        _seconds: u64
    ) {
        // A implémenter selon ta gestion des profils viewers + rewards
        // Tu pourrais stocker dans un mapping de viewers → heures vues selon le live
    }
    
}
