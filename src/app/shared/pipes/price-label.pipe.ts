import { Pipe, PipeTransform } from '@angular/core';

/** Muestra un precio de ejemplo en soles o «Gratis». */
@Pipe({ name: 'priceLabel' })
export class PriceLabelPipe implements PipeTransform {
  transform(priceSoles: number): string {
    return priceSoles === 0 ? 'Gratis (demo)' : `S/ ${priceSoles} · precio de ejemplo`;
  }
}
