import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Plus,
  Search,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  X,
  MessageSquareQuote,
  Quote,
} from "lucide-react";
import ImageUploader from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import { useAdminData } from "../context/AdminDataContext";
import { useToast } from "../context/ToastContext";

export default function TestimonialsManager() {
  const {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialApproved,
    toggleTestimonialFeatured,
  } = useAdminData();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const initialForm = {
    customerName: "",
    customerRole: "Wedding Clients",
    customerImage: "",
    rating: 5,
    eventType: "Wedding & Reception",
    review: "",
    date: "August 2026",
    approved: true,
    featured: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (tst) => {
    setEditingTestimonial(tst);
    setFormData({
      customerName: tst.customerName || "",
      customerRole: tst.customerRole || "Wedding Clients",
      customerImage: tst.customerImage || "",
      rating: tst.rating || 5,
      eventType: tst.eventType || "",
      review: tst.review || "",
      date: tst.date || "",
      approved: tst.approved ?? true,
      featured: tst.featured ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.review.trim()) {
      addToast("Customer name and review content are required.", "warning");
      return;
    }

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, formData);
      addToast("Client testimonial updated.", "success");
    } else {
      addTestimonial(formData);
      addToast("New testimonial added successfully.", "success");
    }

    setModalOpen(false);
  };

  const handleDeletePrompt = (tst) => {
    setItemToDelete(tst);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteTestimonial(itemToDelete.id);
      addToast(`Testimonial from "${itemToDelete.customerName}" deleted.`, "info");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#2B2B2B]">
            Client Reviews &amp; Testimonials
          </h2>
          <p className="text-xs text-[#6F6A62] mt-0.5">
            Manage feedback from brides, grooms, and families to display trust badges on the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2B2B2B] text-white hover:bg-[#1C1B19] rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E4D3A6]" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No testimonials yet"
          description="Add client testimonials and reviews."
          actionLabel="Add Review"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((tst) => (
            <div
              key={tst.id}
              className="bg-white rounded-3xl border border-[#E7E0D2] p-6 shadow-sm hover:shadow-md hover:border-[#C9A669]/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Stars & Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#9C7B3D]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < tst.rating
                            ? "fill-[#9C7B3D] text-[#9C7B3D]"
                            : "text-[#E7E0D2]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    {tst.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4EFE6] text-[#9C7B3D] border border-[#E4D3A6]">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        tst.approved
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-stone-100 text-stone-600 border-stone-200"
                      }`}
                    >
                      {tst.approved ? "Approved" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#2B2B2B] leading-relaxed italic line-clamp-4">
                  "{tst.review}"
                </p>
              </div>

              {/* Client Info & Card Actions */}
              <div className="pt-3 border-t border-[#F8F6F2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F4EFE6] border border-[#E7E0D2] overflow-hidden flex items-center justify-center font-bold text-[#9C7B3D] text-xs shrink-0">
                    {tst.customerImage ? (
                      <img
                        src={tst.customerImage}
                        alt={tst.customerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      tst.customerName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2B2B2B]">
                      {tst.customerName}
                    </h4>
                    <p className="text-[10px] text-[#8E867B]">
                      {tst.eventType} • {tst.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      toggleTestimonialApproved(tst.id);
                      addToast(
                        `Review is now ${!tst.approved ? "Approved" : "Hidden"}.`,
                        "info"
                      );
                    }}
                    className="p-1.5 text-[#6F6A62] hover:text-[#2B2B2B] rounded-lg transition-colors"
                    title={tst.approved ? "Hide from website" : "Approve for website"}
                  >
                    {tst.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(tst)}
                    className="p-1.5 text-[#6F6A62] hover:text-[#2B2B2B] rounded-lg transition-colors"
                    title="Edit Review"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePrompt(tst)}
                    className="p-1.5 text-[#6F6A62] hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7E0D2] z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#6F6A62] hover:text-[#2B2B2B] rounded-xl hover:bg-[#F8F6F2]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-widest2 text-[#9C7B3D]">
                  {editingTestimonial ? "Edit Review" : "New Client Testimonial"}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#2B2B2B]">
                  {editingTestimonial ? `Update ${editingTestimonial.customerName}'s Review` : "Add Client Feedback"}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <ImageUploader
                  value={formData.customerImage}
                  onChange={(url) => setFormData({ ...formData, customerImage: url })}
                  label="Customer Photo / Portrait (Optional)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#6F6A62]">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Arvind & Kavitha"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E0D2] rounded-xl text-xs text-[#2B2B2B] focus:border-[#C9A669] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#6F6A62]">Shoot / Event Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding & Reception"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E0D2] rounded-xl text-xs text-[#2B2B2B] focus:border-[#C9A669] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#6F6A62]">Star Rating (1 to 5)</label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 text-[#9C7B3D] hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= formData.rating
                                ? "fill-[#9C7B3D] text-[#9C7B3D]"
                                : "text-[#E7E0D2]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#6F6A62]">Date / Period</label>
                    <input
                      type="text"
                      placeholder="e.g. August 2026"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E0D2] rounded-xl text-xs text-[#2B2B2B] focus:border-[#C9A669] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#6F6A62]">Client Review Text *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write the full feedback or quote from the couple/family..."
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    className="w-full p-2.5 bg-[#F8F6F2] border border-[#E7E0D2] rounded-xl text-xs text-[#2B2B2B] focus:border-[#C9A669] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2B2B2B]">
                    <input
                      type="checkbox"
                      checked={formData.approved}
                      onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                      className="w-4 h-4 rounded border-[#E7E0D2] text-[#9C7B3D] focus:ring-[#C9A669]"
                    />
                    <span>Approved for Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2B2B2B]">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-[#E7E0D2] text-[#9C7B3D] focus:ring-[#C9A669]"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E7E0D2]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E7E0D2] text-[#6F6A62] hover:bg-[#F8F6F2] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2B2B2B] text-white hover:bg-[#1C1B19] font-semibold shadow-md active:scale-95 transition-all"
                  >
                    {editingTestimonial ? "Save Review" : "Add Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${itemToDelete?.customerName}"?`}
        confirmText="Delete Review"
        isDestructive={true}
      />
    </div>
  );
}
