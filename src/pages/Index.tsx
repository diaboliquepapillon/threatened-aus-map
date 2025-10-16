import { useState } from 'react';
import { VegaLiteChart } from '@/components/VegaLiteChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Choropleth Map Specification
  const mapSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 700,
    height: 450,
    title: {
      text: 'Threatened Species Count by State',
      fontSize: 18,
      font: 'Open Sans',
      fontWeight: 600,
      color: '#3d2817',
    },
    data: {
      url: '/threatened_species.csv',
    },
    transform: [
      ...(selectedGroup !== 'All' ? [{ filter: `datum.group == '${selectedGroup}'` }] : []),
      {
        aggregate: [{ op: 'sum', field: 'count', as: 'total_count' }],
        groupby: ['state'],
      },
    ],
    layer: [
      {
        mark: {
          type: 'geoshape',
          stroke: '#8b6f47',
          strokeWidth: 1,
          cursor: 'pointer',
        },
        encoding: {
          color: {
            field: 'total_count',
            type: 'quantitative',
            scale: {
              scheme: 'oranges',
              domain: [0, 400],
            },
            legend: {
              title: 'Species Count',
              titleFont: 'Open Sans',
              labelFont: 'Open Sans',
            },
          },
          tooltip: [
            { field: 'state', type: 'nominal', title: 'State' },
            { field: 'total_count', type: 'quantitative', title: 'Threatened Species' },
          ],
        },
      },
    ],
    projection: {
      type: 'mercator',
    },
    config: {
      view: { stroke: null },
      background: '#f7f4ef',
    },
  };

  // Bar Chart Specification
  const barSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 700,
    height: 300,
    title: {
      text: selectedState
        ? `Threat Categories in ${selectedState}`
        : 'Threat Categories Across All States',
      fontSize: 16,
      font: 'Open Sans',
      fontWeight: 600,
      color: '#3d2817',
    },
    data: {
      url: '/threatened_species.csv',
    },
    transform: [
      ...(selectedGroup !== 'All' ? [{ filter: `datum.group == '${selectedGroup}'` }] : []),
      ...(selectedState ? [{ filter: `datum.state == '${selectedState}'` }] : []),
      {
        aggregate: [{ op: 'sum', field: 'count', as: 'total_count' }],
        groupby: ['status'],
      },
    ],
    mark: {
      type: 'bar',
      cornerRadiusEnd: 4,
      cursor: 'pointer',
    },
    encoding: {
      x: {
        field: 'status',
        type: 'nominal',
        title: 'Conservation Status',
        axis: {
          labelAngle: -45,
          labelFont: 'Open Sans',
          titleFont: 'Open Sans',
          titleFontWeight: 600,
        },
        sort: ['Critically Endangered', 'Endangered', 'Vulnerable'],
      },
      y: {
        field: 'total_count',
        type: 'quantitative',
        title: 'Number of Species',
        axis: {
          labelFont: 'Open Sans',
          titleFont: 'Open Sans',
          titleFontWeight: 600,
        },
      },
      color: {
        field: 'status',
        type: 'nominal',
        scale: {
          domain: ['Critically Endangered', 'Endangered', 'Vulnerable'],
          range: ['#d62828', '#f77f00', '#fcbf49'],
        },
        legend: null,
      },
      tooltip: [
        { field: 'status', type: 'nominal', title: 'Status' },
        { field: 'total_count', type: 'quantitative', title: 'Count' },
      ],
    },
    config: {
      view: { stroke: null },
      background: '#ffffff',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-8 py-12 max-w-6xl">
          <h1 className="text-5xl font-bold text-foreground mb-3">
            Where Do Australia's Threatened Animals Live?
          </h1>
          <p className="text-2xl text-muted-foreground">
            🐨 🦜 🐍 🐠
          </p>
        </div>
      </header>

      {/* Introduction */}
      <section className="container mx-auto px-8 py-8 max-w-6xl">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <p className="text-lg leading-relaxed text-foreground">
            Australia is home to extraordinary biodiversity, yet many species face extinction due to
            habitat loss, climate change, and invasive predators. This interactive visualisation
            explores the geographic distribution of threatened animals across Australian states and
            territories, revealing patterns in conservation status under the EPBC Act. Discover which
            regions host the most vulnerable species and how threat levels vary by animal group.
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="container mx-auto px-8 py-4 max-w-6xl">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <label htmlFor="group-filter" className="text-sm font-semibold text-foreground">
              Filter by Species Group:
            </label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-64 bg-background">
                <SelectValue placeholder="Select species group" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="All">All Groups</SelectItem>
                <SelectItem value="Mammals">Mammals</SelectItem>
                <SelectItem value="Birds">Birds</SelectItem>
                <SelectItem value="Reptiles">Reptiles</SelectItem>
                <SelectItem value="Amphibians">Amphibians</SelectItem>
                <SelectItem value="Fish">Fish</SelectItem>
              </SelectContent>
            </Select>
            {selectedState && (
              <div className="ml-auto">
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Clear State Filter ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Visualization */}
      <section className="container mx-auto px-8 py-6 max-w-6xl">
        <div className="bg-card rounded-lg p-8 shadow-sm">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground italic">
              Note: Map visualization requires TopoJSON data. Click states in the bar chart below to filter.
            </p>
          </div>
        </div>
      </section>

      {/* Bar Chart Visualization */}
      <section className="container mx-auto px-8 py-6 max-w-6xl">
        <div className="bg-card rounded-lg p-8 shadow-sm">
          <VegaLiteChart spec={barSpec} />
        </div>
      </section>

      {/* Insights */}
      <section className="container mx-auto px-8 py-8 max-w-6xl">
        <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent">
          <h2 className="text-xl font-semibold text-foreground mb-3">Key Insight</h2>
          <p className="text-foreground leading-relaxed">
            Queensland hosts the highest number of threatened species overall, reflecting its vast
            biodiversity hotspots and unique tropical ecosystems. The "Vulnerable" category dominates
            across all states, indicating early-stage conservation concerns that, with intervention,
            may prevent species from becoming critically endangered.
          </p>
        </div>
      </section>

      {/* State Selection Guide */}
      <section className="container mx-auto px-8 py-6 max-w-6xl">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Explore by State</h3>
          <div className="grid grid-cols-4 gap-3">
            {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'].map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state === selectedState ? null : state)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  selectedState === state
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-8 py-8 max-w-6xl">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Data:</strong> Australian Government – Department of Climate Change, Energy, the
            Environment and Water (DCCEEW) – EPBC Act Threatened Species Lists
            <br />
            <strong>Author:</strong> FIT3179 Student | 2025 | FIT3179 Data Visualisation 2
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
