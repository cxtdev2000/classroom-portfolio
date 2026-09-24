"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type IpVisit = {
  ip: string;
  firstSeen: string;
  lastSeen: string;
  hits: number;
  userAgent?: string;
  referer?: string;
  path?: string;
};

type TrafficStats = {
  totalUniqueIps: number;
  totalPageviews: number;
  lastUpdated: string;
  visits: Record<string, IpVisit>;
};

function formatDate(isoString: string) {
  if (!isoString) return "Chưa có";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function parseUserAgent(ua?: string) {
  if (!ua) return "Trình duyệt ẩn";
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
    if (ua.includes("iPhone")) return "📱 iPhone / iOS";
    if (ua.includes("Android")) return "📱 Android";
    return "📱 Thiết bị di động";
  }
  if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "💻 macOS";
  if (ua.includes("Windows")) return "💻 Windows PC";
  if (ua.includes("Linux")) return "💻 Linux";
  return "🌐 Trình duyệt Web";
}

export default function TrafficCountPage() {
  const [stats, setStats] = useState<TrafficStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/traffic", { cache: "no-store" });
      if (!res.ok) throw new Error("Không thể tải dữ liệu traffic");
      const data: TrafficStats = await res.json();
      setStats(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi lấy thống kê");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto refresh every 10 seconds while tab is open
    const interval = setInterval(() => fetchStats(), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    if (!confirm("Bạn có chắc chắn muốn xoá toàn bộ lịch sử đếm traffic không?")) {
      return;
    }
    try {
      const res = await fetch("/api/traffic", { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch {
      alert("Xoá thống kê thất bại");
    }
  };

  const visitsList = stats ? Object.values(stats.visits).sort((a, b) => {
    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
  }) : [];

  const avgHits =
    stats && stats.totalUniqueIps > 0
      ? (stats.totalPageviews / stats.totalUniqueIps).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-[#141210] text-[#f4efe8] font-sans antialiased p-4 md:p-8 selection:bg-[#c68b59] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#302924] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c68b59]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Traffic Analytics & Visitor Counter
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold mt-1 text-[#fbf8f5]">
              Báo cáo lưu lượng truy cập Lớp học Cô Phương Anh
            </h1>
            <p className="text-xs text-[#a89f91] mt-1">
              Hệ thống lọc theo địa chỉ IP độc lập · 1 IP truy cập hoặc reload nhiều lần chỉ tính là 1 count
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#3e342d] bg-[#211c18] hover:bg-[#2c2520] transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? "Đang tải..." : "Làm mới"}
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-red-900/40 text-red-400 bg-red-950/20 hover:bg-red-950/40 transition active:scale-95"
              title="Đặt lại thống kê về 0"
            >
              Reset
            </button>

            <Link
              href="/"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[#e17b88] hover:bg-[#cf6b78] text-white transition shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              Vào lớp ✏️
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Unique Visitors by IP */}
          <div className="p-5 rounded-2xl border border-[#302924] bg-[#1a1613]/90 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#c68b59]/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
            <div className="text-xs font-medium text-[#c68b59] uppercase tracking-wider">
              Lượng Visit theo IP
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-white">
                {loading ? "..." : stats?.totalUniqueIps || 0}
              </span>
              <span className="text-xs text-emerald-400 font-medium">IP duy nhất</span>
            </div>
            <p className="mt-3 text-xs text-[#a89f91] leading-relaxed">
              1 IP dù reload trang bao nhiêu lần cũng chỉ tính là <strong>1 count</strong>.
            </p>
          </div>

          {/* Card 2: Total Pageviews */}
          <div className="p-5 rounded-2xl border border-[#302924] bg-[#1a1613]/90 relative overflow-hidden shadow-lg">
            <div className="text-xs font-medium text-[#a89f91] uppercase tracking-wider">
              Tổng lượt tải trang (Hits)
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-white">
                {loading ? "..." : stats?.totalPageviews || 0}
              </span>
              <span className="text-xs text-[#a89f91]">lượt load</span>
            </div>
            <p className="mt-3 text-xs text-[#a89f91] leading-relaxed">
              Bao gồm cả các lần khách reload lại trang hoặc quay lại quán.
            </p>
          </div>

          {/* Card 3: Avg Hits / IP */}
          <div className="p-5 rounded-2xl border border-[#302924] bg-[#1a1613]/90 relative overflow-hidden shadow-lg">
            <div className="text-xs font-medium text-[#a89f91] uppercase tracking-wider">
              Tần suất trung bình
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-white">
                {loading ? "..." : avgHits}
              </span>
              <span className="text-xs text-[#a89f91]">lượt / khách</span>
            </div>
            <p className="mt-3 text-xs text-[#a89f91] leading-relaxed">
              Số lần tương tác hoặc reload trung bình của mỗi địa chỉ IP.
            </p>
          </div>

          {/* Card 4: Last Active */}
          <div className="p-5 rounded-2xl border border-[#302924] bg-[#1a1613]/90 relative overflow-hidden shadow-lg">
            <div className="text-xs font-medium text-[#a89f91] uppercase tracking-wider">
              Ghé thăm gần nhất
            </div>
            <div className="mt-2">
              <span className="text-sm md:text-base font-medium font-mono text-[#fbf8f5] block">
                {loading ? "..." : formatDate(stats?.lastUpdated || "")}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#a89f91] leading-relaxed">
              Tự động cập nhật mỗi 10 giây khi mở trang đếm này.
            </p>
          </div>

        </div>

        {/* Detailed IP Table */}
        <div className="rounded-2xl border border-[#302924] bg-[#1a1613] overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[#302924] flex items-center justify-between bg-[#1f1a16]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#fbf8f5]">
                Danh sách chi tiết theo Địa chỉ IP
              </h2>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Xếp theo thời điểm truy cập gần đây nhất
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#302924] text-[#c68b59]">
              {visitsList.length} IP đã ghi nhận
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#302924] text-[#a89f91] font-mono uppercase bg-[#171310]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Địa chỉ IP</th>
                  <th className="py-3 px-4 text-center">Số lần Reload / Visit</th>
                  <th className="py-3 px-4">Thiết bị / Nền tảng</th>
                  <th className="py-3 px-4">Lần đầu ghé thăm</th>
                  <th className="py-3 px-4">Lần cuối ghé thăm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26201b]">
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#a89f91]">
                      Đang tải số liệu...
                    </td>
                  </tr>
                )}

                {!loading && visitsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#a89f91]">
                      Chưa có lượt truy cập nào được ghi nhận. Hãy mở trang chủ và reload để kiểm tra!
                    </td>
                  </tr>
                )}

                {visitsList.map((item, idx) => (
                  <tr key={item.ip} className="hover:bg-[#221c17] transition">
                    <td className="py-3.5 px-4 font-mono text-[#a89f91]">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#fbf8f5]">
                      <div className="flex items-center gap-2">
                        <span>{item.ip}</span>
                        {item.hits > 1 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#3a2f26] text-[#e0a97c]">
                            {item.hits}x reloads
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full font-mono font-bold bg-[#c68b59]/20 text-[#e0a97c] border border-[#c68b59]/30">
                        {item.hits}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#d4cbbe] max-w-xs truncate" title={item.userAgent}>
                      {parseUserAgent(item.userAgent)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#a89f91]">
                      {formatDate(item.firstSeen)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                      {formatDate(item.lastSeen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[#7d7568] pt-4">
          Brew & Code Portfolio · Analytics Endpoint: <code className="text-[#a89f91]">/count</code> · Không đếm chính trang này vào lưu lượng truy cập.
        </div>

      </div>
    </div>
  );
}
