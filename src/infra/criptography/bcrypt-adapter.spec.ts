import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../criptography/bcrypt-adapter'
describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with corret values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypter('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
