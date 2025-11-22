#!/bin/bash

##############################################
# 🔐 Configuration HTTPS pour Développement Local
# Génère des certificats SSL locaux avec mkcert
##############################################

set -e

echo ""
echo "🔐 Configuration HTTPS pour StreamSUI"
echo "======================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Dossier des certificats
CERT_DIR="./certificates"

# Fonction pour détecter l'OS
detect_os() {
    case "$(uname -s)" in
        Darwin*)    echo "macos";;
        Linux*)     echo "linux";;
        MINGW*|MSYS*|CYGWIN*) echo "windows";;
        *)          echo "unknown";;
    esac
}

OS=$(detect_os)

echo "📋 Système détecté: $OS"
echo ""

# Vérifier si mkcert est installé
check_mkcert() {
    if command -v mkcert &> /dev/null; then
        echo -e "${GREEN}✅ mkcert est déjà installé${NC}"
        mkcert -version
        return 0
    else
        echo -e "${YELLOW}⚠️  mkcert n'est pas installé${NC}"
        return 1
    fi
}

# Installer mkcert selon l'OS
install_mkcert() {
    echo ""
    echo "📦 Installation de mkcert..."
    echo ""
    
    case $OS in
        macos)
            if command -v brew &> /dev/null; then
                echo "Installation via Homebrew..."
                brew install mkcert
                brew install nss # Pour Firefox
            else
                echo -e "${RED}❌ Erreur: Homebrew n'est pas installé${NC}"
                echo "Installe Homebrew: https://brew.sh"
                echo "Puis relance ce script"
                exit 1
            fi
            ;;
        linux)
            if command -v apt-get &> /dev/null; then
                echo "Installation via apt (Ubuntu/Debian)..."
                sudo apt-get update
                sudo apt-get install -y mkcert libnss3-tools
            elif command -v yum &> /dev/null; then
                echo "Installation via yum (CentOS/RHEL)..."
                sudo yum install -y mkcert nss-tools
            elif command -v pacman &> /dev/null; then
                echo "Installation via pacman (Arch)..."
                sudo pacman -S mkcert nss
            else
                echo -e "${RED}❌ Gestionnaire de paquets non supporté${NC}"
                echo "Installe mkcert manuellement: https://github.com/FiloSottile/mkcert"
                exit 1
            fi
            ;;
        windows)
            echo -e "${YELLOW}⚠️  Windows détecté${NC}"
            echo ""
            echo "Installe mkcert via Chocolatey:"
            echo "  choco install mkcert"
            echo ""
            echo "Ou télécharge depuis: https://github.com/FiloSottile/mkcert/releases"
            echo ""
            echo "Puis relance ce script dans Git Bash ou PowerShell"
            exit 1
            ;;
        *)
            echo -e "${RED}❌ OS non supporté: $OS${NC}"
            echo "Installe mkcert manuellement: https://github.com/FiloSottile/mkcert"
            exit 1
            ;;
    esac
}

# Installer le CA root
install_ca() {
    echo ""
    echo "🔑 Installation du certificat root CA..."
    echo ""
    
    mkcert -install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ CA root installé avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors de l'installation du CA${NC}"
        exit 1
    fi
}

# Générer les certificats
generate_certs() {
    echo ""
    echo "📜 Génération des certificats SSL pour localhost..."
    echo ""
    
    # Créer le dossier certificates
    mkdir -p "$CERT_DIR"
    
    # Générer les certificats
    cd "$CERT_DIR"
    mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1
    cd ..
    
    if [ -f "$CERT_DIR/localhost.pem" ] && [ -f "$CERT_DIR/localhost-key.pem" ]; then
        echo -e "${GREEN}✅ Certificats générés avec succès !${NC}"
        echo ""
        echo "📁 Fichiers créés:"
        echo "   - $CERT_DIR/localhost.pem"
        echo "   - $CERT_DIR/localhost-key.pem"
    else
        echo -e "${RED}❌ Erreur lors de la génération des certificats${NC}"
        exit 1
    fi
}

# Vérifier/Créer .env.local
setup_env() {
    echo ""
    echo "⚙️  Configuration des variables d'environnement..."
    echo ""
    
    ENV_FILE=".env.local"
    
    if [ -f "$ENV_FILE" ]; then
        echo -e "${YELLOW}⚠️  $ENV_FILE existe déjà${NC}"
        
        # Vérifier si HTTPS est déjà configuré
        if grep -q "NEXT_PUBLIC_TWITCH_REDIRECT_URI=https" "$ENV_FILE"; then
            echo -e "${GREEN}✅ Variables HTTPS déjà configurées${NC}"
        else
            echo ""
            echo "Mise à jour recommandée de $ENV_FILE:"
            echo ""
            echo "# Twitch OAuth (HTTPS)"
            echo "NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback"
            echo "NEXT_PUBLIC_BASE_URL=https://localhost:3000"
            echo ""
            echo -e "${YELLOW}⚠️  N'oublie pas de mettre à jour Twitch Console avec l'URL HTTPS !${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  $ENV_FILE n'existe pas${NC}"
        echo ""
        echo "Crée-le avec les variables HTTPS:"
        echo ""
        echo "NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback"
        echo "NEXT_PUBLIC_BASE_URL=https://localhost:3000"
    fi
}

# Message final
show_final_instructions() {
    echo ""
    echo "=============================================="
    echo -e "${GREEN}🎉 Configuration HTTPS terminée !${NC}"
    echo "=============================================="
    echo ""
    echo "📝 Prochaines étapes:"
    echo ""
    echo "1. Mets à jour .env.local avec:"
    echo "   NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback"
    echo ""
    echo "2. Configure Twitch Developer Console:"
    echo "   https://dev.twitch.tv/console/apps"
    echo "   Redirect URI: https://localhost:3000/auth/twitch/callback"
    echo ""
    echo "3. Lance le serveur HTTPS:"
    echo -e "   ${GREEN}pnpm dev:https${NC}"
    echo ""
    echo "4. Ouvre ton navigateur:"
    echo "   https://localhost:3000"
    echo ""
    echo "⚠️  Note: Si tu vois un avertissement de certificat,"
    echo "   clique sur 'Avancé' puis 'Continuer vers localhost'"
    echo "   (Le certificat est auto-signé mais sécurisé)"
    echo ""
    echo "=============================================="
}

# Exécution principale
main() {
    echo "🔍 Vérification de mkcert..."
    
    if ! check_mkcert; then
        read -p "Installer mkcert maintenant? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_mkcert
            if ! check_mkcert; then
                echo -e "${RED}❌ Erreur: mkcert non installé après tentative${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}⚠️  Installation annulée${NC}"
            echo "Installe mkcert manuellement: https://github.com/FiloSottile/mkcert"
            exit 0
        fi
    fi
    
    # Installer le CA
    install_ca
    
    # Générer les certificats
    generate_certs
    
    # Configurer .env
    setup_env
    
    # Instructions finales
    show_final_instructions
}

# Lancer le script
main
