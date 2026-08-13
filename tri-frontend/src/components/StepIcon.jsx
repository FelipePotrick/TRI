const ICONS = {
  symptoms: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="6" width="28" height="36" rx="4" stroke="var(--tri-red)" strokeWidth="2.5" />
      <path d="M18 4h12v6H18z" fill="var(--tri-red)" />
      <path d="M16 20l5 5 11-11" stroke="var(--tri-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="32" x2="32" y2="32" stroke="var(--tri-border)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="37" x2="26" y2="37" stroke="var(--tri-border)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  classify: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 32a16 16 0 0 1 32 0"
        stroke="var(--tri-border)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M8 32a16 16 0 0 1 22-14.7"
        stroke="var(--tri-red)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line x1="24" y1="32" x2="32" y2="20" stroke="var(--tri-green)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="32" r="3" fill="var(--tri-green)" />
    </svg>
  ),
  referral: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 44s14-12.6 14-23a14 14 0 1 0-28 0c0 10.4 14 23 14 23z"
        stroke="var(--tri-red)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M24 13v11M18.5 18.5h11" stroke="var(--tri-green)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 12a16 16 0 1 0 4.6-11.2"
        stroke="var(--tri-border)"
        strokeWidth="0"
      />
      <path
        d="M24 8a16 16 0 1 1-15.8 13.5"
        stroke="var(--tri-red)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M4 8v7h7" stroke="var(--tri-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 15v9l7 4" stroke="var(--tri-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export default function StepIcon({ type }) {
  return <div className="step-icon">{ICONS[type]}</div>
}
