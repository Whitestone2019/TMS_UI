import React, { useState, useEffect } from "react";
import Header from "../../../components/ui/Header";
import { useNavigate } from 'react-router-dom';
import NavigationBreadcrumb from "../../../components/ui/NavigationBreadcrumb";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";
import { uploadSyllabusAPI, getAllSyllabusAPI, updateSyllabusAPI, getAllTrainers } from "../../../api_service";

const UploadSyllabus = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        topic: "",
        durationInDays: "",
        subTopics: [{ name: "", description: "", file: null, trainerId: "" }],
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [syllabusList, setSyllabusList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [trainerList, setTrainerList] = useState([]);



    useEffect(() => {
        console.log("Updated Trainer List:", trainerList);
    }, [trainerList]);
    const loadAll = async () => {
        try {
            const res = await getAllSyllabusAPI();
            setSyllabusList(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch syllabus", err);
        }
    };

    const loadTrainers = async () => {
        try {
            const res = await getAllTrainers();
            console.log("Trainers", res.data);
            setTrainerList(res.data || []);
        } catch (err) {
            console.error("Failed to fetch trainers", err);
        }
    };
    useEffect(() => {
        loadAll();
        loadTrainers();
    }, []);
    useEffect(() => {
        console.log("Updated Trainer List:", trainerList);
    }, [trainerList]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubTopicChange = (index, field, value) => {
        const updated = [...formData.subTopics];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, subTopics: updated }));
    };

    const addSubTopic = () => {
        setFormData((prev) => ({
            ...prev,
            subTopics: [...prev.subTopics, { name: "", description: "", file: null, trainerId: "" }],
        }));
    };

    const deleteSubTopic = (index) => {
        const updated = [...formData.subTopics];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, subTopics: updated }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.topic.trim()) newErrors.topic = "Topic is required";

        formData.subTopics.forEach((sub, i) => {
            if (!sub.name.trim()) newErrors[`subname${i}`] = "Subtopic name required";
            if (!sub.description.trim()) newErrors[`subdesc${i}`] = "Description required";
            if (!editingId && !sub.file) newErrors[`subfile${i}`] = "File required";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogout = () => {
        navigate('/');
    };

    // const handleSubmit = async () => {
    //     if (!validateForm()) return;
    //     setLoading(true);

    //     try {
    //         const fd = new FormData();
    //         fd.append("title", formData.title);
    //         fd.append("topic", formData.topic);


    //         formData.subTopics.forEach((sub, i) => {
    //             console.log("Appending subtopic:", sub);
    //             fd.append(`subTopics[${i}].name`, sub.name);
    //             fd.append(`subTopics[${i}].description`, sub.description);

    //             if (sub.file instanceof File) {
    //                 fd.append(`subTopics[${i}].file`, sub.file, sub.file.name);
    //             } else if (typeof sub.file === "string") {
    //                 // send existing file path so backend knows to keep it
    //                 fd.append(`subTopics[${i}].filePath`, sub.file);
    //             }
    //         });


    //         // console.log(fd);
    //         // console.log(formData);
    //         let res;
    //         if (editingId) {
    //             res = await updateSyllabusAPI(editingId, fd);
    //             setSyllabusList(prev => prev.map(it => it.id === editingId ? res.data : it));
    //             alert("Updated Successfully!");
    //         } else {
    //             console.log(formData);
    //             res = await uploadSyllabusAPI(formData);
    //             setSyllabusList(prev => [...prev, res.data]);
    //             alert("Uploaded Successfully!");

    //         }

    //         // reset form
    //         setEditingId(null);
    //         // setFormData({
    //         //     title: "",

    //         //     topic: "",
    //         //     subTopics: [{ name: "", description: "", file: null }],
    //         // });
    //     } catch (err) {
    //         console.error("Upload error", err);
    //         alert(err?.response?.data || err.message || "Upload failed");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);

        try {

            const syllabusJson = {
                title: formData.title,
                topic: formData.topic,
                durationInDays: Number(formData.durationInDays),
                //subTopics: formData.subTopics.map(st => ({ name: st.name, description: st.description }))
                subTopics: formData.subTopics.map(st => ({
                    id: st.id || null,
                    name: st.name,
                    description: st.description,
                    filePath: typeof st.file === "string" ? st.file : null,
                    trainer: {
                        trainerId: Number(st.trainerId)
                    }
                }))

            };

            // const fd = new FormData();
            // fd.append("syllabus", new Blob([JSON.stringify(syllabusJson)], { type: "application/json" }));

            // formData.subTopics.forEach(st => {
            //     if (st.file instanceof File) {
            //         fd.append("files", st.file, st.file.name);
            //     }
            // });
            const fd = new FormData();
            fd.append("syllabus", JSON.stringify(syllabusJson));

            // formData.subTopics.forEach((sub, i) => {
            //     if (sub.file && sub.file instanceof File) {
            //         fd.append("files", sub.file);
            //     }
            // });

            formData.subTopics.forEach((sub) => {
                if (sub.file instanceof File) {
                    fd.append("files", sub.file);
                } else {
                    fd.append("files", new Blob(), "empty.txt");
                }
            });




            // Send to backend
            const res = editingId
                ? await updateSyllabusAPI(editingId, fd)
                : await uploadSyllabusAPI(fd);

            if (editingId) {
                setSyllabusList(prev => prev.map(it => it.id === editingId ? res.data : it));
                alert("Updated Successfully!");
            } else {
                setSyllabusList(prev => [...prev, res.data]);
                alert("Uploaded Successfully!");
            }

            setEditingId(null);

        } catch (err) {
            console.error("Upload error", err);
            alert(err?.response?.data || err.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const editSyllabus = (item) => {
        setEditingId(item.id);

        setFormData({
            title: item.title,
            topic: item.topic,
            durationInDays: item.durationInDays,
            subTopics: (item.subTopics && item.subTopics.length > 0)
                ? item.subTopics.map(sub => ({
                    id: sub.id,
                    name: sub.name,
                    description: sub.description,
                    file: sub.filePath || null,
                    trainerId: sub.trainer?.trainerId || ""

                    // store the existing file path

                }))
                : [{ name: "", description: "", file: null, trainerId: "" }]
        });
    };


    return (
        <div className="min-h-screen bg-blue-50">
            <Header

                userName={sessionStorage.getItem("userName") || "User"}
                userRole="manager"
                onLogout={handleLogout}
            />
            <main className="pt-20 max-w-7xl mx-auto px-4">
                <NavigationBreadcrumb userRole="manager" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                    {/* LEFT FORM */}
                    {/* <div className="bg-white/50 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-200 h-fit sticky top-24"> */}
                    <div className="bg-white/50 backdrop-blur-lg shadow-xl rounded-2xl border border-blue-200 sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">

                        {/* <div className="p-8 border-b bg-blue-100 rounded-t-2xl"> */}
                        <div className="p-8 border-b bg-blue-100 rounded-t-2xl flex-none">

                            <h2 className="text-3xl font-bold text-black">
                                <Icon name="BookOpen" size={28} className="inline mr-2 text-blue-700" />
                                {editingId ? "Edit Syllabus" : "Upload Syllabus"}
                            </h2>
                        </div>

                        {/* <div className="p-8 space-y-8"> */}
                        <div className="p-8 space-y-8 flex-1 flex flex-col overflow-hidden">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                <Input
                                    label="Title"
                                    placeholder="Enter syllabus title"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    error={errors.title}
                                />

                                <Input
                                    label="Topic"
                                    placeholder="Enter main topic"
                                    value={formData.topic}
                                    onChange={(e) => handleChange("topic", e.target.value)}
                                    error={errors.topic}
                                />
                                <Input
                                    label="Duration (in Days)"
                                    placeholder="Enter number of days e.g. 1, 2, 3"
                                    value={formData.durationInDays}
                                    onChange={(e) => handleChange("durationInDays", e.target.value)}
                                />
                                {/* <Input
                                    label="Duration"
                                    placeholder="Enter number of days"
                                    value={
                                        formData.durationInDays
                                            ? `${formData.durationInDays} ${formData.durationInDays > 1 ? "Days" : "Day"}`
                                            : ""
                                    }
                                    onChange={(e) => {
                                        // Only number store karo
                                        const val = e.target.value.replace(/\D/g, "");
                                        handleChange("durationInDays", val);
                                    }}
                                />
 */}

                            </div>

                            {/* SUBTOPICS */}
                            {/* <div className="space-y-6 h-[500px] overflow-y-scroll pr-3 custom-scroll"> */}
                            <div className="space-y-6 flex-1 overflow-y-auto pr-3 custom-scroll min-h-[200px]">




                                <h3 className="text-xl font-semibold text-blue-700">Subtopics</h3>

                                {formData.subTopics.map((sub, index) => (
                                    <div key={index} className="border p-5 rounded-xl bg-white shadow relative">

                                        <button
                                            onClick={() => deleteSubTopic(index)}
                                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                        >
                                            <Icon name="Trash2" size={22} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                            <Input
                                                label={`Subtopic ${index + 1}`}
                                                placeholder="Enter subtopic name"
                                                value={sub.name}
                                                onChange={(e) =>
                                                    handleSubTopicChange(index, "name", e.target.value)
                                                }
                                                error={errors[`subname${index}`]}
                                            />

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Upload File {!editingId && "*"}
                                                </label>

                                                <label className="cursor-pointer block border border-dashed border-blue-400 rounded-xl p-5 bg-white hover:bg-blue-50 transition shadow-sm overflow-hidden">
                                                    <div className="flex items-center gap-3">
                                                        <Icon name="UploadCloud" size={24} className="text-blue-600" />
                                                        <span className="text-gray-700 truncate block max-w-full">
                                                            {sub.file instanceof File
                                                                ? sub.file.name
                                                                : sub.file
                                                                    ? sub.file.split("/").pop()
                                                                    : "Choose file"}
                                                        </span>
                                                    </div>

                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleSubTopicChange(index, "file", e.target.files[0])
                                                        }
                                                    />
                                                </label>

                                                {errors[`subfile${index}`] && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors[`subfile${index}`]}
                                                    </p>
                                                )}
                                            </div>


                                        </div>

                                        <div className="mt-5">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Description *
                                            </label>

                                            <textarea
                                                className="w-full h-24 px-4 py-3 rounded-xl border border-blue-300 bg-white shadow-sm"
                                                placeholder="Enter subtopic description..."
                                                value={sub.description}
                                                onChange={(e) =>
                                                    handleSubTopicChange(index, "description", e.target.value)
                                                }
                                            />
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Select Trainer *
                                                </label>

                                                <select
                                                    className="w-full h-12 px-4 rounded-xl border border-blue-300 bg-white shadow-sm text-gray-800"
                                                    value={sub.trainerId}
                                                    onChange={(e) => handleSubTopicChange(index, "trainerId", e.target.value)}
                                                >
                                                    <option value="">Select Trainer</option>

                                                    {trainerList?.map((t) => (
                                                        <option key={t.trainerId} value={t.trainerId}>
                                                            {t.name}
                                                        </option>
                                                    ))}

                                                </select>

                                            </div>





                                            {errors[`subdesc${index}`] && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors[`subdesc${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    variant="default"
                                    onClick={addSubTopic}
                                    iconName="Plus"
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
                                >
                                    Add Subtopic
                                </Button>
                            </div>

                            {/* <div className="pt-6 border-t flex flex-col sm:flex-row gap-4"> */}
                            <div className="pt-6 border-t flex flex-col sm:flex-row gap-4 flex-none">

                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                                >
                                    {loading ? (editingId ? "Updating..." : "Uploading...") :
                                        editingId ? "Update Syllabus" : "Upload Syllabus"}
                                </button>

                                <Button
                                    variant="ghost"
                                    onClick={onCancel}
                                    iconName="X"
                                    className="flex-1 text-gray-600 hover:bg-gray-100 py-3 rounded-xl"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT LIST */}
                    <div className="bg-white/70 p-6 shadow-xl rounded-2xl border border-blue-200 h-fit sticky top-24">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                            <Icon name="List" size={24} className="text-blue-700" />
                            Syllabus List
                        </h2>

                        {syllabusList.length === 0 ? (
                            <p className="text-gray-500">No syllabus uploaded yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {syllabusList.map((item) => (
                                    <li
                                        key={item.id}
                                        className="p-4 bg-blue-50 rounded-lg border cursor-pointer hover:bg-blue-100"
                                        onClick={() => editSyllabus(item)}
                                    >
                                        <h4 className="font-semibold text-blue-900">{item.title}</h4>
                                        <p className="text-sm text-gray-600">{item.topic}</p>
                                        {/* <p className="text-sm text-gray-500 mt-1">
                                            {item.subTopics.length} 
                                            {item.subTopics.map((i)=>(
                                                    i.filePath
                                            ))} Subtopics
                                        </p> */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadSyllabus;