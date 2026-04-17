const storageKey = "shelter-os-india";

const translations = {
  en: {
    brandEyebrow: "ShelterOS India",
    heroTitle: "Pet Adoption & Animal Shelter Management System",
    heroKicker: "Built for local shelters, foster homes, and rescue teams",
    heroDescription:
      "Track rescued animals, medical care, adoptions, and volunteers in one bilingual dashboard designed for Indian animal shelters.",
    tagAnimals: "Animals",
    tagAdoptions: "Adoptions",
    tagMedical: "Medical",
    tagVolunteers: "Volunteers",
    summaryAnimals: "Animals in Care",
    summaryAdoptions: "Successful Adoptions",
    summaryTreatment: "Medical Cases",
    summaryVolunteers: "Active Volunteers",
    resetData: "Reset Demo Data",
    animalsLabel: "Animal Registry",
    animalsTitle: "Rescued Animals",
    animalsHint: "Keep intake and adoption status current.",
    animalNamePlaceholder: "Animal name",
    animalSpeciesPlaceholder: "Species / Breed",
    animalAgePlaceholder: "Age",
    animalLocationPlaceholder: "Shelter / Zone",
    addAnimal: "Add Animal",
    medicalLabel: "Health Desk",
    medicalTitle: "Medical Records",
    medicalTreatmentPlaceholder: "Treatment / Diagnosis",
    addRecord: "Add Record",
    adoptionLabel: "Adoption Desk",
    adoptionTitle: "Adoption Requests",
    adopterNamePlaceholder: "Adopter name",
    adopterPhonePlaceholder: "Phone number",
    addAdoption: "Record Adoption",
    volunteerLabel: "Community Support",
    volunteerTitle: "Volunteers",
    volunteerNamePlaceholder: "Volunteer name",
    volunteerRolePlaceholder: "Role / Skill",
    volunteerLanguagePlaceholder: "Preferred language",
    addVolunteer: "Add Volunteer",
    emptyAnimals: "No rescued animals added yet.",
    emptyMedical: "No medical records yet.",
    emptyAdoptions: "No adoptions recorded yet.",
    emptyVolunteers: "No volunteers added yet.",
    rescued: "Rescued",
    underTreatment: "Under Treatment",
    readyForAdoption: "Ready for Adoption",
    adopted: "Adopted",
    ageUnit: "years",
    medicalFor: "For",
    volunteerLanguageLabel: "Language",
    volunteerRoleLabel: "Role",
    adopterPhoneLabel: "Phone",
    shelterLocationLabel: "Location",
    noAnimalsForRecords: "Add animals first to attach records.",
    noAnimalsForAdoption: "Add animals first to record an adoption.",
    defaultMedicalDate: "Today's date",
  },
  hi: {
    brandEyebrow: "शेल्टरओएस इंडिया",
    heroTitle: "पेट अडॉप्शन और एनिमल शेल्टर मैनेजमेंट सिस्टम",
    heroKicker: "स्थानीय शेल्टर, फोस्टर होम और रेस्क्यू टीमों के लिए",
    heroDescription:
      "भारतीय पशु शेल्टरों के लिए तैयार इस द्विभाषी डैशबोर्ड में बचाए गए जानवर, मेडिकल देखभाल, अडॉप्शन और वॉलंटियर का रिकॉर्ड रखें।",
    tagAnimals: "जानवर",
    tagAdoptions: "अडॉप्शन",
    tagMedical: "मेडिकल",
    tagVolunteers: "वॉलंटियर",
    summaryAnimals: "शेल्टर में जानवर",
    summaryAdoptions: "सफल अडॉप्शन",
    summaryTreatment: "मेडिकल रिकॉर्ड",
    summaryVolunteers: "सक्रिय वॉलंटियर",
    resetData: "डेमो डेटा रीसेट करें",
    animalsLabel: "एनिमल रजिस्ट्री",
    animalsTitle: "बचाए गए जानवर",
    animalsHint: "इंटेक और अडॉप्शन स्टेटस अपडेट रखें।",
    animalNamePlaceholder: "जानवर का नाम",
    animalSpeciesPlaceholder: "प्रजाति / नस्ल",
    animalAgePlaceholder: "उम्र",
    animalLocationPlaceholder: "शेल्टर / ज़ोन",
    addAnimal: "जानवर जोड़ें",
    medicalLabel: "हेल्थ डेस्क",
    medicalTitle: "मेडिकल रिकॉर्ड",
    medicalTreatmentPlaceholder: "इलाज / निदान",
    addRecord: "रिकॉर्ड जोड़ें",
    adoptionLabel: "अडॉप्शन डेस्क",
    adoptionTitle: "अडॉप्शन अनुरोध",
    adopterNamePlaceholder: "अडॉप्टर का नाम",
    adopterPhonePlaceholder: "फोन नंबर",
    addAdoption: "अडॉप्शन दर्ज करें",
    volunteerLabel: "कम्युनिटी सपोर्ट",
    volunteerTitle: "वॉलंटियर",
    volunteerNamePlaceholder: "वॉलंटियर का नाम",
    volunteerRolePlaceholder: "भूमिका / कौशल",
    volunteerLanguagePlaceholder: "पसंदीदा भाषा",
    addVolunteer: "वॉलंटियर जोड़ें",
    emptyAnimals: "अभी तक कोई जानवर नहीं जोड़ा गया है।",
    emptyMedical: "अभी तक कोई मेडिकल रिकॉर्ड नहीं है।",
    emptyAdoptions: "अभी तक कोई अडॉप्शन दर्ज नहीं हुआ है।",
    emptyVolunteers: "अभी तक कोई वॉलंटियर नहीं जोड़ा गया है।",
    rescued: "रिस्क्यू किया गया",
    underTreatment: "इलाज चल रहा है",
    readyForAdoption: "अडॉप्शन के लिए तैयार",
    adopted: "अडॉप्टेड",
    ageUnit: "वर्ष",
    medicalFor: "के लिए",
    volunteerLanguageLabel: "भाषा",
    volunteerRoleLabel: "भूमिका",
    adopterPhoneLabel: "फोन",
    shelterLocationLabel: "स्थान",
    noAnimalsForRecords: "रिकॉर्ड जोड़ने से पहले जानवर जोड़ें।",
    noAnimalsForAdoption: "अडॉप्शन दर्ज करने से पहले जानवर जोड़ें।",
    defaultMedicalDate: "आज की तारीख",
  },
};

