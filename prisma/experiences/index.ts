export * from './types';
export * from './wellness';
export * from './city-tours';
export * from './food-drink';
export * from './desert';
export * from './day-trips';
export * from './workshops';
export * from './entertainment';
export * from './sports';
export * from './transfers';

import { wellnessExperiences } from './wellness';
import { cityToursExperiences } from './city-tours';
import { foodDrinkExperiences } from './food-drink';
import { desertExperiences } from './desert';
import { dayTripsExperiences } from './day-trips';
import { workshopsExperiences } from './workshops';
import { entertainmentExperiences } from './entertainment';
import { sportsExperiences } from './sports';
import { transfersExperiences } from './transfers';

import { RichExperience } from './types';

export const allExperiences: RichExperience[] = [
    ...wellnessExperiences,
    ...cityToursExperiences,
    ...foodDrinkExperiences,
    ...desertExperiences,
    ...dayTripsExperiences,
    ...workshopsExperiences,
    ...entertainmentExperiences,
    ...sportsExperiences,
    ...transfersExperiences
];
