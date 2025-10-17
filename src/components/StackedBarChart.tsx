import { VegaLiteChart } from './VegaLiteChart';

interface StackedBarChartProps {
  selectedGroup: string;
  selectedStateName: string | null;
}

export const StackedBarChart = ({ selectedGroup, selectedStateName }: StackedBarChartProps) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    width: 'container',
    height: 320,
    title: {
      text: 'Threat Level Composition by State',
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
      ...(selectedStateName ? [{ filter: `datum.state == '${selectedStateName}'` }] : []),
      {
        aggregate: [{ op: 'sum', field: 'count', as: 'total_count' }],
        groupby: ['state', 'status'],
      },
    ],
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'state',
        type: 'nominal',
        title: 'State',
        axis: {
          labelAngle: -45,
          labelFont: 'Inter',
          titleFont: 'Inter',
          titleFontWeight: 600,
        },
      },
      y: {
        field: 'total_count',
        type: 'quantitative',
        title: 'Number of Species',
        stack: 'normalize',
        axis: {
          labelFont: 'Inter',
          titleFont: 'Inter',
          titleFontWeight: 600,
          format: '%',
        },
      },
      color: {
        field: 'status',
        type: 'nominal',
        title: 'Conservation Status',
        scale: {
          domain: ['Critically Endangered', 'Endangered', 'Vulnerable'],
          range: ['#b30000', '#fc8d59', '#fcbf49'],
        },
        legend: {
          titleFont: 'Inter',
          titleFontWeight: 600,
          labelFont: 'Inter',
        },
      },
      tooltip: [
        { field: 'state', type: 'nominal', title: 'State' },
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

  return <VegaLiteChart spec={spec} />;
};
