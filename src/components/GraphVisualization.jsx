import { useEffect, useRef } from "react"

const GraphVisualization = ({ graph }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!graph || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Define node positions
    const nodePositions = {
      A: { x: 100, y: 100, radius: 20, color: "#ff0000" },
      B: { x: 300, y: 100, radius: 30, color: "#00ff00" },
      C: { x: 200, y: 250, radius: 15, color: "#0000ff" },
      D: { x: 400, y: 200, radius: 18, color: "#ffff00" },
    }

    // Define edges
    const edges = [
      { source: "A", target: "B", weight: 1 },
      { source: "B", target: "C", weight: 2 },
      { source: "C", target: "A", weight: 3 },
      { source: "D", target: "B", weight: 4 },
    ]

    // Draw edges
    edges.forEach((edge) => {
      const source = nodePositions[edge.source]
      const target = nodePositions[edge.target]

      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.strokeStyle = "#999999"
        ctx.lineWidth = Math.max(1, edge.weight)
        ctx.stroke()

        // Edge weight label
        const labelX = (source.x + target.x) / 2
        const labelY = (source.y + target.y) / 2 - 10
        ctx.fillStyle = "#666666"
        ctx.font = "12px Arial"
        ctx.fillText(`weight: ${edge.weight}`, labelX, labelY)
      }
    })

    // Draw nodes
    Object.entries(nodePositions).forEach(([id, node]) => {
      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      ctx.fillStyle = "#000000"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(id, node.x, node.y + 5)

      // Node description
      ctx.font = "12px Arial"
      const attributes = graph.getNodeAttributes(id)
      ctx.fillText(attributes.label || id, node.x, node.y + node.radius + 15)
    })
  }, [graph])

  return (
    <div className="graph-visualization">
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f8f8f8",
        }}
      />
      <div className="graph-legend">
        <p>• Red node (A) connects to green node (B) and blue node (C)</p>
        <p>• Green node (B) connects to blue node (C) and yellow node (D)</p>
        <p>• Blue node (C) connects back to red node (A)</p>
        <p>• Yellow node (D) connects to green node (B)</p>
      </div>
    </div>
  )
}

export default GraphVisualization
