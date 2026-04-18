import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const localApiBaseUrl = "http://localhost:5000/api";
const productionApiBaseUrl = "https://adopt-a-pet-gto4.onrender.com/api";
const sessionStorageKey = "pet-adoption-session";

function resolveApiBaseUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return localApiBaseUrl;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return localApiBaseUrl;
    }
  }

  return productionApiBaseUrl;
}

const apiBaseUrl = resolveApiBaseUrl();

const text = {
  brand: "Adopt A Pet",
  powered: "For Indian shelters & rescue homes",
  navHome: "Home",
  navFind: "Available Pets",
  navShelters: "Admin",
  navCare: "User Requests",
  navAbout: "About Us",
  navAccess: "Login",
  login: "Login",
  register: "Register",
  heroTitle: "A Forever Family For Pets In Need",
  heroLead:
    "Discover live shelter records, send adoption requests, and track every step from enquiry to approval.",
  heroSub:
    "Admins get a professional activity desk with users, requests, animals, medical records, adoptions, and volunteers in one place.",
  heroButton: "Track My Request",
  heroSecondary: "Admin Workspace",
  statPets: "Pets listed",
  statShelters: "Shelters onboard",
  statCities: "Cities covered",
  aboutTitle: "About Us",
  aboutLead:
    "Adopt A Pet connects rescue animals with families while giving shelters a simple way to manage adoption requests, care records, and daily operations.",
  aboutMission:
    "Our mission is to make every adoption more transparent, kinder, and easier to track from first search to the day a pet goes home.",
  aboutShelters: "Shelter-first workflows for animals, medical care, volunteers, and adoptions",
  aboutFamilies: "Clear pet discovery and request tracking for adopters",
  aboutTrust: "A shared system that helps teams respond faster and keep records current",
  aboutContact: "hello@adoptapet.in",
  aboutLocation: "Serving shelters, NGOs, and adopters across India",
  aboutCopyright: "(c) 2026 Adopt A Pet. All rights reserved.",
  authTitle: "Join the adoption network",
  authText:
    "Choose your portal to continue. Users can request pets and track request status, while admins can manage shelter operations and user activity.",
  authUserLogin: "User Login",
  authUserRegister: "User Register",
  authAdminLogin: "Admin Login",
  authAdminRegister: "Admin Register",
  fullName: "Full name",
  email: "Email address",
  password: "Password",
  shelterName: "Shelter name",
  city: "City",
  phone: "Phone number",
  submit: "Continue",
  loading: "Please wait...",
  featuredTitle: "Featured Pets",
  featuredText:
    "Live shelter animals are visible to everyone. Log in as a user to send and track an adoption request.",
  whyOne: "Designed for local Indian shelters and NGO teams",
  whyTwo: "Separate user and admin access for adoption operations",
  whyThree: "Built to expand into a full MERN shelter management system",
  dashboardTitle: "Admin Activity Dashboard",
  dashboardText: "Track animals, requests, users, medical support, adoptions, and volunteers in one place.",
  userTitle: "User Request Tracker",
  userText: "Review your adoption requests, current status, and admin notes from the shelter team.",
  petOneStory: "Gentle indie pup, playful and vaccinated.",
  petTwoStory: "Young rescue cat recovering well and ready for cuddles.",
  petThreeStory: "Calm senior dog who loves quiet homes.",
  statusReady: "Ready",
  statusCare: "In Care",
  statusSpecial: "Special Care",
  adminOnly: "Admin tools are visible only to logged-in admins.",
  userOnly: "Log in as a user to submit and track adoption requests.",
  logout: "Logout"
};

const stats = [
  { label: "statPets", value: "148+" },
  { label: "statShelters", value: "26" },
  { label: "statCities", value: "11" }
];

const petPhotos = {
  dog: [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=80"
  ],
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=80"
  ]
};

const authModes = {
  userLogin: { fields: ["email", "password"], endpoint: "login", role: "user" },
  userRegister: { fields: ["fullName", "email", "phone", "city", "password"], endpoint: "register", role: "user" },
  adminLogin: { fields: ["email", "password"], endpoint: "login", role: "admin" },
  adminRegister: { fields: ["shelterName", "city", "phone", "email", "password"], endpoint: "register", role: "admin" }
};

const animalStatusOptions = ["rescued", "underTreatment", "readyForAdoption", "adopted"];
const requestStatusOptions = ["pending", "reviewing", "approved", "rejected", "completed"];
const emptyForm = { fullName: "", email: "", password: "", shelterName: "", city: "", phone: "" };
const emptyAdminActivity = { users: [], requests: [], pendingAdmins: [], primaryAdmins: [], canReviewAdminRequests: false };
const emptyAnimalForm = { name: "", species: "", age: "", status: "rescued", location: "" };
const createEmptyAdoptionForm = (animalId = "") => ({ animalId, adopter: "", phone: "", date: new Date().toISOString().slice(0, 10) });
const createEmptyMedicalForm = (animalId = "") => ({ animalId, treatment: "", date: new Date().toISOString().slice(0, 10) });
const emptyVolunteerForm = { name: "", role: "", language: "" };
const entityPreviewLimit = 3;
const activityPreviewLimit = 4;
const createEmptyRequestForm = (session, animalId = "") => ({
  animalId,
  adopterName: session?.user?.fullName || "",
  phone: session?.user?.phone || "",
  city: session?.user?.city || "",
  message: ""
});

