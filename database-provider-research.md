# Free database provider research

## Recommendation
TiDB Cloud Starter is a practical free MySQL-compatible option for a Render-hosted Node/Drizzle backend.

## Verified facts from official documentation
- TiDB Cloud Starter is MySQL-compatible and has a free quota without requiring a credit card to get started.
- The documented free quota is 5 GiB row-based storage, 5 GiB columnar storage, and 50 million Request Units per month per qualifying free instance.
- A Starter instance can be created from the TiDB Cloud console via My TiDB -> Create Resource, selecting the Starter plan, name, cloud provider, and region.
- The public endpoint connection workflow is supported for Starter instances. TiDB generates a username prefix; connection usernames must include that prefix, and the documented port is 4000.
- Free Starter instances have limits, including possible connection termination after long idle/open periods and a monthly concurrent connection limit; application connection pools should use a short maximum connection lifetime.

## Sources
- https://docs.pingcap.com/tidbcloud/select-cluster-tier/
- https://docs.pingcap.com/tidbcloud/create-tidb-cluster-serverless/
- https://docs.pingcap.com/tidbcloud/serverless-limitations/
- https://www.pingcap.com/tidb-cloud-starter-pricing-details/
- https://docs.pingcap.com/tidbcloud/connect-via-standard-connection-serverless/

## Connection workflow
Use the TiDB Cloud console’s Connect dialog, keep Connection Type as Public, generate and securely save the password if needed, and copy the provider-generated connection string. Starter uses the shared public endpoint model and its generated username prefix must remain intact. The connection string should be copied exactly into Render’s DATABASE_URL, including its host, port, username, password, and TLS parameters.
