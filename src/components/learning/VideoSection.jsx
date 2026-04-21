export default function VideoSection({ title, videoUrl }) {
  return (
    <div className="glass-card rounded-[2rem] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Video</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">{title}</h3>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-premium">
        <div className="aspect-video">
          <iframe
            className="h-full w-full"
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
