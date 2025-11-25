import { loggerService } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service.js';

export const bugService = {

    query,
    getById,
    add,
    update,
    remove
}

const PAGE_SIZE = 15;

async function query(filterBy) {
    try {

        filterBy.severity = filterBy.severity || 0;
        filterBy.txt = filterBy.txt || '';

        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

        const collection = await dbService.getCollection('bug')
        var bugCursor = await collection.find(criteria, { sort })

        if (filterBy.pageIdx !== undefined) {
            bugCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }
        const bugs = await bugCursor.toArray()

        return bugs

    } catch (err) {
        loggerService.error('Couldnt get bugs', err)
        throw err
    }
}

async function getById(bugId) {

    try {
        
        const criteria = { _id: ObjectId.createFromHexString(bugId) }

        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne(criteria)
        return bug
    } catch (err) {
        loggerService.error(`while finding bug ${bugId}`, err)
        throw err
    }
}

async function add(bug, loggedinUser) {

    try {
        const collection = await dbService.getCollection('bug')
        bug.createdAt = Date.now()
        bug.creator = loggedinUser
        bug.labels = _setLabels(bug.severity)
        await collection.insertOne(bug)
        return bug
    } catch (err) {
        loggerService.error('cannot insert bug', err)
        throw err
    }
}

async function update(bug, loggedinUser) {

    const bugToSave = { severity: bug.severity, description: bug.description }

    try {

        const criteria = { _id: ObjectId.createFromHexString(bug._id) }
        const collection = await dbService.getCollection('bug')
        bugToSave.updatedAt = Date.now()
        bugToSave.labels = _setLabels(bug.severity)
        bugToSave.creator = loggedinUser
        await collection.updateOne(criteria, { $set: bugToSave })

        return bug
    } catch (err) {
        loggerService.error(`cannot update bug ${bug._id}`, err)
        throw err
    }
}

async function remove(bugId, loggedinUser) {

    const { _id: creatorId, isAdmin } = loggedinUser

    try {
        const criteria = {
            _id: ObjectId.createFromHexString(bugId),
        }

        if (!isAdmin) criteria['creator._id'] = creatorId

        const collection = await dbService.getCollection('bug')
        const res = await collection.deleteOne(criteria)

        if (res.deletedCount === 0) throw ('Not your bug')

        return bugId

    } catch (err) {
        loggerService.error(`cannot remove bug ${bugId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    console.log('filterBy:', filterBy);
    const criteria = {
        title: { $regex: filterBy.txt, $options: 'i' },
        severity: { $gte: filterBy.severity },
    }

    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}

// function _saveBugsToFile() {
//     return writeJsonFile('./data/bugs.json', gBugs)
// }

function _setLabels(severity) {
    const allLabels = ["critical", "need-CR", "harmless", "basic-injury"]
    let bugLabels = []

    if (severity <= 3) {
        bugLabels = [...allLabels.filter(label => label === "harmless")]
    } else if (severity > 3 && severity <= 6) {
        bugLabels = [...allLabels.filter(label => ["harmless", "basic-injury"].includes(label))]
    } else if (severity > 6) {
        bugLabels = [...allLabels.filter(label => ["need-CR", "critical"].includes(label))]
    }

    return bugLabels
}


