/**
 * Disjoint-set union with path halving and union by size.
 * Amortised O(alpha(n)) per operation, alpha < 4 for any practical input.
 */
export class Dsu {
  constructor(n) {
    this.n = n;
    this.parent = new Int32Array(n);
    this.size = new Int32Array(n);
    this.reset();
  }

  reset() {
    const p = this.parent;
    const s = this.size;
    for (let i = 0; i < this.n; i++) {
      p[i] = i;
      s[i] = 1;
    }
    this.count = this.n;
    this.maxSize = this.n > 0 ? 1 : 0;
  }

  find(x) {
    const p = this.parent;
    let r = x;
    while (p[r] !== r) r = p[r];
    // path halving
    while (p[x] !== r) {
      const next = p[x];
      p[x] = r;
      x = next;
    }
    return r;
  }

  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) {
      const t = ra;
      ra = rb;
      rb = t;
    }
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    this.count--;
    if (this.size[ra] > this.maxSize) this.maxSize = this.size[ra];
    return true;
  }

  /** All roots, for diagnostics. */
  roots() {
    const out = [];
    for (let i = 0; i < this.n; i++) if (this.find(i) === i) out.push(i);
    return out;
  }
}

export default Dsu;
