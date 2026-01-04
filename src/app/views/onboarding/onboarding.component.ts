import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OnboardingService } from '@app/core/services/onboarding.service';
import { OnboardingSidebarComponent } from '@app/shared/components/onboarding-sidebar/onboarding-sidebar.component';
import { OnboardingOptionComponent } from '@app/shared/components/onboarding-option/onboarding-option.component';
import { BankAccountFormComponent } from '@app/shared/components/bank-account-form/bank-account-form.component';
import { OnboardingData, OnboardingOption, OnboardingStep, BankAccount } from '@app/core/models/onboarding.model';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, OnboardingSidebarComponent, OnboardingOptionComponent, BankAccountFormComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  onboardingService = inject(OnboardingService);
  private router = inject(Router);

  onboardingData!: OnboardingData;
  currentStepData!: OnboardingStep;
  selectedOption: OnboardingOption | null = null;
  bankAccounts: BankAccount[] = [];

  ngOnInit(): void {
    this.loadOnboardingData();
  }

  loadOnboardingData(): void {
    this.onboardingData = this.onboardingService.getOnboardingData();
    this.currentStepData = this.onboardingData.steps.find(
      (s) => s.stepNumber === this.onboardingData.currentStep
    )!;
    this.selectedOption = this.onboardingService.getSelectedOption(
      this.onboardingData.currentStep
    );
    this.bankAccounts = this.onboardingService.getBankAccounts();
  }

  onOptionSelected(option: OnboardingOption): void {
    this.onboardingService.selectOption(this.onboardingData.currentStep, option.id);
    this.selectedOption = option;
  }

  onBack(): void {
    if (this.onboardingData.currentStep > 1) {
      this.onboardingService.previousStep();
      this.loadOnboardingData();
    } else {
      // Se estiver no primeiro passo, não permite voltar (login está mockado)
      // Pode adicionar um diálogo de confirmação aqui se necessário
    }
  }

  onContinue(): void {
    if (!this.onboardingService.canProceed(this.onboardingData.currentStep)) {
      return;
    }

    if (this.onboardingData.currentStep < this.onboardingData.totalSteps) {
      this.onboardingService.nextStep();
      this.loadOnboardingData();
    } else {
      this.completeOnboarding();
    }
  }

  completeOnboarding(): void {
    this.onboardingService.completeOnboarding();
    this.router.navigate(['/home']);
  }

  isOptionSelected(optionId: string): boolean {
    return this.selectedOption?.id === optionId;
  }

  isBankAccountStep(): boolean {
    return this.currentStepData?.type === 'bank-account';
  }

  onBankAccountAdded(account: BankAccount): void {
    this.onboardingService.addBankAccount(account);
    this.bankAccounts = this.onboardingService.getBankAccounts();
  }

  onBankAccountRemoved(index: number): void {
    this.onboardingService.removeBankAccount(index);
    this.bankAccounts = this.onboardingService.getBankAccounts();
  }
}

