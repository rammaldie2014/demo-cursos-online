import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CERTIFICATE_DISCLAIMER, CERTIFICATE_ISSUER } from '../../../core/services/certificate.service';
import { BrandLogo } from '../brand-logo/brand-logo';

@Component({
  selector: 'app-certificate-preview',
  imports: [BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cert" [class.cert--compact]="compact()" role="img" [attr.aria-label]="ariaLabel()">
      <div class="cert__corner cert__corner--tl" aria-hidden="true"></div>
      <div class="cert__corner cert__corner--br" aria-hidden="true"></div>
      <div class="cert__seal" aria-hidden="true">
        <svg viewBox="0 0 48 48"><circle cx="24" cy="20" r="15" fill="#a8d600" /><path d="M24 11l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="#fff" /><path d="M15 32l-3 12 6-3 3 5 3-9M33 32l3 12-6-3-3 5-3-9" fill="#6d8c00" /></svg>
      </div>
      <div class="cert__body">
        <app-brand-logo [size]="compact() ? 'sm' : 'md'" />
        <p class="cert__title">Certificado de finalización</p>
        <p class="cert__small">Otorgado a</p>
        <p class="cert__name">{{ holderName() || 'Tu nombre aquí' }}</p>
        <p class="cert__small">por haber completado satisfactoriamente el curso</p>
        <p class="cert__course">{{ courseTitle() }}</p>
        @if (!compact()) {
          <div class="cert__footer">
            <div>
              <span class="cert__line"></span>
              <span class="cert__small">Emitido por {{ issuer }}</span>
            </div>
            <div>
              <span class="cert__line cert__date">{{ dateLabel() }}</span>
              <span class="cert__small">Fecha de finalización</span>
            </div>
          </div>
        }
        <p class="cert__disclaimer">{{ disclaimer }}</p>
      </div>
    </div>
  `,
  styleUrl: './certificate-preview.scss',
})
export class CertificatePreview {
  readonly holderName = input('');
  readonly courseTitle = input.required<string>();
  readonly dateLabel = input('');
  readonly compact = input(false);

  protected readonly issuer = CERTIFICATE_ISSUER;
  protected readonly disclaimer = CERTIFICATE_DISCLAIMER;

  protected ariaLabel(): string {
    return `Certificado de demostración para ${this.holderName() || 'el alumno'}, curso ${this.courseTitle()}. ${this.disclaimer}.`;
  }
}
