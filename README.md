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

## Database Schema

### `service`

| Field       | Data Type   | Preference                | Description                                  |
| ----------- | ----------- | ------------------------- | -------------------------------------------- |
| service_id  | `SERIAL`    | `PRIMARY KEY`             | Unique auto incrementing service identifier  |
| sac         | `NUMERIC`   | `NOT NULL`                | Service Accounting Code                      |
| description | `TEXT`      | `NOT NULL`                | SAC Service Description                      |
| cgst        | `NUMERIC`   | `NOT NULL`                | Central Goods and Services Tax Percentage    |
| sgst        | `NUMERIC`   | `NOT NULL`                | State Goods and Services Tax Percentage      |
| igst        | `NUMERIC`   | `NOT NULL`                | Integrated Goods and Services Tax Percentage |
| active      | `BOOLEAN`   | `NOT NULL` `DEFAULT TRUE` | Option to display service as a selection     |
| created_at  | `TIMESTAMP` | `NOT NULL`                | Set when service is created                  |
| updated_at  | `TIMESTAMP` | `NOT NULL`                | Updated every time when values are changed   |

```sql
CREATE TABLE service (
  service_id  SERIAL PRIMARY KEY,
  sac         NUMERIC NOT NULL,
  description TEXT NOT NULL,
  cgst        NUMERIC NOT NULL,
  sgst        NUMERIC NOT NULL,
  igst        NUMERIC NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at  TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_timestamp BEFORE UPDATE
  ON service FOR EACH ROW EXECUTE PROCEDURE
  update_timestamp_column();
```

### `customer`

| Field         | Data Type   | Preference                | Description                                  |
| ------------- | ----------- | ------------------------- | -------------------------------------------- |
| customer_id   | `SERIAL`    | `PRIMARY KEY`             | Unique auto incrementing customer identifier |
| gstin         | `CHAR(15)`  | `NOT NULL`                | Goods and Services Tax Identification Number |
| name          | `TEXT`      | `NOT NULL`                | Customer or Company Name                     |
| address       | `TEXT`      | `NOT NULL`                | Customer or Company Address                  |
| payment_terms | `TEXT`      |                           | Optional terms for bill payment              |
| services      | `INTEGER[]` |                           | Stores `service_id` for selected services    |
| active        | `BOOLEAN`   | `NOT NULL` `DEFAULT TRUE` | Option to display customer as a selection    |
| created_at    | `TIMESTAMP` | `NOT NULL`                | Set when customer is created                 |
| updated_at    | `TIMESTAMP` | `NOT NULL`                | Updated every time when values are changed   |

```sql
CREATE TABLE customer (
  customer_id   SERIAL PRIMARY KEY,
  gstin         CHAR(15) NOT NULL,
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  payment_terms TEXT,
  services      INTEGER[],
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at    TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TRIGGER update_customer_timestamp BEFORE UPDATE
  ON customer FOR EACH ROW EXECUTE PROCEDURE
  update_timestamp_column();

CREATE OR REPLACE FUNCTION upper_gstin_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.gstin = UPPER(NEW.gstin);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER upper_customer_gstin BEFORE INSERT OR UPDATE
  ON customer FOR EACH ROW EXECUTE PROCEDURE
  upper_gstin_column();
```

### `invoice`

| Field         | Data Type   | Preference    | Description                             |
| ------------- | ----------- | ------------- | --------------------------------------- |
| invoice_id    | `TEXT`      | `PRIMARY KEY` | Unique incrementing invoice number      |
| date          | `DATE`      | `NOT NULL`    | Date to be printed on invoice           |
| customer_id   | `INTEGER`   | `NOT NULL`    | Customer identifier                     |
| customer_data | `JSON`      | `NOT NULL`    | Stores data for selected `customer_id`  |
| payment_terms | `TEXT`      | `NOT NULL`    | Optional terms for bill payment         |
| particulars   | `JSON`      | `NOT NULL`    | Collection of rows with text and amount |
| total_amount  | `NUMERIC`   | `NOT NULL`    | Total of amount including taxes         |
| created_at    | `TIMESTAMP` | `NOT NULL`    | Set when invoice is created             |

```sql
CREATE TABLE invoice (
  invoice_id    TEXT PRIMARY KEY,
  date          DATE NOT NULL,
  customer_id   INTEGER NOT NULL,
  customer_data JSON NOT NULL,
  payment_terms TEXT NOT NULL,
  particulars   JSON NOT NULL,
  total_amount  NUMERIC NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT current_timestamp
);
```

### `owner`

| Field           | Data Type   | Preference    | Description                                  |
| --------------- | ----------- | ------------- | -------------------------------------------- |
| owner_id        | `SERIAL`    | `PRIMARY KEY` | Unique auto incrementing owner identifier    |
| name            | `TEXT`      | `NOT NULL`    | Owner Name                                   |
| address         | `TEXT`      | `NOT NULL`    | Owner Address                                |
| phone           | `TEXT`      | `NOT NULL`    | Owner Phone Number                           |
| gstin           | `CHAR(15)`  | `NOT NULL`    | Goods and Services Tax Identification Number |
| optional        | `JSON`      |               | Optional text for invoice header             |
| payment_details | `JSON`      |               | Wire Transfer Payment Details                |
| updated_at      | `TIMESTAMP` | `NOT NULL`    | Updated every time when values are changed   |

```sql
CREATE TABLE owner (
  owner_id        SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  address         TEXT NOT NULL,
  phone           TEXT NOT NULL,
  gstin           CHAR(15) NOT NULL,
  optional        JSON,
  payment_details JSON,
  updated_at      TIMESTAMP NOT NULL DEFAULT current_timestamp
);

INSERT INTO owner (name, address, phone, gstin) VALUES (
  'Company Name',
  'Blg No, Street Name, City Name, State Name, Country Name, Nearby Landmark — Zip Code',
  '+91 12345 6789',
  '27AAAAA0000A1Z5'
);

CREATE TRIGGER update_owner_timestamp BEFORE UPDATE
  ON owner FOR EACH ROW EXECUTE PROCEDURE
  update_timestamp_column();

CREATE TRIGGER upper_owner_gstin BEFORE INSERT OR UPDATE
  ON owner FOR EACH ROW EXECUTE PROCEDURE
  upper_gstin_column();
```

## License

This project is licensed under the [MIT License](https://github.com/harshcut/invoice-kit/blob/main/LICENSE).
