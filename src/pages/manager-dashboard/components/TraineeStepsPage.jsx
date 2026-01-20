
import React, { useState, useEffect } from "react";
import Header from "../../../components/ui/Header";
import { useNavigate } from 'react-router-dom';
import NavigationBreadcrumb from "../../../components/ui/NavigationBreadcrumb";
import Icon from "../../../components/AppIcon";
import {
    fetchCompletedSubTopics,
    approveSubTopicAPI,
    rejectSubTopicAPI,
} from "../../../api_service";

export default function TraineeStepsPage() {
    const [trainees, setTrainees] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [expandedSyllabus, setExpandedSyllabus] = useState({});
    const [reviewInput, setReviewInput] = useState({});
    const navigate = useNavigate();

    // ----------------------------------------------------
    // BUILD STRUCTURE
    // ----------------------------------------------------
    const buildTraineeStructure = (data = []) => {
        const traineeMap = {};

        data.forEach((syllabus) => {
            syllabus.subTopics?.forEach((sub) => {
                sub.stepProgress?.forEach((progress) => {
                    const user = progress.user;

                    if (!traineeMap[user.empid]) {
                        traineeMap[user.empid] = {
                            id: user.empid,
                            name: `${user.firstname} ${user.lastname}`,
                            syllabi: {},
                        };
                    }

                    if (!traineeMap[user.empid].syllabi[syllabus.title]) {
                        traineeMap[user.empid].syllabi[syllabus.title] = {
                            title: syllabus.title,
                            subTopics: [],
                        };
                    }

                    let managerDecision = null;
                    if (progress.checker === true) managerDecision = true;
                    else if (progress.checker === false) managerDecision = false;

                    traineeMap[user.empid].syllabi[syllabus.title].subTopics.push({
                        id: sub.subTopicId,
                        progressId: progress.stepProgressId,
                        name: sub.name,
                        status: progress.complete ? "COMPLETED" : "PENDING",
                        managerDecision,
                        time: `${progress.timeSpentSeconds || 0}s`,
                        review: progress.review || "",
                        startDateTime: progress.startDateTime,
                        endDateTime: progress.endDateTime,

                    });
                });
            });
        });

        return Object.values(traineeMap).map((t) => ({
            ...t,
            syllabi: Object.values(t.syllabi),
        }));
    };

    const handleLogout = () => {
        navigate('/');
    };
    const formatCombinedDT = (dt) => {
        if (!dt) return "-";
        const d = new Date(dt);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    };


    // ----------------------------------------------------
    // LOAD DATA
    // ----------------------------------------------------
    // useEffect(() => {
    //     const loadData = async () => {
    //         const response = await fetchCompletedSubTopics();
    //         const list = Array.isArray(response?.data)
    //             ? response.data
    //             : Array.isArray(response)
    //                 ? response
    //                 : [];

    //         const structured = buildTraineeStructure(list);

    //         setTrainees(structured);
    //         setSelectedTrainee(structured[0] || null);
    //     };

    //     loadData();
    // }, []);

    useEffect(() => {


        loadData();
    }, []);
    const loadData = async () => {
        try {
            const response = await fetchCompletedSubTopics();
            const list = Array.isArray(response?.data)
                ? response.data
                : [];

            const structured = buildTraineeStructure(list);
            setTrainees(structured);
            setSelectedTrainee(structured[0] || null);

        } catch (error) {
            console.error("API ERROR:", error);
            console.error("MESSAGE:", error.message);
            console.error("CONFIG:", error.config);
        }
    };

    // ----------------------------------------------------
    // DECISION HANDLER
    // ----------------------------------------------------
    const handleDecision = async (subKey, value, progressId) => {
        const review = reviewInput[subKey] || "";

        if (value === "REJECT" && !review.trim()) {
            alert("Review is mandatory for rejection");
            return;
        }

        if (value === "ACCEPT") {
            await approveSubTopicAPI(progressId, review);
            loadData();
            alert("Approved successfully");
        } else {
            await rejectSubTopicAPI(progressId, review);
            alert("Rejected successfully");
        }
    };

    const toggleSyllabus = (key) => {
        setExpandedSyllabus((p) => ({ ...p, [key]: !p[key] }));
    };

    // ----------------------------------------------------
    // UI
    // ----------------------------------------------------
    return (
        <div className="min-h-screen bg-blue-50">

            <Header

                userName={sessionStorage.getItem("userName") || "User"}
                userRole="manager"
                onLogout={handleLogout}
            />
            <main className="pt-20 max-w-7xl mx-auto px-1">
                <NavigationBreadcrumb userRole="manager" />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mt-8">

                    {/* LEFT PANEL */}
                    <div className="bg-white/70 backdrop-blur border border-blue-200 rounded-2xl shadow-lg">
                        <div className="p-4 bg-blue-100 rounded-t-2xl font-bold text-blue-800 flex gap-2">
                            <Icon name="Users" size={20} /> Trainees
                        </div>

                        {trainees.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTrainee(t)}
                                className={`p-4 cursor-pointer hover:bg-blue-50 ${selectedTrainee?.id === t.id &&
                                    "bg-blue-100 font-semibold"
                                    }`}
                            >
                                {t.name}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="lg:col-span-3 bg-white/70 backdrop-blur border border-blue-200 rounded-2xl shadow-lg w-[1200px]">
                        <div className="p-5 bg-blue-100 rounded-t-2xl text-xl font-bold text-blue-800">
                            Syllabus – {selectedTrainee?.name}
                        </div>

                        <div className="p-4  ">
                            <table className="w-full min-w-[1100px] table-fixed">
                                <thead>
                                    <tr className="bg-blue-100">
                                        <th className="p-3 text-left w-[100px]">Topic</th>
                                        <th className="p-3 text-center w-[100px]">Status</th>
                                        <th className="p-3 text-center w-[200px]">Start Date/Time</th>
                                        <th className="p-3 text-center w-[200px]">End Date/Time</th>


                                        {/* <th className="p-3 text-center">Time</th> */}
                                        <th className="p-3 text-left w-[100px]">Review</th>
                                        <th className="p-3 text-center w-[100px]">Accept</th>
                                        <th className="p-3 text-center w-[100px]">Reject</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedTrainee?.syllabi.map((syllabus) => {
                                        const syllabusKey = `syllabus-${syllabus.title}`;

                                        return (
                                            <React.Fragment key={syllabusKey}>
                                                <tr
                                                    onClick={() => toggleSyllabus(syllabusKey)}
                                                    className="bg-blue-50 cursor-pointer"
                                                >
                                                    <td className="p-3 font-semibold flex items-center gap-2">
                                                        <Icon
                                                            name={
                                                                expandedSyllabus[syllabusKey]
                                                                    ? "ChevronDown"
                                                                    : "ChevronRight"
                                                            }
                                                            size={16}
                                                        />
                                                        {syllabus.title}
                                                    </td>
                                                    <td colSpan="5"></td>
                                                </tr>

                                                {expandedSyllabus[syllabusKey] &&

                                                    syllabus.subTopics.map((st) => {
                                                        const subKey = `${syllabusKey}-${st.id}`;
                                                        // const { date: sd, time: stime } = formatDT(st.startDateTime);
                                                        // const { date: ed, time: etime } = formatDT(st.endDateTime);


                                                        return (
                                                            <tr key={subKey} className="border-b hover:bg-blue-50">
                                                                <td className="p-3 pl-8">{st.name}</td>

                                                                <td className="p-3 text-center">
                                                                    {st.managerDecision === true && (
                                                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                                                                            Accepted
                                                                        </span>
                                                                    )}
                                                                    {st.managerDecision === false && (
                                                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
                                                                            Rejected
                                                                        </span>
                                                                    )}
                                                                    {st.managerDecision === null && (
                                                                        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600">
                                                                            {st.status}
                                                                        </span>
                                                                    )}
                                                                </td>


                                                                <td className="p-3 text-center">{formatCombinedDT(st.startDateTime)}</td>
                                                                <td className="p-3 text-center">{formatCombinedDT(st.endDateTime)}</td>

                                                                {/* <td className="p-3 text-center">{st.time}</td> */}


                                                                <td className="p-3">
                                                                    <input
                                                                        className="w-full border rounded px-3 py-2"
                                                                        placeholder="Enter review"
                                                                        value={
                                                                            reviewInput[subKey] !== undefined
                                                                                ? reviewInput[subKey]
                                                                                : st.review || ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            setReviewInput((p) => ({
                                                                                ...p,
                                                                                [subKey]: e.target.value,
                                                                            }))
                                                                        }
                                                                    />
                                                                </td>

                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="radio"
                                                                        className="w-4 h-4 accent-green-600"
                                                                        name={`decision-${subKey}`}
                                                                        checked={st.managerDecision === true}
                                                                        onChange={() =>
                                                                            handleDecision(subKey, "ACCEPT", st.progressId)
                                                                        }
                                                                    />
                                                                </td>

                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="radio"
                                                                        className="w-4 h-4 accent-red-600"
                                                                        name={`decision-${subKey}`}
                                                                        checked={st.managerDecision === false}
                                                                        onChange={() =>
                                                                            handleDecision(subKey, "REJECT", st.progressId)
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

