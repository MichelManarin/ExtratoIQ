import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OnboardingService } from '@app/core/services/onboarding.service';
import { HomeSidebarComponent } from '@app/shared/components/home-sidebar/home-sidebar.component';
import { DashboardCardComponent } from '@app/shared/components/dashboard-card/dashboard-card.component';
import { FileUploadComponent } from '@app/shared/components/file-upload/file-upload.component';
import { TabsComponent, Tab } from '@app/shared/components/tabs/tabs.component';
import { LineChartComponent } from '@app/shared/components/line-chart/line-chart.component';
import { BarChartComponent } from '@app/shared/components/bar-chart/bar-chart.component';
import { BankAccount } from '@app/core/models/onboarding.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    HomeSidebarComponent,
    DashboardCardComponent,
    FileUploadComponent,
    TabsComponent,
    LineChartComponent,
    BarChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  onboardingService = inject(OnboardingService);
  
  selectedAccount: BankAccount | null = null;
  activeTab: string = 'overview';
  totalBalance = 0;
  monthlyIncome = 0;
  monthlyExpenses = 0;
  transactionsCount = 0;
  isUploadExpanded = false;

  tabs: Tab[] = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'transactions', label: 'Transações' },
    { id: 'analytics', label: 'Análises' },
  ];

  // Mock data para gráficos
  incomeData: number[] = [8500, 9200, 7800, 9500, 8800, 10200, 9800];
  expenseData: number[] = [3200, 3500, 2800, 3100, 3300, 2900, 3000];
  monthlyLabels: string[] = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'];
  dailyLabels: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  get combinedData(): number[] {
    return [...this.incomeData, ...this.expenseData];
  }

  get bankAccounts(): BankAccount[] {
    return this.onboardingService.getBankAccounts();
  }

  onAccountSelect(account: BankAccount): void {
    this.selectedAccount = account;
    this.loadAccountData(account);
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  get selectedAccountId(): string | null {
    return this.selectedAccount?.bankId || null;
  }

  onFileUploaded(file: File): void {
    // Aqui você processaria o arquivo de extrato
    console.log('Arquivo selecionado:', file);
    // TODO: Implementar processamento do arquivo
  }

  onUploadError(error: string): void {
    console.error('Erro no upload:', error);
    // TODO: Mostrar toast/notificação de erro
  }

  toggleUpload(): void {
    this.isUploadExpanded = !this.isUploadExpanded;
  }

  private loadAccountData(account: BankAccount): void {
    // Mock data - substituir por chamada real à API
    this.totalBalance = 12500.50;
    this.monthlyIncome = 8500.00;
    this.monthlyExpenses = 3200.75;
    this.transactionsCount = 45;
  }
}

