import pg from 'pg'
import { Connector, IpAddressTypes, AuthTypes } from '@google-cloud/cloud-sql-connector'
import { drizzle } from 'drizzle-orm/node-postgres'

import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

const { Pool } = pg

interface DatabaseOptionsWithIAM {
  type: 'iam'
  connectionName: string
  isPrivateIp: boolean
  database: string
  user: string
}
interface DatabaseOptionsWithURL {
  type: 'url'
  url: string
}
type DatabaseOptions = DatabaseOptionsWithIAM | DatabaseOptionsWithURL

let cachedDatabaseClient: NodePgDatabase | null = null

async function prepareDatabaseClient(): Promise<void> {
  if (cachedDatabaseClient) return
  cachedDatabaseClient = await getDatabaseClientWithRuntimeConfig()
}

async function getCachedDatabaseClient(): Promise<NodePgDatabase> {
  if (cachedDatabaseClient) return cachedDatabaseClient
  cachedDatabaseClient = await getDatabaseClientWithRuntimeConfig()
  return cachedDatabaseClient
}

async function getDatabaseClient(options: DatabaseOptions): Promise<NodePgDatabase> {
  const dbConfig = await getDatabaseConfig(options)
  const pool = new Pool(dbConfig)
  const client = drizzle({ client: pool })

  return client
}

async function getDatabaseClientWithRuntimeConfig(): Promise<NodePgDatabase> {
  const runtimeConfig = useRuntimeConfig()
  const options: DatabaseOptions = runtimeConfig.cloudsql.connectionName
    ? {
        type: 'iam',
        connectionName: runtimeConfig.cloudsql.connectionName,
        isPrivateIp: runtimeConfig.cloudsql.isPrivateIp,
        database: runtimeConfig.cloudsql.database,
        user: runtimeConfig.cloudsql.user,
      }
    : {
        type: 'url',
        url: runtimeConfig.postgres.url,
      }

  const dbConfig = await getDatabaseConfig(options)
  const pool = new Pool(dbConfig)
  const client = drizzle({ client: pool })
  return client
}

async function getDatabaseConfig(options: DatabaseOptions): Promise<pg.PoolConfig> {
  let dbConfig: pg.PoolConfig

  if (options.type === 'iam') {
    const {
      connectionName,
      isPrivateIp,
      database,
      user,
    } = options
    const connector = new Connector()
    const clientOpts = await connector.getOptions({
      instanceConnectionName: connectionName,
      ipType: isPrivateIp ? IpAddressTypes.PRIVATE : IpAddressTypes.PUBLIC,
      authType: AuthTypes.IAM,
    })

    dbConfig = {
      ...clientOpts,
      user: user,
      database: database,
    }
  }
  else {
    const { url } = options
    dbConfig = {
      connectionString: url,
    }
  }

  return dbConfig
}

export {
  getDatabaseClient,
  getDatabaseClientWithRuntimeConfig,
  getDatabaseConfig,
  prepareDatabaseClient,
  getCachedDatabaseClient,
}
