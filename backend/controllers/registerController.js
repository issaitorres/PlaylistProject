
const { User } = require('../model/User')
const bcrypt = require('bcrypt');

// user1
// {"email": "test1@gmail.com", "firstname": "first1" ,"lastname": "last1", "password": "password"}

// user2
// {"email": "test2@gmail.com", "firstname": "first2" ,"lastname": "last2", "password": "password"}

const handleNewUser = async (req, res) => {
    const { email, firstname, lastname, password } = req.body;
    if (!email || !firstname || !lastname || !password) {
        return res.status(400).json({ 'message': 'Email, firstname, lastname and password are required.' });
    }
    
    const duplicate = await User.findOne({ email: email }).exec()
    if(duplicate) return res.status(409).json({ 'message': 'duplicate email'}) // conflict

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await User.create({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword
        })
        res.status(201).json({ 'success': `New user ${email} created!` });

    } catch (err) {
        
        res.status(500).json({ 'message': err.message})
    }
}

module.exports = { handleNewUser }