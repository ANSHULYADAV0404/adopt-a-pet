import { seedData } from "./seed.js";
import { Animal } from "../models/Animal.js";
import { Adoption } from "../models/Adoption.js";
import { MedicalRecord } from "../models/MedicalRecord.js";
import { Volunteer } from "../models/Volunteer.js";

export async function seedDatabaseIfEmpty() {
  const [animalCount, adoptionCount, medicalCount, volunteerCount] = await Promise.all([
    Animal.countDocuments(),
    Adoption.countDocuments(),
    MedicalRecord.countDocuments(),
    Volunteer.countDocuments()
  ]);

  if (animalCount > 0 || adoptionCount > 0 || medicalCount > 0 || volunteerCount > 0) {
    return;
  }

  const insertedAnimals = await Animal.insertMany(
    seedData.animals.map((animal) => ({
      name: animal.name,
      species: animal.species,
      age: animal.age,
      status: animal.status,
      location: animal.location
    }))
  );

  const animalMap = Object.fromEntries(
    seedData.animals.map((animal, index) => [animal.id, insertedAnimals[index]?._id])
  );

  if (seedData.adoptions.length) {
    await Adoption.insertMany(
      seedData.adoptions.map((adoption) => ({
        animalId: animalMap[adoption.animalId],
        adopter: adoption.adopter,
        phone: adoption.phone,
        date: adoption.date
      }))
    );
  }

  if (seedData.medicalRecords.length) {
    await MedicalRecord.insertMany(
      seedData.medicalRecords.map((record) => ({
        animalId: animalMap[record.animalId],
        treatment: record.treatment,
        date: record.date
      }))
    );
  }

  if (seedData.volunteers.length) {
    await Volunteer.insertMany(seedData.volunteers);
  }

  console.log("Starter shelter data seeded");
}
