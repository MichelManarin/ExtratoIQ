import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankOption, BankAccount } from '@app/core/models/onboarding.model';
import { FormInputComponent } from '@app/shared/components/form-input/form-input.component';
import { FormSelectComponent, SelectOption } from '@app/shared/components/form-select/form-select.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-bank-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInputComponent, FormSelectComponent, ButtonComponent],
  templateUrl: './bank-account-form.component.html',
  styleUrl: './bank-account-form.component.scss',
})
export class BankAccountFormComponent {
  @Input() banks: BankOption[] = [];
  @Input() existingAccounts: BankAccount[] = [];
  @Input() showExistingAccounts: boolean = true;
  @Output() accountAdded = new EventEmitter<BankAccount>();
  @Output() accountRemoved = new EventEmitter<number>();

  selectedBankId: string = '';
  accountName: string = '';

  get selectOptions(): SelectOption[] {
    return this.banks.map((bank) => ({
      value: bank.id,
      label: bank.name,
    }));
  }

  onAddAccount(): void {
    if (!this.selectedBankId || !this.accountName.trim()) {
      return;
    }

    const selectedBank = this.banks.find((b) => b.id === this.selectedBankId);
    if (!selectedBank) return;

    const newAccount: BankAccount = {
      bankId: this.selectedBankId,
      bankName: selectedBank.name,
      accountName: this.accountName.trim(),
    };

    this.accountAdded.emit(newAccount);
    this.selectedBankId = '';
    this.accountName = '';
  }

  onRemoveAccount(index: number): void {
    this.accountRemoved.emit(index);
  }
}

