import {
  isPublicKey,
  isPaysharesAddress,
  isTxHash,
  stroopsToStakks,
} from '../../payshares/utils'

it('stroopsToStakks converts correctly', () => {
  expect(stroopsToStakks(100)).toBe(0.00001)
  expect(stroopsToStakks(5000000)).toBe(0.5)
  expect(stroopsToStakks(5000000000)).toBe(500)
})

it('isPublicKey identifies a valid key', () => {
  expect(isPublicKey()).toBe(false)
  expect(isPublicKey('')).toBe(false)
  expect(isPublicKey(null)).toBe(false)

  // same length as valid key and looks valid but is not
  expect(
    isPublicKey('GBQHXMAVPD3AKY5PWFCBVT3NFIXGE345FVZLL4JXKTVSFT5FKMEV5QIX')
  ).toBe(false)

  // valid secret key is not a valid public key
  expect(
    isPublicKey('SA5OGCE2AQMSXCKYHGQZ3RUV2464W5M2QXBBAY2GSBRTFUUTKQI5UB2A')
  ).toBe(false)

  // valid
  expect(
    isPublicKey('GBQHXMAVPD3AKY5PWFCBVT3NFIXGE345FVZLL4JXKTVSFT5FKMEV5QIL')
  ).toBe(true)
})

it('isPaysharesAddress identifies a valid payshares address', () => {
  expect(isPaysharesAddress()).toBe(false)
  expect(isPaysharesAddress('')).toBe(false)
  expect(isPaysharesAddress(null)).toBe(false)

  expect(isPaysharesAddress('comma,forbidden*payshares.org')).toBe(false)
  expect(isPaysharesAddress('two*asterisk*payshares.org')).toBe(false)

  expect(isPaysharesAddress('jed*payshares.org')).toBe(true)
  expect(isPaysharesAddress('hatch1234*some-domain-888.a.b.c')).toBe(true)
})

it('isTxHash identifies a valid transaction hash', () => {
  expect(isTxHash()).toBe(false)
  expect(isTxHash('')).toBe(false)
  expect(isTxHash(null)).toBe(false)
  expect(isTxHash('ddefd')).toBe(false)

  expect(
    isTxHash('ddeff3d3b8455f8173ef4d63e6650625734207fd351d2b9eeeaf0e38ffe1064b')
  ).toBe(true)
})
