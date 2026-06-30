import { Metadata } from 'next';
import ExperienceCreateForm from './experience-create-form';

export const metadata: Metadata = { title: 'New Experience | Admin' };

export default function NewExperiencePage() {
    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <ExperienceCreateForm />
        </div>
    );
}
