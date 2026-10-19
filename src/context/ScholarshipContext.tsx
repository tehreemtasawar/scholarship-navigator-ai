import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  MatchResult,
  RoadmapTask,
  ScholarshipRecord,
} from '../types/scholarship';
import { SCHOLARSHIPS } from '../data/scholarships';
import { DEMO_PROFILES, DEFAULT_BLANK_PROFILE } from '../data/demoProfiles';
import { matchAllScholarships } from '../logic/matching';

export type AppTab =
  | 'home'
  | 'find'
  | 'results'
  | 'details'
  | 'funding'
  | 'compare'
  | 'roadmap'
  | 'about'
  | 'privacy';

interface ScholarshipContextType {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedScholarshipId: string | null;
  setSelectedScholarshipId: (id: string | null) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  roadmapTasks: RoadmapTask[];
  toggleTaskStatus: (taskId: string) => void;
  addScholarshipToRoadmap: (scholarship: ScholarshipRecord) => void;
  removeScholarshipFromRoadmap: (scholarshipId: string) => void;
  matchResults: MatchResult[];
  activeDemoProfileId: string | null;
  loadDemoProfile: (demoId: string) => void;
  resetProfile: () => void;
  viewScholarshipDetails: (id: string) => void;
  selectedScholarship: ScholarshipRecord | null;
  selectedMatchResult: MatchResult | null;
  compareNotification: string | null;
  clearCompareNotification: () => void;
}

const ScholarshipContext = createContext<ScholarshipContextType | null>(null);

const STORAGE_KEY_PROFILE = 'scholarship_nav_profile_v1';
const STORAGE_KEY_ROADMAP = 'scholarship_nav_roadmap_v1';
const STORAGE_KEY_COMPARE = 'scholarship_nav_compare_v1';

