"use client";
import React, {useEffect, useState} from "react";
import {HiBell, HiBriefcase, HiChatAlt2, HiUser} from "react-icons/hi";
import ButtonAccount from "@/components/ButtonAccount";
import Link from "next/link";
import config from "@/config";
import Image from "next/image";
import logo from "@/app/icon.png";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export const dynamic = "force-dynamic";

const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        borderRadius: "0.375rem", // Igual al borde de tus inputs
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Azul en foco, gris por defecto
        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
        "&:hover": {
            borderColor: "#3b82f6", // Cambia el borde al pasar el mouse
        },
        height: "2.5rem", // Altura similar a tus inputs
        backgroundColor: "white",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#9ca3af", // Color gris claro para el placeholder
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "#111827", // Color negro para el texto seleccionado
    }),
};

export default function Dashboard() {
    const [isTrialPeriodActive, setIsTrialPeriodActive] = useState(false);
    const calculateTrialPeriod = (createdAt: string): boolean => {
        const creationDate = new Date(createdAt);
        const currentDate = new Date();
        const diffInDays = Math.ceil(
            (currentDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffInDays <= 14;
    };

    const countryOptions = countryList().getData();
    const [isSavingUserInfo, setIsSavingUserInfo] = useState(false);
    const [isSavingExperience, setIsSavingExperience] = useState(false);
    const [activeTab, setActiveTab] = useState("userInfo");
    const [useForm, setUseForm] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [uploadedCV, setUploadedCV] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Agrega el estado isLoading

    const supabase = createClientComponentClient();

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        title: "",
        expertise: "",
        experience: "",
        skills: [],
    });

    const [cvData, setCvData] = useState({
        presentation: "",
        skills: [],
        experiences: [],
    });

    const [applications, setApplications] = useState([
        // {
        //     platform: "LinkedIn",
        //     date: "March 10, 2024",
        //     status: "Shared",
        // },
        // {
        //     platform: "GitHub",
        //     date: "March 5, 2024",
        //     status: "Pending",
        // },
    ]);

    const handleSkillChange = (index: number, value: string) => {
        setUserData((prev) => {
            const updatedSkills = [...prev.skills];
            updatedSkills[index] = value;
            return {...prev, skills: updatedSkills};
        });
    };

    const handleDeleteExperience = async (index: number, expId: string | null) => {
        if (expId) {
            const {error} = await supabase
                .from("experiences")
                .delete()
                .eq("id", expId);

            if (error) {
                console.error("Error deleting experience:", error);
                return;
            }
        }

        // Eliminar la experiencia del estado local
        setCvData((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setUploadedCV(event.target.files[0]); // Guardar el archivo en el estado
        }
    };

    // Obtener usuario autenticado
    const fetchCurrentUser = async () => {
        const {data, error} = await supabase.auth.getSession();

        if (error || !data.session) {
            console.error("User is not authenticated or session is invalid:", error);
            return null;
        }

        const user = data.session.user;
        if (user?.user_metadata?.created_at) {
            // Calcular si el usuario está dentro del período de prueba
            const trialActive = calculateTrialPeriod(user.user_metadata.created_at);
            setIsTrialPeriodActive(trialActive);
        } else {
            console.error("created_at field is missing in user_metadata.");
        }
        return user;
    };

    // Precargar información del usuario y experiencias
    const fetchUserData = async (userId: string) => {
        try {
            // Obtener información del usuario
            const {data: user, error: userError} = await supabase
                .from("users")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle();

            if (userError) {
                console.error("Error fetching user data:", userError);
            } else if (user !== null) {
                setUserData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    country: user.country || "",
                    title: user.title || "",
                    expertise: user.expertise || "",
                    experience: user.experience || "",
                    skills: user.skills || [],
                });
                setCvData((prev) => ({
                    ...prev,
                    presentation: user.presentation || "",
                }));
            }

            // Obtener experiencias profesionales
            const {data: experiences, error: experiencesError} = await supabase
                .from("experiences")
                .select("*")
                .eq("user_id", userId);

            if (experiencesError) {
                console.error("Error fetching experiences:", experiencesError);
            } else {
                setCvData((prev) => ({
                    ...prev,
                    experiences: experiences || [],
                }));
            }
        } catch (error) {
            console.error("Unexpected error fetching user data:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const initializeUser = async () => {
            const user = await fetchCurrentUser();
            if (user) {
                setCurrentUser(user);
                await fetchUserData(user.id); // Precargar datos si el usuario está autenticado
            }
        };
        initializeUser();
    }, []);

    // Guardar información del usuario
    const handleSaveUserInfo = async () => {
        setIsSavingUserInfo(true);
        try {
            // Verificar si el usuario ya existe
            const {data: existingUser, error: fetchError} = await supabase
                .from("users")
                .select("user_id")
                .eq("user_id", currentUser.id)
                .single();

            if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Error checking existing user:", fetchError);
                return;
            }

            if (existingUser) {
                // Actualizar usuario si ya existe
                const {error: updateError} = await supabase
                    .from("users")
                    .update({
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        country: userData.country,
                        title: userData.title,
                        expertise: userData.expertise,
                        experience: userData.experience,
                        skills: userData.skills,
                    })
                    .eq("user_id", currentUser.id);

                if (updateError) {
                    console.error("Error updating user info:", updateError);
                } else {
                    console.log("User info updated successfully.");
                }
            } else {
                // Insertar nuevo usuario si no existe
                const {error: insertError} = await supabase
                    .from("users")
                    .insert({
                        user_id: currentUser.id,
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        country: userData.country,
                        title: userData.title,
                        expertise: userData.expertise,
                        experience: userData.experience,
                        skills: userData.skills,
                    });

                if (insertError) {
                    console.error("Error inserting user info:", insertError);
                } else {
                    console.log("User info saved successfully.");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setIsSavingUserInfo(false); // Termina el loading
        }
    };
    // Guardar experiencia profesional
    const handleSaveProfessionalExperience = async () => {
        setIsSavingExperience(true);
        try {
            const {error: presentationError} = await supabase
                .from("users")
                .update({presentation: cvData.presentation})
                .eq("user_id", currentUser.id);

            if (presentationError) {
                console.error("Error saving presentation:", presentationError);
                return;
            }

            const {error: experiencesError} = await supabase
                .from("experiences")
                .upsert(
                    cvData.experiences.map((exp) => ({
                        user_id: currentUser.id,
                        title: exp.title,
                        company: exp.company,
                        duration: exp.duration,
                        description: exp.description,
                    }))
                );

            if (experiencesError) {
                console.error("Error saving experiences:", experiencesError);
                return;
            }

            // alert("Professional experience saved successfully!");
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setIsSavingExperience(false); // Termina el loading
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleTabChange = (tab: string) => {
        setActiveTab(tab); // Cambia el estado de la pestaña activa
    };

    const handleExperienceChange = (index: number, field: string, value: string) => {
        const updatedExperiences = [...cvData.experiences];
        updatedExperiences[index][field] = value;
        setCvData((prev) => ({...prev, experiences: updatedExperiences}));
    };
    const handleAddSkill = () => {
        setUserData((prev) => ({
            ...prev,
            skills: [...prev.skills, ""], // Agrega un nuevo campo vacío para un skill
        }));
    };
    const handleAddExperience = () => {
        setCvData((prev) => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                {title: "", company: "", duration: "", description: ""},
            ],
        }));
    };
    return (
        <main className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col fixed h-full">
                <h2 className="text-2xl font-bold mb-6"><Link
                    className="flex items-center gap-2 shrink-0 "
                    href="/"
                    title={`${config.appName} hompage`}
                >
                    <Image
                        src={logo}
                        alt={`${config.appName} logo`}
                        className="w-8"
                        placeholder="blur"
                        priority={true}
                        width={32}
                        height={32}
                    />
                    <span className="font-extrabold text-lg">{config.appName}</span>
                </Link></h2>
                <ul className="flex-1">
                    <li
                        onClick={() => handleTabChange("userInfo")}
                        className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center gap-4 ${
                            activeTab === "userInfo" ? "bg-gray-700" : ""
                        }`}
                    >
                        <HiUser className="w-5 h-5"/>
                        User Information
                    </li>
                    <li
                        onClick={() => handleTabChange("professionalExperience")}
                        className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center gap-4 ${
                            activeTab === "professionalExperience" ? "bg-gray-700" : ""
                        }`}
                    >
                        <HiBriefcase className="w-5 h-5"/>
                        Professional Experience
                    </li>
                    <li
                        onClick={() => handleTabChange("alerts")}
                        className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center gap-4 ${
                            activeTab === "alerts" ? "bg-gray-700" : ""
                        }`}
                    >
                        <HiBell className="w-5 h-5"/>
                        Alerts
                    </li>
                </ul>
                <div className="mt-auto">
                    <ButtonAccount/>
                </div>
            </aside>

            {/* Main Content */}
            <section className="flex-1 p-8 bg-gray-100 ml-64 overflow-y-auto min-h-screen">

                {activeTab === "userInfo" && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">User Information</h2>
                        {isLoading ? (<div className="space-y-4">
                            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                        </div>) : (<div className="bg-white p-6 shadow rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Choose how to proceed</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setUseForm(!useForm)}
                                >
                                    {useForm ? "Switch to CV Upload" : "Switch to Manual Entry"}
                                </button>
                            </div>
                            {useForm ? (
                                <form className="space-y-8">
                                    {/* Personal Details */}


                                    <div className="bg-white p-6 shadow rounded-lg space-y-4">
                                        <h3 className="text-xl font-bold">Personal Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block font-medium">Name</label>
                                                <input
                                                    type="text"
                                                    value={userData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    className="input input-bordered w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    className="input input-bordered w-full"
                                                    placeholder="example@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-medium">Phone</label>
                                                <PhoneInput
                                                    country={'us'}
                                                    value={userData.phone}
                                                    onChange={(value) => handleInputChange("phone", value)}
                                                    inputStyle={{
                                                        width: '100%',
                                                        borderRadius: '8px',
                                                        border: '1px solid #d1d5db',
                                                        height: "40px"
                                                    }}
                                                    buttonStyle={{border: '1px solid #d1d5db'}}
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-medium">Country</label>
                                                <Select
                                                    options={countryOptions}
                                                    value={countryOptions.find((option) => option.value === userData.country)}
                                                    onChange={(selected) =>
                                                        handleInputChange("country", selected?.value ?? "")
                                                    }
                                                    styles={customStyles} // Aplica los estilos personalizados
                                                    placeholder="Select a country"
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Professional Details */}
                                    <div className="bg-white p-6 shadow rounded-lg space-y-4">
                                        <h3 className="text-xl font-bold">Professional Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block font-medium">Title</label>
                                                <input
                                                    type="text"
                                                    value={userData.title}
                                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                                    className="input input-bordered w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-medium">Years of Experience</label>
                                                <input
                                                    type="text"
                                                    value={userData.experience}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                            handleInputChange("experience", value);
                                                        }
                                                    }}
                                                    className="input input-bordered w-full"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-medium">Areas of Expertise</label>
                                            <textarea
                                                value={userData.expertise}
                                                onChange={(e) => handleInputChange("expertise", e.target.value)}
                                                className="textarea textarea-bordered w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Skills */}


                                    <div className="bg-white p-6 shadow rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold">Skills</h3>
                                            <button
                                                type="button"
                                                onClick={handleAddSkill}
                                                className="btn btn-primary"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {userData.skills.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <input
                                                        type="text"
                                                        value={skill}
                                                        onChange={(e) => handleSkillChange(index, e.target.value)}
                                                        className="input input-bordered w-full"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setUserData((prev) => ({
                                                                ...prev,
                                                                skills: prev.skills.filter((_, i) => i !== index),
                                                            }))
                                                        }
                                                        className="btn btn-error"
                                                        style={{
                                                            backgroundColor: "transparent",
                                                            color: "#fb7373",
                                                            borderColor: "transparent",
                                                        }}
                                                    >
                                                        ✖
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    <div className="flex justify-center mt-8">
                                        {/* Save Button */}
                                        <button
                                            onClick={handleSaveUserInfo}
                                            type="button"
                                            className={`btn btn-success px-6 py-3 rounded-lg hover:bg-green-600 text-white font-semibold focus:ring-2 focus:ring-green-500 transition-all ${isSavingUserInfo ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={isSavingUserInfo}
                                        >
                                            {isSavingUserInfo ? "Saving..." : "Save Information"}
                                        </button>
                                    </div>

                                </form>
                            ) : (
                                <div>
                                    <label className="block font-medium">Upload CV</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className="file-input file-input-bordered w-full max-w-xs"
                                    />
                                    {uploadedCV && (
                                        <div className="mt-4">
                                            <h3 className="font-medium text-lg">Uploaded File:</h3>
                                            <p>{uploadedCV.name}</p>
                                            {uploadedCV.type === "application/pdf" ? (
                                                <embed
                                                    src={URL.createObjectURL(uploadedCV)}
                                                    type="application/pdf"
                                                    className="w-full h-96 border rounded-lg mt-2"
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-600">
                                                    Preview not available for this file type.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>)}

                    </div>
                )}
                {activeTab === "professionalExperience" && (
                    <div>
                        <h2 className="text-3xl font-extrabold mb-6">Professional Experience</h2>
                        <div className="bg-white p-6 shadow rounded-lg space-y-4">
                            {/* Presentation Section */}
                            <div className="mb-6">
                                <label className="block font-medium text-lg mb-2">Presentation</label>
                                <textarea
                                    value={cvData.presentation}
                                    onChange={(e) =>
                                        setCvData((prev) => ({...prev, presentation: e.target.value}))
                                    }
                                    className="textarea textarea-bordered w-full rounded-lg shadow-sm p-4 bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Write a short description about yourself and your career."
                                />
                            </div>

                            {/* Experience Section */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold">Experiences</h3>
                                {/* Add Experience Button */}
                                <button
                                    onClick={() =>
                                        setCvData((prev) => ({
                                            ...prev,
                                            experiences: [
                                                {id: null, title: "", company: "", duration: "", description: ""}, // `id: null` to mark as a new experience
                                                ...prev.experiences, // Add new experience to the beginning of the list
                                            ],
                                        }))
                                    }
                                    className="btn btn-primary px-4 py-2 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    + Add
                                </button>
                            </div>

                            {cvData.experiences.map((exp, index) => (
                                <div
                                    key={index}
                                    className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-bold">Experience {index + 1}</h4>
                                        {/* Delete Experience Button */}
                                        <button
                                            onClick={() => handleDeleteExperience(index, exp.id)}
                                            className="btn btn-error w-8 h-8 rounded-full hover:bg-red-600 text-white flex items-center justify-center focus:ring-2 focus:ring-red-500 transition-all"
                                            aria-label="Delete experience"
                                            style={{
                                                backgroundColor: "transparent",
                                                color: "#fb7373",
                                                borderColor: "transparent",
                                            }}
                                        >✖
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={exp.title}
                                        onChange={(e) =>
                                            handleExperienceChange(index, "title", e.target.value)
                                        }
                                        className="input input-bordered w-full mb-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={(e) =>
                                            handleExperienceChange(index, "company", e.target.value)
                                        }
                                        className="input input-bordered w-full mb-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Duration"
                                        value={exp.duration}
                                        onChange={(e) =>
                                            handleExperienceChange(index, "duration", e.target.value)
                                        }
                                        className="input input-bordered w-full mb-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) =>
                                            handleExperienceChange(index, "description", e.target.value)
                                        }
                                        className="textarea textarea-bordered w-full rounded-lg shadow-sm p-4 bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Describe your role and achievements."
                                    />
                                </div>
                            ))}

                            {/* Save Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleSaveProfessionalExperience}
                                    className={`btn btn-success px-6 py-3 rounded-lg hover:bg-green-600 text-white font-semibold focus:ring-2 focus:ring-green-500 transition-all ${isSavingExperience ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isSavingExperience}
                                >
                                    {isSavingExperience ? "Saving..." : "Save Experience"}
                                </button>
                            </div>
                        </div>

                    </div>
                )}


                {activeTab === "alerts" && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Alerts</h2>
                        {currentUser && (currentUser?.user_metadata?.hasPurchased || isTrialPeriodActive) ? (
                            // Mostrar mensaje si no ha comprado
                            <div className="bg-white p-6 shadow rounded-lg text-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    You need to subscribe to access Alerts.
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Please visit our pricing page to choose a plan that works for you.
                                </p>
                                <button
                                    onClick={() => (window.location.href = "/#pricing")}
                                    className="btn btn-primary px-6 py-3 rounded-lg hover:bg-blue-600 text-white font-semibold focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    Go to Pricing
                                </button>
                            </div>
                        ) : (
                            // Mostrar tabla de alertas si ha comprado
                            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                                {applications.length > 0 ? (
                                    <table className="table w-full table-auto">
                                        <thead className="bg-primary text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                                Platform
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                                Date Shared
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-gray-50">
                                        {applications.map((app, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-gray-100 transition-all duration-200 ${
                                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {app.platform}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{app.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    app.status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : app.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                }`}
                            >
                                {app.status}
                            </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-10">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                                            We are working to find the best matches for you!
                                        </h3>
                                        <p className="text-gray-600">
                                            Don't forget to upload your information so we can help you find the perfect
                                            match.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}


            </section>
            {/* Floating Button */}
            <a
                href="mailto:kevyn@franco.expert"
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full shadow-lg p-4 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
                title="Contact Support"
            >
                <HiChatAlt2 className="w-6 h-6"/>
            </a>
        </main>
    );
}