import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../criptography/bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash')
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with corret values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypter('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on succes', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypter('any_value')
    expect(hash).toBe('hash')
  })
})
