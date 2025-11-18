import { bugService } from './bug.service.js'
import { pdfService } from '../../services/pdf.service.js'
import { loggerService } from '../../services/logger.service.js'


export async function getBugs(req, res) {

    const { txt, severity, pageIdx, labels, sortBy, sortDir } = req.query
    const filterBy = {
        txt,
        severity: +severity || 0
    }

    if (pageIdx !== undefined) filterBy.pageIdx = +pageIdx
    if (labels) {
        filterBy.labels = labels.split(',').map(label => label.trim())
        console.log('Parsed labels:', filterBy.labels)
    }
    if (sortBy) filterBy.sortBy = sortBy
    if (sortDir) filterBy.sortDir = +sortDir

    console.log('FilterBy being sent to service:', filterBy)

    try {
        const bugs = await bugService.query(filterBy)
        loggerService.info(`Bugs read successfuly`)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getBugsReport(req, res) {

    try {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=bugs-report.pdf'
        })

        pdfService.buildPDF(
            (dataChunk) => res.write(dataChunk),
            () => res.end()
        )

        res.send('Downloaded bugs-report.pdf')
    } catch (err) {
        loggerService.error(`Couldn't download pdf`, err)
        res.status(400).send(`Couldn't download pdf`)
    }
}

export async function getBug(req, res) {

    const { bugId } = req.params
    if (req.cookies.visitedBugs) {
        var visitedBugs = JSON.parse(req.cookies.visitedBugs)
    }
    else {
        var visitedBugs = []
    }

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length < 3) visitedBugs.push(bugId)
        else return res.status(401).send('wait for a while...')
    }
    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000 })
    console.log('visitedBugs: ', visitedBugs)

    try {
        const bug = await bugService.getById(bugId)
        loggerService.info(`Bug with id: ${bugId} read successfuly`)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug`, err)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function updateBug(req, res) {
    const { _id, title, severity, description, createdAt, labels } = req.body
    const bugToSave = { _id, title, severity, description, createdAt, labels }
    const loggedinUser = req.loggedinUser

    try {
        const savedBug = await bugService.save(bugToSave, loggedinUser)
        loggerService.info(`Bug with id: ${bugToSave._id} added successfuly`)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }

}

export async function addBug(req, res) {
    const { _id, title, severity, description, createdAt, labels } = req.body
    const bugToSave = { _id, title, severity, description, createdAt, labels }
    const loggedinUser = req.loggedinUser

    try {
        const savedBug = await bugService.save(bugToSave, loggedinUser)
        loggerService.info(`Bug with id: ${bugToSave._id} added successfuly`)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
    const loggedinUser = req.loggedinUser

    try {
        await bugService.remove(bugId, loggedinUser)
        loggerService.info(`Bug with id: ${bugId} removed successfuly`)
        res.send(`Bug with Id: ${bugId} removed successfuly`)
    } catch (err) {
        loggerService.error(`Couldn't remove bug`, err)
        res.status(400).send(`Couldn't remove bug`)
    }

}