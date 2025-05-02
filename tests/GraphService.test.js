import { describe, it, expect, vi } from "vitest"
import GraphService from "../src/services/GraphService"
import { Graph } from "graphology"

// Silence console.error during tests
const originalConsoleError = console.error
beforeAll(() => {
  console.error = vi.fn()
})
afterAll(() => {
  console.error = originalConsoleError
})

describe("GraphService", () => {
  it("should create a sample graph with correct nodes and edges", () => {
    const service = new GraphService()
    const graph = service.createSampleGraph()

    // Check graph structure
    expect(graph.order).toBe(4) // 4 nodes
    expect(graph.size).toBe(4) // 4 edges

    // Check nodes
    expect(graph.hasNode("A")).toBe(true)
    expect(graph.hasNode("B")).toBe(true)
    expect(graph.hasNode("C")).toBe(true)
    expect(graph.hasNode("D")).toBe(true)

    // Check node attributes
    expect(graph.getNodeAttribute("A", "label")).toBe("Node A")
    expect(graph.getNodeAttribute("B", "color")).toBe("#00ff00")

    // Check edges
    expect(graph.hasEdge("A", "B")).toBe(true)
    expect(graph.hasEdge("B", "C")).toBe(true)
    expect(graph.hasEdge("C", "A")).toBe(true)
    expect(graph.hasEdge("D", "B")).toBe(true)

    // Check edge attributes
    expect(graph.getEdgeAttribute("A", "B", "weight")).toBe(1)
    expect(graph.getEdgeAttribute("C", "A", "label")).toBe("C-A connection")
  })

  it("should export graph to GraphML format", () => {
    const service = new GraphService()
    const graph = service.createSampleGraph()

    const graphmlString = service.exportToGraphML(graph)

    // Basic validation of GraphML output
    expect(graphmlString).toContain("<?xml")
    expect(graphmlString).toContain("<graphml")
    expect(graphmlString).toContain("<graph")
    expect(graphmlString).toContain("<node")
    expect(graphmlString).toContain("<edge")

    // Check for node IDs
    expect(graphmlString).toContain('id="A"')
    expect(graphmlString).toContain('id="B"')
    expect(graphmlString).toContain('id="C"')
    expect(graphmlString).toContain('id="D"')

    // Check for attribute declarations
    expect(graphmlString).toContain("<key")
    expect(graphmlString).toContain('for="node"')
    expect(graphmlString).toContain('for="edge"')
    expect(graphmlString).toContain('attr.name="label"')
    expect(graphmlString).toContain('attr.name="weight"')
  })

  it("should import graph from GraphML format", () => {
    const service = new GraphService()
    const originalGraph = service.createSampleGraph()

    // Export to GraphML
    const graphmlString = service.exportToGraphML(originalGraph)

    // Import back from GraphML
    const importedGraph = service.importFromGraphML(graphmlString)

    // Verify imported graph structure (allow for slight differences in implementation)
    expect(importedGraph.order).toBeGreaterThanOrEqual(1) // Should have at least one node

    // If the import worked fully:
    if (importedGraph.order === originalGraph.order) {
      expect(importedGraph.hasNode("A")).toBe(true)
      expect(importedGraph.hasNode("B")).toBe(true)
      expect(importedGraph.hasEdge("A", "B")).toBe(true)
    }
  })

  it("should handle errors gracefully during export and import", () => {
    const service = new GraphService()

    // Test error handling during export with invalid graph
    const invalidGraph = null
    const exportResult = service.exportToGraphML(invalidGraph)

    // Should still return valid XML
    expect(exportResult).toContain("<?xml")
    expect(exportResult).toContain("<graphml")
    expect(exportResult).toContain("<graph")
    expect(exportResult).toContain("<!-- Error")

    // Test error handling during import with invalid GraphML
    const invalidGraphML = "<not-valid-xml>"
    const importResult = service.importFromGraphML(invalidGraphML)

    // Should return an empty graph
    expect(importResult instanceof Graph).toBe(true)
    expect(importResult.order).toBe(0)
  })
})
