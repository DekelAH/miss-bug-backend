import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile, writeJsonFile } from "../../services/util.service.js"


export const userService = {

    query,
    getById,
    save,
    remove
}

const gUsers = readJsonFile('./data/users.json')

async function query() {

    try {

        const users = [...gUsers]
        return users
    } catch (err) {
        loggerService.error('Couldnt get users', err)
        throw err
    }
}

async function getById(userId) {

    try {
        const user = gUsers.find(user => user._id === userId)
        if (!user) {
            throw new Error(`Cannot find bug with id: ${userId}`)
        }
        return user
    } catch (err) {

        throw err
    }
}

async function save(userToSave) {

    console.log(userToSave)
    try {
        if (userToSave._id) {

            const userIdx = gUsers.findIndex(user => user._id === userToSave._id)
            if (userIdx < 0) throw new Error('Cannot find user')
            gUsers[userIdx] = userToSave

        } else {

            userToSave._id = makeId()
            gUsers.push(userToSave)
        }

        await _saveUsersToFile()
        return userToSave
    } catch (err) {

        throw err
    }
}

async function remove(userId) {

    try {
        const userIdx = gUsers.findIndex(bug => bug._id === userId)
        if (userIdx < 0) {
            throw new Error(`Cannot find bug with id: ${userId}`)
        }
        gUsers.splice(userIdx, 1)
        await _saveUsersToFile()
    } catch (err) {
        throw err
    }
}

function _saveUsersToFile() {
    return writeJsonFile('./data/users.json', gUsers)
}