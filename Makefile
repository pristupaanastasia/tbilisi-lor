.PHONY: deploy logs

# Адрес сервера лежит в deploy.local.mk (не в git): SERVER = root@<ip>
-include deploy.local.mk
REMOTE_DIR := /opt/tbilisi-lor
# По IP без домена: make deploy DOMAIN=
DOMAIN ?= tbilisi-lor.com

deploy:
	@test -n "$(SERVER)" || { echo "создай deploy.local.mk с SERVER = root@<ip>"; exit 1; }
	ssh $(SERVER) 'mkdir -p $(REMOTE_DIR)/site'
	rsync -az --delete --exclude 'drafts-*' index.html style.css robots.txt sitemap.xml js $(SERVER):$(REMOTE_DIR)/site/
	rsync -az deploy/Caddyfile deploy/docker-compose.yml $(SERVER):$(REMOTE_DIR)/
	ssh $(SERVER) 'cd $(REMOTE_DIR) && printf "SITE_ADDRESS=$(if $(DOMAIN),$(DOMAIN),:80)\nWWW_ADDRESS=$(if $(DOMAIN),www.$(DOMAIN),http://www.localhost)\n" > .env && docker compose up -d && docker compose restart caddy'

logs:
	ssh $(SERVER) 'cd $(REMOTE_DIR) && docker compose logs --tail=50 caddy'

