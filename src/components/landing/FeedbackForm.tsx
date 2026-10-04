'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Loader2, MessageSquare, Star } from 'lucide-react';

const ratingOptions = [
  { label: 'Poor', value: 1 },
  { label: 'Fair', value: 2 },
  { label: 'Good', value: 3 },
  { label: 'Very Good', value: 4 },
  { label: 'Excellent', value: 5 },
] as const;

interface FeedbackFormProps {
  title?: string;
  description?: string;
  showRating?: boolean;
  showEmail?: boolean;
  submitLabel?: string;
  onSubmit?: (data: { rating: number; message: string; name: string; email: string }) => Promise<void> | void;
  successMessage?: string;
  className?: string;
}

export default function FeedbackForm({
  title = 'Share your feedback',
  description = 'Tell us what is working for you and what we can improve. It will only take a minute.',
  showRating = true,
  showEmail = true,
  submitLabel = 'Submit feedback',
  onSubmit,
  successMessage = 'Thank you! Your feedback has been received.',
  className = '',
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (showRating && rating === 0) {
      setErrorMessage('Please select a rating.');
      setStatus('error');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please share your feedback.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMessage('');
    try {
      await onSubmit?.({ rating, message, name, email });
      setStatus('success');
      setMessage('');
      setName('');
      setEmail('');
      setRating(0);
    } catch (error) {
      console.error(error);
      setErrorMessage('We could not submit your feedback. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className={`rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 backdrop-blur sm:p-8 ${className}`}>
      <div className="flex items-start gap-3">
        <MessageSquare size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
        <div>
          <h3 className="text-heading font-bold text-primary-light">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-primary-light/55">{description}</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="mt-6 rounded-2xl bg-success/10 p-4 text-sm text-success-light" role="status">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {showRating && (
            <div>
              <label className="text-sm font-medium text-primary-light">Rating</label>
              <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {ratingOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={value <= rating}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={
                        value <= (hoverRating || rating) ? 'text-sky-400 fill-sky-400' : 'text-primary-light/25'
                      }
                      aria-label={label}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="block text-sm font-medium text-primary-light">
            Your feedback
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Tell us what you think..."
              className="mt-2 w-full resize-y rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-primary-light">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400"
              />
            </label>
            {showEmail && (
              <label className="block text-sm font-medium text-primary-light">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400"
                />
              </label>
            )}
          </div>

          {status === 'error' && (
            <p className="rounded-2xl bg-danger/10 p-3 text-sm text-danger-light" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-sky-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                {submitLabel} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
