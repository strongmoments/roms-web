import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
export interface DemoColor {
  name: string;
  color: string;
}
@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss'],
})
export class RecruitmentComponent {
  @ViewChild('resourceDemandDialog') resourceDemandDialog!: TemplateRef<any>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  fruits = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];
  fruits2 = [{ name: 'Lemon2' }, { name: 'Lime2' }, { name: 'Apple2' }];

  availableColors: DemoColor[] = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },
  ];

  constructor(private dialog: MatDialog) {}
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
      this.fruits2.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);
    const index2 = this.fruits2.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    if (index2 >= 0) {
      this.fruits2.splice(index2, 1);
    }
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(this.resourceDemandDialog, {
      width: '30em',
      height: '15em',
      data: { data: data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }
}
