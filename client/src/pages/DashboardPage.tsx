import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { api, mediaUrl } from '../lib/api'
import type { Project } from '../types/project'

const AUTH_KEY = 'portfolio-dashboard-pin-ok'

const optionalUrl = z.union([z.literal(''), z.string().url()])

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  technologies: z.string().min(2),
  projectUrl: optionalUrl,
  githubUrl: optionalUrl,
  imageUrl: optionalUrl,
})

type FormValues = z.infer<typeof formSchema>

const defaultPin = import.meta.env.VITE_DASHBOARD_PIN ?? '8821'

export function DashboardPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [pin, setPin] = useState('')
  const [pinErr, setPinErr] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [editing, setEditing] = useState<Project | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const resolver = useMemo(() => zodResolver(formSchema), [])
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      imageUrl: '',
    },
  })

  const load = async () => {
    try {
      const r = await api.get<Project[]>('/api/projects')
      setProjects(r.data)
      setLoadErr(null)
    } catch {
      setLoadErr('API offline. Run `npm run dev` in /server (port 4000).')
    }
  }

  useEffect(() => {
    if (authed) void load()
  }, [authed])

  useEffect(() => {
    if (!editing) return
    setValue('title', editing.title)
    setValue('description', editing.description)
    setValue('technologies', editing.technologies.join(', '))
    setValue('projectUrl', editing.projectUrl ?? '')
    setValue('githubUrl', editing.githubUrl ?? '')
    setValue('imageUrl', editing.imageUrl.startsWith('/uploads') ? '' : editing.imageUrl)
    setImageFile(null)
  }, [editing, setValue])

  const tryAuth = () => {
    if (pin === defaultPin) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setAuthed(true)
      setPinErr(false)
    } else {
      setPinErr(true)
    }
  }

  const buildFd = (values: FormValues) => {
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('description', values.description)
    fd.append(
      'technologies',
      JSON.stringify(
        values.technologies
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    )
    if (values.projectUrl) fd.append('projectUrl', values.projectUrl)
    if (values.githubUrl) fd.append('githubUrl', values.githubUrl)
    if (values.imageUrl && !imageFile) fd.append('imageUrl', values.imageUrl)
    if (imageFile) fd.append('image', imageFile)
    return fd
  }

  const onCreate = async (values: FormValues) => {
    try {
      const fd = buildFd(values)
      const r = await api.post<Project>('/api/projects', fd)
      setProjects((p) => [r.data, ...p])
      setImageFile(null)
      reset()
    } catch {
      alert('Could not create project. Check the API and required fields (image file or URL).')
    }
  }

  const onUpdate = async (values: FormValues) => {
    if (!editing) return
    try {
      const fd = buildFd(values)
      const r = await api.put<Project>(`/api/projects/${editing.id}`, fd)
      setProjects((p) => p.map((x) => (x.id === r.data.id ? r.data : x)))
      setEditing(null)
      setImageFile(null)
      reset()
    } catch {
      alert('Could not update project. Verify URLs and try again.')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await api.delete(`/api/projects/${id}`)
    setProjects((p) => p.filter((x) => x.id !== id))
    if (editing?.id === id) {
      setEditing(null)
      reset()
    }
  }

  if (!authed) {
    return (
      <div className="relative min-h-screen px-4 py-24">
        <div className="mx-auto max-w-md rounded-3xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] p-8">
          <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">DASHBOARD</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Enter access PIN</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Default PIN is <span className="text-[color:var(--fg)]">8821</span> unless you set{' '}
            <code className="rounded bg-black/30 px-1">VITE_DASHBOARD_PIN</code>.
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-6 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_8%,transparent)] px-4 py-3 text-sm outline-none"
            placeholder="PIN"
          />
          {pinErr && <p className="mt-2 text-sm text-[color:var(--accent2)]">Incorrect PIN</p>}
          <button
            type="button"
            onClick={tryAuth}
            className="mt-4 w-full rounded-2xl px-4 py-3 font-medium text-[#031016]"
            style={{ background: 'linear-gradient(120deg, var(--accent), var(--accent3))' }}
          >
            Unlock
          </button>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
        </div>
      </div>
    )
  }

  const busyTitle = editing ? 'Edit project' : 'Add project'

  return (
    <div className="relative min-h-screen px-4 py-24 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">CONTROL ROOM</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Project dashboard</h1>
            <p className="mt-2 max-w-xl text-sm text-[color:var(--muted)]">
              Upload cover art, tune stacks, wire outbound links. Changes reflect instantly on the public
              grid.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-[color:var(--stroke)] px-4 py-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Portfolio
          </Link>
        </div>

        {loadErr && (
          <p className="rounded-2xl border border-[color:color-mix(in_oklab,var(--accent2)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--accent2)_10%,transparent)] px-4 py-3 text-sm">
            {loadErr}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="glass-panel flex gap-4 overflow-hidden rounded-3xl p-4"
              >
                <img src={mediaUrl(p.imageUrl)} alt="" className="h-24 w-36 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-semibold">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[color:var(--muted)]">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center gap-1 rounded-xl border border-[color:var(--stroke)] px-3 py-1 text-xs"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-[color:color-mix(in_oklab,var(--accent2)_35%,transparent)] px-3 py-1 text-xs text-[color:var(--accent2)]"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && !loadErr && (
              <p className="text-sm text-[color:var(--muted)]">No projects yet—create one on the right.</p>
            )}
          </div>

          <div className="glass-panel h-fit rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">{busyTitle}</h2>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null)
                    reset()
                    setImageFile(null)
                  }}
                  className="text-xs text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={handleSubmit(editing ? onUpdate : onCreate)}
              key={editing?.id ?? 'new'}
            >
              <div>
                <label className="text-xs text-[color:var(--muted)]">Title</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-3 py-2 text-sm outline-none"
                  {...register('title')}
                />
              </div>
              <div>
                <label className="text-xs text-[color:var(--muted)]">Description</label>
                <textarea
                  rows={4}
                  className="mt-1 w-full resize-none rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-3 py-2 text-sm outline-none"
                  {...register('description')}
                />
              </div>
              <div>
                <label className="text-xs text-[color:var(--muted)]">Technologies (comma separated)</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-3 py-2 text-sm outline-none"
                  {...register('technologies')}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-[color:var(--muted)]">Project URL</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-3 py-2 text-sm outline-none"
                    {...register('projectUrl')}
                  />
                </div>
                <div>
                  <label className="text-xs text-[color:var(--muted)]">GitHub URL</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-3 py-2 text-sm outline-none"
                    {...register('githubUrl')}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[color:var(--muted)]">Image</label>
                <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-dashed border-[color:var(--stroke)] p-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[color:var(--muted)]">
                    <ImagePlus className="h-4 w-4" />
                    <span>Upload file</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {imageFile && <p className="text-xs text-[color:var(--accent)]">{imageFile.name}</p>}
                  <div>
                    <p className="text-[11px] text-[color:var(--muted)]">
                      {editing ? 'Remote image URL (optional)' : 'Or remote image URL'}
                    </p>
                    <input
                      className="mt-1 w-full rounded-xl border border-[color:var(--stroke)] bg-transparent px-3 py-2 text-xs outline-none"
                      placeholder="https://..."
                      {...register('imageUrl')}
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-[color:var(--muted)]">
                  {editing
                    ? 'Leave file empty to keep the current image, upload a replacement, or set a remote URL.'
                    : 'Provide a file or a remote image URL.'}
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium text-[#031016] md:w-auto"
                style={{ background: 'linear-gradient(120deg, var(--accent), var(--accent3))' }}
              >
                {editing ? (
                  <>
                    <Pencil className="h-4 w-4" />
                    Save changes
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Publish project
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
