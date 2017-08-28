var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var apiURL = 'http://localhost:8080/api';
var lastid = null;
chai.use(chaiHttp);

describe('node-api', () => {
	describe('Test all routes', () => {
		it('it should GET a request from all users', (done) => {
			chai.request(apiURL)
				.get('/users')
				.end((err, res) => {
					should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.result.should.be.a('array');
					done();
				});
		});
		it('it should POST a request from homepage', (done) => {
            var user = {
                username: 'Test1',
                password: 'qwerty',
                firstname: 'rawl',
                lastname: 'altavano'
            }
            chai.request(apiURL)
                .post('/users')
                .send(user)                
				.end((err, res) => {
					should.not.exist(err);
					res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('msg').eql('Record successfully saved');
					done();
				});
        });
        it('it should GET a request for a specific User', (done) => {
            var _id = 'a87ff679a2f3e71d9181a67b7542122c'
            chai.request(apiURL)
                .get('/users/' + _id)                
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.result.should.be.an('object');
                    done();
                });
        });
        it('it should PUT a request to a user', (done) => {
            var _id = 'a87ff679a2f3e71d9181a67b7542122c'
            var user = {
                firstname: 'raul',
                lastname: 'altavano',
                username: 'Test2',
                password: 'asdf'
            }
            chai.request(apiURL)
                .put('/users/' + _id)
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('msg').eql('Record successfully updated');
                    done();
                });
        });
		it('it should DELETE a request from specific user', (done) => {
			var _id = 'a87ff679a2f3e71d9181a67b7542122c'
            chai.request(apiURL)
                .delete('/users/' + _id)                
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('msg').eql('User succesfully deleted');
                    done();
                });
		});
	});
});