const statusOptions = ["rescued", "underTreatment", "readyForAdoption", "adopted"];

const demoState = {
  language: "en",
  animals: [
    {
      id: crypto.randomUUID(),
      name: "Milo",
      species: "Indie Dog",
      age: 3,
      status: "readyForAdoption",
      location: "Jaipur Shelter",
    },
    {
      id: crypto.randomUUID(),
      name: "Gudiya",
      species: "Cat",
      age: 1,
      status: "underTreatment",
      location: "Lucknow Clinic Wing",
    },
  ],
  medicalRecords: [],
  adoptions: [],
  volunteers: [
    {
      id: crypto.randomUUID(),
      name: "Aman Sharma",
      role: "Weekend Foster Coordinator",
      language: "Hindi / English",
    },
  ],
};

demoState.medicalRecords.push({
  id: crypto.randomUUID(),
  animalId: demoState.animals[1].id,
  treatment: "Vaccination and wound dressing",
  date: new Date().toISOString().slice(0, 10),
});

demoState.adoptions.push({
  id: crypto.randomUUID(),
  animalId: demoState.animals[0].id,
  adopter: "Neha Verma",
  phone: "+91 98765 43210",
  date: new Date().toISOString().slice(0, 10),
});

const state = loadState();

const refs = {
  languageToggle: document.getElementById("languageToggle"),
  resetData: document.getElementById("resetData"),
  animalsCount: document.getElementById("animalsCount"),
  adoptionsCount: document.getElementById("adoptionsCount"),
  medicalCount: document.getElementById("medicalCount"),
  volunteersCount: document.getElementById("volunteersCount"),
  animalForm: document.getElementById("animalForm"),
  medicalForm: document.getElementById("medicalForm"),
  adoptionForm: document.getElementById("adoptionForm"),
  volunteerForm: document.getElementById("volunteerForm"),
  animalStatus: document.getElementById("animalStatus"),
  medicalAnimal: document.getElementById("medicalAnimal"),
  adoptionAnimal: document.getElementById("adoptionAnimal"),
  medicalDate: document.getElementById("medicalDate"),
  animalList: document.getElementById("animalList"),
  medicalList: document.getElementById("medicalList"),
  adoptionList: document.getElementById("adoptionList"),
  volunteerList: document.getElementById("volunteerList"),
  emptyStateTemplate: document.getElementById("emptyStateTemplate"),
};

refs.medicalDate.value = new Date().toISOString().slice(0, 10);

refs.languageToggle.addEventListener("click", () => {
  state.language = state.language === "en" ? "hi" : "en";
  persist();
  render();
});

refs.resetData.addEventListener("click", () => {
  Object.assign(state, structuredClone(demoState));
  persist();
  render();
});

refs.animalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  state.animals.unshift({
    id: crypto.randomUUID(),
    name: formData.get("name").trim(),
    species: formData.get("species").trim(),
    age: Number(formData.get("age")),
    status: formData.get("status"),
    location: formData.get("location").trim(),
  });
  event.currentTarget.reset();
  persist();
  render();
});

refs.medicalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  state.medicalRecords.unshift({
    id: crypto.randomUUID(),
    animalId: formData.get("animalId"),
    treatment: formData.get("treatment").trim(),
    date: formData.get("date"),
  });
  event.currentTarget.reset();
  refs.medicalDate.value = new Date().toISOString().slice(0, 10);
  persist();
  render();
});

refs.adoptionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const animalId = formData.get("animalId");
  const animal = state.animals.find((entry) => entry.id === animalId);
  if (animal) {
    animal.status = "adopted";
  }
  state.adoptions.unshift({
    id: crypto.randomUUID(),
    animalId,
    adopter: formData.get("adopter").trim(),
    phone: formData.get("phone").trim(),
    date: new Date().toISOString().slice(0, 10),
  });
  event.currentTarget.reset();
  persist();
  render();
});

