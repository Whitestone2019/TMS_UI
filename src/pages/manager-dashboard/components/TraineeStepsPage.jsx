import React, { useState } from "react";
import Header from "../../../components/ui/Header";
import NavigationBreadcrumb from "../../../components/ui/NavigationBreadcrumb";
import Icon from "../../../components/AppIcon";

// ---------------- DUMMY DATA (STEP -> SUBTOPIC) ----------------
const trainees = [
    {
        id: 1,
        name: "Amit Sharma",
        syllabus: [
            {
                id: 1,
                title: "SIC",
                steps: [
                    {
                        stepNumber: 1,
                        stepName: "Networking Basics",
                        subTopics: [
                            { id: 1, name: "Protocol", status: "COMPLETED", time: "2 Days" },
                            { id: 2, name: "OSI Model", status: "PENDING", time: "-" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Neha Verma",
        syllabus: [
            {
                id: 2,
                title: "Java",
                steps: [
                    {
                        stepNumber: 1,
                        stepName: "Core Java",
                        subTopics: [
                            { id: 1, name: "Variables", status: "COMPLETED", time: "1 Day" },
                            { id: 2, name: "Datatypes", status: "COMPLETED", time: "1 Day" },
                        ],
                    },
                    {
                        stepNumber: 2,
                        stepName: "Control Statements",
                        subTopics: [
                            { id: 3, name: "Conditional", status: "PENDING", time: "-" },
                            { id: 4, name: "Loops", status: "PENDING", time: "-" },
                        ],
                    },
                ],
            },
        ],
    },
];

export default function TraineeStepsPage() {
    const [selectedTrainee, setSelectedTrainee] = useState(trainees[0]);
    const [expandedSteps, setExpandedSteps] = useState({});
    const [decision, setDecision] = useState({});

    const toggleStep = (key) => {
        setExpandedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDecision = (key, value) => {
        setDecision({ ...decision, [key]: value });
    };

    return (
        <div className="min-h-screen bg-blue-50">
            <Header userRole="checker" userName="Checker" />

            <main className="pt-20 max-w-7xl mx-auto px-4">
                <NavigationBreadcrumb userRole="checker" />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
                    {/* LEFT : TRAINEE LIST */}
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
                                    className={`p-4 cursor-pointer transition hover:bg-blue-50 ${selectedTrainee.id === t.id
                                            ? "bg-blue-100 font-semibold text-blue-900"
                                            : "text-gray-700"
                                        }`}
                                >
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT : STEPS TABLE */}
                    <div className="lg:col-span-3 bg-white/70 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-xl">
                        <div className="p-6 border-b bg-blue-100 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-blue-800">
                                Steps – {selectedTrainee.name}
                            </h2>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="p-3 text-left">Step / SubTopic</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Time</th>
                                        <th className="p-3 text-center">Accept</th>
                                        <th className="p-3 text-center">Reject</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedTrainee.syllabus.map((syllabus) =>
                                        syllabus.steps.map((step) => {
                                            const stepKey = `${syllabus.id}-${step.stepNumber}`;

                                            return (
                                                <React.Fragment key={stepKey}>
                                                    {/* STEP ROW */}
                                                    <tr
                                                        className="border-b bg-blue-50 hover:bg-blue-100 cursor-pointer"
                                                        onClick={() => toggleStep(stepKey)}
                                                    >
                                                        <td className="p-3 font-semibold text-blue-900 flex items-center gap-2">
                                                            <Icon
                                                                name={
                                                                    expandedSteps[stepKey]
                                                                        ? "ChevronDown"
                                                                        : "ChevronRight"
                                                                }
                                                                size={18}
                                                            />
                                                            Step {step.stepNumber} – {step.stepName}
                                                        </td>
                                                        <td colSpan="4"></td>
                                                    </tr>

                                                    {/* SUBTOPICS */}
                                                    {expandedSteps[stepKey] &&
                                                        step.subTopics.map((st) => {
                                                            const subKey = `${stepKey}-${st.id}`;
                                                            return (
                                                                <tr
                                                                    key={subKey}
                                                                    className="border-b hover:bg-blue-50"
                                                                >
                                                                    <td className="p-3 pl-10 text-gray-700">
                                                                        {st.name}
                                                                    </td>

                                                                    <td className="p-3 text-center">
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${st.status === "COMPLETED"
                                                                                    ? "bg-green-100 text-green-700"
                                                                                    : "bg-yellow-100 text-yellow-700"
                                                                                }`}
                                                                        >
                                                                            {st.status}
                                                                        </span>
                                                                    </td>

                                                                    <td className="p-3 text-center text-gray-700">
                                                                        {st.time}
                                                                    </td>

                                                                    <td className="p-3 text-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`decision-${subKey}`}
                                                                            onChange={() =>
                                                                                handleDecision(subKey, "ACCEPT")
                                                                            }
                                                                        />
                                                                    </td>

                                                                    <td className="p-3 text-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`decision-${subKey}`}
                                                                            onChange={() =>
                                                                                handleDecision(subKey, "REJECT")
                                                                            }
                                                                        />
                                                                        {decision[subKey] === "REJECT" && (
                                                                            <button className="ml-3 px-3 py-1 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700">
                                                                                Review
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
