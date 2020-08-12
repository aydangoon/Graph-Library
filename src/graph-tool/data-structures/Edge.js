export default function Edge(u, v, color, weight) {

    this.u = u
    this.v = v
    this.bent = false
    this.weight = weight
    this.color = color
    this.eulerianMarker = null
    this.hamiltonianMarker = null

}
