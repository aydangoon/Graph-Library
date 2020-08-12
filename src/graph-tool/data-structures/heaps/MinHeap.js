export default function MinHeap() {
    this.A = []
    this.parent = i => Math.floor(i / 2)
    this.left = i => 2 * i
    this.right = i => 2 * i + 1

    this.insert = (elt, key = 9999) => {
        this.A.push({elt, key: 9999}) //make sure 9999 can not be exceeded
        this.decreaseKey(this.A.length - 1, key)
    }

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

    this.indexOf = (delt) => {
        for (let i = 0; i < this.A.length; i++) {
            if (this.A[i].elt === delt) {
                return i
            }
        }
        return -1
    }

    this.getKey = (i) => { return this.A[i].key }

    this.exchange = (i, i2) => {
        const A = this.A
        let temp = A[i]
        A[i] = A[i2]
        A[i2] = temp
    }

    this.isEmpty = () => this.A.length === 0

}
