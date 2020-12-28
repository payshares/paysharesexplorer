import {PsrKey} from 'payshares-base/lib/psrkey'

const STROOPS_PER_STAKK = 10000000
const stroopsToStakks = stroops => stroops / STROOPS_PER_STAKK

// payshares federated address (eg. "payshares*fed.network")
const isPaysharesAddress = addr => /^[^*,]*\*[a-z0-9-.]*$/i.test(addr)
const isPublicKey = keyPsr => PsrKey.isValidEd25519PublicKey(keyPsr)
const isSecretKey = keyPsr => PsrKey.isValidEd25519SecretSeed(keyPsr)
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)

export {isPublicKey, isSecretKey, isPaysharesAddress, isTxHash, stroopsToStakks}
