import { SignupController } from './signup'

describe('', () => {
  test('Shout return 400 if no name is provide', () => {
    const sut = new SignupController()
    const httpResquest = {
      body: {
        // name: 'any_name',
        email: 'any_email@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
