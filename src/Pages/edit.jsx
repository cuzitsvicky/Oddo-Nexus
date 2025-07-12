import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router"
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

export default function EditProfilePage() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Alexandra Chen",
    title: "Senior UX/UI Designer & Frontend Developer",
    location: "San Francisco, CA",
    email: "alexandra.chen@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "March 2022",
    bio: "Passionate designer and developer with 8+ years of experience creating beautiful, user-centered digital experiences. I specialize in bridging the gap between design and development, ensuring pixel-perfect implementations that delight users.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=300&width=800",
    stats: {
      projects: 47,
      followers: 1234,
      following: 567,
      likes: 8901,
    },
    skills: {
      design: [
        { name: "UI/UX Design", level: 95 },
        { name: "Figma", level: 90 },
        { name: "Adobe Creative Suite", level: 85 },
        { name: "Prototyping", level: 88 },
      ],
      development: [
        { name: "React", level: 92 },
        { name: "TypeScript", level: 88 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 90 },
      ],
    },
    experience: [
      {
        company: "TechCorp Inc.",
        position: "Senior UX Designer",
        duration: "2022 - Present",
        description: "Leading design initiatives for enterprise SaaS products, managing a team of 4 designers.",
      },
      {
        company: "StartupXYZ",
        position: "Product Designer",
        duration: "2020 - 2022",
        description: "Designed and developed the complete user experience for a fintech mobile application.",
      },
      {
        company: "Design Studio",
        position: "UI Designer",
        duration: "2018 - 2020",
        description: "Created beautiful interfaces for various client projects across different industries.",
      },
    ],
    projects: [
      {
        title: "E-commerce Dashboard",
        description: "Complete redesign of admin dashboard with 40% improvement in user efficiency",
        image: "/placeholder.svg?height=200&width=300",
        tags: ["UI/UX", "React", "Analytics"],
      },
      {
        title: "Mobile Banking App",
        description: "Fintech mobile app serving 100K+ users with seamless transaction experience",
        image: "/placeholder.svg?height=200&width=300",
        tags: ["Mobile", "Fintech", "UX Research"],
      },
      {
        title: "Design System",
        description: "Comprehensive design system adopted across 15+ products in the organization",
        image: "/placeholder.svg?height=200&width=300",
        tags: ["Design System", "Components", "Documentation"],
      },
    ],
    achievements: [
      { title: "Design Excellence Award", year: "2023", organization: "TechCorp" },
      { title: "Best Mobile App Design", year: "2022", organization: "Design Awards" },
      { title: "Innovation in UX", year: "2021", organization: "UX Conference" },
    ],
    socialLinks: {
      github: "https://github.com/alexandra-chen",
      linkedin: "https://linkedin.com/in/alexandra-chen",
      twitter: "https://twitter.com/alexandra_chen",
      website: "https://alexandrachen.design",
    },
  })

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    // Fetch current user's data
    fetch(`http://localhost:4000/api/users/${currentUserId}`)
      .then(res => res.json())
      .then(userData => {
        if (userData) {
          // Set basic user info from users table
          setProfileData(prevDefault => ({
            ...prevDefault,
            name: userData.name || "Your Name",
            email: userData.email || "your@email.com",
            // Keep other default values for now
          }));
        }
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        navigate('/login');
      });
  }, [navigate]);

  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [newExperience, setNewExperience] = useState({ company: "", position: "", duration: "", description: "" })
  const [newProject, setNewProject] = useState({ title: "", description: "", image: "", tags: [] })
  const [newAchievement, setNewAchievement] = useState({ title: "", year: "", organization: "" })
  const [newTag, setNewTag] = useState("")
  const fileInputRef = useRef(null)

  const addSkill = (type) => {
    const skill = type === "offered" ? newSkillOffered : newSkillWanted
    if (skill.trim()) {
      setProfileData((prev) => ({
        ...prev,
        [type === "offered" ? "skillsOffered" : "skillsWanted"]: [
          ...prev[type === "offered" ? "skillsOffered" : "skillsWanted"],
          skill.trim(),
        ],
      }))
      if (type === "offered") {
        setNewSkillOffered("")
      } else {
        setNewSkillWanted("")
      }
    }
  }

  const removeSkill = (type, index) => {
    setProfileData((prev) => ({
      ...prev,
      [type === "offered" ? "skillsOffered" : "skillsWanted"]: prev[
        type === "offered" ? "skillsOffered" : "skillsWanted"
      ].filter((_, i) => i !== index),
    }))
  }

  const updateSkillLevel = (category, index, level) => {
    setProfileData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => 
          i === index ? { ...skill, level: parseInt(level) } : skill
        )
      }
    }))
  }

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setProfileData((prev) => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }]
      }))
      setNewExperience({ company: "", position: "", duration: "", description: "" })
    }
  }

  const removeExperience = (index) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProfileData((prev) => ({
        ...prev,
        projects: [...prev.projects, { ...newProject, tags: [...newProject.tags] }]
      }))
      setNewProject({ title: "", description: "", image: "", tags: [] })
    }
  }

  const removeProject = (index) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const addProjectTag = () => {
    if (newTag.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeProjectTag = (index) => {
    setNewProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.year) {
      setProfileData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, { ...newAchievement }]
      }))
      setNewAchievement({ title: "", year: "", organization: "" })
    }
  }

  const removeAchievement = (index) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      alert('Please log in to save your profile!');
      navigate('/login');
      return;
    }

    try {
      console.log('Saving profile for user:', currentUserId);
      console.log('Profile data to save:', profileData);

      // Update user's basic info in users table
      const basicResponse = await fetch(`http://localhost:4000/api/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });

      if (!basicResponse.ok) {
        const errorData = await basicResponse.json();
        throw new Error(`Basic info update failed: ${errorData.error || basicResponse.statusText}`);
      }

      console.log('Basic info updated successfully');

      // Update user's detailed profile info
      const profileResponse = await fetch(`http://localhost:4000/api/users/${currentUserId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: profileData.title,
          location: profileData.location,
          phone: profileData.phone,
          joinDate: profileData.joinDate,
          bio: profileData.bio,
          avatar: profileData.avatar,
          coverImage: profileData.coverImage,
          stats: profileData.stats,
          skills: profileData.skills,
          experience: profileData.experience,
          projects: profileData.projects,
          achievements: profileData.achievements,
          socialLinks: profileData.socialLinks,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(`Profile update failed: ${errorData.error || profileResponse.statusText}`);
      }

      console.log('Profile updated successfully');
      alert('Profile saved successfully!');
      // Set flag to indicate we're returning from edit page
      sessionStorage.setItem('returningFromEdit', 'true');
      navigate('/profile');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(`Failed to save profile: ${err.message}`);
    }
  }

  const handleDiscard = () => {
    console.log("Discarding changes")
    alert("Changes discarded!")
    // Set flag to indicate we're returning from edit page
    sessionStorage.setItem('returningFromEdit', 'true');
    navigate('/profile')
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Optionally show uploading state
        const url = await uploadToCloudinary(file);
        setProfileData((prev) => ({ ...prev, avatar: url }));
      } catch (err) {
        alert('Image upload failed!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mobile Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200 bg-white/80"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-black">
                Edit Profile
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscard}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                    Discard
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        {/* Main Profile Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h3>
            
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-300 transition-all duration-300">
                  <img
                    src={profileData.avatar || '/placeholder.svg?height=200&width=200'}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                    <motion.div
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                            onClick={handleImageUpload}
                      className="rounded-full p-2 bg-white text-gray-900 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                      value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                      Professional Title
                </label>
                <input
                  type="text"
                      value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="e.g., Senior Developer"
                />
                </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                        Email
                </label>
                <input
                        type="email"
                        value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                        placeholder="your.email@example.com"
                      />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                        Phone
                </label>
                <input
                        type="tel"
                        value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="City, State/Country"
                />
                  </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Join Date
                </label>
                <input
                  type="text"
                  value={profileData.joinDate}
                  onChange={(e) => setProfileData({ ...profileData, joinDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="e.g., March 2022"
                />
                </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Bio
                </label>
                <textarea
                      value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
                </div>

                {/* Skills Section */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Skills & Expertise
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Design Skills */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-black">Design Skills</h4>
                <div className="space-y-4">
                  {profileData.skills.design.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkillLevel('design', index, e.target.value)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateSkillLevel('design', index, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Skills */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-black">Development Skills</h4>
                <div className="space-y-4">
                  {profileData.skills.development.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkillLevel('development', index, e.target.value)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateSkillLevel('development', index, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
                </div>

          {/* Experience Section */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Work Experience
            </h3>
            
            <div className="space-y-4 mb-6">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-black">{exp.position}</h4>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-black hover:text-gray-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Add New Experience */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold mb-4 text-black">Add New Experience</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2022 - Present)"
                  value={newExperience.duration}
                  onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <button
                  onClick={addExperience}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add Experience
                </button>
              </div>
              <textarea
                placeholder="Description"
                value={newExperience.description}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                rows={3}
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Projects Section */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Projects
            </h3>
            
            <div className="space-y-4 mb-6">
              {profileData.projects.map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-black">{project.title}</h4>
                    <button
                      onClick={() => removeProject(index)}
                      className="text-black hover:text-gray-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
                </div>

            {/* Add New Project */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold mb-4 text-black">Add New Project</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addProjectTag()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={addProjectTag}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {newProject.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeProjectTag(index)}
                        className="text-black hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={addProject}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Achievements
            </h3>
            
            <div className="space-y-4 mb-6">
              {profileData.achievements.map((achievement, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-black">{achievement.title}</h4>
                    <button
                      onClick={() => removeAchievement(index)}
                      className="text-black hover:text-gray-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.year} - {achievement.organization}</p>
                </div>
              ))}
            </div>

            {/* Add New Achievement */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold mb-4 text-black">Add New Achievement</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={newAchievement.year}
                  onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Organization"
                    value={newAchievement.organization}
                    onChange={(e) => setNewAchievement({ ...newAchievement, organization: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={addAchievement}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Social Links
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">GitHub</label>
                <input
                  type="url"
                  value={profileData.socialLinks.github}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    socialLinks: { ...profileData.socialLinks, github: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  value={profileData.socialLinks.linkedin}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Twitter</label>
                <input
                  type="url"
                  value={profileData.socialLinks.twitter}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Website</label>
                <input
                  type="url"
                  value={profileData.socialLinks.website}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    socialLinks: { ...profileData.socialLinks, website: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="md:hidden space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Changes
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDiscard}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Discard Changes
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
