module creator_seal::nft {
    use std::string::{Self, String};

    /// NFT personnalisé avec métadonnées
    public struct CustomNFT has key, store {
        id: sui::object::UID,
        name: String,
        description: String,
        image_url: String,
        creator: address,
    }

    /// Evénement de mint
    public struct MintEvent has copy, drop {
        nft_id: address,
        name: String,
        recipient: address,
        image_url: String,
    }

    /// Mint un NFT personnalisé et le transfert au destinataire
    public entry fun mint_nft(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        recipient: address,
        ctx: &mut sui::tx_context::TxContext
    ) {
        let sender = sui::tx_context::sender(ctx);
        let uid = sui::object::new(ctx);
        let nft_id = sui::object::uid_to_address(&uid);

        let nft = CustomNFT {
            id: uid,
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
            creator: sender,
        };

        // Emit event
        sui::event::emit(MintEvent {
            nft_id,
            name: nft.name,
            recipient,
            image_url: nft.image_url,
        });

        // Transfer to recipient
        sui::transfer::public_transfer(nft, recipient);
    }

    /// Getters pour les métadonnées
    public fun get_name(nft: &CustomNFT): String {
        nft.name
    }

    public fun get_description(nft: &CustomNFT): String {
        nft.description
    }

    public fun get_image_url(nft: &CustomNFT): String {
        nft.image_url
    }

    public fun get_creator(nft: &CustomNFT): address {
        nft.creator
    }
}
