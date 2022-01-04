# Getting Started

Invoice Kit is a tax invoice generator with customer, service, and invoice masters. The database used is a Supabase PostgreSQL container self-hosted on Docker.

## Developing

Fork the repository using [this](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) guide, then clone it locally.

```shell
git clone https://github.com/harshcut/invoice-kit
cd invoice-kit
yarn install
cp .env.local.example .env.local
```

## Initializing with Docker

Docker is the easiest way to get started with self-hosted Supabase. Checkout the docker directory in the [Supabase](https://github.com/supabase/supabase) repository.

```shell
git clone --depth 1 https://github.com/supabase/supabase.git
cd ./supabase/docker
cp .env.example .env
docker-compose up
```

To initialize the Supabase Client we use the `createClient()` method from Supabase. You will need the `KONG_HTTP_PORT` and the `ANON_KEY` from `.env`. Add these values in `.env.local` for `invoice-kit`.

```shell
# Docker Supabase Connection
NEXT_PUBLIC_KONG_HTTP_PORT=
NEXT_PUBLIC_ANON_KEY=
```

To request data from the database we use the built-in Supabase methods. The documentation relating to these functions can be found [here](https://supabase.com/docs/reference/javascript/select). Note that some of the methods relating to `storage-api` might not work.

### Failing Peer Authentication

When connecting to the PostgreSQL service within Docker CLI you might encounter `FATAL: Peer authentication failed for user "postgres"`. To fix this issue update the `pg_hba.conf` file within `/etc/postgresql`. The location of this file isn't very consistent.

```bash
cd /etc/postgresql
apt update
apt install nano
nano pg_hba.conf
```

Change the following line within `pg_hba.conf` and restart the container.

```diff
- local   all             postgres                                peer
+ local   all             postgres                                md5
```

## License

This project is licensed under the [MIT License](https://github.com/harshcut/invoice-kit/blob/main/LICENSE).
