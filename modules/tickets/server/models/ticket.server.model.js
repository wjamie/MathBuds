'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var TicketSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Ticket name',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill Ticket description',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Ticket', TicketSchema);
