import { useState, useEffect } from "react";
import { User, MessageSquare, Ban, AlertCircle, FileDown, Star, ThumbsDown, Search } from "lucide-react";

const globalStyles = `
  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  .backdrop-blur-xl {
    backdrop-filter: blur(16px) saturate(180%);
  }

  @media (max-width: 768px) {
    .animate-slideInUp {
      animation-duration: 0.6s;
      animation-name: slideInUp;
      animation-timing-function: ease-out;
      animation-delay: var(--delay);
      animation-fill-mode: both;
    }
  }

  .bg-white\\/80 {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .bg-white\\/90 {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .bg-gradient-to-r {
    background-size: 200% 200%;
  }

  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  }
`;

function StatsCard({ title, value, icon, change, delay }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const isPositive = change.startsWith("+");
  const isSpecial = change === "Top" || change === "Low";
  const numericValue = parseInt(value.toString().replace(/,/g, ""));

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = numericValue / 50;
      const counter = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 30);
    }, parseFloat(delay) * 1000);

    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <div
      className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:shadow-gray-500/20 cursor-pointer rounded-2xl p-6"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-black text-white p-4 rounded-2xl shadow-lg group-hover:bg-gray-800 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          <div className="w-6 h-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
            {title === "Most Swapped Skill" || title === "Least Swapped Skill"
              ? value
              : animatedValue.toLocaleString()}
          </p>
          <p
            className={`text-xs font-semibold transition-all duration-300 group-hover:scale-105 ${
              isSpecial ? "text-gray-600" : isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {change} {isSpecial ? "Skill" : "Since last week"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ModerationCard({ title, value, color, delay }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = parseInt(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = numericValue / 20;
      const counter = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 50);
    }, parseFloat(delay) * 1000);

    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  const colorClasses = {
    red: "text-red-600 bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-150",
    orange: "text-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150",
    yellow: "text-yellow-600 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-150",
  };

  return (
    <div
      className={`group backdrop-blur-sm rounded-2xl p-6 border transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl ${colorClasses[color]}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
          {title}
        </span>
        <span className={`text-3xl font-bold transition-all duration-300 group-hover:scale-110 ${colorClasses[color].split(" ")[0]}`}>
          {animatedValue}
        </span>
      </div>
    </div>
  );
}

