export default function Gateway({text, borderPosition='y', className, style, bg = true}) {
  return (
    <div
    className={`flex w-full ${ borderPosition === 'x' ? 'border-x-2' : 'border-y-2' } border-primary text-primary justify-center items-center ${bg ? ' bg-white-smoke ' : ' bg-[#EDEEF0] '} p-2 ${className}`}
    style={style}
    >
      <span className="min-h-4">{text}</span>
    </div>
  );
}
