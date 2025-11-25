import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const userService = {

    query,
    getById,
    getByUsername,
    add,
    update,
    remove
}


async function query(filterBy = {}) {

    const criteria = _buildCriteria(filterBy)

    try {

        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = user._id.getTimestamp()
            return user
        })
        return users
    } catch (err) {
        loggerService.error('Couldnt get users', err)
        throw err
    }
}

async function getById(userId) {

    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        if (!user) {
            throw new Error(`Cannot find bug with id: ${userId}`)
        }
        return user
    } catch (err) {

        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        loggerService.error('Problem finding user by given username', err)
        throw err
    }
}

async function update(user) {

    try {
        
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id),
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error('Problem updating user', err)  
        throw err
    }
}

async function add(user) {

    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            isAdmin: user.isAdmin,
            score: 100
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        loggerService.error('Problem adding user', err)  
        throw err
    }
}

async function remove(userId) {

    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection('user')
        await collection.deleteOne(criteria)
    } catch (err) {
        loggerService.error('Problem removing user by given id : ', err)  
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria,
            },
            {
                fullname: txtCriteria,
            },
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}

// function _saveUsersToFile() {
//     return writeJsonFile('./data/users.json', gUsers)
// }

