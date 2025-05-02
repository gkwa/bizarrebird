import { useState, useEffect } from "react"
import GraphVisualization from "./components/GraphVisualization"
import GraphService from "./services/GraphService"
import "./App.css"

function App() {
  const [graph, setGraph] = useState(null)
  const [graphmlOutput, setGraphmlOutput] = useState("")
  const [exportStatus, setExportStatus] = useState({ success: true, message: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initGraph = async () => {
      try {
        const graphService = new GraphService()
        const newGraph = graphService.createSampleGraph()
        setGraph(newGraph)

        // Generate GraphML output
        const graphmlString = graphService.exportToGraphML(newGraph)

        // Check if the export was successful
        if (graphmlString.includes("<!-- Error")) {
          const errorMsg = graphmlString.match(/<!-- Error: (.*?) -->/)[1]
          setExportStatus({
            success: false,
            message: `GraphML export encountered an issue: ${errorMsg}`,
          })
        } else {
          setExportStatus({
            success: true,
            message: "GraphML export successful",
          })
        }

        setGraphmlOutput(graphmlString)
        setLoading(false)
      } catch (error) {
        console.error("Error initializing graph:", error)
        setExportStatus({
          success: false,
          message: `Error initializing graph: ${error.message}`,
        })
        setLoading(false)
      }
    }

    initGraph()
  }, [])

  const handleDownload = () => {
    try {
      // Make sure we have content to download
      if (!graphmlOutput || graphmlOutput.trim() === "") {
        alert("No GraphML content available to download!")
        return
      }

      const blob = new Blob([graphmlOutput], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "bizarrebird-graph.graphml"
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error("Error downloading GraphML:", error)
      alert("Error creating download file. See console for details.")
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>BizarreBird Graph Tool</h1>
        <p>A simple graph visualization tool using graphology</p>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading graph data...</div>
        ) : (
          <>
            <section className="graph-section">
              <h2>Graph Visualization</h2>
              <GraphVisualization graph={graph} />
            </section>

            <section className="export-section">
              <h2>GraphML Export</h2>

              {/* Status message */}
              {exportStatus.message && (
                <div className={`status-message ${exportStatus.success ? "success" : "error"}`}>
                  {exportStatus.message}
                </div>
              )}

              <pre className="graphml-output">{graphmlOutput}</pre>

              <button onClick={handleDownload} disabled={!exportStatus.success}>
                Download GraphML
              </button>

              {!exportStatus.success && (
                <p className="help-text">
                  Export encountered an issue. Please check the GraphML content and try again.
                </p>
              )}
            </section>
          </>
        )}
      </main>

      <footer>
        <p>Created with graphology, vite, and react</p>
      </footer>
    </div>
  )
}

export default App
