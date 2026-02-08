interface ErrorMessageProps {
  message: string | null;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="w-full bg-red-50 border border-red-200 rounded-lg px-4 py-3">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}
