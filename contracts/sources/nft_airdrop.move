module creator_seal::nft_airdrop {

    /// Adresse admin autorisée à lancer l'airdrop (adapter selon déploiement)
    /// Adresse administrateur (adapter avant déploiement). Utiliser un littéral @0x...
    const ADMIN_ADDRESS: address = @0x0; // placeholder

    /// NFT d'engagement basique (remplacer par votre design définitif si besoin)
    public struct EngagementNFT has key, store {
        id: sui::object::UID,
        recipient: address,
        score: u64,
    }

    /// Evénement récapitulatif de l'airdrop
    public struct AirdropEvent has copy, drop, store {
        recipients: vector<address>,
        scores: vector<u64>,
        count: u64,
        success: vector<bool>,
    }

    /// Mint d'un NFT (placeholder)
    fun mint_engagement_nft(recipient: address, score: u64, ctx: &mut sui::tx_context::TxContext): EngagementNFT {
        EngagementNFT { id: sui::object::new(ctx), recipient, score }
    }

    /// Batch mint + transfert des NFTs aux destinataires
    public fun batch_airdrop(
        recipients: vector<address>,
        scores: vector<u64>,
        ctx: &mut sui::tx_context::TxContext
    ) {
        // Contrôle d'accès simple
        assert!(sui::tx_context::sender(ctx) == ADMIN_ADDRESS, 100);

        let len = std::vector::length(&recipients);
        assert!(len == std::vector::length(&scores), 101);
        assert!(len > 0, 102);
        assert!(len <= 100, 103); // limite arbitraire

        let mut i = 0;
        let mut success = std::vector::empty<bool>();
        while (i < len) {
            let addr_ref = std::vector::borrow(&recipients, i);
            let sc_ref = std::vector::borrow(&scores, i);
            let addr = *addr_ref;
            let sc = *sc_ref;
            let mut minted = false;
            if (addr != @0x0) { // évite adresse nulle placeholder
                let nft = mint_engagement_nft(addr, sc, ctx);
                sui::transfer::public_transfer(nft, addr);
                minted = true;
            };
            std::vector::push_back(&mut success, minted);
            i = i + 1;
        };

        sui::event::emit(AirdropEvent { recipients, scores, count: len as u64, success });
    }
}
