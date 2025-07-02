import User from '../models/user.model.js'
export const signup = async (req, res) => {
    //console.log(req.body)
    const { username, email, password } = req.body
    const newUser = new User({ username, email, password })
    await newUser.save();
    res.status(200).json('User created successfully')
}