import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import {
    PRONOUNS_OPTIONS,
    GENDER_OPTIONS,
    SERVICE_LOCATIONS,
    SERVICES_PROVIDED_TO,
    TREATMENT_PLATFORMS,
    DAYS_OF_WEEK,
} from '../../lib/constants';

interface OnboardingPageProps {
    onComplete: () => void;
}

const steps = [
    'Getting Started',
    'Location',
    'Personal Details',
    'Professional Details',
    'Calendar',
    // 'Education', // Can add these later as per original design, but let's stick to core profile first
    // 'Media',
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Personal
        preferredName: '',
        pronouns: '',
        dateOfBirth: '',
        gender: '',
        about: '',
        workBestWith: '',

        // Address
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',

        // Professional
        serviceLocations: [] as string[],
        servicesProvidedTo: [] as string[],
        treatmentPlatforms: [] as string[],
        specializations: [] as string[],
        totalExperienceYears: 0,

        // Availability
        availability: DAYS_OF_WEEK.map((day, index) => ({
            dayOfWeek: index,
            isAvailable: false,
            timeSlots: [{ startTime: '09:00', endTime: '17:00' }],
        })),
    });

    const handleNext = async () => {
        setError('');
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await saveProfile();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const saveProfile = async () => {
        setLoading(true);
        try {
            // Map frontend state to backend schema
            const backendPayload = {
                preferred_name: formData.preferredName,
                pronouns: formData.pronouns,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                about: formData.about,
                work_best_with: formData.workBestWith,

                address: {
                    line1: formData.addressLine1,
                    line2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    postal_code: formData.postalCode,
                },

                service_locations: formData.serviceLocations,
                services_provided_to: formData.servicesProvidedTo,
                treatment_platforms: formData.treatmentPlatforms,
                experience_years: formData.totalExperienceYears,

                availability: formData.availability.map(day => ({
                    day_of_week: day.dayOfWeek,
                    is_available: day.isAvailable,
                    time_slots: day.timeSlots.map(slot => ({
                        start_time: slot.startTime,
                        end_time: slot.endTime
                    }))
                })),

                onboarding_completed: true
            };

            await api.put('/doctors/profile', backendPayload);
            onComplete();
        } catch (err: any) {
            console.error('Failed to save profile:', err);
            setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleArrayValue = (array: string[], value: string) => {
        return array.includes(value)
            ? array.filter((v) => v !== value)
            : [...array, value];
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="text-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold text-[#2E7D32] mb-4">
                                Let's set up your healer profile
                            </h2>
                            <p className="text-gray-600 mb-8">
                                We'll ask you a few details so patients can understand your expertise and book you easily.
                            </p>
                            <div className="bg-[#E7F8EF] rounded-lg p-6 text-left space-y-3">
                                <p className="flex items-center gap-2 text-[#2E7D32]">
                                    <CheckCircle className="w-5 h-5" />
                                    Your name and pronouns
                                </p>
                                <p className="flex items-center gap-2 text-[#2E7D32]">
                                    <CheckCircle className="w-5 h-5" />
                                    Your practice locations and availability
                                </p>
                                <p className="flex items-center gap-2 text-[#2E7D32]">
                                    <CheckCircle className="w-5 h-5" />
                                    Professional details
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">Practice Location</h2>
                        <div className="space-y-4">
                            <Input
                                label="Address Line 1"
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            />
                            <Input
                                label="Address Line 2"
                                value={formData.addressLine2}
                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="City"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                                <Input
                                    label="State / Region"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Country"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                                <Input
                                    label="PIN / ZIP Code"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">Personal Details</h2>
                        <div className="space-y-4">
                            <Input
                                label="Preferred Name"
                                value={formData.preferredName}
                                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#1F2933]">Preferred Pronoun</label>
                                <select
                                    value={formData.pronouns}
                                    onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
                                >
                                    <option value="">Select pronouns</option>
                                    {PRONOUNS_OPTIONS.map((pronoun) => (
                                        <option key={pronoun} value={pronoun}>
                                            {pronoun}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#1F2933]">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
                                >
                                    <option value="">Select gender</option>
                                    {GENDER_OPTIONS.map((gender) => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#1F2933]">About Yourself</label>
                                <textarea
                                    value={formData.about}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
                                    placeholder="Tell us about your experience, healing approach, and philosophy"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#1F2933]">
                                    Who do you work best with?
                                </label>
                                <textarea
                                    value={formData.workBestWith}
                                    onChange={(e) => setFormData({ ...formData, workBestWith: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
                                    placeholder="Describe the type of clients you support best"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">Professional Details</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2933] mb-3">
                                    Service Locations
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SERVICE_LOCATIONS.map((location) => (
                                        <label key={location} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.serviceLocations.includes(location)}
                                                onChange={() =>
                                                    setFormData({
                                                        ...formData,
                                                        serviceLocations: toggleArrayValue(formData.serviceLocations, location),
                                                    })
                                                }
                                                className="accent-[#6CCF93]"
                                            />
                                            <span className="text-sm">{location}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2933] mb-3">
                                    Services Provided To
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SERVICES_PROVIDED_TO.map((service) => (
                                        <label key={service} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.servicesProvidedTo.includes(service)}
                                                onChange={() =>
                                                    setFormData({
                                                        ...formData,
                                                        servicesProvidedTo: toggleArrayValue(formData.servicesProvidedTo, service),
                                                    })
                                                }
                                                className="accent-[#6CCF93]"
                                            />
                                            <span className="text-sm">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1F2933] mb-3">
                                    Treatment Platforms
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {TREATMENT_PLATFORMS.map((platform) => (
                                        <label key={platform} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.treatmentPlatforms.includes(platform)}
                                                onChange={() =>
                                                    setFormData({
                                                        ...formData,
                                                        treatmentPlatforms: toggleArrayValue(formData.treatmentPlatforms, platform),
                                                    })
                                                }
                                                className="accent-[#6CCF93]"
                                            />
                                            <span className="text-sm">{platform}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Input
                                label="Total Experience (Years)"
                                type="number"
                                value={formData.totalExperienceYears}
                                onChange={(e) =>
                                    setFormData({ ...formData, totalExperienceYears: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">Set Up Your Availability</h2>
                        <div className="space-y-3">
                            {formData.availability.map((day, index) => (
                                <Card key={day.dayOfWeek}>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={day.isAvailable}
                                                onChange={(e) => {
                                                    const newAvailability = [...formData.availability];
                                                    newAvailability[index].isAvailable = e.target.checked;
                                                    setFormData({ ...formData, availability: newAvailability });
                                                }}
                                                className="w-5 h-5 accent-[#6CCF93]"
                                            />
                                            <span className="font-medium text-[#1F2933] w-24">
                                                {DAYS_OF_WEEK[day.dayOfWeek]}
                                            </span>
                                        </label>
                                        {day.isAvailable && (
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="time"
                                                    value={day.timeSlots[0]?.startTime || '09:00'}
                                                    onChange={(e) => {
                                                        const newAvailability = [...formData.availability];
                                                        newAvailability[index].timeSlots[0].startTime = e.target.value;
                                                        setFormData({ ...formData, availability: newAvailability });
                                                    }}
                                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                                                />
                                                <span className="text-gray-500">to</span>
                                                <input
                                                    type="time"
                                                    value={day.timeSlots[0]?.endTime || '17:00'}
                                                    onChange={(e) => {
                                                        const newAvailability = [...formData.availability];
                                                        newAvailability[index].timeSlots[0].endTime = e.target.value;
                                                        setFormData({ ...formData, availability: newAvailability });
                                                    }}
                                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E7F8EF] to-white py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${index <= currentStep
                                        ? 'bg-[#6CCF93] text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-12 h-1 mx-1 ${index < currentStep ? 'bg-[#6CCF93]' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
                    </p>
                </div>

                <Card className="p-8 mb-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {renderStepContent()}
                </Card>

                <div className="flex justify-between">
                    {currentStep > 0 && (
                        <Button onClick={handleBack} variant="outline" disabled={loading}>
                            Back
                        </Button>
                    )}
                    <Button onClick={handleNext} className="ml-auto" size="lg" disabled={loading}>
                        {loading ? 'Saving...' : (currentStep === steps.length - 1 ? 'Finish Setup' : 'Next')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
