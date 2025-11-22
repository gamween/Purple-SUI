module counter::streaming {
    use std::option::Option;

    public struct Creator has store {
        creator_address: address,
        username: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        total_streams: u64
    }

    public struct LiveStreaming has store {
        id: u64,
        creator_address: address,
        started_at: u64,
        ended_at: Option<u64>,
        viewers: u64,
        ipfs_cid: vector<u8>
    }
}
