import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  selectTab(tabId: string): void {
    if (tabId !== this.activeTabId) {
      this.activeTabId = tabId;
      this.tabChanged.emit(tabId);
    }
  }
}

