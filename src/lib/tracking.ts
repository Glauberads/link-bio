export async function trackEvent(eventName: string, data: { alvo: string, tipo: string, pagina: string }) {
  // 1. Get Meta Cookies if they exist
  let fbp = undefined;
  let fbc = undefined;
  
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('_fbp=')) {
        fbp = cookie.substring('_fbp='.length);
      }
      if (cookie.startsWith('_fbc=')) {
        fbc = cookie.substring('_fbc='.length);
      }
    }
  }

  // 2. Fire Frontend Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, data);
  }

  // 3. Send to our Backend (Database + Meta CAPI)
  try {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        ...data,
        fbp,
        fbc,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
      })
    });
  } catch (error) {
    console.error('Tracking Error:', error);
  }
}
