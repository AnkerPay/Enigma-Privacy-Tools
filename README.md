# Enigma-Privacy-Tools

## Install
### 1. Install requirements:

Docker Compose version 1.23.2 or higher

Node.js version 10 or higher

```bash
apt update
apt install nvm mc aptitude
apt install build-essential
apt install apt-transport-https ca-certificates curl software-properties-common
nvm install 10.16.2
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
apt update
apt install docker-ce

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

```
### 2. Install discovery-cli
```bash
npm i -g @enigmampc/discovery-cli
```
Start the network — `discovery start`

Stop the network — `discovery stop`

### 3. Install RUST
```bash
curl https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
```

### 4. For init Enigma directory
```bash
discovery init .
```

### 5. Clone code into directory
```bash
git clone https://github.com/AnkerPay/Enigma-Privacy-Tools.git
```
### 6. Run enigma
```bash
discovery compile
discovery migrate
discovery start
```

### 7. Run frontend
```bash
cd client
npm install
npm start
```

API Location: https://localhost:3000/



