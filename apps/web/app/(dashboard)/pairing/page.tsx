import Image from 'next/image';

export default function PairingPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-brand-700">Pair a device</h1>
        <p className="text-sm text-brand-600">
          Generate a short-lived QR code that links a device to your organisation. Pairing requires guardian
          authentication and explicit consent from the device owner for adults.
        </p>
        <ol className="space-y-2 text-sm text-brand-600">
          <li>1. Ask the child or adult to install the Sentinel AU agent.</li>
          <li>2. On the device, open the app and choose “Scan pairing code”.</li>
          <li>3. Confirm consent details and assign the correct profile.</li>
        </ol>
        <div className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand-500">Pairing token</p>
          <p className="text-lg font-semibold text-brand-700">AUS-2941-QR</p>
          <p className="text-xs text-brand-500">Expires in 09:32</p>
          <button className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
            Regenerate
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-sm">
          <Image src="/demo-qr.svg" alt="Pairing QR" width={220} height={220} />
          <p className="mt-3 text-center text-xs text-brand-500">QR codes are unique per device and rotate every 60 seconds.</p>
        </div>
      </div>
    </div>
  );
}
