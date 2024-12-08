export default function Loading() {
  return (
    <div className="my-36 flex flex-col justify-center gap-14 items-center">
      <h1 className="text-center text-4xl font-bold text-primary-500">We&apos;re getting the test ready for you</h1>

      <div className="flex flex-col justify-center gap-2 items-center">
        <p className="text-center text-lg font-semibold text-secondary-400">This may take up to a minute.</p>
        <p className="text-center text-lg font-semibold text-secondary-400">Please don&apos;t refresh this page or quit the app</p>
      </div>
    </div>
  )
}