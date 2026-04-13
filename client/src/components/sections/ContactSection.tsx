import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../../lib/api'
import { useSectionReveal } from '../../hooks/useSectionReveal'

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Tell me a bit more (10+ characters)'),
})

type Form = z.infer<typeof schema>

export function ContactSection() {
  const ref = useSectionReveal<HTMLElement>()
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    setStatus('idle')
    try {
      await api.post('/api/contact', data)
      setStatus('ok')
      reset()
    } catch {
      setStatus('err')
    }
  }

  return (
    <section ref={ref} id="contact" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">CONTACT</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Let&apos;s connect and <span className="text-gradient">work together</span>
          </h2>
          <p className="mt-6 text-[color:var(--muted)]">
            Reach me at amolr5624@gmail.com or send a message using this form. I am open to collaboration,
            project discussions, and learning opportunities.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel space-y-4 rounded-3xl p-6 md:p-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <label className="text-xs tracking-wide text-[color:var(--muted)]" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none transition focus:border-[color:color-mix(in_oklab,var(--accent)_55%,transparent)]"
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-[color:var(--accent2)]">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-xs tracking-wide text-[color:var(--muted)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 w-full rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none transition focus:border-[color:color-mix(in_oklab,var(--accent)_55%,transparent)]"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[color:var(--accent2)]">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs tracking-wide text-[color:var(--muted)]" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="mt-2 w-full resize-none rounded-2xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none transition focus:border-[color:color-mix(in_oklab,var(--accent)_55%,transparent)]"
              {...register('message')}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-[color:var(--accent2)]">{errors.message.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium text-[#031016] disabled:opacity-60 md:w-auto"
            style={{
              background: 'linear-gradient(120deg, var(--accent), var(--accent3))',
              boxShadow: '0 0 30px color-mix(in oklab, var(--accent) 30%, transparent)',
            }}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
          {status === 'ok' && (
            <p className="text-sm text-[color:var(--accent)]">Message received. I will get back to you soon.</p>
          )}
          {status === 'err' && (
            <p className="text-sm text-[color:var(--accent2)]">Could not reach the server. Try again shortly.</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
