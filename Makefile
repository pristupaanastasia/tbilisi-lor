.PHONY: deploy logs test check-secrets hooks

# Адрес сервера лежит в deploy.local.mk (не в git): SERVER = root@<ip>
-include deploy.local.mk
REMOTE_DIR := /opt/tbilisi-lor
# По IP без домена: make deploy DOMAIN=
DOMAIN ?= tbilisi-lor.com

deploy:
	@test -n "$(SERVER)" || { echo "создай deploy.local.mk с SERVER = root@<ip>"; exit 1; }
	ssh $(SERVER) 'mkdir -p $(REMOTE_DIR)/site'
	@# версия в ссылках на CSS/JS сбрасывает кэш браузеров после каждой выкладки
	mkdir -p .build && sed "s/__V__/$$(git rev-parse --short HEAD)-$$(date +%s)/g" index.html > .build/index.html
	rsync -az --delete --exclude 'drafts-*' .build/index.html style.css robots.txt sitemap.xml js $(SERVER):$(REMOTE_DIR)/site/
	rsync -az deploy/Caddyfile deploy/docker-compose.yml $(SERVER):$(REMOTE_DIR)/
	ssh $(SERVER) 'cd $(REMOTE_DIR) && printf "SITE_ADDRESS=$(if $(DOMAIN),$(DOMAIN),:80)\nWWW_ADDRESS=$(if $(DOMAIN),www.$(DOMAIN),http://www.localhost)\n" > .env && docker compose up -d && docker compose restart caddy'

logs:
	ssh $(SERVER) 'cd $(REMOTE_DIR) && docker compose logs --tail=50 caddy'


# Тесты: node --test, покрытие строк в js/ должно быть не ниже 70%
test:
	node --test --experimental-test-coverage --test-coverage-include='js/**' --test-coverage-lines=70 'test/*.test.js'

# Проверка уходящих коммитов на секреты, IP и запретные файлы
check-secrets:
	node scripts/check-secrets.js < /dev/null

# Подключить git-хуки из .githooks (pre-push: check-secrets + test)
hooks:
	git config core.hooksPath .githooks
	@echo "✔ хуки подключены: перед пушем запускаются check-secrets и test"