function ReportButton({ text, delay, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:bg-black hover:text-white transition-all duration-300 font-semibold px-6 py-3 rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 backdrop-blur-sm border border-gray-200 group"
      style={{ animationDelay: delay }}
    >
      <span className="group-hover:scale-110 transition-transform duration-200 inline-block">{text}</span>
    </button>
  );
}

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    total_users: 0,
    total_swaps: 0,
    most_swapped_skill: "Loading...",
    least_swapped_skill: "Loading..."
  });
  const [moderation, setModeration] = useState({
    pending_reports: 0,
    flagged_users: 0,
    banned_users: 0
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, moderationRes, reportsRes] = await Promise.all([
        fetch('http://localhost:4000/api/admin/stats'),
        fetch('http://localhost:4000/api/admin/moderation'),
        fetch('http://localhost:4000/api/admin/reports')
      ]);

      const statsData = await statsRes.json();
      const moderationData = await moderationRes.json();
      const reportsData = await reportsRes.json();

      setStats(statsData);
      setModeration(moderationData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    fetchAdminData();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        alert(`Message Sent: ${message}`);
        setMessage("");
        fetchAdminData();
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'rejected',
          admin_notes: 'Content rejected by admin'
        }),
      });

      if (response.ok) {
        alert('Report rejected successfully');
        fetchAdminData();
      } else {
        alert('Failed to reject report');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert('Error rejecting report');
    }
  };

  const handleGenerateReport = () => {
    alert('Generating report... This would download a CSV file in a real application.');
  };

  const handleViewAnalytics = () => {
    alert('Opening analytics dashboard... This would navigate to a detailed analytics page.');
  };

  const handleUserManagement = () => {
    alert('Opening user management... This would navigate to a user management interface.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent)] animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.01)_50%,transparent_75%)] animate-[shimmer_3s_ease-in-out_infinite]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.02),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.02),transparent_50%)]"></div>
        </div>

        <div
          className={`relative z-10 p-4 md:p-6 space-y-8 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:shadow-gray-500/10 hover:shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent animate-[gradient_3s_ease-in-out_infinite] bg-[length:200%_200%]">
                  Welcome Back, Admin 👋
                </h1>
                <p className="text-gray-600 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                  Manage your platform efficiently
                </p>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard title="Users" value={stats.total_users} icon={<User className="w-6 h-6" />} change="+6.5%" delay="0.1" />
            <StatsCard title="Swaps" value={stats.total_swaps} icon={<MessageSquare className="w-6 h-6" />} change="+11.5%" delay="0.2" />
            <StatsCard title="Most Swapped Skill" value={stats.most_swapped_skill} icon={<Star className="w-6 h-6" />} change="Top" delay="0.3" />
            <StatsCard title="Least Swapped Skill" value={stats.least_swapped_skill} icon={<ThumbsDown className="w-6 h-6" />} change="Low" delay="0.4" />
          </div>

          <div className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.01] hover:shadow-gray-500/10 rounded-3xl p-6">
            <div className="pb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-black text-white rounded-xl group-hover:bg-gray-800 transition-all duration-300 group-hover:rotate-12 shadow-lg group-hover:scale-110">
                  <AlertCircle className="w-6 h-6" />
                </div>
                Moderation Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModerationCard title="Pending Reports" value={moderation.pending_reports} color="red" delay="0.1" />
              <ModerationCard title="Flagged Users" value={moderation.flagged_users} color="orange" delay="0.2" />
              <ModerationCard title="Banned Users" value={moderation.banned_users} color="yellow" delay="0.3" />
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.01] rounded-3xl p-6">
            <div className="pb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-black text-white rounded-xl group-hover:bg-gray-800 transition-all duration-300 group-hover:rotate-12 shadow-lg group-hover:scale-110">
                  <Ban className="w-6 h-6" />
                </div>
                Moderate Content
              </h2>
            </div>
            <div className="overflow-auto rounded-2xl bg-gray-50/80 border border-gray-200/50 backdrop-blur-sm">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="p-4 text-left text-gray-700 font-semibold">User</th>
                    <th className="p-4 text-left text-gray-700 font-semibold">Skill Description</th>
                    <th className="p-4 text-center text-gray-700 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <tr key={report.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 group/row">
                        <td className="p-4 text-gray-900 font-medium group-hover/row:text-black transition-colors duration-300">
                          {report.reported_user_name || 'Unknown User'}
                        </td>
                        <td className="p-4 text-gray-700 group-hover/row:text-gray-900 transition-colors duration-300">
                          "{report.reason}" - {report.skill_name || 'General'}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleRejectReport(report.id)}
                            className="bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 backdrop-blur-sm border-0 rounded-xl px-4 py-2 text-sm"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">
                        No reports to moderate
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.01] rounded-3xl p-6">
            <div className="pb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-black text-white rounded-xl group-hover:bg-gray-800 transition-all duration-300 group-hover:rotate-12 shadow-lg group-hover:scale-110">
                  <AlertCircle className="w-6 h-6" />
                </div>
                Broadcast Message
              </h2>
            </div>
            <div className="space-y-6">
              <div className="relative group/textarea">
                <textarea
                  className="w-full h-32 bg-gray-50/80 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-gray-400 transition-all duration-300 resize-none rounded-2xl backdrop-blur-sm hover:bg-gray-50 focus:shadow-lg focus:shadow-gray-500/20 p-4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your platform-wide message here..."
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-500/5 to-transparent opacity-0 group-focus-within/textarea:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
              <button
                onClick={handleSendMessage}
                className="bg-black text-white hover:bg-gray-800 transition-all duration-300 font-semibold px-8 py-3 rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 group/button border-0"
              >
                <span className="group-hover/button:scale-110 transition-transform duration-200 inline-block">
                  Send Broadcast
                </span>
              </button>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.01] rounded-3xl p-6">
            <div className="pb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-black text-white rounded-xl group-hover:bg-gray-800 transition-all duration-300 group-hover:rotate-12 shadow-lg group-hover:scale-110">
                  <FileDown className="w-6 h-6" />
                </div>
                Download Reports
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <ReportButton text="Activity Logs" delay="0.1" onClick={handleGenerateReport} />
              <ReportButton text="Feedback" delay="0.2" onClick={handleViewAnalytics} />
              <ReportButton text="Swap Stats" delay="0.3" onClick={handleUserManagement} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}