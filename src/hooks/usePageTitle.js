import { useEffect } from 'react';

// Sets document.title for each page and restores on unmount.
export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — VELOOP Rewards Games` : 'VELOOP Rewards Games';
    return () => { document.title = prev; };
  }, [title]);
}
