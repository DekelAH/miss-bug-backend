import express from 'express'
import { addBug, getBug, getBugsReport, getBugs, removeBug, updateBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.get('/report', getBugsReport)
router.put('/:bugId', updateBug)
router.post('/', addBug)
router.delete('/:bugId', removeBug)

export const bugRoutes = router