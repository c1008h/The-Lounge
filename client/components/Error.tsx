import React from 'react'

interface ErrorProps {
    message?: string;
    error?: string | any;
}
export default function Error({ message, error }: ErrorProps) {
  return (
    <div>
        {message && !error ? (
            <>{message}</>
        ) : (
            <>
                {message}: {error}

            </>
        )}
    </div>
  )
}
