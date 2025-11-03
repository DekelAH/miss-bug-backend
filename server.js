import express from 'express'
import cors from 'cors'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'

const app = express()

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))

//* --------------- Config ---------------

const corsOptions = {

    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credential: true
}

app.use(cors(corsOptions))

//* --------------- Bugs CRUD ---------------

app.get('/', async (req, res) => {
    res.send('Welcome to Bug Server Side')
})

app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        loggerService.info(`Bugs read successfuly`)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
})

app.get('/api/bug/save', async (req, res) => {

    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        createdAt: req.query.createdAt
    }

    try {
        const savedBug = await bugService.save(bugToSave)
        loggerService.info(`Bug with id: ${bugToSave._id} added successfuly`)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    try {
        const bug = await bugService.getById(bugId)
        loggerService.info(`Bug with id: ${bugId} read successfuly`)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug`, err)
        res.status(400).send(`Couldn't get bug`)
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId)
        loggerService.info(`Bug with id: ${bugId} removed successfuly`)
        res.redirect('/api/bug')
        // res.send(`Bug with Id: ${bugId} removed successfuly`)
    } catch (err) {
        loggerService.error(`Couldn't remove bug`, err)
        res.status(400).send(`Couldn't remove bug`)
    }
})

app.get('/api/bugs-report', async (req, res) => {
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
        res.status(400).send(`Couldn't remove bug`)
    }
})



