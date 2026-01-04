import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingOption } from '@app/core/models/onboarding.model';

@Component({
  selector: 'app-onboarding-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-option.component.html',
  styleUrl: './onboarding-option.component.scss',
})
export class OnboardingOptionComponent {
  @Input() option!: OnboardingOption;
  @Input() selected = false;
  @Output() optionSelected = new EventEmitter<OnboardingOption>();

  selectOption(): void {
    this.optionSelected.emit(this.option);
  }
}

