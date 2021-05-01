import { SignupController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

const makeSut = (): SignupController => {
  return new SignupController()
}

describe('', () => {
  test('Shout return 400 if no name is provide', () => {
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = makeSut()
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
})
