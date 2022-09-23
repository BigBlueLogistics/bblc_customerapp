# How to run the project with docker

**Execute command of running container**

```bash
docker exec -it <container ID> /bin/bash
```

**Build images**

```bash
docker-compose -f ./docker-compose-dev.yml build --build-arg OWNER_NAME=$(whoami) --build-arg OWNER_ID=$(id -u)
```

**_Run images_**

**Uses interactive process**

```bash
docker-compose -f ./docker-compose-dev.yml up
```

**Uses detached process**

```bash
docker-compose -f ./docker-compose-dev.yml up -d
```
