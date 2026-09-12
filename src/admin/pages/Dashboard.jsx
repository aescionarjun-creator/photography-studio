import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Images,
  Camera,
  MapPin,
  Plus,
  ArrowRight,
  TrendingUp,
  Phone,
  Calendar,
  ExternalLink,
  Clapperboard,
  Briefcase,
  Eye,
  Frame,
  Star,
} from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();
  const {
    bookings,
    enquiries,
    gallery,
    services,
    branches,
    portfolio,
    films,
    frameOrders,
    testimonials,
  } = useAdminData();

  // Dynamic Time of Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Metrics
  const totalBookings = bookings.length;
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;
  const completedShoots = bookings.filter((b) => b.status === "Completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;
  const totalGallery = gallery.length;
  const totalServices = services.length;
  const totalBranches = branches.length;
  const newFrameOrders = (frameOrders || []).filter((o) => o.status === "New").length;
  const googleReviews = (testimonials || []).filter((t) => t.source === "google");
  const pendingGoogleReviews = googleReviews.filter((t) => !t.approved && !t.hidden).length;

  // Upcoming shoots (sorted by date)
  const upcomingShoots = [...bookings]
    .filter((b) => b.status === "Confirmed" || b.status === "In Progress" || b.status === "New")
    .slice(0, 5);

  // Recent enquiries
  const recentEnquiries = [...enquiries].slice(0, 4);

  // Monthly breakdown mock data for SVG chart
  const monthlyData = [
    { month: "Mar", count: 8, revenue: "₹6.4L" },
    { month: "Apr", count: 14, revenue: "₹11.2L" },
    { month: "May", count: 19, revenue: "₹15.8L" },
    { month: "Jun", count: 12, revenue: "₹9.5L" },
    { month: "Jul", count: 16, revenue: "₹13.0L" },
    { month: "Aug", count: 22, revenue: "₹18.4L" },
  ];
  const maxCount = Math.max(...monthlyData.map((d) => d.count));

  // Service distribution
  const serviceStats = [
    { name: "Wedding Photography", count: 42, percentage: 48 },
    { name: "Pre-Wedding Shoots", count: 24, percentage: 28 },
    { name: "Cinematic Wedding Films", count: 18, percentage: 20 },
    { name: "Baby & Maternity", count: 10, percentage: 12 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-6 text-[#2B2B2B] shadow-sm border border-[#E7E0D2] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[#C9A669] before:via-[#DFCA9F] before:to-[#9C7B3D]">
        {/* Subtle decorative warm background aura */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 bg-[#FBF7F0] rounded-full blur-2xl opacity-70" />

        <div className="space-y-1.5 relative z-10 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#7A746B] font-medium mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#C9A669]" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1C1B19] tracking-tight">
            {getGreeting()},{" "}
            <span className="bg-gradient-to-r from-[#8C6D32] to-[#C9A669] bg-clip-text text-transparent">
              {adminUser?.name || "Subash"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6A62] max-w-xl leading-relaxed">
            Here is what is happening across your studio shoots, incoming bride &amp; groom enquiries, and media assets today.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          {newFrameOrders > 0 ? (
            <Link
              to="/admin/frames"
              className="px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#2B2B2B] border border-[#E7E0D2] rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm group"
            >
              <Frame className="w-3.5 h-3.5 text-[#C9A669] group-hover:scale-110 transition-transform" />
              <span>Frame Orders</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#C9A669]/15 text-[#8C6D32] text-[10px] font-bold">
                {newFrameOrders}
              </span>
            </Link>
          ) : (
            <Link
              to="/admin/bookings"
              className="px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#2B2B2B] border border-[#E7E0D2] rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm group"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#C9A669] group-hover:scale-110 transition-transform" />
              <span>Shoot Schedule</span>
            </Link>
          )}

          <Link
            to="/admin/bookings?new=true"
            className="px-4 py-2.5 bg-gradient-to-r from-[#C9A669] to-[#9C7B3D] hover:from-[#D4B376] hover:to-[#A88544] text-[#1C1B19] rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* 8 Statistic Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={CalendarDays}
          description="All studio shoots"
          accent="neutral"
          onClick={() => navigate("/admin/bookings")}
        />
        <StatCard
          title="New Enquiries"
          value={newEnquiries}
          icon={MessageSquare}
          trend={`${newEnquiries} awaiting review`}
          accent="gold"
          onClick={() => navigate("/admin/enquiries")}
        />
        <StatCard
          title="Confirmed Shoots"
          value={confirmedBookings}
          icon={CheckCircle2}
          description="Upcoming schedule"
          accent="neutral"
          onClick={() => navigate("/admin/bookings")}
        />
        <StatCard
          title="Completed Shoots"
          value={completedShoots}
          icon={Clock}
          description="Successfully archived"
          accent="neutral"
          onClick={() => navigate("/admin/bookings")}
        />
        <StatCard
          title="Cancelled Shoots"
          value={cancelledBookings}
          icon={XCircle}
          description="Postponed or cancelled"
          accent="neutral"
          onClick={() => navigate("/admin/bookings")}
        />
        <StatCard
          title="Gallery Images"
          value={totalGallery}
          icon={Images}
          description="High-res photos"
          accent="neutral"
          onClick={() => navigate("/admin/gallery")}
        />
        <StatCard
          title="Active Services"
          value={totalServices}
          icon={Camera}
          description="Studio packages"
          accent="neutral"
          onClick={() => navigate("/admin/services")}
        />
        <StatCard
          title="Active Branches"
          value={totalBranches}
          icon={MapPin}
          description="Studios & lounges"
          accent="neutral"
          onClick={() => navigate("/admin/branches")}
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#E7E0D2] shadow-sm min-w-0">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-display font-semibold text-sm text-[#2B2B2B] truncate">
            Quick Management Actions
          </h3>
          <span className="text-xs text-[#6F6A62] shrink-0">One-click shortcuts</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
          <Link
            to="/admin/bookings?new=true"
            className="p-2.5 sm:p-3 rounded-lg border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-1.5 group min-w-0"
          >
            <div className="p-2 rounded-md bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B] truncate w-full">+ New Booking</span>
          </Link>

          <Link
            to="/admin/gallery?new=true"
            className="p-2.5 sm:p-3 rounded-lg border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-1.5 group min-w-0"
          >
            <div className="p-2 rounded-md bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Images className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B] truncate w-full">+ Upload Image</span>
          </Link>

          <Link
            to="/admin/portfolio?new=true"
            className="p-2.5 sm:p-3 rounded-lg border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-1.5 group min-w-0"
          >
            <div className="p-2 rounded-md bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B] truncate w-full">+ Add Project</span>
          </Link>

          <Link
            to="/admin/services?new=true"
            className="p-2.5 sm:p-3 rounded-lg border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-1.5 group min-w-0"
          >
            <div className="p-2 rounded-md bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B] truncate w-full">+ Add Service</span>
          </Link>

          <Link
            to="/admin/films?new=true"
            className="p-2.5 sm:p-3 rounded-lg border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-1.5 group min-w-0"
          >
            <div className="p-2 rounded-md bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Clapperboard className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B] truncate w-full">+ Add Film</span>
          </Link>
        </div>
      </div>

      {/* Analytics Section: Monthly Shoot Bar Chart & Service Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
        {/* Left: Monthly Shoots Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-xl p-4 sm:p-5 border border-[#E7E0D2] shadow-sm space-y-5 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#6F6A62]">
                Studio Analytics
              </span>
              <h3 className="font-display font-semibold text-base sm:text-lg text-[#2B2B2B] truncate">
                Monthly Bookings &amp; Shoots
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 bg-[#F8F6F2] text-[#9C7B3D] rounded-full font-semibold border border-[#E7E0D2] shrink-0">
              2026 Season
            </span>
          </div>

          {/* Minimalist Interactive Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-3 pt-8 pb-2 px-1 sm:px-2 border-b border-[#E7E0D2] relative">
            {monthlyData.map((item, idx) => {
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative min-w-0">
                  {/* Tooltip on hover - positioned absolutely so it never expands flex width */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-center pointer-events-none z-20">
                    <span className="bg-[#2B2B2B] text-[#E4D3A6] text-[10px] py-1 px-2 rounded-md font-bold shadow whitespace-nowrap">
                      {item.count} Shoots ({item.revenue})
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-[#F4EFE6] group-hover:bg-[#C9A669] rounded-t-xl transition-all duration-300 relative overflow-hidden"
                       style={{ height: `${heightPercent}%` }}>
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-[#9C7B3D]/30 to-transparent opacity-0 group-hover:opacity-100" />
                  </div>
                  {/* Label */}
                  <span className="text-xs font-semibold text-[#6F6A62] mt-3 group-hover:text-[#2B2B2B]">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#6F6A62] pt-1 min-w-0">
            <span className="flex items-center gap-2 min-w-0 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A669] shrink-0" />
              <span className="truncate">Peak Season: August &amp; Wedding Auspicious Muhurtham</span>
            </span>
            <span className="font-semibold text-[#2B2B2B] shrink-0 pl-4 sm:pl-0">91 Total Shoots YTD</span>
          </div>
        </div>

        {/* Right: Popular Services Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 sm:p-5 border border-[#E7E0D2] shadow-sm space-y-4 min-w-0">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#6F6A62]">
              Package Demand
            </span>
            <h3 className="font-display font-semibold text-base sm:text-lg text-[#2B2B2B]">
              Popular Studio Services
            </h3>
          </div>

          <div className="space-y-4">
            {serviceStats.map((srv, idx) => (
              <div key={idx} className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between text-xs font-medium gap-2 min-w-0">
                  <span className="text-[#2B2B2B] truncate">{srv.name}</span>
                  <span className="text-[#9C7B3D] font-bold shrink-0 pl-2">{srv.count} shoots ({srv.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#F8F6F2] rounded-full overflow-hidden border border-[#E7E0D2]/80">
                  <div
                    className="h-full bg-gradient-to-r from-[#C9A669] to-[#9C7B3D] rounded-full transition-all duration-500"
                    style={{ width: `${srv.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E7E0D2]/80">
            <Link
              to="/admin/services"
              className="text-xs text-[#9C7B3D] hover:underline font-semibold flex items-center justify-between"
            >
              <span>Manage Service Pricing &amp; Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Shoots & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Upcoming Shoots Table */}
        <div className="lg:col-span-7 bg-white rounded-xl p-4 sm:p-5 border border-[#E7E0D2] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E0D2]">
            <div>
              <h3 className="font-display font-semibold text-base text-[#2B2B2B]">
                Upcoming Scheduled Shoots
              </h3>
              <p className="text-xs text-[#6F6A62]">Next confirmed client sessions</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs text-[#9C7B3D] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto w-full min-w-0">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="text-[#6F6A62] border-b border-[#F8F6F2]">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F6F2]">
                {upcomingShoots.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3 font-medium text-[#2B2B2B]">
                      <div className="font-semibold">{b.customerName}</div>
                      <div className="text-[10px] text-[#8E867B]">{b.location}</div>
                    </td>
                    <td className="py-3 text-[#6F6A62]">{b.requiredService}</td>
                    <td className="py-3 font-medium text-[#2B2B2B]">
                      {new Date(b.eventDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/bookings?id=${b.id}`)}
                        className="p-1.5 text-[#6F6A62] hover:text-[#9C7B3D] rounded-lg hover:bg-[#F8F6F2]"
                        title="View Shoot Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Enquiries Box */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 sm:p-5 border border-[#E7E0D2] shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E0D2]">
            <div>
              <h3 className="font-display font-semibold text-base text-[#2B2B2B]">
                Recent Client Enquiries
              </h3>
              <p className="text-xs text-[#6F6A62]">Leads received via website</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs text-[#9C7B3D] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentEnquiries.map((enq) => (
              <div
                key={enq.id}
                onClick={() => navigate("/admin/enquiries")}
                className="p-3 rounded-lg border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] cursor-pointer transition-all space-y-1.5 min-w-0"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#2B2B2B] truncate">
                      {enq.clientName || enq.name || "Anonymous"}
                    </h4>
                    <p className="text-[11px] text-[#9C7B3D] font-medium truncate">
                      {enq.interestedService || enq.service || "General Inquiry"}
                    </p>
                  </div>
                  <StatusBadge status={enq.status} size="sm" />
                </div>
                <p className="text-xs text-[#6F6A62] line-clamp-2 leading-relaxed break-words">
                  "{enq.message || enq.notes || enq.clientMessage || "No message provided."}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#8E867B] pt-1">
                  <span>{enq.phone || "No phone"}</span>
                  <span>{enq.receivedDate || enq.createdAt || ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
