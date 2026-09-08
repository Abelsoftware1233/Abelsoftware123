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
# 4. BESTANDEN OP DE JUISTE PLEK ZETTEN (alleen op de VPS, GitHub blijft ongemoeid)
# -------------------------------------------------------------
echo ">> Bestanden worden gesorteerd naar de Maven-structuur..."

# Oude gesorteerde kopieen weggooien, zodat verwijderde/hernoemde bestanden niet blijven hangen
rm -rf src/main/java/com/abelsoftware123/registratie
rm -rf src/main/resources
mkdir -p src/main/java/com/abelsoftware123/registratie
mkdir -p src/main/resources

# --- Java bestanden die AL in de repo-root staan (jouw eigen controllers/config) ---
JAVA_FILES="UserController.java AdminController.java SecurityConfig.java DataInitializer.java UpdateProfileRequest.java UserProfileDTO.java User.java UserRepository.java UserService.java RegistratieApplication.java"

for f in $JAVA_FILES; do
    if [ -f "$f" ]; then
        cp "$f" "src/main/java/com/abelsoftware123/registratie/$f"
        echo "   java (uit repo): $f"
    fi
done

# --- Basisbestanden die het script zelf aanmaakt als ze nog niet in de repo staan ---
PKG_DIR="src/main/java/com/abelsoftware123/registratie"

if [ ! -f "$PKG_DIR/RegistratieApplication.java" ]; then
cat > "$PKG_DIR/RegistratieApplication.java" << 'JAVAEOF'
package com.abelsoftware123.registratie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RegistratieApplication {
    public static void main(String[] args) {
        SpringApplication.run(RegistratieApplication.class, args);
    }
}
JAVAEOF
    echo "   java (auto-gegenereerd): RegistratieApplication.java"
fi

if [ ! -f "$PKG_DIR/User.java" ]; then
cat > "$PKG_DIR/User.java" << 'JAVAEOF'
package com.abelsoftware123.registratie;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String role = "ROLE_USER";

    private String firstName;
    private String lastName;
    private String profilePictureUrl;

    public User() {}

    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = "ROLE_USER";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return this.passwordHash; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
}
JAVAEOF
    echo "   java (auto-gegenereerd): User.java"
fi

if [ ! -f "$PKG_DIR/UserRepository.java" ]; then
cat > "$PKG_DIR/UserRepository.java" << 'JAVAEOF'
package com.abelsoftware123.registratie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsernameOrEmail(String username, String email);
}
JAVAEOF
    echo "   java (auto-gegenereerd): UserRepository.java"
fi

if [ ! -f "$PKG_DIR/UserProfileDTO.java" ]; then
cat > "$PKG_DIR/UserProfileDTO.java" << 'JAVAEOF'
package com.abelsoftware123.registratie;

public class UserProfileDTO {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
}
JAVAEOF
    echo "   java (auto-gegenereerd): UserProfileDTO.java"
fi

if [ ! -f "$PKG_DIR/UpdateProfileRequest.java" ]; then
cat > "$PKG_DIR/UpdateProfileRequest.java" << 'JAVAEOF'
package com.abelsoftware123.registratie;

public class UpdateProfileRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String newPassword;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
JAVAEOF
    echo "   java (auto-gegenereerd): UpdateProfileRequest.java"
fi

if [ ! -f "$PKG_DIR/UserService.java" ]; then
cat > "$PKG_DIR/UserService.java" << 'JAVAEOF'
package com.abelsoftware123.registratie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerNewUser(String username, String email, String password) {
        if (username == null || username.length() < 3 || password == null || password.length() < 8) {
            throw new RuntimeException("Gebruikersnaam min. 3 tekens, wachtwoord min. 8.");
        }
        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Gebruikersnaam of e-mail al in gebruik.");
        }
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setRole("ROLE_USER");
        userRepository.save(newUser);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Gebruiker niet gevonden.");
        }
        userRepository.deleteById(id);
    }

    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Profiel niet gevonden."));
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        return dto;
    }

    public void updateUserProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden."));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getNewPassword().length() < 8) {
                 throw new RuntimeException("Nieuw wachtwoord moet minimaal 8 tekens lang zijn.");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }
        userRepository.save(user);
    }

    public void createUserByAdmin(String username, String email, String password, String role) {
        if (username == null || username.length() < 3 || password == null || password.length() < 8) {
            throw new RuntimeException("Gebruikersnaam min. 3 tekens, wachtwoord min. 8.");
        }
        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Gebruikersnaam of e-mail al in gebruik.");
        }
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setRole(normalizeRole(role));
        userRepository.save(newUser);
    }

    public void updateUserByAdmin(Long id, String username, String email, String role) {
        User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden."));
        user.setUsername(username);
        user.setEmail(email);
        user.setRole(normalizeRole(role));
        userRepository.save(user);
    }

    public String resetPassword(Long id) {
        User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden."));
        String newPassword = "Echo" + (1000 + (int) (Math.random() * 9000));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return newPassword;
    }

    private String normalizeRole(String role) {
        if (role == null) return "ROLE_USER";
        String upper = role.toUpperCase();
        return upper.startsWith("ROLE_") ? upper : "ROLE_" + upper;
    }
}
JAVAEOF
    echo "   java (auto-gegenereerd): UserService.java"
fi

# --- HTML/CSS/JS bestanden die bij DEZE website horen ---
RESOURCE_FILES="index.html login.html registreer.html admin.html profiel.html profiel-games.html payments.html privacy.html reviews.html ruimte.html uitlegg.html website.html forgot-password.html logout.html bedankt.html application.properties style.css profiel.js registreer-script.js admin-script.js"

for f in $RESOURCE_FILES; do
    if [ -f "$f" ]; then
        cp "$f" "src/main/resources/$f"
        echo "   resource: $f"
    fi
done

echo ">> Bestanden gesorteerd. Originelen in de repo-root blijven ongewijzigd voor GitHub Pages."

# --- Eventuele overige .java bestanden in de root meenemen (oudere/andere controllers) ---
# Hun package-regel wordt geforceerd naar het platte package, zodat alles compileert
# als één geheel, ook als de bestanden oorspronkelijk een andere package hadden.
for f in *.java; do
    [ -e "$f" ] || continue
    if [ ! -f "$PKG_DIR/$f" ]; then
        sed 's/^package .*/package com.abelsoftware123.registratie;/' "$f" > "$PKG_DIR/$f"
        echo "   java (overig, package aangepast): $f"
    fi
done

# -------------------------------------------------------------
# 5. PROJECT BOUWEN MET MAVEN
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
