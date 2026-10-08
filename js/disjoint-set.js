/**
 * Disjoint Set (Union-Find) Data Structure
 * Implements Path Compression and Union by Rank for O(α(V)) cycle detection
 * Essential algorithmic backbone of Kruskal's Minimum Spanning Tree (MST).
 */

class DisjointSet {
  /**
   * @param {number} size - Number of vertices (0 to size - 1)
   */
  constructor(size) {
    this.size = size;
    this.parent = new Array(size);
    this.rank = new Array(size).fill(0);
    this.numComponents = size;

    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
    }
  }

  /**
   * Find root representative of element i with Path Compression
   * @param {number} i - Vertex index
   * @returns {number} Root index
   */
  find(i) {
    if (this.parent[i] === i) {
      return i;
    }
    // Path Compression heuristic: flattens tree structure
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  /**
   * Check if vertices u and v belong to the same connected component (Cycle check)
   * @param {number} u
   * @param {number} v
   * @returns {boolean} True if in same set (Cycle forms)
   */
  connected(u, v) {
    return this.find(u) === this.find(v);
  }

  /**
   * Union the sets containing u and v by Rank heuristic
   * @param {number} u
   * @param {number} v
   * @returns {boolean} True if sets were merged, False if cycle detected
   */
  union(u, v) {
    const rootU = this.find(u);
    const rootV = this.find(v);

    if (rootU === rootV) {
      // Cycle detected! Already in the same connected component
      return false;
    }

    // Union by Rank: attach smaller depth tree under root of deeper tree
    if (this.rank[rootU] < this.rank[rootV]) {
      this.parent[rootU] = rootV;
    } else if (this.rank[rootU] > this.rank[rootV]) {
      this.parent[rootV] = rootU;
    } else {
      this.parent[rootV] = rootU;
      this.rank[rootU]++;
    }

    this.numComponents--;
    return true;
  }

  /**
   * Returns whether all vertices are fully connected into a single component
   * @returns {boolean}
   */
  isFullyConnected() {
    return this.numComponents === 1;
  }

  /**
   * Clone current DisjointSet state to test hypothetical edge selections
   * @returns {DisjointSet}
   */
  clone() {
    const cloneSet = new DisjointSet(this.size);
    cloneSet.parent = [...this.parent];
    cloneSet.rank = [...this.rank];
    cloneSet.numComponents = this.numComponents;
    return cloneSet;
  }
}

// Export for module or global use
if (typeof window !== "undefined") {
  window.DisjointSet = DisjointSet;
}
