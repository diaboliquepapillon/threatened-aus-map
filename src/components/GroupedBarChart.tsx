import { VegaLiteChart } from './VegaLiteChart';

interface GroupedBarChartProps {
  selectedGroup: string;
  selectedStateName: string | null;
}

export const GroupedBarChart = ({ selectedGroup, selectedStateName }: GroupedBarChartProps) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    width: 'container',
    height: 320,
    title: {
      text: selectedStateName 
        ? `Animal Groups in ${selectedStateName}` 
        : 'Animal Groups Across Australia',
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
        groupby: ['group', 'status'],
      },
    ],
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'group',
        type: 'nominal',
        title: 'Animal Group',
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
        axis: {
          labelFont: 'Inter',
          titleFont: 'Inter',
          titleFontWeight: 600,
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
      xOffset: { field: 'status' },
      tooltip: [
        { field: 'group', type: 'nominal', title: 'Animal Group' },
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
