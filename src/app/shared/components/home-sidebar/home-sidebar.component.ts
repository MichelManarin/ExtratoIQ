import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '@app/core/services/onboarding.service';
import { BankAccount } from '@app/core/models/onboarding.model';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-home-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './home-sidebar.component.html',
  styleUrl: './home-sidebar.component.scss',
})
export class HomeSidebarComponent {
  onboardingService = inject(OnboardingService);
  @Input() selectedAccountId: string | null = null;
  @Output() accountSelected = new EventEmitter<BankAccount>();
  @Output() addAccountRequested = new EventEmitter<void>();
  
  get bankAccounts(): BankAccount[] {
    return this.onboardingService.getBankAccounts();
  }

  selectAccount(account: BankAccount): void {
    this.accountSelected.emit(account);
  }

  isSelected(account: BankAccount): boolean {
    return this.selectedAccountId === account.bankId;
  }

  onAddAccount(): void {
    this.addAccountRequested.emit();
  }
}

