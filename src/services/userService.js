require('dotenv').config(); 
const db=require('../models/db');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const saltRounds=10;
const secret_key = process.env.SECRET_KEY;

async function registeruser(FirstName, LastName, Email, PhoneNumber, Password, Pincode, City, Role) {
    const checkQuery = 'SELECT COUNT(*) AS count FROM Users WHERE Email = ?';
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const insertQuery = 'INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Pincode, City, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    try {
        // Check if the user already exists
        const [checkResult] = await db.query(checkQuery, [Email]);
        if (checkResult[0].count > 0) {
            throw new Error('Email already exists');
        }

        // Insert the new user into the database
        const [insertResult] = await db.query(insertQuery, [FirstName, LastName, Email, PhoneNumber, hashedPassword, Pincode, City, Role]);
        
        return { id: insertResult.insertId, message: 'User registered successfully' };
    } catch (err) {
        throw new Error('Error registering user: ' + err.message);
    }
}

  async function loginuser(Email, Password) {
    const query = 'SELECT UserId, Email, Password FROM Users WHERE Email = ?';
    
    try {
        const [rows] = await db.query(query, [Email]);
        if (rows.length === 0) {
            throw new Error('User does not exist');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (isMatch) {
            const token = jwt.sign(
                { user: { id: user.UserId, Email: user.Email } },
                secret_key,
                { expiresIn: '1h' }
            );

            return { token, message: 'Login successful' };
        } else {
            throw new Error('Invalid password or email');
        }
    } catch (err) {
        console.error('Error during login:', err.message);
        throw new Error('Error during login: ' + err.message);
    }
}

async function getAgentsByLocation(city) {
    const agentsQuery = 'SELECT FirstName, LastName, Email, PhoneNumber FROM Users WHERE City = ? AND Role = "Agent"';

    try {
        // Retrieve agents from the specified city
        const [agentsResult] = await db.query(agentsQuery, [city]);

        return agentsResult;
    } catch (err) {
        // Handle errors and log them if necessary
        console.error('Error retrieving agents:', err);
        throw new Error('Error retrieving agents: ' + err.message);
    }
}
module.exports = { registeruser, loginuser ,getAgentsByLocation};