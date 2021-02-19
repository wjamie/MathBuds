'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ticket = mongoose.model('Ticket'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ticket;

/**
 * Ticket routes tests
 */
describe('Ticket CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Ticket
    user.save(function () {
      ticket = {
        name: 'Ticket name'
      };

      done();
    });
  });

  it('should be able to save a Ticket if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle Ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Get a list of Tickets
            agent.get('/api/tickets')
              .end(function (ticketsGetErr, ticketsGetRes) {
                // Handle Tickets save error
                if (ticketsGetErr) {
                  return done(ticketsGetErr);
                }

                // Get Tickets list
                var tickets = ticketsGetRes.body;

                // Set assertions
                (tickets[0].user._id).should.equal(userId);
                (tickets[0].name).should.match('Ticket name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ticket if not logged in', function (done) {
    agent.post('/api/tickets')
      .send(ticket)
      .expect(403)
      .end(function (ticketSaveErr, ticketSaveRes) {
        // Call the assertion callback
        done(ticketSaveErr);
      });
  });

  it('should not be able to save an Ticket if no name is provided', function (done) {
    // Invalidate name field
    ticket.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(400)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Set message assertion
            (ticketSaveRes.body.message).should.match('Please fill Ticket name');

            // Handle Ticket save error
            done(ticketSaveErr);
          });
      });
  });

  it('should be able to update an Ticket if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle Ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Update Ticket name
            ticket.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ticket
            agent.put('/api/tickets/' + ticketSaveRes.body._id)
              .send(ticket)
              .expect(200)
              .end(function (ticketUpdateErr, ticketUpdateRes) {
                // Handle Ticket update error
                if (ticketUpdateErr) {
                  return done(ticketUpdateErr);
                }

                // Set assertions
                (ticketUpdateRes.body._id).should.equal(ticketSaveRes.body._id);
                (ticketUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tickets if not signed in', function (done) {
    // Create new Ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the ticket
    ticketObj.save(function () {
      // Request Tickets
      request(app).get('/api/tickets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ticket if not signed in', function (done) {
    // Create new Ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the Ticket
    ticketObj.save(function () {
      request(app).get('/api/tickets/' + ticketObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ticket.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ticket with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tickets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ticket is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ticket which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ticket
    request(app).get('/api/tickets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ticket with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ticket if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ticket
        agent.post('/api/tickets')
          .send(ticket)
          .expect(200)
          .end(function (ticketSaveErr, ticketSaveRes) {
            // Handle Ticket save error
            if (ticketSaveErr) {
              return done(ticketSaveErr);
            }

            // Delete an existing Ticket
            agent.delete('/api/tickets/' + ticketSaveRes.body._id)
              .send(ticket)
              .expect(200)
              .end(function (ticketDeleteErr, ticketDeleteRes) {
                // Handle ticket error error
                if (ticketDeleteErr) {
                  return done(ticketDeleteErr);
                }

                // Set assertions
                (ticketDeleteRes.body._id).should.equal(ticketSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ticket if not signed in', function (done) {
    // Set Ticket user
    ticket.user = user;

    // Create new Ticket model instance
    var ticketObj = new Ticket(ticket);

    // Save the Ticket
    ticketObj.save(function () {
      // Try deleting Ticket
      request(app).delete('/api/tickets/' + ticketObj._id)
        .expect(403)
        .end(function (ticketDeleteErr, ticketDeleteRes) {
          // Set message assertion
          (ticketDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ticket error error
          done(ticketDeleteErr);
        });

    });
  });

  it('should be able to get a single Ticket that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Ticket
          agent.post('/api/tickets')
            .send(ticket)
            .expect(200)
            .end(function (ticketSaveErr, ticketSaveRes) {
              // Handle Ticket save error
              if (ticketSaveErr) {
                return done(ticketSaveErr);
              }

              // Set assertions on new Ticket
              (ticketSaveRes.body.name).should.equal(ticket.name);
              should.exist(ticketSaveRes.body.user);
              should.equal(ticketSaveRes.body.user._id, orphanId);

              // force the Ticket to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Ticket
                    agent.get('/api/tickets/' + ticketSaveRes.body._id)
                      .expect(200)
                      .end(function (ticketInfoErr, ticketInfoRes) {
                        // Handle Ticket error
                        if (ticketInfoErr) {
                          return done(ticketInfoErr);
                        }

                        // Set assertions
                        (ticketInfoRes.body._id).should.equal(ticketSaveRes.body._id);
                        (ticketInfoRes.body.name).should.equal(ticket.name);
                        should.equal(ticketInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Ticket.remove().exec(done);
    });
  });
});
