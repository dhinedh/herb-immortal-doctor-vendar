import React, { useState } from 'react';
import { User, GraduationCap, Award, FileText, Edit2, Plus, Trash2 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

type TabType = 'overview' | 'education' | 'licenses' | 'certificates' | 'details';

interface DoctorProfile {
  full_name: string;
  preferred_name?: string;
  email: string;
  phone?: string;
  about?: string;
  work_best_with?: string;
  profile_photo_url?: string;
}

interface Education {
  id: string;
  degree: string;
  specialization?: string;
  institution: string;
  country: string;
  start_year: number;
  end_year?: number;
}

interface License {
  id: string;
  license_type: string;
  issuing_authority: string;
  license_number: string;
  issue_date: string;
  expiry_date?: string;
}

interface Certificate {
  id: string;
  title: string;
  issued_by: string;
  year: number;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profile] = useState<DoctorProfile>({
    full_name: 'John Smith',
    preferred_name: 'John',
    email: user?.email || 'doctor@herbimmortal.com',
    phone: '+1 (555) 987-6543',
    about: 'Experienced holistic healer with 15+ years of practice in integrative medicine. Specializing in herbal remedies, Ayurveda, and natural healing approaches.',
    work_best_with: 'I work best with patients who are committed to natural healing and willing to make lifestyle changes for long-term wellness.',
  });
  const [education] = useState<Education[]>([
    {
      id: 'edu-1',
      degree: 'Bachelor of Ayurvedic Medicine and Surgery (BAMS)',
      specialization: 'Ayurvedic Medicine',
      institution: 'National Institute of Ayurveda',
      country: 'India',
      start_year: 2003,
      end_year: 2008,
    },
    {
      id: 'edu-2',
      degree: 'Master of Science in Herbal Medicine',
      specialization: 'Phytotherapy',
      institution: 'Maryland University of Integrative Health',
      country: 'United States',
      start_year: 2009,
      end_year: 2011,
    },
  ]);
  const [licenses] = useState<License[]>([
    {
      id: 'lic-1',
      license_type: 'Ayurvedic Practitioner License',
      issuing_authority: 'Central Council of Indian Medicine',
      license_number: 'CCIM-2008-12345',
      issue_date: '2008-07-15',
      expiry_date: '2028-07-15',
    },
    {
      id: 'lic-2',
      license_type: 'Herbal Medicine Practitioner',
      issuing_authority: 'American Herbalists Guild',
      license_number: 'AHG-2011-67890',
      issue_date: '2011-09-01',
    },
  ]);
  const [certificates] = useState<Certificate[]>([
    {
      id: 'cert-1',
      title: 'Advanced Herbal Formulation',
      issued_by: 'American Botanical Council',
      year: 2015,
    },
    {
      id: 'cert-2',
      title: 'Clinical Ayurveda Certification',
      issued_by: 'National Ayurvedic Medical Association',
      year: 2013,
    },
    {
      id: 'cert-3',
      title: 'Integrative Medicine Fellowship',
      issued_by: 'Academy of Integrative Health & Medicine',
      year: 2017,
    },
  ]);

  const handleEditProfile = () => {
    alert('Edit profile feature will be implemented');
  };

  const handleAddEducation = () => {
    alert('Add education feature will be implemented');
  };

  const handleAddLicense = () => {
    alert('Add license feature will be implemented');
  };

  const handleAddCertificate = () => {
    alert('Add certificate feature will be implemented');
  };

  const handleEditItem = (type: string, id: string) => {
    alert(`Edit ${type} feature will be implemented. ID: ${id}`);
  };

  const handleDeleteItem = (type: string, id: string) => {
    alert(`Delete ${type} feature will be implemented. ID: ${id}`);
  };

  const tabs = [
    { key: 'overview' as TabType, label: 'Overview', icon: User },
    { key: 'education' as TabType, label: 'Education', icon: GraduationCap },
    { key: 'licenses' as TabType, label: 'Licenses', icon: FileText },
    { key: 'certificates' as TabType, label: 'Certificates', icon: Award },
    { key: 'details' as TabType, label: 'Other Details', icon: Edit2 },
  ];


  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">My Profile</h1>
        <p className="text-gray-600">View and manage your professional profile</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-64 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#E7F8EF] text-[#2E7D32]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        <div className="flex-1">
          {activeTab === 'overview' && (
            <Card>
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#2E7D32]">Profile Overview</h2>
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold text-3xl">
                  {profile?.full_name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1F2933] mb-1">
                    Dr. {profile?.preferred_name || profile?.full_name}
                  </h3>
                  <p className="text-gray-600 mb-2">{profile?.email}</p>
                  {profile?.phone && <p className="text-gray-600">{profile.phone}</p>}
                </div>
              </div>

              {profile?.about && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[#1F2933] mb-2">About</h4>
                  <p className="text-gray-700 leading-relaxed">{profile.about}</p>
                </div>
              )}

              {profile?.work_best_with && (
                <div>
                  <h4 className="font-semibold text-[#1F2933] mb-2">I work best with</h4>
                  <p className="text-gray-700 leading-relaxed">{profile.work_best_with}</p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'education' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#2E7D32]">Education</h2>
                <Button onClick={handleAddEducation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {education.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No education records added</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#1F2933]">{edu.degree}</h3>
                          {edu.specialization && (
                            <p className="text-gray-600">{edu.specialization}</p>
                          )}
                          <p className="text-gray-700 mt-1">{edu.institution}, {edu.country}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {edu.start_year} - {edu.end_year || 'Present'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem('education', edu.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem('education', edu.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'licenses' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#2E7D32]">Professional Licenses</h2>
                <Button onClick={handleAddLicense}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add License
                </Button>
              </div>

              {licenses.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No licenses added</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {licenses.map((license) => (
                    <div key={license.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#1F2933]">
                            {license.license_type}
                          </h3>
                          <p className="text-gray-600 mt-1">{license.issuing_authority}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            License No: {license.license_number}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Issued: {new Date(license.issue_date).toLocaleDateString()}
                            {license.expiry_date && ` | Expires: ${new Date(license.expiry_date).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem('license', license.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem('license', license.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'certificates' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#2E7D32]">Certificates</h2>
                <Button onClick={handleAddCertificate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certificate
                </Button>
              </div>

              {certificates.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No certificates added</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Award className="w-8 h-8 text-[#6CCF93]" />
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem('certificate', cert.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem('certificate', cert.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-[#1F2933] mb-1">{cert.title}</h3>
                      <p className="text-sm text-gray-600">{cert.issued_by}</p>
                      <p className="text-sm text-gray-500 mt-1">Year: {cert.year}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'details' && (
            <Card>
              <h2 className="text-2xl font-semibold text-[#2E7D32] mb-6">Other Details</h2>
              <p className="text-gray-600">
                Additional profile information coming soon. You can manage your service locations,
                specializations, languages, and availability settings here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
