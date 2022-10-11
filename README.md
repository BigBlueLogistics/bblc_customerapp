## How to run the project with docker

**Execute command of running container**

```bash
docker exec -it <IMAGE NAME> /bin/bash

# using root
docker exec --user root --workdir /root -it <IMAGE NAME> /bin/bash
```

**Build images**

```bash
docker-compose -f ./docker-compose.yml build --build-arg OWNER_NAME=$(whoami) --build-arg OWNER_ID=$(id -u)
```

**_Run images_**

**Uses interactive process**

```bash
docker-compose -f ./docker-compose.yml up
```

**Uses detached process**

```bash
docker-compose -f ./docker-compose.yml up -d
```
