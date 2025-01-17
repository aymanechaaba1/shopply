'use client';

import React from 'react';
import { useDraftModeEnvironment } from 'next-sanity/hooks';
import { useRouter } from 'next/navigation';

function DisableDraftModeBtn() {
  let environment = useDraftModeEnvironment();
  let router = useRouter();

  if (environment !== 'live' && environment !== 'unknown') return null;

  let handleClick = async () => {
    await fetch('/draft-mode/disable');
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-gray-50 px-4 py-2 z-50"
    >
      Disable Draft Mode
    </button>
  );
}

export default DisableDraftModeBtn;