function App() {
  const [activeAuth, setActiveAuth] = useState("userLogin");
  const [formState, setFormState] = useState(emptyForm);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(() => loadStoredSession());

  const [publicAnimals, setPublicAnimals] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [adminActivity, setAdminActivity] = useState(emptyAdminActivity);
  const [adminApprovalNotes, setAdminApprovalNotes] = useState({});
  const [crudFeedback, setCrudFeedback] = useState({ type: "", message: "" });
  const [crudLoading, setCrudLoading] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState({ type: "", message: "" });
  const [requestLoading, setRequestLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ city: "", radius: "", pet: "" });

  const [animalForm, setAnimalForm] = useState(emptyAnimalForm);
  const [adoptionForm, setAdoptionForm] = useState(createEmptyAdoptionForm());
  const [medicalForm, setMedicalForm] = useState(createEmptyMedicalForm());
  const [volunteerForm, setVolunteerForm] = useState(emptyVolunteerForm);
  const [requestForm, setRequestForm] = useState(() => createEmptyRequestForm(session));

  const [editingAnimalId, setEditingAnimalId] = useState("");
  const [editingAdoptionId, setEditingAdoptionId] = useState("");
  const [editingMedicalId, setEditingMedicalId] = useState("");
  const [editingVolunteerId, setEditingVolunteerId] = useState("");
  const [expandedEntityLists, setExpandedEntityLists] = useState({
    animals: false,
    adoptions: false,
    medicalRecords: false,
    volunteers: false
  });
  const [expandedActivityLists, setExpandedActivityLists] = useState({
    pendingAdmins: false,
    users: false,
    requests: false
  });

  const currentConfig = authModes[activeAuth];
  const currentFields = currentConfig.fields;
  const isAdmin = session?.user?.role === "admin" && Boolean(session?.token);
  const isUser = session?.user?.role === "user" && Boolean(session?.token);
  const adminHeaders = useMemo(() => (session?.token ? { Authorization: `Bearer ${session.token}` } : {}), [session]);
  const primaryAdminIds = adminActivity.primaryAdmins.map((admin) => String(admin._id));
  const readyAnimals = publicAnimals.filter((animal) => animal.status !== "adopted");
  const displayedAnimals = publicAnimals.filter((animal) => {
    const cityMatch = !searchFilters.city || animal.location.toLowerCase().includes(searchFilters.city.toLowerCase());
    const petMatch = !searchFilters.pet || animal.species.toLowerCase().includes(searchFilters.pet.toLowerCase()) || animal.name.toLowerCase().includes(searchFilters.pet.toLowerCase());
    return cityMatch && petMatch;
  });

  const managementCards = [
    { title: "Animals in Care", value: animals.length, accent: "orange" },
    { title: "Adoptions", value: adoptions.length, accent: "red" },
    { title: "Requests", value: adminActivity.requests.length, accent: "teal" },
    { title: "Users", value: adminActivity.users.length, accent: "ink" },
    { title: "Pending Admins", value: adminActivity.pendingAdmins.length, accent: "teal" }
  ];
  const visibleAnimals = expandedEntityLists.animals ? animals : animals.slice(0, entityPreviewLimit);
  const visibleAdoptions = expandedEntityLists.adoptions ? adoptions : adoptions.slice(0, entityPreviewLimit);
  const visibleMedicalRecords = expandedEntityLists.medicalRecords ? medicalRecords : medicalRecords.slice(0, entityPreviewLimit);
  const visibleVolunteers = expandedEntityLists.volunteers ? volunteers : volunteers.slice(0, entityPreviewLimit);
  const visiblePendingAdmins = expandedActivityLists.pendingAdmins ? adminActivity.pendingAdmins : adminActivity.pendingAdmins.slice(0, activityPreviewLimit);
  const visibleActivityUsers = expandedActivityLists.users ? adminActivity.users : adminActivity.users.slice(0, activityPreviewLimit);
  const visibleActivityRequests = expandedActivityLists.requests ? adminActivity.requests : adminActivity.requests.slice(0, activityPreviewLimit);

  useEffect(() => {
    loadPublicAnimals();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadShelterData();
      loadAdminActivity();
    } else {
      setAnimals([]);
      setAdoptions([]);
      setMedicalRecords([]);
      setVolunteers([]);
      setAdminActivity(emptyAdminActivity);
      setAdminApprovalNotes({});
    }

    if (isUser) {
      loadUserRequests();
      setRequestForm(createEmptyRequestForm(session, readyAnimals[0]?._id || ""));
    } else {
      setUserRequests([]);
    }
  }, [isAdmin, isUser, session?.token]);

  useEffect(() => {
    if (!animals.length) return;
    setAdoptionForm((current) => ({ ...current, animalId: current.animalId || animals[0]._id }));
    setMedicalForm((current) => ({ ...current, animalId: current.animalId || animals[0]._id }));
  }, [animals]);

  useEffect(() => {
    if (!requestForm.animalId && readyAnimals[0]?._id) {
      setRequestForm((current) => ({ ...current, animalId: readyAnimals[0]._id }));
    }
  }, [readyAnimals, requestForm.animalId]);

  const loadPublicAnimals = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/animals`);
      setPublicAnimals(response.data);
    } catch (error) {
      setRequestFeedback({ type: "error", message: error.response?.data?.message || "Failed to load pet records." });
    }
  };

  const loadShelterData = async () => {
    try {
      const config = { headers: adminHeaders };
      const [animalsResponse, adoptionsResponse, medicalResponse, volunteersResponse] = await Promise.all([
        axios.get(`${apiBaseUrl}/animals`, config),
        axios.get(`${apiBaseUrl}/adoptions`, config),
        axios.get(`${apiBaseUrl}/medical-records`, config),
        axios.get(`${apiBaseUrl}/volunteers`, config)
      ]);
      setAnimals(animalsResponse.data);
      setAdoptions(adoptionsResponse.data);
      setMedicalRecords(medicalResponse.data);
      setVolunteers(volunteersResponse.data);
    } catch (error) {
      setCrudFeedback({ type: "error", message: error.response?.data?.message || "Failed to load shelter data." });
    }
  };

  const loadUserRequests = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/requests/mine`, { headers: adminHeaders });
      setUserRequests(response.data);
    } catch (error) {
      const status = error.response?.status;
      setRequestFeedback({
        type: "error",
        message: status === 404
          ? "Request tracking API is not available yet. Restart the backend server, then refresh this page."
          : error.response?.data?.message || "Failed to load your requests."
      });
    }
  };

  const loadAdminActivity = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/activity`, { headers: adminHeaders });
      setAdminActivity(response.data);
      setAdminApprovalNotes((current) =>
        response.data.pendingAdmins.reduce(
          (next, admin) => ({ ...next, [admin._id]: current[admin._id] || "" }),
          {}
        )
      );
    } catch (error) {
      setCrudFeedback({ type: "error", message: error.response?.data?.message || "Failed to load user activity." });
    }
  };

  const activateMode = (mode) => {
    setActiveAuth(mode);
    setFeedback({ type: "", message: "" });
    document.getElementById("access")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      const payload = {
        role: currentConfig.role,
        fullName: formState.fullName.trim(),
        shelterName: formState.shelterName.trim(),
        city: formState.city.trim(),
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        password: formState.password
      };
      const response = await axios.post(`${apiBaseUrl}/auth/${currentConfig.endpoint}`, payload);
      if (response.data.token) {
        const nextSession = { user: response.data.user, token: response.data.token };
        setSession(nextSession);
        persistSession(nextSession);
        setRequestForm(createEmptyRequestForm(nextSession, readyAnimals[0]?._id || ""));
      } else if (response.data.requiresApproval) {
        setActiveAuth("adminLogin");
      }
      setFeedback({ type: "success", message: response.data.message });
      setFormState(emptyForm);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong while contacting the server.";
      setFeedback({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    clearStoredSession();
    setCrudFeedback({ type: "", message: "" });
    setRequestFeedback({ type: "", message: "" });
    setFeedback({ type: "success", message: "Logged out successfully." });
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    setRequestLoading(true);
    setRequestFeedback({ type: "", message: "" });
    try {
      await axios.post(`${apiBaseUrl}/requests`, requestForm, { headers: adminHeaders });
      setRequestFeedback({ type: "success", message: "Request submitted. You can track it below." });
      setRequestForm(createEmptyRequestForm(session, readyAnimals[0]?._id || ""));
      await Promise.all([loadUserRequests(), loadPublicAnimals()]);
    } catch (error) {
      setRequestFeedback({ type: "error", message: error.response?.data?.message || "Failed to submit request." });
    } finally {
      setRequestLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status, adminNote = "") => {
    setCrudLoading(true);
    setCrudFeedback({ type: "", message: "" });
    try {
      await axios.patch(`${apiBaseUrl}/requests/${requestId}/status`, { status, adminNote }, { headers: adminHeaders });
      setCrudFeedback({ type: "success", message: "Request status updated." });
      await Promise.all([loadAdminActivity(), loadPublicAnimals(), loadShelterData()]);
    } catch (error) {
      setCrudFeedback({ type: "error", message: error.response?.data?.message || "Failed to update request." });
    } finally {
      setCrudLoading(false);
    }
  };

  const reviewAdminRequest = async (requestId, decision) => {
    setCrudLoading(true);
    setCrudFeedback({ type: "", message: "" });
    try {
      const note = adminApprovalNotes[requestId]?.trim() || "";
      const response = await axios.patch(
        `${apiBaseUrl}/auth/admin-requests/${requestId}`,
        { decision, note },
        { headers: adminHeaders }
      );
      setCrudFeedback({ type: "success", message: response.data.message });
      setAdminApprovalNotes((current) => ({ ...current, [requestId]: "" }));
      await loadAdminActivity();
    } catch (error) {
      setCrudFeedback({
        type: "error",
        message: error.response?.data?.message || "Failed to review admin registration."
      });
    } finally {
      setCrudLoading(false);
    }
  };

  const handleEntitySubmit = async ({ event, endpoint, payload, editId, onReset }) => {
    event.preventDefault();
    setCrudLoading(true);
    setCrudFeedback({ type: "", message: "" });
    try {
      const config = { headers: adminHeaders };
      if (editId) {
        await axios.put(`${apiBaseUrl}/${endpoint}/${editId}`, payload, config);
        setCrudFeedback({ type: "success", message: "Entry updated successfully." });
      } else {
        await axios.post(`${apiBaseUrl}/${endpoint}`, payload, config);
        setCrudFeedback({ type: "success", message: "Entry added successfully." });
      }
      onReset();
      await Promise.all([loadShelterData(), loadPublicAnimals()]);
    } catch (error) {
      setCrudFeedback({ type: "error", message: error.response?.data?.message || "Failed to save entry." });
    } finally {
      setCrudLoading(false);
    }
  };

  const handleDelete = async (endpoint, id) => {
    setCrudLoading(true);
    setCrudFeedback({ type: "", message: "" });
    try {
      await axios.delete(`${apiBaseUrl}/${endpoint}/${id}`, { headers: adminHeaders });
      setCrudFeedback({ type: "success", message: "Entry deleted successfully." });
      await Promise.all([loadShelterData(), loadPublicAnimals()]);
    } catch (error) {
      setCrudFeedback({ type: "error", message: error.response?.data?.message || "Failed to delete entry." });
    } finally {
      setCrudLoading(false);
    }
  };

  const resetAnimal = () => { setAnimalForm(emptyAnimalForm); setEditingAnimalId(""); };
  const resetAdoption = () => { setAdoptionForm(createEmptyAdoptionForm(animals[0]?._id || "")); setEditingAdoptionId(""); };
  const resetMedical = () => { setMedicalForm(createEmptyMedicalForm(animals[0]?._id || "")); setEditingMedicalId(""); };
  const resetVolunteer = () => { setVolunteerForm(emptyVolunteerForm); setEditingVolunteerId(""); };
  const toggleEntityList = (listName) => {
    setExpandedEntityLists((current) => ({ ...current, [listName]: !current[listName] }));
  };

  const toggleActivityList = (listName) => {
    setExpandedActivityLists((current) => ({ ...current, [listName]: !current[listName] }));
  };

  const renderEntityToggle = (listName, total, label) => {
    if (total <= entityPreviewLimit) return null;
    const isExpanded = expandedEntityLists[listName];
    const hiddenCount = total - entityPreviewLimit;
    return (
      <button className="list-toggle" type="button" onClick={() => toggleEntityList(listName)}>
        {isExpanded ? `Show fewer ${label}` : `Show ${hiddenCount} more ${label}`}
      </button>
    );
  };

  const renderActivityToggle = (listName, total, label) => {
    if (total <= activityPreviewLimit) return null;
    const isExpanded = expandedActivityLists[listName];
    const hiddenCount = total - activityPreviewLimit;
    return (
      <button className="list-toggle" type="button" onClick={() => toggleActivityList(listName)}>
        {isExpanded ? `Show fewer ${label}` : `Show ${hiddenCount} more ${label}`}
      </button>
    );
  };

  return (
    <div className="landing-page">
      <header className="site-header">
        <div className="header-top">
          <div className="brand-block">
            <div className="brand-mark"><span className="paw">🐾</span></div>
            <div><h1 className="brand-title">{text.brand}</h1><p className="brand-powered">{text.powered}</p></div>
          </div>
          <div className="header-actions">
            {session ? (
              <button className="pill-button solid-fill" type="button" onClick={logout}>{text.logout}</button>
            ) : (
              <>
                <button className="pill-button ghost-fill" type="button" onClick={() => activateMode("userLogin")}>{text.login}</button>
                <button className="pill-button solid-fill" type="button" onClick={() => activateMode("userRegister")}>{text.register}</button>
              </>
            )}
          </div>
        </div>
        <nav className="main-nav">
          <a href="#home">{text.navHome}</a>
          <a href="#pets">{text.navFind}</a>
          {isUser ? <a href="#requests">{text.navCare}</a> : null}
          {isAdmin ? <a href="#shelters">{text.navShelters}</a> : null}
          <a href="#about">{text.navAbout}</a>
          <a href="#access">{session ? "Account" : text.navAccess}</a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="hero-tag">Pet Adoption & Animal Shelter Management</p>
            <h2>{text.heroTitle}</h2>
            <p className="hero-lead">{text.heroLead}</p>
            <p className="hero-sub">{text.heroSub}</p>
            <div className="hero-buttons">
              <button className="cta-primary" type="button" onClick={() => scrollToSection(isUser ? "requests" : "pets")}>{isUser ? text.heroButton : "Find Pets"}</button>
              <button className="cta-secondary" type="button" onClick={() => scrollToSection(isAdmin ? "shelters" : "access")}>{isAdmin ? text.heroSecondary : "Login / Register"}</button>
            </div>
            <div className="stats-row">
              {stats.map((item) => <article key={item.label} className="stat-chip"><strong>{item.value}</strong><span>{text[item.label]}</span></article>)}
            </div>
          </div>
          <div className="hero-visual-wrap"><div className="hero-photo-card"><HeroIllustration /></div></div>
        </section>

        <section className="auth-section" id="access">
          <div className="auth-copy">
            <p className="section-tag">Access Portals</p>
            <h3>{text.authTitle}</h3>
            <p>{text.authText}</p>
            <ul className="benefit-list"><li>{text.whyOne}</li><li>{text.whyTwo}</li><li>{text.whyThree}</li></ul>
            {session ? <div className="session-card"><strong>Active Session</strong><p>{session.user.role === "admin" ? (session.user.shelterName || "Admin") : (session.user.fullName || "User")}</p><p>{session.user.email}</p><p>Role: {session.user.role}</p></div> : null}
          </div>
          <div className="auth-panel">
            <div className="auth-tabs">
              <button type="button" className={activeAuth === "userLogin" ? "tab active" : "tab"} onClick={() => activateMode("userLogin")}>{text.authUserLogin}</button>
              <button type="button" className={activeAuth === "userRegister" ? "tab active" : "tab"} onClick={() => activateMode("userRegister")}>{text.authUserRegister}</button>
              <button type="button" className={activeAuth === "adminLogin" ? "tab active" : "tab"} onClick={() => activateMode("adminLogin")}>{text.authAdminLogin}</button>
              <button type="button" className={activeAuth === "adminRegister" ? "tab active" : "tab"} onClick={() => activateMode("adminRegister")}>{text.authAdminRegister}</button>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              {currentFields.map((field) => <label key={field} className="field"><span>{text[field]}</span><input type={field === "password" ? "password" : field === "email" ? "email" : "text"} placeholder={text[field]} value={formState[field]} onChange={(event) => setFormState({ ...formState, [field]: event.target.value })} required /></label>)}
              <p className="field-note">Portal: <strong>{currentConfig.role === "admin" ? "Admin" : "User"}</strong> • Action: <strong>{currentConfig.endpoint === "register" ? "Register" : "Login"}</strong></p>
              {activeAuth === "adminRegister" ? <p className="field-note">New admin registrations are sent to the original two admins and become active only after both approvals are recorded.</p> : null}
              {feedback.message ? <div className={feedback.type === "success" ? "auth-feedback success" : "auth-feedback error"}>{feedback.message}</div> : null}
              <button type="submit" className="form-submit" disabled={loading}>{loading ? text.loading : text.submit}</button>
            </form>
          </div>
        </section>

        <section className="featured-section" id="pets">
          <div className="search-copy">Search by <span>Shelter, City or Zipcode & Radius</span></div>
          <div className="search-strip">
            <input value={searchFilters.city} onChange={(event) => setSearchFilters({ ...searchFilters, city: event.target.value })} placeholder="Select Shelter, City" />
            <input value={searchFilters.radius} onChange={(event) => setSearchFilters({ ...searchFilters, radius: event.target.value })} placeholder="Radius + Km" />
            <input value={searchFilters.pet} onChange={(event) => setSearchFilters({ ...searchFilters, pet: event.target.value })} placeholder="Select Pet (Optional)" />
            <button type="button" onClick={() => scrollToSection("pets")}>Search</button>
          </div>
          <div className="section-head featured-head"><div><p className="section-tag">Public Catalogue</p><h3>{text.featuredTitle}</h3></div><p className="section-copy">{text.featuredText}</p></div>
          <p className="result-count">{displayedAnimals.length} pet record{displayedAnimals.length === 1 ? "" : "s"} found from shelter data</p>
          <div className="pet-grid">
            {displayedAnimals.length ? displayedAnimals.map((pet, index) => {
              const tone = ["peach", "butter", "mint"][index % 3];
              const photoUrl = getPetPhoto(pet, index);
              return (
                <article key={pet._id} className={`pet-card tone-${tone}`}>
                  <div className="pet-illustration">
                    <img src={photoUrl} alt={`${pet.name} ${pet.species}`} loading="lazy" />
                  </div>
                  <div className="pet-body">
                    <div className="pet-meta-row"><div><h4>{pet.name}</h4><p>{pet.species} • {pet.age} yrs</p></div><span className="pet-status">{formatStatus(pet.status)}</span></div>
                    <div className="pet-data-row"><span>Shelter</span><strong>{pet.location}</strong></div>
                    <div className="pet-data-row"><span>Search tags</span><strong>{getSearchTags(pet)}</strong></div>
                    {pet.status === "adopted" ? (
                      <button className="mini-action public-action disabled-action" type="button" disabled>Already Adopted</button>
                    ) : (
                      <button className="mini-action public-action" type="button" onClick={() => { setRequestForm((current) => ({ ...current, animalId: pet._id })); scrollToSection(isUser ? "requests" : "access"); }}>Request Adoption</button>
                    )}
                  </div>
                </article>
              );
            }) : <div className="empty-state">No available pets match this search yet.</div>}
          </div>
          {displayedAnimals.length > 3 ? <button className="find-more" type="button" onClick={() => scrollToSection("access")}>Find more pets</button> : null}
        </section>

        {isUser ? <section className="user-section" id="requests">
          <div className="section-head"><div><p className="section-tag">User Page</p><h3>{text.userTitle}</h3></div><p className="section-copy">{isUser ? text.userText : text.userOnly}</p></div>
          <div className="available-picker">
            <div className="crud-head"><h4>Available Pets</h4><span>{readyAnimals.length} ready for requests</span></div>
            <div className="available-pet-grid">
              {readyAnimals.length ? readyAnimals.map((animal, index) => (
                <button
                  className={requestForm.animalId === animal._id ? "available-pet active" : "available-pet"}
                  key={animal._id}
                  type="button"
                  onClick={() => setRequestForm((current) => ({ ...current, animalId: animal._id }))}
                >
                  <img src={getPetPhoto(animal, index)} alt={`${animal.name} ${animal.species}`} />
                  <span>
                    <strong>{animal.name}</strong>
                    <small>{animal.species} • {animal.location}</small>
                  </span>
                </button>
              )) : <div className="empty-state">No available pets are open for requests right now.</div>}
            </div>
          </div>
          <div className="user-workspace">
              <form className="request-form" onSubmit={handleRequestSubmit}>
                <select value={requestForm.animalId} onChange={(event) => setRequestForm({ ...requestForm, animalId: event.target.value })} required><option value="">Select available pet</option>{readyAnimals.map((animal) => <option key={animal._id} value={animal._id}>{animal.name} - {animal.species}</option>)}</select>
                <input value={requestForm.adopterName} onChange={(event) => setRequestForm({ ...requestForm, adopterName: event.target.value })} placeholder="Your name" required />
                <input value={requestForm.phone} onChange={(event) => setRequestForm({ ...requestForm, phone: event.target.value })} placeholder="Phone number" required />
                <input value={requestForm.city} onChange={(event) => setRequestForm({ ...requestForm, city: event.target.value })} placeholder="City" />
                <textarea value={requestForm.message} onChange={(event) => setRequestForm({ ...requestForm, message: event.target.value })} placeholder="Why would this pet fit your home?" rows="4" />
                <button className="entity-submit" type="submit" disabled={requestLoading}>{requestLoading ? "Submitting..." : "Submit Request"}</button>
              </form>
              <div className="request-list">
                {requestFeedback.message ? <div className={requestFeedback.type === "success" ? "auth-feedback success" : "auth-feedback error"}>{requestFeedback.message}</div> : null}
                {userRequests.length ? userRequests.map((request) => <RequestCard key={request._id} request={request} />) : <div className="empty-state">No requests yet. Choose an available pet and submit your first request.</div>}
              </div>
            </div>
        </section> : null}

        {isAdmin ? <section className="management-section" id="shelters">
          <div className="section-head"><div><p className="section-tag">Management Layer</p><h3>{text.dashboardTitle}</h3></div><p className="section-copy">{isAdmin ? text.dashboardText : text.adminOnly}</p></div>

            <>
              <div className="management-grid">
                {managementCards.map((card) => <article key={card.title} className={`management-card accent-${card.accent}`}><span>{card.title}</span><strong>{card.value}</strong></article>)}
              </div>

              <div className="activity-panel">
                <div className="crud-head"><h4>User Activity</h4><button className="mini-action secondary-mini" type="button" onClick={loadAdminActivity}>Refresh Activity</button></div>
                <div className="activity-grid">
                  <section className="activity-column">
                    <h5>Pending Admin Registrations</h5>
                    <p>{adminActivity.primaryAdmins.length ? `Original approvers: ${adminActivity.primaryAdmins.map((admin) => admin.shelterName || admin.fullName || admin.email).join(" and ")}` : "No original admins are configured yet."}</p>
                    {!adminActivity.canReviewAdminRequests && adminActivity.primaryAdmins.length ? <p>Only the original admins can approve or reject new admin requests.</p> : null}
                    {visiblePendingAdmins.length ? visiblePendingAdmins.map((admin) => {
                      const decisions = admin.adminApprovalDecisions || [];
                      const approvedCount = decisions.filter((entry) => entry.decision === "approved" && primaryAdminIds.includes(String(entry.adminId?._id || entry.adminId))).length;
                      const rejectedBy = decisions.find((entry) => entry.decision === "rejected" && primaryAdminIds.includes(String(entry.adminId?._id || entry.adminId)));
                      return (
                        <article className="activity-item" key={admin._id}>
                          <strong>{admin.shelterName || "Unnamed shelter admin"}</strong>
                          <p>{admin.email}</p>
                          <p>{admin.city || "City not added"} • {admin.phone || "No phone"}</p>
                          <p>{rejectedBy ? `Rejected by ${rejectedBy.adminId?.shelterName || rejectedBy.adminId?.fullName || rejectedBy.adminId?.email || "an original admin"}` : `${approvedCount}/${Math.max(adminActivity.primaryAdmins.length, 1)} original admin approvals received`}</p>
                          {decisions.length ? decisions.map((entry) => (
                            <p key={`${admin._id}-${entry.adminId?._id || entry.adminId}`}>
                              {entry.adminId?.shelterName || entry.adminId?.fullName || entry.adminId?.email || "Original admin"}: {formatStatus(entry.decision)}
                              {entry.note ? ` • ${entry.note}` : ""}
                            </p>
                          )) : <p>No approvals recorded yet.</p>}
                          {adminActivity.canReviewAdminRequests ? (
                            <div className="status-controls">
                              <input
                                placeholder="Approval note"
                                value={adminApprovalNotes[admin._id] || ""}
                                onChange={(event) => setAdminApprovalNotes((current) => ({ ...current, [admin._id]: event.target.value }))}
                              />
                              <button className="mini-action" type="button" disabled={crudLoading} onClick={() => reviewAdminRequest(admin._id, "approved")}>Approve</button>
                              <button className="mini-action danger-mini" type="button" disabled={crudLoading} onClick={() => reviewAdminRequest(admin._id, "rejected")}>Reject</button>
                            </div>
                          ) : null}
                        </article>
                      );
                    }) : <div className="empty-state">No pending admin registrations right now.</div>}
                    {renderActivityToggle("pendingAdmins", adminActivity.pendingAdmins.length, "pending admin requests")}
                  </section>
                  <section className="activity-column">
                    <h5>Registered Users</h5>
                    {visibleActivityUsers.length ? visibleActivityUsers.map((user) => <article className="activity-item" key={user._id}><strong>{user.fullName || "Unnamed user"}</strong><p>{user.email}</p><p>{user.city || "City not added"} • {user.phone || "No phone"}</p></article>) : <div className="empty-state">No registered users yet.</div>}
                    {renderActivityToggle("users", adminActivity.users.length, "registered users")}
                  </section>
                  <section className="activity-column">
                    <h5>Adoption Requests</h5>
                    {visibleActivityRequests.length ? visibleActivityRequests.map((request) => <article className="activity-item" key={request._id}><div className="request-row"><strong>{request.animalId?.name || "Animal removed"}</strong><span className={`status-badge status-${request.status}`}>{formatStatus(request.status)}</span></div><p>{request.userId?.fullName || request.adopterName} • {request.phone}</p><p>{request.message || "No message added."}</p><div className="status-controls"><select defaultValue={request.status} onChange={(event) => updateRequestStatus(request._id, event.target.value, request.adminNote || "")}>{requestStatusOptions.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}</select><input placeholder="Admin note" defaultValue={request.adminNote || ""} onBlur={(event) => event.target.value !== (request.adminNote || "") && updateRequestStatus(request._id, request.status, event.target.value)} /></div></article>) : <div className="empty-state">No adoption requests yet.</div>}
                    {renderActivityToggle("requests", adminActivity.requests.length, "adoption requests")}
                  </section>
                </div>
              </div>

              <div className="crud-shell">
                <div className="crud-head"><h4>Manage Shelter Entries</h4><button className="mini-action secondary-mini" type="button" onClick={loadShelterData}>Refresh Data</button></div>
                {crudFeedback.message ? <div className={crudFeedback.type === "success" ? "auth-feedback success" : "auth-feedback error"}>{crudFeedback.message}</div> : null}
                <div className="crud-grid">
                  <section className="crud-card">
                    <div className="crud-card-head"><h5>Animals</h5>{editingAnimalId ? <button className="mini-action" type="button" onClick={resetAnimal}>Cancel Edit</button> : null}</div>
                    <form className="entity-form" onSubmit={(event) => handleEntitySubmit({ event, endpoint: "animals", payload: { ...animalForm, age: Number(animalForm.age) }, editId: editingAnimalId, onReset: resetAnimal })}>
                      <input value={animalForm.name} onChange={(event) => setAnimalForm({ ...animalForm, name: event.target.value })} placeholder="Animal name" required />
                      <input value={animalForm.species} onChange={(event) => setAnimalForm({ ...animalForm, species: event.target.value })} placeholder="Species / Breed" required />
                      <input type="number" min="0" value={animalForm.age} onChange={(event) => setAnimalForm({ ...animalForm, age: event.target.value })} placeholder="Age" required />
                      <select value={animalForm.status} onChange={(event) => setAnimalForm({ ...animalForm, status: event.target.value })}>{animalStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                      <input value={animalForm.location} onChange={(event) => setAnimalForm({ ...animalForm, location: event.target.value })} placeholder="Location" required />
                      <button className="entity-submit" type="submit" disabled={crudLoading}>{editingAnimalId ? "Update Animal" : "Add Animal"}</button>
                    </form>
                    <div className="entity-list">
                      {visibleAnimals.map((animal) => <article key={animal._id} className="entity-item"><div><strong>{animal.name}</strong><p>{animal.species} • {animal.age} yrs • {animal.status}</p><p>{animal.location}</p></div><div className="entity-actions"><button className="mini-action" type="button" onClick={() => { setEditingAnimalId(animal._id); setAnimalForm({ name: animal.name, species: animal.species, age: animal.age, status: animal.status, location: animal.location }); }}>Edit</button><button className="mini-action danger-mini" type="button" onClick={() => handleDelete("animals", animal._id)}>Delete</button></div></article>)}
                      {renderEntityToggle("animals", animals.length, "animals")}
                    </div>
                  </section>

                  <section className="crud-card">
                    <div className="crud-card-head"><h5>Adoptions</h5>{editingAdoptionId ? <button className="mini-action" type="button" onClick={resetAdoption}>Cancel Edit</button> : null}</div>
                    <form className="entity-form" onSubmit={(event) => handleEntitySubmit({ event, endpoint: "adoptions", payload: adoptionForm, editId: editingAdoptionId, onReset: resetAdoption })}>
                      <select value={adoptionForm.animalId} onChange={(event) => setAdoptionForm({ ...adoptionForm, animalId: event.target.value })} required><option value="">Select animal</option>{animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.name}</option>)}</select>
                      <input value={adoptionForm.adopter} onChange={(event) => setAdoptionForm({ ...adoptionForm, adopter: event.target.value })} placeholder="Adopter name" required />
                      <input value={adoptionForm.phone} onChange={(event) => setAdoptionForm({ ...adoptionForm, phone: event.target.value })} placeholder="Phone number" required />
                      <input type="date" value={adoptionForm.date} onChange={(event) => setAdoptionForm({ ...adoptionForm, date: event.target.value })} required />
                      <button className="entity-submit" type="submit" disabled={crudLoading}>{editingAdoptionId ? "Update Adoption" : "Add Adoption"}</button>
                    </form>
                    <div className="entity-list">
                      {visibleAdoptions.map((adoption) => <article key={adoption._id} className="entity-item"><div><strong>{adoption.animalId?.name || "Animal removed"}</strong><p>{adoption.adopter} • {adoption.phone}</p><p>{adoption.date}</p></div><div className="entity-actions"><button className="mini-action" type="button" onClick={() => { setEditingAdoptionId(adoption._id); setAdoptionForm({ animalId: adoption.animalId?._id || adoption.animalId, adopter: adoption.adopter, phone: adoption.phone, date: adoption.date }); }}>Edit</button><button className="mini-action danger-mini" type="button" onClick={() => handleDelete("adoptions", adoption._id)}>Delete</button></div></article>)}
                      {renderEntityToggle("adoptions", adoptions.length, "adoptions")}
                    </div>
                  </section>

                  <section className="crud-card">
                    <div className="crud-card-head"><h5>Medical Records</h5>{editingMedicalId ? <button className="mini-action" type="button" onClick={resetMedical}>Cancel Edit</button> : null}</div>
                    <form className="entity-form" onSubmit={(event) => handleEntitySubmit({ event, endpoint: "medical-records", payload: medicalForm, editId: editingMedicalId, onReset: resetMedical })}>
                      <select value={medicalForm.animalId} onChange={(event) => setMedicalForm({ ...medicalForm, animalId: event.target.value })} required><option value="">Select animal</option>{animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.name}</option>)}</select>
                      <input value={medicalForm.treatment} onChange={(event) => setMedicalForm({ ...medicalForm, treatment: event.target.value })} placeholder="Treatment" required />
                      <input type="date" value={medicalForm.date} onChange={(event) => setMedicalForm({ ...medicalForm, date: event.target.value })} required />
                      <button className="entity-submit" type="submit" disabled={crudLoading}>{editingMedicalId ? "Update Record" : "Add Record"}</button>
                    </form>
                    <div className="entity-list">
                      {visibleMedicalRecords.map((record) => <article key={record._id} className="entity-item"><div><strong>{record.animalId?.name || "Animal removed"}</strong><p>{record.treatment}</p><p>{record.date}</p></div><div className="entity-actions"><button className="mini-action" type="button" onClick={() => { setEditingMedicalId(record._id); setMedicalForm({ animalId: record.animalId?._id || record.animalId, treatment: record.treatment, date: record.date }); }}>Edit</button><button className="mini-action danger-mini" type="button" onClick={() => handleDelete("medical-records", record._id)}>Delete</button></div></article>)}
                      {renderEntityToggle("medicalRecords", medicalRecords.length, "records")}
                    </div>
                  </section>

                  <section className="crud-card">
                    <div className="crud-card-head"><h5>Volunteers</h5>{editingVolunteerId ? <button className="mini-action" type="button" onClick={resetVolunteer}>Cancel Edit</button> : null}</div>
                    <form className="entity-form" onSubmit={(event) => handleEntitySubmit({ event, endpoint: "volunteers", payload: volunteerForm, editId: editingVolunteerId, onReset: resetVolunteer })}>
                      <input value={volunteerForm.name} onChange={(event) => setVolunteerForm({ ...volunteerForm, name: event.target.value })} placeholder="Volunteer name" required />
                      <input value={volunteerForm.role} onChange={(event) => setVolunteerForm({ ...volunteerForm, role: event.target.value })} placeholder="Role" required />
                      <input value={volunteerForm.language} onChange={(event) => setVolunteerForm({ ...volunteerForm, language: event.target.value })} placeholder="Language" required />
                      <button className="entity-submit" type="submit" disabled={crudLoading}>{editingVolunteerId ? "Update Volunteer" : "Add Volunteer"}</button>
                    </form>
                    <div className="entity-list">
                      {visibleVolunteers.map((volunteer) => <article key={volunteer._id} className="entity-item"><div><strong>{volunteer.name}</strong><p>{volunteer.role}</p><p>{volunteer.language}</p></div><div className="entity-actions"><button className="mini-action" type="button" onClick={() => { setEditingVolunteerId(volunteer._id); setVolunteerForm({ name: volunteer.name, role: volunteer.role, language: volunteer.language }); }}>Edit</button><button className="mini-action danger-mini" type="button" onClick={() => handleDelete("volunteers", volunteer._id)}>Delete</button></div></article>)}
                      {renderEntityToggle("volunteers", volunteers.length, "volunteers")}
                    </div>
                  </section>
                </div>
              </div>
            </>
        </section> : null}

        <section className="about-section" id="about">
          <div className="about-brand">
            <div className="about-brand-row">
              <div className="about-mark"><span className="paw">🐾</span></div>
              <div>
                <p className="section-tag">Who We Are</p>
                <h3>{text.aboutTitle}</h3>
              </div>
            </div>
            <p>{text.aboutLead}</p>
            <p>{text.aboutMission}</p>
          </div>

          <div className="about-footer-grid">
            <article>
              <strong>For Shelters</strong>
              <span>{text.aboutShelters}</span>
            </article>
            <article>
              <strong>For Families</strong>
              <span>{text.aboutFamilies}</span>
            </article>
            <article>
              <strong>For Trust</strong>
              <span>{text.aboutTrust}</span>
            </article>
          </div>

          <div className="about-link-grid">
            <div>
              <h4>Explore</h4>
              <a href="#home">Home</a>
              <a href="#pets">Find a Pet</a>
              <a href="#access">Login / Register</a>
            </div>
            <div>
              <h4>Contact</h4>
              <span>{text.aboutContact}</span>
              <span>{text.aboutLocation}</span>
            </div>
          </div>
          <p className="copyright-line">{text.aboutCopyright}</p>
        </section>
      </main>
    </div>
  );
}

function loadStoredSession() {
  try {
    const raw = localStorage.getItem(sessionStorageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

function clearStoredSession() {
  localStorage.removeItem(sessionStorageKey);
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 640 520" className="hero-svg" role="img" aria-label="Person holding a rescued puppy"><defs><linearGradient id="warmBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3d2f2b" /><stop offset="100%" stopColor="#181312" /></linearGradient></defs><rect width="640" height="520" rx="28" fill="url(#warmBg)" /><circle cx="495" cy="185" r="78" fill="#65453f" /><circle cx="480" cy="173" r="56" fill="#f0c3a6" /><ellipse cx="482" cy="291" rx="138" ry="114" fill="#b28a4a" /><path d="M387 268c48-34 84-40 132-33 28 4 57 16 83 36-35 19-49 53-51 92-60 6-168-18-164-95z" fill="#d1b179" /><circle cx="320" cy="235" r="46" fill="#e7d0a3" /><ellipse cx="302" cy="206" rx="18" ry="25" fill="#c89d65" /><ellipse cx="340" cy="206" rx="18" ry="25" fill="#c89d65" /><circle cx="309" cy="231" r="4" fill="#2d211e" /><circle cx="331" cy="231" r="4" fill="#2d211e" /><ellipse cx="320" cy="245" rx="10" ry="7" fill="#6b4f3e" /><rect x="120" y="340" width="210" height="90" rx="34" fill="#7d8755" /><circle cx="152" cy="385" r="11" fill="#d4d9bf" /><circle cx="196" cy="385" r="11" fill="#d4d9bf" /><circle cx="240" cy="385" r="11" fill="#d4d9bf" /></svg>
  );
}

function PetAvatar({ tone }) {
  const backgrounds = { peach: "#ffd8bf", butter: "#ffe9a8", mint: "#d5f1da" };
  return (
    <svg viewBox="0 0 200 150" className="pet-svg" role="img" aria-label="Pet illustration"><rect width="200" height="150" rx="24" fill={backgrounds[tone]} /><circle cx="100" cy="74" r="34" fill="#f5d2a7" /><ellipse cx="76" cy="52" rx="12" ry="20" fill="#c69259" /><ellipse cx="124" cy="52" rx="12" ry="20" fill="#c69259" /><circle cx="88" cy="74" r="4" fill="#312420" /><circle cx="112" cy="74" r="4" fill="#312420" /><ellipse cx="100" cy="88" rx="10" ry="6" fill="#76533d" /></svg>
  );
}

function getPetPhoto(pet, index) {
  const species = `${pet.name} ${pet.species}`.toLowerCase();
  const group = species.includes("cat") || species.includes("kitten") || species.includes("persian") || species.includes("siamese") || species.includes("tabby") || species.includes("calico")
    ? petPhotos.cat
    : petPhotos.dog;
  return group[index % group.length];
}

function getSearchTags(pet) {
  const city = pet.location.split(" ")[0] || pet.location;
  return `${city}, ${pet.species}, ${formatStatus(pet.status)}`;
}

function RequestCard({ request }) {
  return (
    <article className="request-card">
      <div className="request-row"><strong>{request.animalId?.name || "Animal removed"}</strong><span className={`status-badge status-${request.status}`}>{formatStatus(request.status)}</span></div>
      <p>{request.animalId?.species || "Pet"} • {request.animalId?.location || "Shelter location"}</p>
      <p>Submitted: {formatDate(request.createdAt)}</p>
      {request.adminNote ? <p className="admin-note">Admin note: {request.adminNote}</p> : null}
    </article>
  );
}

function formatStatus(value = "") {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Not available";
}

export default App;
