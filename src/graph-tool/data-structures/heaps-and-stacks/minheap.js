// @fileoverview Object constructor for a Min Heap.

/* eslint-disable */

// A Min Heap Object is an implementation of a Minimum
// Heap Binary Tree. Nodes in the tree are {elt, key} pairs
// where the elt is the actual element, and key is an integer
// on range [0, 9999). The root node has the lowest key.
export default function MinHeap() {

    // @private {Type[]} An array representing the heap.
    this.A = []

    // @private {function} gets the parent index of an index.
    this.parent = i => Math.floor(i / 2)

    // @private {function} gets the left child index of an index.
    this.left = i => 2 * i

    // @private {function} gets the right child index of an index.
    this.right = i => 2 * i + 1

    // Adds an element key pair to the tree.
    // @param {Type} elt: the element to be added
    // @param {integer} key: the key value of the element key pair
    this.insert = (elt, key = 9999) => {
        this.A.push({elt, key: 9999}) //make sure 9999 can not be exceeded
        this.decreaseKey(this.A.length - 1, key)
    }

    // Decreases the key of an element key pair defined by a node
    // index.
    // @param {integer} i: the index of the elt key pair for which
    // the key value will be decreased
    // @param {integer} key: the new key
    this.decreaseKey = (i, key) => {
        const A = this.A
        if (A[i].key < key) {
            return
        }

        A[i].key = key
        let parent
        while (i > 0 && A[this.parent(i)].key > A[i].key) {
            parent = this.parent(i)
            this.exchange(parent, i)
            i = parent
        }
    }

    // Returns and removes the minimum elt key pair from the tree.
    // @returns {Type} the minimum node's elt
    this.extractMin = () => {
        const A = this.A
        if (A.length === 0) {
            return
        }
        let min = A.shift()
        if (A.length > 0) {
            A.unshift(A.pop())
            this.minHeapify(0)
        }
        return min.elt

    }

    // Ensures the min heap invariant for the tree starting at a sub-tree
    // defined by an index.
    // @param {integer} i: the index of the root node for the subtree that needs
    // to be minheapified
    this.minHeapify = (i) => {
        const A = this.A
        let min = i
        let l = this.left(i)
        let r = this.right(i)
        if (l <= A.length - 1 && A[l].key < A[i].key) {
            min = l
        }
        if (r <= A.length - 1 && A[r].key < A[min].key) {
            min = r
        }
        if (i !== min) {
            this.exchange(min, i)
            this.minHeapify(min)
        }

    }

    // Finds the index of an element in the array representation of the tree.
    // @param {Type} delt: the element for which we want to find the index
    // @returns {integer} the index of the element or -1 if none is found
    this.indexOf = (delt) => {
        for (let i = 0; i < this.A.length; i++) {
            if (this.A[i].elt === delt) {
                return i
            }
        }
        return -1
    }

    // Gets the key of an elt key pair from an index.
    // @param {integer} i: the index in the array representation of the tree
    // @returns {integer} the key associated with the elt key pair at that index
    this.getKey = (i) => { return this.A[i].key }

    // Swaps two nodes in the array by two specified indices
    // @param {integer} i: the index of the first node
    // @param {integer} i2: the index of the second node
    this.exchange = (i, i2) => {
        const A = this.A
        let temp = A[i]
        A[i] = A[i2]
        A[i2] = temp
    }

    // @private {function} returns a boolean checking if the binary heap is empty
    this.isEmpty = () => this.A.length === 0

}
