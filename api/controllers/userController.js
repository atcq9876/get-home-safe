const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({
      user_id: user._id,
      name: user.name,
      token,
      walkingSpeed: user.walkingSpeed,
      phoneNumber: user.phoneNumber
    });  
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const user = await User.signup(name, email, phoneNumber, password)

    // create a token
    const token = createToken(user._id)

    const userWithId = await User.findOne({ email: email })

    res.status(200).json({
      user_id: userWithId._id,
      name: userWithId.name, token,
      walkingSpeed: userWithId.walkingSpeed,
      phoneNumber: user.phoneNumber
    });
    } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get a user
const getUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    res.status(200).json({
      id: user._id,
      walkingSpeed: user.walkingSpeed,
      name: user.name,
      phoneNumber: user.phoneNumber
    })
  } catch (error) {
    res.status(404).json({ error: 'This user does not exist' })
  }
}

// patch user information
const updateUser = async (req, res) => {
  const user_id = req.params.id
  const password = req.body.password

  if (!validator.isStrongPassword(password)) {
    res.status(400).json({ error: 'Password not strong enough' })
  } else {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      await User.findOneAndUpdate(
        {
          _id: user_id,
        },
        {
          password: hashedPassword,
        },
      )
      res.status(200).json({ message: 'User updated successfully!' })
    } catch (error) {
      res.status(404).json({ error: 'User does not exist' })
    }
  }
}

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params

  const user = await User.findByIdAndDelete({ _id: id })

  const token = createToken(user._id)
  await User.updateMany(
    {},
    { $pull: { emergencyContacts: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber
    } } }
  );
  // maybe delete the token from below response
  res.status(200).json({ message: 'User deleted successfully', token: token })
}

const getNotifications = async (req, res) => {
  const { user_id } = req.params
  try {
    const user = await User.findOne({ _id: user_id })
    res.status(200).json({ notifications: user.notifications })
  } catch (error) {
    res.status(404).json({ error: 'User not found' })
  }
}

const addNotification = async (req, res) => {
  const { receiver_id } = req.params
  const { notification } = req.body
  const receiver = await User.findOne({ _id: receiver_id })
  if (!receiver) {
    return res.status(400).json({ error: 'User not found' })
  }
  receiver.notifications.unshift(notification)
  await receiver.save()
  res.status(200).json({
    message: 'Notification added!',
    updatedNotification: receiver.notifications,
  })
}

const deleteNotification = async (req, res) => {
  const { user_id, notification_index } = req.params
  const user = await User.findOne({ _id: user_id })
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }
  user.notifications.splice(notification_index, 1)
  await user.save()
  res.status(200).json({
    message: 'Notification deleted',
    updatedNotifications: user.notifications,
  })
}

const emergencyContact = async (req, res) => {
  const { user_id, emergencyContactEmail, field } = req.body
  const reqContact = await User.findOne({ email: emergencyContactEmail })
  if (!reqContact) {
    res.status(400).json({ error: 'This user does not exist' })
    return
  } else if (user_id === reqContact._id.toString()) {
    res
      .status(400)
      .json({ error: "You can't add yourself as an emergency contact" })
    return
  } else {
    if (field === 'add') {
      const user = await User.findOne({ _id: user_id })
      const currentContacts = user.emergencyContacts.toObject()
      if (
        !currentContacts.some(
          (contact) => contact.email === emergencyContactEmail,
        )
      ) {
        update = await User.findOneAndUpdate(
          { _id: user_id },
          {
            $push: {
              emergencyContacts: {
                id: reqContact._id,
                name: reqContact.name,
                email: reqContact.email,
                phoneNumber: reqContact.phoneNumber
              },
            },
          },
        )
        const token = await createToken(user_id)
        res.status(200).json({ message: 'OK', token: token })
        return
      } else {
        res.status(400).json({
          error: 'You already have that user in your emergency contact list',
        })
        return
      }
    }
    if (field === 'delete') {
      update = await User.findOneAndUpdate(
        { _id: user_id },
        {
          $pull: {
            emergencyContacts: {
              id: reqContact._id,
              name: reqContact.name,
              email: reqContact.email,
              phoneNumber: reqContact.phoneNumber
            },
          },
        },
      )
      const token = await createToken(user_id)
      res.status(200).json({ message: 'OK', token: token })
      return
    } else {
      res.status(400).json({ error: 'Deleting emergency contact unsuccesful' })
      return
    }
  }
}
const getEmergencyContacts = async (req, res) => {
  const user_id = req.params.id
  try {
    const user = await User.findById(user_id)
    res.status(200).json({ emergencyContacts: user.emergencyContacts })
  } catch (error) {
    res.status(404).json({ error: 'This user no longer exists' })
  }
}
const getSearchResults = async (req, res) => {
  const query = req.params.query
  const emailList = await User.find({
    email: { $regex: `.*${query}.*`, $options: 'i' },
  }).limit(1)
  res.status(200).json({ data: emailList })
}
const updateWalkingSpeed = async (req, res) => {
  const { id } = req.params
  const { walkingSpeed } = req.body

  try {
    const user = await User.findById(id)
    user.walkingSpeed = walkingSpeed
    await user.save()
    res.status(200).json({ walkingSpeed: user.walkingSpeed })
  } catch {
    res.status(400).json({ error: 'User not found' })
  }
}

module.exports = {
  signupUser,
  loginUser,
  emergencyContact,
  getEmergencyContacts,
  getSearchResults,
  addNotification,
  deleteNotification,
  getNotifications,
  updateUser,
  deleteUser,
  getUser,
  updateWalkingSpeed,
}
