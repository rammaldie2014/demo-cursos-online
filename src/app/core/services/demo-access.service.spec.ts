import { TestBed } from '@angular/core/testing';
import { MAIN_COURSE_ID } from '../data/courses.data';
import { StorageKeys } from '../storage/storage-keys';
import { configureDemoTestBed } from '../testing/test-providers';
import { DemoAccessService } from './demo-access.service';
import { EnrollmentService } from './enrollment.service';
import { SessionStore } from './session.store';

describe('DemoAccessService', () => {
  it('el invitado puede inscribirse y conserva su avance al registrarse', () => {
    const storage = configureDemoTestBed();
    const access = TestBed.inject(DemoAccessService);
    const enrollment = TestBed.inject(EnrollmentService);

    access.continueAsGuest();
    expect(enrollment.enroll(MAIN_COURSE_ID)).toBe(true);

    const profile = access.register({ name: 'Ana Pérez', email: 'ana@example.com' });

    expect(TestBed.inject(SessionStore).displayName()).toBe('Ana Pérez');
    expect(enrollment.isEnrolled(MAIN_COURSE_ID)).toBe(true);
    expect(storage.read(StorageKeys.learnerState('invitado'))).toBeNull();
    expect(storage.read(StorageKeys.learnerState(profile.id))).not.toBeNull();
  });

  it('no permite inscribirse sin perfil ni en cursos de ejemplo', () => {
    configureDemoTestBed();
    const enrollment = TestBed.inject(EnrollmentService);
    expect(enrollment.enroll(MAIN_COURSE_ID)).toBe(false);

    TestBed.inject(DemoAccessService).continueAsGuest();
    expect(enrollment.enroll('marketing-digital')).toBe(false);
  });

  it('salir y volver a entrar recupera los datos del mismo perfil', () => {
    configureDemoTestBed();
    const access = TestBed.inject(DemoAccessService);
    const enrollment = TestBed.inject(EnrollmentService);

    access.signIn({ name: 'Luis', email: 'luis@example.com' });
    enrollment.enroll(MAIN_COURSE_ID);
    access.signOut();
    expect(enrollment.isEnrolled(MAIN_COURSE_ID)).toBe(false);

    access.signIn({ name: 'Luis', email: 'luis@example.com' });
    expect(enrollment.isEnrolled(MAIN_COURSE_ID)).toBe(true);
  });

  it('reiniciar la demo borra todos los datos guardados', () => {
    const storage = configureDemoTestBed();
    const access = TestBed.inject(DemoAccessService);
    access.continueAsGuest();
    TestBed.inject(EnrollmentService).enroll(MAIN_COURSE_ID);

    access.resetDemo();

    expect(storage.keys('ayv:')).toEqual([]);
    expect(TestBed.inject(SessionStore).hasProfile()).toBe(false);
  });
});
