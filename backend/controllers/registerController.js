
const { User } = require('../model/User')
const bcrypt = require('bcrypt');


const handleNewUser = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ 'message': 'Email, username and password are required.' });
    }
    
    const duplicate = await User.findOne({ email: email }).exec()
    if(duplicate) return res.status(409).json({ 'message': 'duplicate email'}) // conflict

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await User.create({
            email: email,
            userName: username,
            password: hashedPassword
        })
        res.status(201).json({ 'success': `New user ${email} created!` });

    } catch (err) {
        
        res.status(500).json({ 'message': err.message})
    }
}

module.exports = { handleNewUser }