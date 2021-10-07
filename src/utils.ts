import { LineItem } from './appTypes';

export function formatPrice(v: number): string {
  if (v) {
    return '$' + v.toFixed(2);
  }
  return '';
}
export function formatImage(path: string, origin: string): string {
  if (path && origin) {
    return origin + path;
  }
  return '';
}
export function showQty(v: number): string {
  if (v < 1) {
    return '';
  }
  return v.toString();
}
export function showQtyTxt(v: number): string {
  if (v < 1) {
    return 'No stock*';
  }
  return 'In stock';
}
export function isQty(v: number): boolean {
  if (v > 0) {
    return true;
  }
  return false;
}
export function sortOrder(items: Array<LineItem>, sizes: Array<string>): void {
  if (items.length > 0) {
    const getIndex = (val: string) => {
      return sizes.indexOf(val);
    };
    items.sort((a, b) => {
      var x = getIndex(a.size);
      var y = getIndex(b.size);
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    // Sort by colour (alpha)
    items.sort(function (a, b) {
      var x = a.colour.toLowerCase();
      var y = b.colour.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    // Sort by Style (alpha)
    items.sort(function (a, b) {
      var x = a.style.toLowerCase();
      var y = b.style.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
  }
}