refs.volunteerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  state.volunteers.unshift({
    id: crypto.randomUUID(),
    name: formData.get("name").trim(),
    role: formData.get("role").trim(),
    language: formData.get("language").trim(),
  });
  event.currentTarget.reset();
  persist();
  render();
});

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return structuredClone(demoState);
  }

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(demoState);
  }
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function t(key) {
  return translations[state.language][key];
}

function render() {
  applyTranslations();
  populateStatusOptions();
  populateAnimalSelectors();
  renderSummary();
  renderAnimals();
  renderMedical();
  renderAdoptions();
  renderVolunteers();
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-placeholder-i18n]").forEach((element) => {
    element.placeholder = t(element.dataset.placeholderI18n);
  });

  refs.languageToggle.textContent = state.language === "en" ? "हिन्दी" : "English";
}

function populateStatusOptions() {
  refs.animalStatus.innerHTML = statusOptions
    .map((status) => `<option value="${status}">${t(status)}</option>`)
    .join("");
}

function populateAnimalSelectors() {
  const animalOptions = state.animals
    .map((animal) => `<option value="${animal.id}">${animal.name} • ${animal.species}</option>`)
    .join("");

  refs.medicalAnimal.innerHTML = animalOptions;
  refs.adoptionAnimal.innerHTML = animalOptions;

  refs.medicalAnimal.disabled = state.animals.length === 0;
  refs.adoptionAnimal.disabled = state.animals.length === 0;
}

function renderSummary() {
  refs.animalsCount.textContent = state.animals.length;
  refs.adoptionsCount.textContent = state.adoptions.length;
  refs.medicalCount.textContent = state.medicalRecords.length;
  refs.volunteersCount.textContent = state.volunteers.length;
}

function renderAnimals() {
  if (state.animals.length === 0) {
    refs.animalList.replaceChildren(createEmptyState(t("emptyAnimals")));
    return;
  }

  refs.animalList.innerHTML = state.animals
    .map(
      (animal) => `
        <article class="animal-card">
          <div class="animal-header">
            <div>
              <h3>${animal.name}</h3>
              <p class="animal-meta">${animal.species} • ${animal.age} ${t("ageUnit")}</p>
            </div>
            <span class="status-pill ${statusClass(animal.status)}">${t(animal.status)}</span>
          </div>
          <div class="badge">${t("shelterLocationLabel")}: ${animal.location}</div>
        </article>
      `
    )
    .join("");
}

function renderMedical() {
  if (state.animals.length === 0) {
    refs.medicalList.replaceChildren(createEmptyState(t("noAnimalsForRecords")));
    return;
  }

  if (state.medicalRecords.length === 0) {
    refs.medicalList.replaceChildren(createEmptyState(t("emptyMedical")));
    return;
  }

  refs.medicalList.innerHTML = state.medicalRecords
    .map((record) => {
      const animal = findAnimal(record.animalId);
      return `
        <article class="mini-card">
          <div>
            <strong>${record.treatment}</strong>
            <p class="mini-meta">${t("medicalFor")} ${animal?.name || "-"}</p>
          </div>
          <span class="badge">${record.date}</span>
        </article>
      `;
    })
    .join("");
}

function renderAdoptions() {
  if (state.animals.length === 0) {
    refs.adoptionList.replaceChildren(createEmptyState(t("noAnimalsForAdoption")));
    return;
  }

  if (state.adoptions.length === 0) {
    refs.adoptionList.replaceChildren(createEmptyState(t("emptyAdoptions")));
    return;
  }

  refs.adoptionList.innerHTML = state.adoptions
    .map((entry) => {
      const animal = findAnimal(entry.animalId);
      return `
        <article class="mini-card">
          <div>
            <strong>${animal?.name || "-"}</strong>
            <p class="mini-meta">${entry.adopter}</p>
            <p class="mini-meta">${t("adopterPhoneLabel")}: ${entry.phone}</p>
          </div>
          <span class="badge">${entry.date}</span>
        </article>
      `;
    })
    .join("");
}

function renderVolunteers() {
  if (state.volunteers.length === 0) {
    refs.volunteerList.replaceChildren(createEmptyState(t("emptyVolunteers")));
    return;
  }

  refs.volunteerList.innerHTML = state.volunteers
    .map(
      (volunteer) => `
        <article class="mini-card">
          <div>
            <strong>${volunteer.name}</strong>
            <p class="mini-meta">${t("volunteerRoleLabel")}: ${volunteer.role}</p>
            <p class="mini-meta">${t("volunteerLanguageLabel")}: ${volunteer.language}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function statusClass(status) {
  switch (status) {
    case "rescued":
      return "status-rescued";
    case "underTreatment":
      return "status-treatment";
    case "readyForAdoption":
      return "status-ready";
    case "adopted":
      return "status-adopted";
    default:
      return "";
  }
}

function findAnimal(animalId) {
  return state.animals.find((animal) => animal.id === animalId);
}

function createEmptyState(text) {
  const node = refs.emptyStateTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector("p").textContent = text;
  return node;
}

render();
