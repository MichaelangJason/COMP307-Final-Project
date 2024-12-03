const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../src/schemas/user.js');

const router = express.Router();

// Register Endpoint
router.post('/register', async (req, res) => {});

// Login Endpoint
router.post('/login', async (req, res) => {});

// Logout Endpoint
router.delete('/logout', (req, res) => {});