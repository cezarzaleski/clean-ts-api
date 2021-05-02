import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Controller', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })
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
