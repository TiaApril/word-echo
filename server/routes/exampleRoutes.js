import express from 'express'
import {
  getExamples,
  getExample,
  createExample,
  updateExample,
  deleteExample,
} from '../controllers/exampleController.js'

const router = express.Router()

router.route('/').get(getExamples).post(createExample)
router.route('/:id').get(getExample).put(updateExample).delete(deleteExample)

export default router
