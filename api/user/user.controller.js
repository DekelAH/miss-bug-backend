import { loggerService } from "../../services/logger.service.js"
import { userService } from "./user.service.js"

export async function getUsers(req, res) {

    try {
        const users = await userService.query()
        loggerService.info(`Users read successfuly`)
        res.send(users)
    } catch (err) {
        loggerService.error(`Couldn't get users`, err)
        res.status(400).send(`Couldn't get users`)
    }
}

export async function getUser(req, res) {

    const { userId } = req.params

    try {
        const user = await userService.getById(userId)
        loggerService.info(`User with id: ${userId} read successfuly`)
        res.send(user)
    } catch (err) {
        loggerService.error(`Couldn't get user`, err)
        res.status(400).send(`Couldn't get user`)
    }
}

export async function updateUser(req, res) {
    const { _id, fullname, username, password, score } = req.body
    const userToSave = { _id, fullname, username, password, score }

    try {
        const savedUser = await userService.save(userToSave)
        loggerService.info(`User with id: ${userToSave._id} updated successfuly`)
        res.send(savedUser)
    } catch (err) {
        loggerService.error(`Couldn't save user`, err)
        res.status(400).send(`Couldn't save user`)
    }

}

export async function addUser(req, res) {
    const { fullname, username, password, score } = req.body
    const userToSave = { fullname, username, password, score }

    try {
        const savedBug = await userService.save(userToSave)
        loggerService.info(`User with id: ${userToSave._id} added successfuly`)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save user`, err)
        res.status(400).send(`Couldn't save user`)
    }
}

export async function removeUser(req, res) {
    const { userId } = req.params
    try {
        await userService.remove(userId)
        loggerService.info(`User with id: ${userId} removed successfuly`)
        res.send(`User with Id: ${userId} removed successfuly`)
    } catch (err) {
        loggerService.error(`Couldn't remove user`, err)
        res.status(400).send(`Couldn't remove user`)
    }

}