import { Camera, Plus } from "lucide-react";

export default function EmptyState({
  icon: Icon = Camera,
  title = "No records found",
  description = "Get started by adding your first record.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white border border-[#E7E0D2] my-4 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-[#F8F6F2] border border-[#E7E0D2] flex items-center justify-center text-[#9C7B3D] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-display font-semibold text-[#2B2B2B] mb-1">
        {title}
      </h4>
      <p className="text-sm text-[#6F6A62] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B2B2B] text-white hover:bg-[#1C1B19] text-sm font-medium rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#E4D3A6]" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
