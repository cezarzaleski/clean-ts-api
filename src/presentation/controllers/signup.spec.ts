import { SignupController } from './signup'
import { MissingParamError, InvalidParamError } from '../errors'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  // mock stub duble para teste
  // começa testando o caminho feliz
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidator = new EmailValidatorStub()
  return {
    sut: new SignupController(emailValidator),
    emailValidatorStub: emailValidator
  }
}

describe('', () => {
  test('Shout return 400 if no name is provide', () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Shout return 400 if no email is provide', () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Shout return 400 if no password is provide', () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Shout return 400 if no passwordConfirmation is provide', () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Shout return 400 if an invalid email is provide', () => {
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
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Shout call EmailValidator with correct email', () => {
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
    sut.handle(httpResquest)
    expect(isValidSpy).toHaveBeenCalledWith('email@teste.com')
  })

  test('Shout return 500 if EmailValidator throws', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignupController(emailValidatorStub)
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'email@teste.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
