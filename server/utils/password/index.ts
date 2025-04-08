import { scrypt, randomBytes } from 'crypto'

import type { ScryptOptions } from 'crypto'

const SALT_LENGTH = 16
const HASH_LENGTH = 64
const SCRYPT_OPTIONS: ScryptOptions = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  N: 2 ** 16,
  r: 8,
  p: 2,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  maxmem: 129 * (2 ** 16) * 8,
}

async function hashPasswordWithScrypt(password: string): Promise<{ salt: string, hash: string }>
async function hashPasswordWithScrypt(password: string, salt: string): Promise<string>
async function hashPasswordWithScrypt(
  password: string,
  salt?: string,
): Promise<string | { salt: string, hash: string }> {
  const saltForHash = salt ?? randomBytes(SALT_LENGTH).toString('hex')

  const hash = await new Promise<string>((resolve, reject) => {
    scrypt(password.normalize(), saltForHash, HASH_LENGTH, SCRYPT_OPTIONS, (err, derivedKey) => {
      if (err) {
        reject(err)
        return
      }
      resolve(derivedKey.toString('hex'))
    })
  })

  if (!salt) {
    return { salt: saltForHash, hash }
  }
  else {
    return hash
  }
}

export {
  hashPasswordWithScrypt,
}
