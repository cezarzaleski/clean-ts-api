import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  // mock stub duble para teste
  // começa testando o caminho feliz
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const addAccount = makeAddAccount()
  return {
    sut: new SignupController(emailValidator, addAccount),
    emailValidatorStub: emailValidator,
    addAccountStub: addAccount
  }
}

describe('SignUpController', () => {
  test('Shout return 400 if no name is provide', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Shout return 400 if no email is provide', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Shout return 400 if no password is provide', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Shout return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'password',
        passwordConfirmation: 'invalidPassword'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Shout return 400 if no passwordConfirmation is provide', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Shout return 400 if an invalid email is provide', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // para alterar o valor de um mock em um teste específico
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Shout call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // para alterar o valor de um mock em um teste específico
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpResquest)
    expect(isValidSpy).toHaveBeenCalledWith('email@teste.com')
  })

  test('Shout return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Shout return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Shout call AddAccount witch correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    // para alterar o valor de um mock em um teste específico
    const addAccountStubSpy = jest.spyOn(addAccountStub, 'add')
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpResquest)
    expect(addAccountStubSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'email@teste.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})