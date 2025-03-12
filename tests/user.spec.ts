import { Request } from 'express';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index'; // Certifique-se de exportar o app corretamente
import { describe, it, before } from 'mocha';

const { expect } = chai;
chai.use(chaiHttp);

describe('User API', () => {
  let userId: string;
  
  before((done) => {
    chai.request(app)
      .post('/users')
      .send({ username: 'testuser', email: 'test@example.com', password: '123456' })
      .end((err, res) => {
        userId = res.body.id;
        done();
      });
  });

  describe('POST /users', () => {
    it('should create a new user', (done) => {
      chai.request(app)
        .post('/users')
        .send({ username: 'newuser', email: 'new@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body.username).to.equal('newuser');
          done();
        });
    });

    it('should return an error for missing required fields', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'invalid@example.com' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should get a user by id', (done) => {
      chai.request(app)
        .get(`/users/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('username');
          expect(res.body.id).to.equal(userId);
          done();
        });
    });

    it('should return 404 for non-existent user', (done) => {
      chai.request(app)
        .get('/users/9999')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user details', (done) => {
      chai.request(app)
        .put(`/users/${userId}`)
        .send({ username: 'updatedUser' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal('updatedUser');
          done();
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', (done) => {
      chai.request(app)
        .delete(`/users/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('User deleted successfully');
          done();
        });
    });

    it('should return 404 for deleting non-existent user', (done) => {
      chai.request(app)
        .delete(`/users/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
