import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CATEGORY_LABELS, CourseCategory, CourseLevel, LEVEL_LABELS } from '../../core/models';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { CourseCard } from '../../shared/ui/course-card/course-card';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { Icon } from '../../shared/ui/icon/icon';
import {
  CourseFilterCriteria,
  CourseSort,
  DURATION_LABELS,
  DurationBucket,
  durationBucketOf,
  EMPTY_CRITERIA,
  filterCourses,
  hasActiveFilters,
} from './course-filter';

type ListKey = 'categories' | 'levels' | 'durations';

interface FilterOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly count: number;
}

@Component({
  selector: 'app-catalog-page',
  imports: [CourseCard, EmptyState, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {
  private readonly allCourses = inject(CourseRepository).getAll();

  protected readonly criteria = signal<CourseFilterCriteria>(EMPTY_CRITERIA);
  protected readonly filtersOpen = signal(false);

  protected readonly results = computed(() => filterCourses(this.allCourses, this.criteria()));
  protected readonly isFiltered = computed(() => hasActiveFilters(this.criteria()));

  protected readonly categoryOptions = this.buildOptions<CourseCategory>(CATEGORY_LABELS, (c) => c.category);
  protected readonly levelOptions = this.buildOptions<CourseLevel>(LEVEL_LABELS, (c) => c.level);
  protected readonly durationOptions = this.buildOptions<DurationBucket>(DURATION_LABELS, (c) =>
    durationBucketOf(c.durationHours),
  );

  protected readonly sortOptions: readonly { readonly value: CourseSort; readonly label: string }[] = [
    { value: 'relevancia', label: 'Más relevantes' },
    { value: 'duracion', label: 'Menor duración' },
    { value: 'precio', label: 'Menor precio' },
  ];

  protected setQuery(query: string): void {
    this.criteria.update((c) => ({ ...c, query }));
  }

  protected setSort(sort: string): void {
    this.criteria.update((c) => ({ ...c, sort: sort as CourseSort }));
  }

  protected isChecked(key: ListKey, value: string): boolean {
    return (this.criteria()[key] as readonly string[]).includes(value);
  }

  protected toggle(key: ListKey, value: string): void {
    this.criteria.update((c) => {
      const list = c[key] as readonly string[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...c, [key]: next };
    });
  }

  protected clear(): void {
    this.criteria.set(EMPTY_CRITERIA);
  }

  private buildOptions<T extends string>(
    labels: Readonly<Record<T, string>>,
    pick: (course: (typeof this.allCourses)[number]) => T,
  ): readonly FilterOption<T>[] {
    return (Object.keys(labels) as T[])
      .map((value) => ({ value, label: labels[value], count: this.allCourses.filter((c) => pick(c) === value).length }))
      .filter((option) => option.count > 0);
  }
}
