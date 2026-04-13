import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = __dirname
const dataDir = path.join(root, 'data')
const uploadsDir = path.join(root, 'uploads')
const projectsFile = path.join(dataDir, 'projects.json')
const contactFile = path.join(dataDir, 'contact-messages.json')

function ensureDirs() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
}

function readProjects() {
  if (!fs.existsSync(projectsFile)) return []
  const raw = fs.readFileSync(projectsFile, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeProjects(projects) {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2), 'utf8')
}

function uploadPathFromPublicUrl(url) {
  const rel = String(url || '').replace(/^\/+/, '')
  return path.join(root, rel)
}

function appendContact(entry) {
  const list = fs.existsSync(contactFile)
    ? JSON.parse(fs.readFileSync(contactFile, 'utf8'))
    : []
  list.push(entry)
  fs.writeFileSync(contactFile, JSON.stringify(list, null, 2), 'utf8')
}

ensureDirs()
if (!fs.existsSync(projectsFile)) {
  writeProjects([
    {
      id: nanoid(),
      title: 'CampusVoice: Online Complaint, Suggestion & Lost and Found Portal',
      description:
        'This project was developed for NIT Polytechnic, Nagpur. It allows students and faculty to submit complaints and suggestions, which are forwarded to the HOD and Principal. It also includes a complaint tracking system.',
      technologies: ['Angular', 'HTML', 'CSS', 'Python (Flask)', 'MySQL (XAMPP)'],
      imageUrl: 'https://picsum.photos/seed/campusvoice/800/520',
      projectUrl: '',
      githubUrl: 'https://github.com/',
    },
    {
      id: nanoid(),
      title: 'Portfolio Web Application',
      description:
        'A modern portfolio web application built using React with animations and interactive user interface.',
      technologies: ['React', 'HTML', 'CSS', 'JavaScript'],
      imageUrl: 'https://picsum.photos/seed/amolportfolio/800/520',
      projectUrl: '',
      githubUrl: 'https://github.com/',
    },
  ])
}

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(uploadsDir))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png'
    cb(null, `${nanoid(10)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)
    cb(null, ok)
  },
})

const projectBody = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  technologies: z.array(z.string()).min(1).max(24),
  projectUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().optional(),
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/projects', (_req, res) => {
  res.json(readProjects())
})

function parseTechnologies(raw) {
  try {
    const v = JSON.parse(raw || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

app.post('/api/projects', upload.single('image'), (req, res) => {
  const parsed = projectBody.safeParse({
    title: req.body.title,
    description: req.body.description,
    technologies: parseTechnologies(req.body.technologies),
    projectUrl: req.body.projectUrl,
    githubUrl: req.body.githubUrl,
    imageUrl: req.body.imageUrl,
  })
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }
  const data = parsed.data
  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : (data.imageUrl && String(data.imageUrl).trim()) || ''
  if (!imageUrl) {
    return res.status(400).json({ error: 'Provide an image file or image URL' })
  }
  const projects = readProjects()
  const item = {
    id: nanoid(),
    title: data.title,
    description: data.description,
    technologies: data.technologies,
    imageUrl,
    projectUrl: data.projectUrl || undefined,
    githubUrl: data.githubUrl || undefined,
  }
  projects.unshift(item)
  writeProjects(projects)
  res.status(201).json(item)
})

app.put('/api/projects/:id', upload.single('image'), (req, res) => {
  const parsed = projectBody.safeParse({
    title: req.body.title,
    description: req.body.description,
    technologies: parseTechnologies(req.body.technologies),
    projectUrl: req.body.projectUrl,
    githubUrl: req.body.githubUrl,
    imageUrl: req.body.imageUrl,
  })
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }
  const projects = readProjects()
  const idx = projects.findIndex((p) => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const prev = projects[idx]
  const data = parsed.data
  let imageUrl = prev.imageUrl
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`
    if (prev.imageUrl?.startsWith('/uploads/')) {
      fs.promises.unlink(uploadPathFromPublicUrl(prev.imageUrl)).catch(() => {})
    }
  } else if (data.imageUrl) {
    imageUrl = data.imageUrl
  }
  projects[idx] = {
    ...prev,
    title: data.title,
    description: data.description,
    technologies: data.technologies,
    imageUrl,
    projectUrl: data.projectUrl || undefined,
    githubUrl: data.githubUrl || undefined,
  }
  writeProjects(projects)
  res.json(projects[idx])
})

app.delete('/api/projects/:id', (req, res) => {
  const projects = readProjects()
  const idx = projects.findIndex((p) => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = projects.splice(idx, 1)
  if (removed.imageUrl?.startsWith('/uploads/')) {
    fs.promises.unlink(uploadPathFromPublicUrl(removed.imageUrl)).catch(() => {})
  }
  writeProjects(projects)
  res.json({ ok: true })
})

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(10).max(4000),
})

app.post('/api/contact', (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }
  const entry = { ...parsed.data, id: nanoid(), at: new Date().toISOString() }
  appendContact(entry)
  res.status(201).json({ ok: true })
})

const clientDist = path.join(root, '..', 'client', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get(/^(?!\/api\/|\/uploads\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`)
  if (fs.existsSync(clientDist)) {
    console.log(`Serving SPA from ${clientDist}`)
  }
})
