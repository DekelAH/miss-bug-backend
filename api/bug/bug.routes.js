import express from 'express'
import { addBug, getBug, getBugsReport, getBugs, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', log, getBugs)
router.get('/report', log, requireAuth, getBugsReport)
router.get('/:bugId', log, getBug)
router.put('/:bugId', log, requireAuth, updateBug)
router.post('/', log, requireAuth, addBug)
router.delete('/:bugId', log, requireAuth, removeBug)

export const bugRoutes = router