export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved profile:', e);
    }
    // Default to Profile A so the app opens in a rich, demonstrative state
    return DEMO_PROFILES[0].profile;
  });

  const [activeDemoProfileId, setActiveDemoProfileId] = useState<string | null>('profile-a-meets');

  // 2. Navigation state
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);

  // 3. Compare state (max 3)
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const liveIds = new Set(SCHOLARSHIPS.map((scholarship) => scholarship.id));
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPARE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string' && liveIds.has(id)).slice(0, 3);
        }
      }
    } catch (e) {}
    return ['chevening-uk-2026', 'fulbright-pakistan-2026'];
  });
  const [compareNotification, setCompareNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!compareNotification) return;
    const timer = setTimeout(() => {
      setCompareNotification(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [compareNotification]);

  const clearCompareNotification = () => setCompareNotification(null);

  // 4. Roadmap state
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROADMAP);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial seeded tasks for demonstration
    return [
      {
        id: 'seed-task-1',
        scholarshipId: 'chevening-uk-2026',
        scholarshipName: 'Chevening Scholarships',
        title: 'Attest bachelor transcripts and degree certificate',
        description: 'Ensure original degree certificate and all annual/semester transcripts are verified.',
        category: 'mandatory_official',
        status: 'completed',
        officialSourceUrl: 'https://www.chevening.org/scholarships/',
      },
      {
        id: 'seed-task-2',
        scholarshipId: 'chevening-uk-2026',
        scholarshipName: 'Chevening Scholarships',
        title: 'Draft 4 Chevening leadership and networking essays',
        description: 'Complete the four 500-word essays addressing leadership, networking, studying in the UK, and long-term career goals.',
        category: 'mandatory_official',
        status: 'in_progress',
        officialSourceUrl: 'https://www.chevening.org/scholarships/',
      },
      {
        id: 'seed-task-3',
        scholarshipId: 'chevening-uk-2026',
        scholarshipName: 'Chevening Scholarships',
        title: 'Review UK Student Visa & IHS Coverage Guidance',
        description: 'Verify current official Chevening provisions for the UK student visa application fee and Immigration Health Surcharge (IHS). Do not assume IHS coverage; budget for personal out-of-pocket items such as the TB test if applicable until confirmed.',
        category: 'mandatory_official',
        status: 'not_started',
        officialSourceUrl: 'https://www.chevening.org/scholarships/what-does-a-chevening-scholarship-cover/',
      },
    ];
  });

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  // Sync compare to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(compareIds));
    } catch (e) {}
  }, [compareIds]);

  // Sync roadmap to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(roadmapTasks));
    } catch (e) {}
  }, [roadmapTasks]);

  // Handle URL hash navigation for deep linking & back/forward behavior
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'find', 'results', 'details', 'funding', 'compare', 'roadmap', 'about', 'privacy'].includes(hash)) {
        setActiveTab(hash as AppTab);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: AppTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Deterministic matching results automatically updated whenever profile changes
  const matchResults = useMemo(() => {
    return matchAllScholarships(profile, SCHOLARSHIPS);
  }, [profile]);

  // Selected scholarship
  const selectedScholarship = useMemo(() => {
    if (!selectedScholarshipId) return null;
    return SCHOLARSHIPS.find((s) => s.id === selectedScholarshipId) || null;
  }, [selectedScholarshipId]);

  const selectedMatchResult = useMemo(() => {
    if (!selectedScholarshipId) return null;
    return matchResults.find((m) => m.scholarship.id === selectedScholarshipId) || null;
  }, [selectedScholarshipId, matchResults]);

  const viewScholarshipDetails = (id: string) => {
    setSelectedScholarshipId(id);
    changeTab('details');
  };

  // Compare toggle
  const toggleCompare = (id: string) => {
    if (!SCHOLARSHIPS.some((scholarship) => scholarship.id === id)) {
      setCompareNotification('Only live scholarship records can be added to the Compare Lab.');
      return;
    }
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        setCompareNotification(null);
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        setCompareNotification(
          'Comparison limit reached: You can compare up to 3 scholarships side by side. Please remove one from the Compare Lab first.'
        );
        return prev;
      }
      setCompareNotification(null);
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);

  // Roadmap actions
  const toggleTaskStatus = (taskId: string) => {
    setRoadmapTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus =
          t.status === 'not_started'
            ? 'in_progress'
            : t.status === 'in_progress'
            ? 'completed'
            : 'not_started';
        return { ...t, status: nextStatus };
      })
    );
  };

  const addScholarshipToRoadmap = (scholarship: ScholarshipRecord) => {
    const existing = roadmapTasks.some((t) => t.scholarshipId === scholarship.id);
    if (existing) {
      changeTab('roadmap');
      return;
    }

    const newTasks: RoadmapTask[] = [
      {
        id: `${scholarship.id}-task-verify`,
        scholarshipId: scholarship.id,
        scholarshipName: scholarship.name,
        title: `Verify official criteria on ${scholarship.provider} portal`,
        description: 'Read the full call for applications and confirmed eligibility documents on official website.',
        category: 'mandatory_official',
        status: 'not_started',
        officialSourceUrl: scholarship.officialUrl,
      },
      ...scholarship.mandatoryCriteria.map((crit, idx) => ({
        id: `${scholarship.id}-crit-${idx}`,
        scholarshipId: scholarship.id,
        scholarshipName: scholarship.name,
        title: crit.label,
        description: crit.description,
        category: 'mandatory_official' as const,
        status: 'not_started' as const,
        officialSourceUrl: scholarship.officialUrl,
      })),
      {
        id: `${scholarship.id}-task-budget`,
        scholarshipId: scholarship.id,
        scholarshipName: scholarship.name,
        title: 'Review Funding Reality Check for uncovered expenses',
        description: 'Check whether health insurance, housing bond, or visa fees require personal funds.',
        category: 'general_preparation',
        status: 'not_started',
      },
    ];

    setRoadmapTasks((prev) => [...prev, ...newTasks]);
    changeTab('roadmap');
  };

  const removeScholarshipFromRoadmap = (scholarshipId: string) => {
    setRoadmapTasks((prev) => prev.filter((t) => t.scholarshipId !== scholarshipId));
  };

  // Demo profile loader
  const loadDemoProfile = (demoId: string) => {
    if (demoId === 'blank') {
      setProfile(DEFAULT_BLANK_PROFILE);
      setActiveDemoProfileId('blank');
      return;
    }
    const found = DEMO_PROFILES.find((p) => p.id === demoId);
    if (found) {
      setProfile(found.profile);
      setActiveDemoProfileId(found.id);
    }
  };

  const resetProfile = () => {
    setProfile(DEFAULT_BLANK_PROFILE);
    setActiveDemoProfileId('blank');
  };

  return (
    <ScholarshipContext.Provider
      value={{
        profile,
        setProfile,
        activeTab,
        setActiveTab: changeTab,
        selectedScholarshipId,
        setSelectedScholarshipId,
        compareIds,
        toggleCompare,
        clearCompare,
        roadmapTasks,
        toggleTaskStatus,
        addScholarshipToRoadmap,
        removeScholarshipFromRoadmap,
        matchResults,
        activeDemoProfileId,
        loadDemoProfile,
        resetProfile,
        viewScholarshipDetails,
        selectedScholarship,
        selectedMatchResult,
        compareNotification,
        clearCompareNotification,
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarship = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarship must be used within a ScholarshipProvider');
  }
  return context;
};
