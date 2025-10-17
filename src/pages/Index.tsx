import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { InsightCard } from '@/components/InsightCard';
import { VegaLiteChart } from '@/components/VegaLiteChart';
import { StackedBarChart } from '@/components/StackedBarChart';
import { GroupedBarChart } from '@/components/GroupedBarChart';
import { TreemapChart } from '@/components/TreemapChart';
import { SectionNarrative } from '@/components/SectionNarrative';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingDown, AlertTriangle, ShieldAlert, Waves, Map, BarChart3, Grid3x3, Layers } from 'lucide-react';

const Index = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  // Base path for data files (handles both dev and production)
  const baseUrl = import.meta.env.BASE_URL || '/';

  // State name mapping
  const stateNameMap: Record<string, string> = {
    'NSW': 'New South Wales',
    'VIC': 'Victoria',
    'QLD': 'Queensland',
    'WA': 'Western Australia',
    'SA': 'South Australia',
    'TAS': 'Tasmania',
    'NT': 'Northern Territory',
    'ACT': 'Australian Capital Territory',
  };

  // Derived state full name for filtering
  const selectedStateFull = selectedState ? stateNameMap[selectedState] : null;

  // Map with hardcoded species data - more reliable approach
  const speciesData = {
    'New South Wales': 747,
    'Queensland': 602,
    'Western Australia': 610,
    'Victoria': 351,
    'South Australia': 314,
    'Tasmania': 229,
    'Northern Territory': 151,
    'Australian Capital Territory': 69
  };

  const mapSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    title: 'Threatened Species in Australia',
    width: 800,
    height: 500,
    projection: { 
      type: 'naturalEarth',
      scale: 1000,
      translate: [400, 250]
    },
    data: {
      url: `${baseUrl}australia_topo.json`,
      format: { type: 'topojson', feature: 'STE_2021_AUST_GDA2020' }
    },
    transform: [
      {
        calculate: `datum.properties.STE_NAME21 === 'New South Wales' ? 747 : 
                   datum.properties.STE_NAME21 === 'Queensland' ? 602 :
                   datum.properties.STE_NAME21 === 'Western Australia' ? 610 :
                   datum.properties.STE_NAME21 === 'Victoria' ? 351 :
                   datum.properties.STE_NAME21 === 'South Australia' ? 314 :
                   datum.properties.STE_NAME21 === 'Tasmania' ? 229 :
                   datum.properties.STE_NAME21 === 'Northern Territory' ? 151 :
                   datum.properties.STE_NAME21 === 'Australian Capital Territory' ? 69 : 0`,
        as: 'species_count'
      }
    ],
    mark: { 
      type: 'geoshape', 
      stroke: 'white', 
      strokeWidth: 0.5
    },
    encoding: {
      color: {
        field: 'species_count',
        type: 'quantitative',
        scale: { scheme: 'reds' },
        legend: { 
          title: 'Threatened Species', 
          orient: 'bottom', 
          direction: 'horizontal', 
          gradientLength: 300 
        }
      },
      tooltip: [
        { field: 'properties.STE_NAME21', type: 'nominal', title: 'State' },
        { field: 'species_count', type: 'quantitative', title: 'Threatened Species', format: ',.0f' }
      ]
    }
  };
  // Handle map click to update selected state
  const handleMapClick = (stateName: string | null) => {
    if (stateName) {
      // Convert full state name to abbreviation
      const stateAbbrev = Object.keys(stateNameMap).find(
        key => stateNameMap[key] === stateName
      );
      // Toggle: if already selected, deselect
      setSelectedState(prev => prev === stateAbbrev ? null : stateAbbrev || null);
    }
  };


  // Bar Chart Specification
  const barSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    width: 'container',
    height: 320,
    title: {
      text: selectedState
        ? `Threat Categories in ${stateNameMap[selectedState] || selectedState}`
        : 'Threat Categories Across All States',
      fontSize: 18,
      font: 'Inter',
      fontWeight: 600,
      color: '#4b6043',
    },
    data: {
      url: `${baseUrl}threatened_species.csv`,
    },
    transform: [
      ...(selectedGroup !== 'All' ? [{ filter: `datum.group == '${selectedGroup}'` }] : []),
      ...(selectedState ? [{ filter: `datum.state == '${stateNameMap[selectedState]}'` }] : []),
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
          labelFont: 'Inter',
          titleFont: 'Inter',
          titleFontWeight: 600,
        },
        sort: ['Critically Endangered', 'Endangered', 'Vulnerable'],
      },
      y: {
        field: 'total_count',
        type: 'quantitative',
        title: 'Number of Species',
        axis: {
          labelFont: 'Inter',
          titleFont: 'Inter',
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
      background: 'transparent',
      axis: {
        grid: true,
        gridColor: '#e5e5e5',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20 max-w-7xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Where Do Australia's Threatened Animals Live?
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-6">
            🐨 🦜 🐍 🐠
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Australia hosts some of the most diverse wildlife on Earth — but many are under threat. 
            Explore which regions are most affected and which groups face the greatest conservation risks 
            through this interactive visualisation of EPBC Act threatened species data.
          </p>
        </div>
      </header>

      {/* Filter Controls */}
      <section id="visualisation" className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <label htmlFor="group-filter" className="text-sm font-semibold text-foreground whitespace-nowrap">
                Filter by Species Group:
              </label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-64 bg-background shadow-sm" aria-label="Select species group">
                  <SelectValue placeholder="Select species group" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="All">All Groups</SelectItem>
                  <SelectItem value="Mammals">🐨 Mammals</SelectItem>
                  <SelectItem value="Birds">🦜 Birds</SelectItem>
                  <SelectItem value="Reptiles">🐍 Reptiles</SelectItem>
                  <SelectItem value="Amphibians">🐸 Amphibians</SelectItem>
                  <SelectItem value="Fish">🐠 Fish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(selectedState || selectedGroup !== 'All') && (
              <Button
                onClick={() => {
                  setSelectedState(null);
                  setSelectedGroup('All');
                }}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                Reset All Filters ✕
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Map Section */}
      <section className="container mx-auto px-6 lg:px-8 py-6 max-w-7xl">
        <SectionNarrative
          icon={Map}
          title="Where Do Threatened Species Live?"
          description="This choropleth map reveals the geographic distribution of threatened animal species across Australian states and territories. Darker shades indicate higher concentrations of at-risk wildlife."
          highlight="Queensland hosts the highest number of threatened species, followed by New South Wales and Western Australia"
        />
        
        <div className="bg-card rounded-xl p-6 lg:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
          <VegaLiteChart spec={mapSpec} onStateClick={handleMapClick} />
          <p className="text-xs text-muted-foreground italic text-center mt-4">
            Hover over states to see species counts • Click to filter other visualisations
          </p>
        </div>
      </section>

      {/* Comparative Analysis Section */}
      <section className="container mx-auto px-6 lg:px-8 py-6 max-w-7xl">
        <SectionNarrative
          icon={BarChart3}
          title="How Do Threat Levels Differ Across Regions?"
          description="Understanding the composition of threat categories helps identify which states face the most severe conservation challenges. The stacked bar chart shows the proportional breakdown of Critically Endangered, Endangered, and Vulnerable species."
          highlight="Victoria shows a higher proportion of 'Vulnerable' species, indicating early-stage threats requiring immediate intervention"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stacked Bar Chart */}
          <div className="bg-card rounded-xl p-6 lg:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <StackedBarChart selectedGroup={selectedGroup} selectedStateName={selectedStateFull} />
            <p className="text-xs text-muted-foreground italic text-center mt-4">
              Normalised view showing threat composition by state
            </p>
          </div>

          {/* Original Bar Chart */}
          <div className="bg-card rounded-xl p-6 lg:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <VegaLiteChart spec={barSpec} />
            <p className="text-xs text-muted-foreground italic text-center mt-4">
              Conservation status distribution {selectedState ? `in ${stateNameMap[selectedState]}` : 'across Australia'}
            </p>
          </div>
        </div>
      </section>

      {/* Animal Groups Analysis Section */}
      <section className="container mx-auto px-6 lg:px-8 py-6 max-w-7xl">
        <SectionNarrative
          icon={Layers}
          title="Which Animal Groups Are Most at Risk?"
          description="Different animal groups face varying levels of threat across Australia. Mammals and birds dominate the threatened species lists, but reptiles and amphibians also show significant vulnerability in specific regions."
          highlight="Mammals account for the largest proportion of threatened species, followed by birds and reptiles"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grouped Bar Chart */}
          <div className="bg-card rounded-xl p-6 lg:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <GroupedBarChart selectedGroup={selectedGroup} selectedStateName={selectedStateFull} />
            <p className="text-xs text-muted-foreground italic text-center mt-4">
              Grouped comparison of animal groups by threat status
            </p>
          </div>

          {/* Treemap/Heatmap */}
          <div className="bg-card rounded-xl p-6 lg:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <TreemapChart selectedGroup={selectedGroup} selectedStateName={selectedStateFull} />
            <p className="text-xs text-muted-foreground italic text-center mt-4">
              Heatmap showing species distribution across group and status combinations
            </p>
          </div>
        </div>
      </section>

      {/* State Selection Guide */}
      <section className="container mx-auto px-6 lg:px-8 py-6 max-w-7xl">
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Explore by State or Territory
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'].map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state === selectedState ? null : state)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md ${
                  selectedState === state
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
                aria-label={`Filter by ${state}`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Key Insights Section */}
      <section id="insights" className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {selectedState ? `Conservation Snapshot: ${stateNameMap[selectedState] || selectedState}` : 'Key Conservation Insights'}
          </h2>
          <p className="text-muted-foreground">
            Understanding regional patterns helps prioritise conservation efforts
          </p>
        </div>

        {!selectedState ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard
              icon={<TrendingDown className="h-6 w-6" />}
              state="Queensland"
              abbrev="QLD"
              description="Highest number of threatened species reflecting vast biodiversity hotspots and unique tropical ecosystems under pressure."
              color="bg-secondary/10 text-secondary border-secondary/20"
            />
            <InsightCard
              icon={<AlertTriangle className="h-6 w-6" />}
              state="New South Wales"
              abbrev="NSW"
              description="High species diversity with significant urban development impact, particularly affecting coastal and woodland habitats."
              color="bg-primary/10 text-primary border-primary/20"
            />
            <InsightCard
              icon={<ShieldAlert className="h-6 w-6" />}
              state="Western Australia"
              abbrev="WA"
              description="Large number of endemic species face threats from mining activities and introduced predators in remote regions."
              color="bg-accent/10 text-accent border-accent/20"
            />
            <InsightCard
              icon={<Waves className="h-6 w-6" />}
              state="Tasmania"
              abbrev="TAS"
              description="Island ecosystems host unique species vulnerable to climate change and invasive species introduction."
              color="bg-primary/10 text-primary border-primary/20"
            />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 border-l-4 border-primary shadow-lg">
            <div className="prose prose-lg max-w-none">
              {selectedState === 'QLD' && (
                <p className="text-foreground leading-relaxed">
                  Queensland hosts the highest number of threatened species across Australia, reflecting its extraordinary biodiversity from tropical rainforests to the Great Barrier Reef. The state's unique ecosystems face mounting pressure from habitat clearing, climate change, and coastal development, making it a critical conservation priority.
                </p>
              )}
              {selectedState === 'NSW' && (
                <p className="text-foreground leading-relaxed">
                  New South Wales shows high species diversity with particular vulnerability in coastal regions and western woodlands. Urban expansion along the coast and agricultural intensification inland have created significant habitat fragmentation, threatening both terrestrial and marine species.
                </p>
              )}
              {selectedState === 'WA' && (
                <p className="text-foreground leading-relaxed">
                  Western Australia's vast landmass contains numerous endemic species found nowhere else on Earth. Mining operations, introduced predators like foxes and cats, and changing rainfall patterns pose severe threats to these unique desert and southwest forest ecosystems.
                </p>
              )}
              {selectedState === 'VIC' && (
                <p className="text-foreground leading-relaxed">
                  Victoria's intensive agricultural landscape and dense urban centers have transformed much of the state's original habitat. Grassland species and wetland fauna are particularly vulnerable, with the "Vulnerable" category indicating species at early-stage risk requiring immediate conservation intervention.
                </p>
              )}
              {selectedState === 'TAS' && (
                <p className="text-foreground leading-relaxed">
                  Tasmania's island isolation has produced unique species assemblages highly sensitive to environmental change. Climate warming, invasive species, and disease (like the devastating Tasmanian Devil facial tumor) create compounding threats to this irreplaceable biodiversity.
                </p>
              )}
              {selectedState === 'SA' && (
                <p className="text-foreground leading-relaxed">
                  South Australia's predominantly arid and semi-arid environments host species specially adapted to harsh conditions. Increasing temperatures, prolonged droughts, and habitat degradation from pastoral activities threaten these resilient but vulnerable populations.
                </p>
              )}
              {selectedState === 'NT' && (
                <p className="text-foreground leading-relaxed">
                  The Northern Territory's remote tropical and desert ecosystems face threats from altered fire management, feral herbivores, and predatory mammals. Indigenous land management practices offer hope for conservation of unique monsoonal and spinifex grassland species.
                </p>
              )}
              {selectedState === 'ACT' && (
                <p className="text-foreground leading-relaxed">
                  Despite its small size, the Australian Capital Territory contains important habitat remnants within an urbanised landscape. Grassland birds and woodland mammals face pressure from development, requiring careful management of the urban-nature interface.
                </p>
              )}
            </div>
          </div>
        )}
      </section>


      {/* Data Source Section */}
      <section id="data" className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
        <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">About This Visualisation</h2>
          <div className="space-y-4 text-foreground/80">
            <p className="leading-relaxed">
              This interactive data visualisation was created for FIT3179 Data Visualisation 2 at Monash University. 
              It explores the geographic distribution and conservation status of threatened animal species across Australian states and territories 
              using data from the Environment Protection and Biodiversity Conservation (EPBC) Act Threatened Species Lists.
            </p>
            <div className="border-l-4 border-primary pl-6 py-2">
              <p className="text-sm font-semibold text-foreground mb-1">Data Source</p>
              <p className="text-sm">
                Australian Government – Department of Climate Change, Energy, the Environment and Water (DCCEEW)
                <br />
                EPBC Act Threatened Species Lists (2025)
              </p>
            </div>
            <div className="border-l-4 border-accent pl-6 py-2">
              <p className="text-sm font-semibold text-foreground mb-1">Visualisation Technique</p>
              <p className="text-sm">
                Built with Vega-Lite for interactive data exploration. Features include dynamic filtering, 
                state-based drill-down analysis, and responsive design for multiple devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">FIT3179 Data Visualisation 2</strong> • Monash University • 2025 • <strong>Aylin Vahabova</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Created with Vega-Lite, React, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
