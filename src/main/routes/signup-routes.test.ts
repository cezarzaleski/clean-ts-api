import request from 'supertest'
import app from '../config/app'

describe('SignUp Controller', () => {
  test('Should return an account on sucesses', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Cezar',
        email: 'cezar.zaleski@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
