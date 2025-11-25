import { MongoClient } from "mongodb"
import { loggerService } from "./logger.service.js"
import { config } from '../config/index.js '


export const dbService = { getCollection }

var dbConn = null

async function getCollection(collectionName) {

    try {

        const db = await _connect()
        const collection = db.collection(collectionName)
        return collection

    } catch (err) {
        loggerService.error('Cannot get collection', err)
        throw err
    }
}

async function _connect() {

    if (dbConn) return dbConn

    try {
        const client = await MongoClient.connect(config.dbURL)
        return dbConn = client.db(config.dbName)
    } catch (err) {
        loggerService.error('Cannot connect to DB', err)
        throw err
    }
}
