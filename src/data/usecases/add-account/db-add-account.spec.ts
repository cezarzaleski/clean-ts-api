import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypter (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encrypSpy = jest.spyOn(encrypterStub, 'encrypter')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encrypSpy).toHaveBeenCalledWith('valid_password')
  })
})
