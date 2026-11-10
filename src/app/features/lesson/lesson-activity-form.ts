import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivityField, Lesson, LessonAnswers } from '../../core/models';
import { fieldError } from '../../core/services/lesson-validation';
import { Icon } from '../../shared/ui/icon/icon';

type ActivityForm = FormGroup<Record<string, FormControl<string>>>;

function activityValidator(field: ActivityField): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const message = fieldError(field, control.value);
    return message ? { activity: message } : null;
  };
}

/** Actividad práctica de un instructivo: campos editables con validación. */
@Component({
  selector: 'app-lesson-activity-form',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson-activity-form.html',
  styleUrl: './lesson-activity-form.scss',
})
export class LessonActivityForm implements OnInit {
  readonly lesson = input.required<Lesson>();
  readonly initialAnswers = input<LessonAnswers>({});
  readonly completed = input(false);

  readonly save = output<LessonAnswers>();

  private readonly document = inject(DOCUMENT);
  protected readonly attempted = signal(false);
  protected form!: ActivityForm;

  ngOnInit(): void {
    const controls = Object.fromEntries(
      this.lesson().activity.fields.map((field) => [
        field.id,
        new FormControl(this.initialAnswers()[field.id] ?? '', { nonNullable: true, validators: activityValidator(field) }),
      ]),
    );
    this.form = new FormGroup(controls);
  }

  protected controlId(field: ActivityField): string {
    return `campo-${this.lesson().id}-${field.id}`;
  }

  protected errorFor(field: ActivityField): string | null {
    const control = this.form.controls[field.id];
    if (!control || !(control.touched || this.attempted())) {
      return null;
    }
    return (control.errors?.['activity'] as string | undefined) ?? null;
  }

  protected lengthOf(field: ActivityField): number {
    return this.form.controls[field.id]?.value.length ?? 0;
  }

  protected useSample(): void {
    const sample = this.lesson().sampleAnswers;
    if (sample) {
      this.form.patchValue(sample);
      this.form.markAsDirty();
    }
  }

  protected submit(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalid();
      return;
    }
    this.save.emit(this.form.getRawValue());
    this.form.markAsPristine();
  }

  private focusFirstInvalid(): void {
    const field = this.lesson().activity.fields.find((f) => this.form.controls[f.id]?.invalid);
    if (field) {
      this.document.getElementById(this.controlId(field))?.focus();
    }
  }
}
