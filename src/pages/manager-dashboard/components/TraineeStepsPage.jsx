
import React, { useState, useEffect } from "react";
import Header from "../../../components/ui/Header";
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
    const [decision, setDecision] = useState({});
    const [reviewInput, setReviewInput] = useState();

    // ----------------------------------------------------
    // BUILD TRAINEE STRUCTURE: SYLLABUS -> SUBTOPICS
    // ----------------------------------------------------
    const buildTraineeStructure = (data = []) => {
        const traineeMap = {};

        data.forEach((syllabus) => {
            syllabus.subTopics?.forEach((sub) => {
                sub.stepProgress?.forEach((progress) => {
                    const user = progress.user;

                    // TRAINEE
                    if (!traineeMap[user.empid]) {
                        traineeMap[user.empid] = {
                            id: user.empid,
                            name: `${user.firstname} ${user.lastname}`,
                            syllabi: {}, // Merge syllabi
                        };
                    }

                    // SYLLABUS
                    if (!traineeMap[user.empid].syllabi[syllabus.title]) {
                        traineeMap[user.empid].syllabi[syllabus.title] = {
                            title: syllabus.title,
                            subTopics: [],
                        };
                    }

                    // SUBTOPIC
                    traineeMap[user.empid].syllabi[syllabus.title].subTopics.push({
                        id: sub.subTopicId,
                        progressId: progress.stepProgressId,
                        name: sub.name,
                        status: progress.complete ? "COMPLETED" : "PENDING",
                        managerDecision:
                            typeof progress.checker === "boolean"
                                ? progress.checker
                                : null, // boolean: true = accept, false = reject
                        time: `${progress.timeSpentSeconds || 0}s`,
                    });
                });
            });
        });

        // Convert syllabi object to array
        return Object.values(traineeMap).map((t) => ({
            ...t,
            syllabi: Object.values(t.syllabi),
        }));
    };

    // ----------------------------------------------------
    // LOAD DATA
    // ----------------------------------------------------
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchCompletedSubTopics();
                const list = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

                const structured = buildTraineeStructure(list);
                console.log("Structure", structured);
                setTrainees(structured);
                setSelectedTrainee(structured[-1] || null);
            } catch (err) {
                console.error("Error fetching completed subtopics", err);
            }
        };
        loadData();
    }, []);

    // ----------------------------------------------------
    // APPROVE / REJECT HANDLER
    // ----------------------------------------------------
    const handleDecision = async (subKey, value, progressId) => {
        setDecision((prev) => ({ ...prev, [subKey]: value }));
        try {
            if (value === "ACCEPT") {
                await approveSubTopicAPI(progressId, reviewInput);
                alert("Approved successfully");
            } else {
                await rejectSubTopicAPI(progressId, reviewInput);
                alert("Rejected successfully");
            }

            // Update local state after decision
            setSelectedTrainee((prev) => {
                const newTrainees = { ...prev };
                newTrainees.syllabi = newTrainees.syllabi.map((syllabus) => {
                    syllabus.subTopics = syllabus.subTopics.map((st) => {
                        if (`syllabus-${syllabus.title}-${st.id}` === subKey) {
                            return { ...st, managerDecision: value === "ACCEPT" };
                        }
                        return st;
                    });
                    return syllabus;
                });
                return newTrainees;
            });
        } catch (err) {
            console.error("Decision error", err);
            alert("Something went wrong");
        }
    };

    // ----------------------------------------------------
    // TOGGLE SYLLABUS COLLAPSE
    // ----------------------------------------------------
    const toggleSyllabus = (key) => {
        setExpandedSyllabus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // ----------------------------------------------------
    // UI
    // ----------------------------------------------------
    return (
        <div className="min-h-screen bg-blue-50">
            <Header userRole="manager" userName="Checker" />

            <main className="pt-20 max-w-7xl mx-auto px-4">
                <NavigationBreadcrumb userRole="manager" />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

                    {/* LEFT PANEL */}
                    <div className="lg:col-span-1 bg-white/70 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-xl">
                        <div className="p-5 border-b bg-blue-100 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                                <Icon name="Users" size={22} /> Trainees
                            </h2>
                        </div>

                        <div className="divide-y">
                            {trainees.map((t) => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTrainee(t)}
                                    className={`p-4 cursor-pointer transition hover:bg-blue-50 ${selectedTrainee?.id === t.id
                                        ? "bg-blue-100 font-semibold text-blue-900"
                                        : "text-gray-700"
                                        }`}
                                >
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="lg:col-span-3 bg-white/70 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-xl">
                        <div className="p-6 border-b bg-blue-100 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-blue-800">
                                Syllabi – {selectedTrainee?.name}
                            </h2>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="p-3 text-left">Syllabus / SubTopic</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Time</th>
                                        <th className="p-3 text-center">Accept</th>
                                        <th className="p-3 text-center">Reject</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedTrainee?.syllabi.map((syllabus) => {
                                        const syllabusKey = `syllabus-${syllabus.title}`;

                                        return (
                                            <React.Fragment key={syllabusKey}>
                                                {/* SYLLABUS ROW */}
                                                <tr
                                                    className="border-b bg-blue-50 hover:bg-blue-100 cursor-pointer"
                                                    onClick={() => toggleSyllabus(syllabusKey)}
                                                >
                                                    <td className="p-3 font-semibold text-blue-900 flex items-center gap-2">
                                                        <Icon
                                                            name={
                                                                expandedSyllabus[syllabusKey]
                                                                    ? "ChevronDown"
                                                                    : "ChevronRight"
                                                            }
                                                            size={18}
                                                        />
                                                        {syllabus.title}
                                                    </td>
                                                    <td colSpan="4"></td>
                                                </tr>

                                                {/* SUBTOPICS */}
                                                {expandedSyllabus[syllabusKey] &&
                                                    syllabus.subTopics.map((st) => {
                                                        const subKey = `${syllabusKey}-${st.id}`;
                                                        const decisionText =
                                                            st.managerDecision === true
                                                                ? "Accepted"
                                                                : st.managerDecision === false
                                                                    ? "Rejected"
                                                                    : st.status;

                                                        return (
                                                            <tr key={subKey} className="border-b hover:bg-blue-50">
                                                                <td className="p-3 pl-10">{st.name}</td>
                                                                <td className="p-3 text-center">{decisionText}</td>
                                                                <td className="p-3 text-center">{st.time}</td>
                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="text"
                                                                        className="border px-2 py-1 rounded w-full"
                                                                        placeholder="Enter review"
                                                                        value={reviewInput || ""}
                                                                        onChange={(e) => setReviewInput(e.target.value)}


                                                                    // onKeyDown={(e) => {
                                                                    //     if (e.key === "Enter" && reviewInputs[subKey]) {
                                                                    //         handleDecision(subKey, "ACCEPT", st.progressId);
                                                                    //     }
                                                                    // }}
                                                                    />
                                                                </td>

                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`decision-${subKey}`}
                                                                        checked={st.managerDecision === true}
                                                                        // disabled={st.managerDecision !== null}
                                                                        onChange={() =>
                                                                            handleDecision(subKey, "ACCEPT", st.progressId)
                                                                        }
                                                                    />
                                                                </td>

                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`decision-${subKey}`}
                                                                        checked={st.managerDecision === false}
                                                                        // disabled={st.managerDecision !== null}
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
