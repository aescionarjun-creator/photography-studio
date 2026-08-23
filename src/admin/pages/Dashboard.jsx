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
  Sparkles,
  Phone,
  Calendar,
  ExternalLink,
  Clapperboard,
  Briefcase,
  Eye,
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
      <div className="bg-gradient-to-r from-[#24221F] to-[#1C1B19] rounded-3xl p-6 sm:p-8 text-[#F8F6F2] shadow-lg border border-[#3A3833] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#322F2A] text-[#E4D3A6] text-xs font-semibold border border-[#48443D]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A669]" />
            <span>Studio Management Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F8F6F2]">
            {getGreeting()}, {adminUser?.name || "Subash"}
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A196] max-w-xl leading-relaxed">
            Here's what's happening with your studio shoots, incoming bride &amp; groom enquiries, and media assets today.
          </p>
        </div>

        {/* Quick Actions Button Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 relative z-10">
          <Link
            to="/admin/bookings?new=true"
            className="px-4 py-2.5 bg-gradient-to-r from-[#C9A669] to-[#9C7B3D] text-[#1C1B19] rounded-xl text-xs font-bold shadow hover:brightness-110 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
          <Link
            to="/admin/gallery"
            className="px-4 py-2.5 bg-[#2E2C27] hover:bg-[#38352F] text-[#F8F6F2] border border-[#48443D] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Images className="w-4 h-4 text-[#C9A669]" />
            <span>Upload Photo</span>
          </Link>
        </div>
      </div>

      {/* 8 Statistic Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <div className="bg-white rounded-2xl p-5 border border-[#E7E0D2] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sm text-[#2B2B2B]">
            Quick Management Actions
          </h3>
          <span className="text-xs text-[#6F6A62]">One-click shortcuts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/admin/bookings?new=true"
            className="p-3.5 rounded-xl border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="p-2.5 rounded-lg bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B]">+ Add Booking</span>
          </Link>

          <Link
            to="/admin/gallery"
            className="p-3.5 rounded-xl border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="p-2.5 rounded-lg bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Images className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B]">+ Upload Gallery</span>
          </Link>

          <Link
            to="/admin/portfolio"
            className="p-3.5 rounded-xl border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="p-2.5 rounded-lg bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B]">+ Add Project</span>
          </Link>

          <Link
            to="/admin/services"
            className="p-3.5 rounded-xl border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="p-2.5 rounded-lg bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B]">+ Add Service</span>
          </Link>

          <Link
            to="/admin/films"
            className="p-3.5 rounded-xl border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="p-2.5 rounded-lg bg-[#F8F6F2] group-hover:bg-[#F4EFE6] text-[#9C7B3D] transition-colors">
              <Clapperboard className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B]">+ Add Film</span>
          </Link>
        </div>
      </div>

      {/* Analytics Section: Monthly Shoot Bar Chart & Service Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Shoots Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E7E0D2] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#6F6A62]">
                Studio Analytics
              </span>
              <h3 className="font-display font-semibold text-lg text-[#2B2B2B]">
                Monthly Bookings &amp; Shoots
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 bg-[#F8F6F2] text-[#9C7B3D] rounded-full font-semibold border border-[#E7E0D2]">
              2026 Season
            </span>
          </div>

          {/* Minimalist Interactive Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E7E0D2]">
            {monthlyData.map((item, idx) => {
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-center pointer-events-none">
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

          <div className="flex items-center justify-between text-xs text-[#6F6A62] pt-1">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A669]" />
              Peak Season: August &amp; Wedding Auspicious Muhurtham
            </span>
            <span className="font-semibold text-[#2B2B2B]">91 Total Shoots YTD</span>
          </div>
        </div>

        {/* Right: Popular Services Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E7E0D2] shadow-sm space-y-5">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#6F6A62]">
              Package Demand
            </span>
            <h3 className="font-display font-semibold text-lg text-[#2B2B2B]">
              Popular Studio Services
            </h3>
          </div>

          <div className="space-y-4">
            {serviceStats.map((srv, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#2B2B2B]">{srv.name}</span>
                  <span className="text-[#9C7B3D] font-bold">{srv.count} shoots ({srv.percentage}%)</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Shoots Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E7E0D2] shadow-sm space-y-4">
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
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
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E7E0D2] shadow-sm space-y-4">
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

          <div className="space-y-3">
            {recentEnquiries.map((enq) => (
              <div
                key={enq.id}
                onClick={() => navigate("/admin/enquiries")}
                className="p-3.5 rounded-xl border border-[#E7E0D2] hover:border-[#C9A669] hover:bg-[#FDFBF7] cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2B2B]">
                      {enq.name}
                    </h4>
                    <p className="text-[11px] text-[#9C7B3D] font-medium">
                      {enq.interestedService}
                    </p>
                  </div>
                  <StatusBadge status={enq.status} size="sm" />
                </div>
                <p className="text-xs text-[#6F6A62] line-clamp-2 leading-relaxed">
                  "{enq.message}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#8E867B] pt-1">
                  <span>{enq.phone}</span>
                  <span>{enq.receivedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
