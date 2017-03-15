import dotenv from 'dotenv';
let mongoose = require("mongoose");
let Patient = require('../src/Controllers/Patient');
//Require the dev-dependencies

dotenv.config();

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src');
let should = chai.should();


var accessToken = null;

chai.use(chaiHttp);

describe('Auth', () => {

    /*
     * Test the /POST
     */

    describe('Test Unit Login User', () => {

        //should valid username and password
        it('it should valid username and password', (done) => {
            chai.request(server)
                .post('/api/v1/auth/login')
                // sent param username and password
                .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })
                // .send({ username: 'admin', password: '123456' })
                .end((err, res) => {
                    // check resposive return
                    console.log(res.body);
                    res.body.should.have.property('accessToken');
                    res.body.should.have.property('user');
                    done();
                });
        });

        //should invalid username and password
        it('it should invalid username and password', (done) => {
            chai.request(server)
                .post('/api/v1/auth/login')
                // sent wrong param username and password
                .send({ username: 'admin', password: '654321' })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                    console.log('The message return is:' + res.body.message);
                });
        });

        //should required username and password
        it('it should required username and password', (done) => {
            chai.request(server)
                .post('/api/v1/auth/login')
                // sent wrong param username and password null
                .send({ username: '', password: '' })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                    console.log('The message return is:' + res.body.message);
                });
        });

    });



});