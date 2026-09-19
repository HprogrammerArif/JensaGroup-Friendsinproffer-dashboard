import { useMemo, useState } from "react";
import {
    FiAlertTriangle,
    FiArrowLeft,
    FiBell,
    FiCheck,
    FiMessageSquare,
    FiSearch,
    FiTool,
} from "react-icons/fi";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { useNavigate } from "react-router";

const notifications = [
    {
        id: 1,
        title: "New Rule Breaking Report",
        message: "Smoking detected at Flat 319 - Conditioning House",
        time: "5 mins ago",
        icon: FiAlertTriangle,
        iconStyle: "bg-red-50 text-red-500",
        highPriority: true,
        unread: true,
        highlighted: true,
    },
    {
        id: 2,
        title: "High Priority Maintenance",
        message: "Leaking shower reported at Flat 203 - Mill Street",
        time: "1 hour ago",
        icon: FiTool,
        iconStyle: "bg-orange-50 text-orange-500",
        highPriority: true,
        unread: true,
        highlighted: true,
    },
    {
        id: 3,
        title: "Extra Messy Clean Reported",
        message: "Cleaner Sarah Khan marked Flat 412 as extra messy",
        time: "2 hours ago",
        icon: HiOutlineCalendarDays,
        iconStyle: "bg-blue-50 text-blue-500",
        unread: true,
        highlighted: true,
    },
    {
        id: 4,
        title: "New Message from Cleaner",
        message: "James Miller: Need cleaning supplies for Mill Street",
        time: "3 hours ago",
        icon: FiMessageSquare,
        iconStyle: "bg-purple-50 text-purple-500",
        unread: false,
        highlighted: false,
    },
    {
        id: 5,
        title: "Maintenance Completed",
        message: "John Smith completed window latch repair at Flat 203",
        time: "5 hours ago",
        icon: FiTool,
        iconStyle: "bg-orange-50 text-orange-500",
        unread: false,
        highlighted: false,
    },
    {
        id: 6,
        title: "Weekly Wages Ready",
        message: "Wage calculations for week ending Feb 5 are ready for review",
        time: "1 day ago",
        icon: FiTool,
        iconStyle: "bg-green-50 text-green-500",
        unread: false,
        highlighted: false,
    },
];

const Notifications = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");

    const unreadCount = useMemo(
        () => notifications.filter((item) => item.unread).length,
        []
    );

    const filteredNotifications = useMemo(() => {
        if (filter === "unread") {
            return notifications.filter((item) => item.unread);
        }

        return notifications;
    }, [filter]);

    return (
        <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full">
                <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                            aria-label="Go back"
                        >
                            <FiArrowLeft />
                        </button>

                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
                            <p className="text-sm text-slate-500">{unreadCount} unread notifications</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-44 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 lg:w-60"
                            />
                        </div>

                        <button
                            type="button"
                            aria-label="Notification settings"
                            className="cursor-pointer rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-50"
                        >
                            <FiBell className="text-lg text-slate-500 " />
                        </button>

                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                                JT
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold leading-tight text-slate-800">John Tari</p>
                                <p className="text-xs leading-tight text-slate-400">johnTari@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mb-4 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${filter === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        All ({notifications.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setFilter("unread")}
                        className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${filter === "unread"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                </div>

                <section className="space-y-3">
                    {filteredNotifications.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.id}
                                className={`rounded-xl border bg-white px-4 py-4 shadow-sm sm:px-5 ${item.highlighted ? "border-blue-400" : "border-slate-200"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconStyle}`}
                                    >
                                        <Icon className="text-base" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>

                                            <div className="flex items-center gap-2">
                                                {item.highPriority ? (
                                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">
                                                        High Priority
                                                    </span>
                                                ) : null}
                                                <FiCheck className="text-sm text-blue-500" />
                                            </div>
                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">{item.message}</p>
                                        <p className="mt-2 text-xs text-slate-400">{item.time}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </div>
        </main>
    );
};

export default Notifications;