## How to run the project with docker

_Available docker compose config names:_
<br/>
_development: docker-compose.yml </br> production: docker-compose-prod.yml_
<br/>

**Execute command of running container**

```bash
docker exec -it <IMAGE NAME> /bin/bash

# using root
docker exec --user root --workdir /root -it <IMAGE NAME> /bin/bash
```

**Build images**

```bash
docker-compose -f <docker-compose-config-filename> build --build-arg OWNER_NAME=$(whoami) --build-arg OWNER_ID=$(id -u)
```

**_Run images_**

**Uses interactive process**

```bash
docker-compose -f <docker-compose-config-filename> up
```

**Uses detached process**

```bash
docker-compose -f <docker-compose-config-filename> up -d
```

**_Run specific service_**

```bash
# Service names: app = frontend, api = backend
docker-compose -f <docker-compose-config-filename> run <service_name>
```

**SSL Installation**

NOTE: Generate a CSR in Docker host not in docker container itself. [Reference link](https://ph.godaddy.com/help/apache-generate-csr-certificate-signing-request-5269)

```bash
openssl req -new -newkey rsa:2048 -nodes -keyout yourdomain.key -out yourdomain.csr
```
