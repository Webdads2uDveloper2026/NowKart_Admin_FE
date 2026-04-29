export function Skeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="h-4 w-64 bg-neutral-200 rounded-full mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square rounded-2xl bg-neutral-200 animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-3 w-24 bg-neutral-200 rounded-full animate-pulse" />
            <div className="h-7 w-3/4 bg-neutral-200 rounded-lg animate-pulse" />
            <div className="h-4 w-1/3 bg-neutral-200 rounded-full animate-pulse" />
            <div className="h-8 w-1/2 bg-neutral-200 rounded-lg animate-pulse" />
            <div className="border-t border-neutral-100 my-1" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-20 bg-neutral-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
            <div className="border-t border-neutral-100 my-1" />
            <div className="h-12 w-full bg-neutral-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
