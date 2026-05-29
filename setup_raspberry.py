#!/usr/bin/env python3
# -*- coding: utf-8 -*-
""" Raspberry Pi WordPress auto-deploy script """

import paramiko
import sys
import io

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '192.168.0.105'
USER = 'wxc'
PASS = '123456'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd, timeout=60):
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if exit_code != 0 and err:
        print(f"  [WARN] ({exit_code}) {err[:200]}")
    return out

def run_script(script_code, timeout=120):
    escaped = script_code.replace("'", "'\\''")
    cmd = f"bash -c '{escaped}'"
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if err:
        print(f"  [WARN] {err[:300]}")
    return out, exit_code

print("=" * 55)
print("  Raspberry Pi WordPress Auto-Deploy")
print("=" * 55)

# === Connect ===
print("\n[1/7] Connecting to Raspberry Pi...")
client.connect(HOST, username=USER, password=PASS, timeout=10)
hostname = run('hostname')
arch = run('uname -m')
print(f"  [OK] Connected: {hostname} | {arch}")

# === Step 1: sudo without password ===
print("\n[2/7] Configuring passwordless sudo...")
run(f"echo '{PASS}' | sudo -S bash -c \"echo '{USER} ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/{USER}\"")
print("  [OK] Passwordless sudo configured")

# === Step 2: Change apt sources ===
print("\n[3/7] Switching apt to Tsinghua mirror...")
run_script(f"""
set -e
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak 2>/dev/null || true
sudo bash -c 'cat > /etc/apt/sources.list <<APTEOC
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ trixie main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ trixie-updates main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ trixie-backports main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security trixie-security main contrib non-free non-free-firmware
APTEOC
sudo bash -c 'cat > /etc/apt/sources.list.d/raspi.list <<RASPI
deb https://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ trixie main
RASPI'
echo 'mirror_ok'
""", timeout=30)
print("  [OK] Tsinghua mirror configured")

# === Step 3: System update ===
print("\n[4/7] Updating system packages...")
print("  (This may take 5-10 minutes...)")
run_script("sudo apt-get update -qq && echo 'update_ok'", timeout=120)
run_script("sudo apt-get upgrade -y -qq 2>&1 | tail -3; echo 'upgrade_done'", timeout=300)
print("  [OK] System updated")

# === Step 4: Install LAMP ===
print("\n[5/7] Installing LAMP stack (Apache+MariaDB+PHP)...")
print("  (This may take 5-10 minutes...)")
lamp_result, _ = run_script("""
sudo apt-get install -y -qq \
  apache2 \
  mariadb-server \
  php \
  php-mysql \
  php-curl \
  php-gd \
  php-mbstring \
  php-xml \
  php-zip \
  php-json \
  php-intl \
  wget \
  unzip \
  curl 2>&1 | tail -5
echo 'LAMP_DONE'
""", timeout=300)
print("  [OK] LAMP packages installed")

run("sudo systemctl enable apache2 mariadb && sudo systemctl start apache2 mariadb")
php_ver = run("php -v | head -1")
print(f"  [OK] {php_ver}")

# === Step 5: Create WordPress database ===
print("\n[6/7] Creating WordPress database...")

db_pass = "wp_secure_2024"
db_commands = f"""
CREATE DATABASE IF NOT EXISTS wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'wpuser'@'localhost' IDENTIFIED BY '{db_pass}';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
"""
cmd = db_commands.replace('\n', ' ').strip()
run(f"sudo mysql -e \"{cmd}\"", timeout=10)
print(f"  [OK] Database 'wordpress' created")
print(f"  [OK] User 'wpuser' / password: {db_pass}")

# === Step 6: Install WordPress ===
print("\n[7/7] Installing WordPress...")

run_script("""
cd /tmp
wget -q https://wordpress.org/latest.tar.gz
sudo rm -rf /var/www/html/*
sudo tar -xzf latest.tar.gz -C /var/www/html/ --strip-components=1
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
rm -f latest.tar.gz
echo 'WP_DOWNLOADED'
""", timeout=120)

run_script(f"""
sudo cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php
sudo sed -i "s/database_name_here/wordpress/" /var/www/html/wp-config.php
sudo sed -i "s/username_here/wpuser/" /var/www/html/wp-config.php
sudo sed -i "s/password_here/{db_pass}/" /var/www/html/wp-config.php

# Security keys
SALTS=$(curl -s https://api.wordpress.org/secret-key/1.1/salt/)
if [ -n "$SALTS" ]; then
  sudo sed -i '/^require_once.*wp-settings\.php/i '"$SALTS" /var/www/html/wp-config.php
fi
echo 'WP_CONFIG_DONE'
""", timeout=30)

apache_test = run("curl -s -o /dev/null -w '%{http_code}' http://localhost/", timeout=10)
print(f"  [OK] Apache responds: {apache_test}")

# Create info page for testing
run('echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php > /dev/null')

# Get local IP
local_ip = run("ip -4 addr show | grep -oP '(?<=inet\\s)\\d+\\.\\d+\\.\\d+\\.\\d+' | grep -v 127.0.0.1 | head -1")

print("\n" + "=" * 55)
print("  [DONE] Deployment Complete!")
print("=" * 55)
print(f"""
  Local access:  http://{local_ip}/
  Local access:  http://192.168.0.105/

  WordPress Database:
    Database: wordpress
    Username: wpuser
    Password: {db_pass}

  Next steps:
    1. Open http://192.168.0.105/wp-admin/install.php in browser
    2. Set up site title, admin username, and password
    3. Install 'All-in-One WP Migration' plugin if restoring old site
    4. Delete /info.php after testing: sudo rm /var/www/html/info.php

  For external access (port forwarding):
    Use Oray peanut hull: https://www.oray.com/
    Or setup DDNS on your router
""")

client.close()
print("Connection closed.")
