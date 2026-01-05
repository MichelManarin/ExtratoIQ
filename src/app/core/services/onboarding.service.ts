import { Injectable, signal } from '@angular/core';
import { OnboardingData, OnboardingOption, OnboardingStep, BankAccount, BankOption } from '../models/onboarding.model';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly onboardingKey = 'onboarding_completed';
  private readonly onboardingDataKey = 'onboarding_data';

  isCompleted = signal<boolean>(this.checkIfCompleted());
  currentStep = signal<number>(1);

  private defaultSteps: OnboardingStep[] = [
    {
      stepNumber: 1,
      title: 'Em qual estágio você está na sua jornada financeira?',
      type: 'options',
      options: [
        {
          id: 'visualize',
          title: 'Quero apenas visualizar meus gastos',
          description: 'Sem análises profundas',
        },
        {
          id: 'categorize',
          title: 'Quero categorizar meus gastos',
          description: 'Entender onde gasto mais',
        },
        {
          id: 'improve',
          title: 'Quero melhorar minha vida financeira',
          description: 'Análises, metas e insights',
        },
        {
          id: 'reduce',
          title: 'Quero reduzir dívidas e economizar',
          description: 'Planejamento financeiro',
        },
        {
          id: 'invest',
          title: 'Quero investir melhor meu dinheiro',
          description: 'Estratégia e crescimento',
        },
      ],
      info: 'Essa informação ajuda a personalizar sua experiência no ExtratoIQ',
    },
    {
      stepNumber: 2,
      title: 'Com que frequência você gostaria de acompanhar suas finanças?',
      type: 'options',
      options: [
        {
          id: 'daily',
          title: 'Diariamente',
          description: 'Acompanhamento detalhado todos os dias',
        },
        {
          id: 'weekly',
          title: 'Semanalmente',
          description: 'Revisão semanal dos gastos',
        },
        {
          id: 'monthly',
          title: 'Mensalmente',
          description: 'Análise mensal do extrato',
        },
        {
          id: 'as-needed',
          title: 'Apenas quando necessário',
          description: 'Sem notificações regulares',
        },
      ],
      info: 'Isso nos ajuda a enviar lembretes no momento certo',
    },
    {
      stepNumber: 3,
      title: 'Vamos configurar sua primeira conta bancária',
      type: 'bank-account',
      banks: [
        { id: 'santander', name: 'Santander' },
        { id: 'itau', name: 'Itaú' },
      ],
      info: 'Você poderá adicionar mais contas depois',
    },
    {
      stepNumber: 4,
      title: 'Você tem alguma meta financeira específica?',
      type: 'options',
      options: [
        {
          id: 'emergency-fund',
          title: 'Economizar para emergência',
          description: 'Criar uma reserva de emergência',
        },
        {
          id: 'reduce-debts',
          title: 'Reduzir dívidas',
          description: 'Pagar dívidas existentes',
        },
        {
          id: 'invest-more',
          title: 'Investir mais',
          description: 'Aumentar investimentos',
        },
        {
          id: 'big-purchase',
          title: 'Planejar uma grande compra',
          description: 'Casa, carro, viagem, etc.',
        },
        {
          id: 'no-goals',
          title: 'Ainda não tenho metas definidas',
          description: 'Vou definir depois',
        },
      ],
      info: 'Essas informações nos ajudam a sugerir conteúdos relevantes',
    },
  ];

  getOnboardingData(): OnboardingData {
    const saved = localStorage.getItem(this.onboardingDataKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Valida se os dados salvos têm a mesma estrutura
        if (parsed.steps && Array.isArray(parsed.steps) && parsed.steps.length === this.defaultSteps.length) {
          // Garante que currentStep não ultrapasse totalSteps e seja válido
          if (parsed.currentStep > parsed.totalSteps || parsed.currentStep < 1) {
            parsed.currentStep = 1;
          }
          // Garante que totalSteps está correto
          parsed.totalSteps = this.defaultSteps.length;
          // Atualiza os steps caso a estrutura tenha mudado
          parsed.steps = this.defaultSteps;
          return parsed;
        } else {
          // Se a estrutura não corresponder, reseta
          this.resetOnboardingData();
        }
      } catch (e) {
        // Se houver erro ao parsear, reseta
        this.resetOnboardingData();
      }
    }

    return {
      currentStep: 1,
      totalSteps: this.defaultSteps.length,
      steps: this.defaultSteps,
      bankAccounts: [],
    };
  }

  private resetOnboardingData(): void {
    localStorage.removeItem(this.onboardingDataKey);
    this.currentStep.set(1);
  }

  saveOnboardingData(data: OnboardingData): void {
    localStorage.setItem(this.onboardingDataKey, JSON.stringify(data));
    this.currentStep.set(data.currentStep);
  }

  selectOption(stepNumber: number, optionId: string): void {
    const data = this.getOnboardingData();
    const step = data.steps.find((s) => s.stepNumber === stepNumber);
    if (step && step.options) {
      step.options.forEach((opt) => {
        opt.selected = opt.id === optionId;
      });
      this.saveOnboardingData(data);
    }
  }

  getSelectedOption(stepNumber: number): OnboardingOption | null {
    const data = this.getOnboardingData();
    const step = data.steps.find((s) => s.stepNumber === stepNumber);
    if (!step || !step.options) {
      return null;
    }
    return step.options.find((opt) => opt.selected) || null;
  }

  nextStep(): void {
    const data = this.getOnboardingData();
    if (data.currentStep < data.totalSteps) {
      data.currentStep++;
      this.saveOnboardingData(data);
    }
  }

  previousStep(): void {
    const data = this.getOnboardingData();
    if (data.currentStep > 1) {
      data.currentStep--;
      this.saveOnboardingData(data);
    }
  }

  completeOnboarding(): void {
    localStorage.setItem(this.onboardingKey, 'true');
    this.isCompleted.set(true);
  }

  checkIfCompleted(): boolean {
    return localStorage.getItem(this.onboardingKey) === 'true';
  }

  resetOnboarding(): void {
    localStorage.removeItem(this.onboardingKey);
    localStorage.removeItem(this.onboardingDataKey);
    this.isCompleted.set(false);
    this.currentStep.set(1);
  }

  canProceed(stepNumber: number): boolean {
    const data = this.getOnboardingData();
    const step = data.steps.find((s) => s.stepNumber === stepNumber);
    
    if (!step) return false;
    
    if (step.type === 'bank-account') {
      return !!(data.bankAccounts && data.bankAccounts.length > 0);
    }
    
    const selected = this.getSelectedOption(stepNumber);
    return selected !== null;
  }

  addBankAccount(bankAccount: BankAccount): void {
    const data = this.getOnboardingData();
    if (!data.bankAccounts) {
      data.bankAccounts = [];
    }
    data.bankAccounts.push(bankAccount);
    this.saveOnboardingData(data);
  }

  removeBankAccount(index: number): void {
    const data = this.getOnboardingData();
    if (data.bankAccounts) {
      data.bankAccounts.splice(index, 1);
      this.saveOnboardingData(data);
    }
  }

  getBankAccounts(): BankAccount[] {
    const data = this.getOnboardingData();
    return data.bankAccounts || [];
  }

  getAvailableBanks(): BankOption[] {
    const bankStep = this.defaultSteps.find(step => step.type === 'bank-account');
    return bankStep?.banks || [
      { id: 'santander', name: 'Santander' },
      { id: 'itau', name: 'Itaú' },
      { id: 'bradesco', name: 'Bradesco' },
      { id: 'bb', name: 'Banco do Brasil' },
      { id: 'caixa', name: 'Caixa Econômica' },
      { id: 'nubank', name: 'Nubank' },
      { id: 'inter', name: 'Inter' },
    ];
  }
}

