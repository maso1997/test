import { Component, Input } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';

@Component({
  selector: 'gem-file-upload-page',
  templateUrl: './file-upload-page.component.html',
  styleUrls: ['./file-upload-page.component.scss'],
})
export class FileUploadPageComponent {
  @Input() codeProduit: string='';
  @Input() productName: string = '';
  @Input() productDescription: string = '';
  @Input() createdBy:string='';
  @Input() reglementaire:boolean=false;
  @Input() stepper!: NbStepperComponent;
  
  selectedFiles: File[] = [];

  onFilesSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      this.selectedFiles = [...this.selectedFiles, ...files];
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  submit(stepper: NbStepperComponent) {
        stepper.next();
    }
}