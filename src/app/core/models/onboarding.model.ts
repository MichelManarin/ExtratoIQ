export interface OnboardingOption {
  id: string;
  title: string;
  description: string;
  selected?: boolean;
}

export interface BankOption {
  id: string;
  name: string;
  logo?: string;
}

export interface BankAccount {
  bankId: string;
  bankName: string;
  accountName: string;
}

export interface OnboardingStep {
  stepNumber: number;
  title: string;
  type?: 'options' | 'bank-account';
  options?: OnboardingOption[];
  banks?: BankOption[];
  info?: string;
}

export interface OnboardingData {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  bankAccounts?: BankAccount[];
}

