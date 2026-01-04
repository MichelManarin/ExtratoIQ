import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() accept: string = '.csv,.xlsx,.xls';
  @Input() maxSize: number = 10 * 1024 * 1024; // 10MB
  @Input() disabled: boolean = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() error = new EventEmitter<string>();

  selectedFile: File | null = null;
  isDragging = false;

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.size > this.maxSize) {
      this.error.emit(`Arquivo muito grande. Tamanho máximo: ${this.maxSize / 1024 / 1024}MB`);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = this.accept.split(',').map(ext => ext.replace('.', '').trim());

    if (extension && !acceptedExtensions.includes(extension)) {
      this.error.emit(`Tipo de arquivo não suportado. Use: ${this.accept}`);
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

