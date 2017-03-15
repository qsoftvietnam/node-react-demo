import dotenv from 'dotenv';
let mongoose = require("mongoose");
let Patient = require('../src/Controllers/Patient');
let PatientModel = require('../src/Models/Patient');

dotenv.config();
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src');
let should = chai.should();

var accessToken = null;

chai.use(chaiHttp);

let patientIdValid = Math.floor((Math.random() * 100000000) + 1);

//Our parent block
describe('Patient', () => {
    beforeEach((done) => { //Before each test we empty the database
        chai.request(server)
            .post('/api/v1/auth/login')
            .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })
            .end((err, res) => {
                accessToken = res.body.accessToken;
                done();
            });
    });
    /*
      * Test the get all the Patient
      */
    describe('/GET Patient', () => {

        //but not login, or login failt
        it('it should GET all the patients but not login', (done) => {

            chai.request(server)
                .get('/api/v1/patient')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                    console.log('The message return is:' + res.body.message);
                });
        });

        //Test the get all the Patient login
        it('it should GET all the patients ', (done) => {

            chai.request(server)
                .get('/api/v1/patient')
                .set('Authorization', 'Bearer ' + accessToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST Patient', () => {

        //should POST a Patient not login
        it('it should POST a Patient not login ', (done) => {
            let patient = {
                patientId: Math.floor((Math.random() * 100000000) + 1),
                patientName: "The Lord of the Rings",
            }

            chai.request(server)
                .post('/api/v1/patient')
                .send(patient)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                    console.log('The message return is:' + res.body.message);

                });
        });

        //should POST a Patient but patientId field null
        it('it should POST a Patient but patientId field null', (done) => {
            let patient = {
                patientId: null,
                patientName: "The Lord of the Rings",
            }

            chai.request(server)
                .post('/api/v1/patient')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(patient)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                    console.log('The message return is:' + res.body.message);
                });
        });

        //should POST a Patient but patientName field null
        it('it should POST a Patient but patientName field null', (done) => {
            let patient = {
                patientId: Math.floor((Math.random() * 100000000) + 1),
                patientName: null,
            }

            chai.request(server)
                .post('/api/v1/patient')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(patient)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                    console.log('The message return is:' + res.body.message);
                });
        });

        //should POST a Patient valid
        it('it should POST a Patient valid', (done) => {
            let patient = {
                patientId: patientIdValid,
                patientName: "The Lord of the Rings",
            }

            chai.request(server)
                .post('/api/v1/patient')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(patient)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        //should POST a Patient duplicate
        it('it should POST a Patient duplicate patientId', (done) => {

            let patient = {
                patientId: patientIdValid,
                patientName: "The Lord of the Rings",
            }


            chai.request(server)
                .post('/api/v1/patient')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(patient)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                    console.log('The message return is:' + res.body.message);
                });
        });

    });


});