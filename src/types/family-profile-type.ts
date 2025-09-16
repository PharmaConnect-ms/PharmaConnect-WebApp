
export enum CareTaskType {
  MEDICATION = 'medication',
  FEEDING = 'feeding',
  EXERCISE = 'exercise',
  CHECKUP = 'checkup',
  THERAPY = 'therapy',
  HYGIENE = 'hygiene',
  OTHER = 'other',
}

export enum CareFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed',
}

export enum RelationshipType {
  CHILD = 'child',
  PARENT = 'parent',
  GRANDPARENT = 'grandparent',
  SPOUSE = 'spouse',
  SIBLING = 'sibling',
  OTHER = 'other',
}

export enum CareLevel {
  INDEPENDENT = 'independent',
  ASSISTED = 'assisted',
  DEPENDENT = 'dependent',
  CRITICAL = 'critical',
}

export interface CreateCareProfile {
  title: string;
  description: string;
  taskType: CareTaskType;
  frequency: CareFrequency;
  scheduledTime?: string;
  daysOfWeek?: string[];
  instructions?: string;
  familyMemberId: string;
  userId: string;   
}


export interface CreateFamilyMember {
  name: string;
  age: number;
  dateOfBirth?: string;
  relationship: RelationshipType;
  careLevel?: CareLevel;
  medicalNotes?: string;
  allergies?: string[];
  medications?: string[];
  userId: string;
}


export interface CareProfile {
  id: string;
  title: string;
  description: string;
  taskType: CareTaskType;
  frequency: CareFrequency;
  scheduledTime?: string;   
  daysOfWeek?: string[];
  isActive: boolean;
  instructions?: string;

  // Relation
  familyMemberId: string;

  // Timestamps
  createdAt: string; 
  updatedAt: string;
}


export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  dateOfBirth?: string;   
  relationship: RelationshipType;
  careLevel: CareLevel;
  medicalNotes?: string;
  allergies?: string[];
  medications?: string[];
  isActive: boolean;

  // Relations
  caregiverId: string;
  careProfiles?: CareProfile[];

  createdAt: string;
  updatedAt: string;
}