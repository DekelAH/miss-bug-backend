import { makeId, readJsonFile, writeJsonFile } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

export const bugService = {

    query,
    getById,
    save,
    remove
}

const PAGE_SIZE = 6;
const gBugs = readJsonFile('./data/bugs.json')

async function query(filterBy = {}) {
    try {
        let bugsToDisplay = [...gBugs]
        
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }
        
        if (filterBy.severity > 0) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.severity)
        }
        
        if (filterBy.labels && filterBy.labels.length > 0) {
            bugsToDisplay = bugsToDisplay.filter(bug => {
                if (!bug.labels || !Array.isArray(bug.labels)) return false
                
                return filterBy.labels.some(filterLabel => 
                    bug.labels.some(bugLabel => 
                        bugLabel.toLowerCase() === filterLabel.toLowerCase()
                    )
                )
            })
        }
        if (filterBy.sortBy) {
            bugsToDisplay.sort((a, b) => {
                let aVal = a[filterBy.sortBy]
                let bVal = b[filterBy.sortBy]
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase()
                    bVal = bVal && bVal.toLowerCase()
                }
                
                if (aVal === undefined || aVal === null) return 1
                if (bVal === undefined || bVal === null) return -1
                
                if (aVal < bVal) return -1 * filterBy.sortDir
                if (aVal > bVal) return 1 * filterBy.sortDir
                return 0
            })
        }
        
        if (typeof filterBy.pageIdx === 'number' && filterBy.pageIdx >= 0) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }
        
        return bugsToDisplay
        
    } catch (err) {
        loggerService.error('Couldnt get bugs', err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = gBugs.find(bug => bug._id === bugId)
        if (!bug) {
            throw new Error(`Cannot find bug with id: ${bugId}`)
        }
        return bug
    } catch (err) {

        throw err
    }
}

async function save(bugToSave) {

    console.log(bugToSave)
    try {
        if (bugToSave._id) {

            const bugIdx = gBugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx < 0) throw new Error('Cannot find bug')
            bugToSave.createdAt = Date.now()
            gBugs[bugIdx] = bugToSave

        } else {

            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            gBugs.push(bugToSave)
        }

        await _saveBugsToFile()
        return bugToSave
    } catch (err) {

        throw err
    }
}

async function remove(bugId) {
    try {
        const bugIdx = gBugs.findIndex(bug => bug._id === bugId)
        if (bugIdx < 0) {
            throw new Error(`Cannot find bug with id: ${bugId}`)
        }
        gBugs.splice(bugIdx, 1)
        await _saveBugsToFile()
    } catch (err) {
        throw err
    }
}

function _saveBugsToFile() {
    return writeJsonFile('./data/bugs.json', gBugs)
}


