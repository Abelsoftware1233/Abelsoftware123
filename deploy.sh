#!/bin/bash
set -e

# ===================================================================
# ECHO AI - AUTOMATISCH DEPLOY SCRIPT
# Voor: Abelsoftware123
# Domein: abelsoftware123.abelsoftware123.com
# ===================================================================

DOMAIN="abelsoftware123.abelsoftware123.com"
REPO_URL="https://github.com/Abelsoftware1233/Abelsoftware123.git"
APP_DIR="/opt/echoai"
APP_PORT="8081"
SERVICE_NAME="echoai"
JAR_NAME="registratie-0.0.1-SNAPSHOT.jar"

echo "======================================================"
echo " ECHO AI DEPLOY - Start"
echo "======================================================"

# -------------------------------------------------------------
# 1. JAVA INSTALLEREN (indien nog niet aanwezig)
# -------------------------------------------------------------
if ! command -v java &> /dev/null; then
    echo ">> Java wordt geinstalleerd..."
    apt update
    apt install -y openjdk-17-jdk
else
    echo ">> Java is al geinstalleerd, wordt overgeslagen."
fi

# -------------------------------------------------------------
# 2. GIT INSTALLEREN (indien nog niet aanwezig)
# -------------------------------------------------------------
if ! command -v git &> /dev/null; then
    echo ">> Git wordt geinstalleerd..."
    apt install -y git
fi

# -------------------------------------------------------------
# 3. PROJECT CLONEN OF BIJWERKEN
# -------------------------------------------------------------
echo ">> Project ophalen van GitHub..."
if [ -d "$APP_DIR/repo" ]; then
    echo ">> Bestaande map gevonden, wordt bijgewerkt (git pull)..."
    cd "$APP_DIR/repo"
    git pull
else
    mkdir -p "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR/repo"
    cd "$APP_DIR/repo"
fi

# -------------------------------------------------------------
# 4. PROJECT BOUWEN MET MAVEN
# -------------------------------------------------------------
if ! command -v mvn &> /dev/null; then
    echo ">> Maven wordt geinstalleerd..."
    apt install -y maven
fi

echo ">> Project wordt gebouwd (dit kan even duren)..."
if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw clean package -DskipTests
else
    echo ">> Geen mvnw gevonden, systeem-Maven wordt gebruikt."
    mvn clean package -DskipTests
fi

# -------------------------------------------------------------
# 5. JAR NAAR VASTE PLEK KOPIEREN
# -------------------------------------------------------------
echo ">> Jar-bestand wordt gekopieerd..."
cp "target/${JAR_NAME}" "${APP_DIR}/app.jar"

# -------------------------------------------------------------
# 6. SYSTEMD SERVICE AANMAKEN
# -------------------------------------------------------------
echo ">> Systemd service wordt aangemaakt..."
cat > /etc/systemd/system/${SERVICE_NAME}.service <<EOF
[Unit]
Description=Echo AI Spring Boot Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/java -jar ${APP_DIR}/app.jar
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${SERVICE_NAME}
systemctl restart ${SERVICE_NAME}

echo ">> Wachten tot backend opstart..."
sleep 8
systemctl status ${SERVICE_NAME} --no-pager || true

# -------------------------------------------------------------
# 7. NGINX SERVER BLOCK TOEVOEGEN (raakt bestaande sites niet aan)
# -------------------------------------------------------------
echo ">> Nginx server block wordt aangemaakt voor ${DOMAIN}..."

cat > /etc/nginx/sites-available/${DOMAIN} <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Symlink aanmaken (alleen als hij nog niet bestaat)
if [ ! -L "/etc/nginx/sites-enabled/${DOMAIN}" ]; then
    ln -s /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}
fi

echo ">> Nginx configuratie wordt getest..."
nginx -t

echo ">> Nginx wordt herladen..."
systemctl reload nginx

# -------------------------------------------------------------
# 8. GRATIS SSL VIA LET'S ENCRYPT (CERTBOT)
# -------------------------------------------------------------
if ! command -v certbot &> /dev/null; then
    echo ">> Certbot wordt geinstalleerd..."
    apt install -y certbot python3-certbot-nginx
fi

echo ">> SSL certificaat wordt aangevraagd voor ${DOMAIN}..."
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} --redirect || \
    echo "!! Certbot kon geen certificaat regelen. Waarschijnlijk moet je DNS nog even doorpropageren. Probeer dit later handmatig: sudo certbot --nginx -d ${DOMAIN}"

echo "======================================================"
echo " KLAAR!"
echo " Backend service: systemctl status ${SERVICE_NAME}"
echo " Website zou nu bereikbaar moeten zijn op:"
echo " https://${DOMAIN}"
echo "======================================================"
