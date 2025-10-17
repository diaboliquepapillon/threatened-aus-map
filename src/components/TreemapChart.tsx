import { VegaLiteChart } from './VegaLiteChart';

interface TreemapChartProps {
  selectedGroup: string;
  selectedStateName: string | null;
}

export const TreemapChart = ({ selectedGroup, selectedStateName }: TreemapChartProps) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.4.1.json',
    width: 'container',
    height: 320,
    title: {
      text: 'Species Distribution: Group × Status',
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
      type: 'rect',
      tooltip: true,
      stroke: '#fff',
      strokeWidth: 2,
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
        field: 'status',
        type: 'nominal',
        title: 'Conservation Status',
        axis: {
          labelFont: 'Inter',
          titleFont: 'Inter',
          titleFontWeight: 600,
        },
        sort: ['Critically Endangered', 'Endangered', 'Vulnerable'],
      },
      color: {
        field: 'total_count',
        type: 'quantitative',
        title: 'Species Count',
        scale: {
          scheme: 'orangered',
        },
        legend: {
          titleFont: 'Inter',
          titleFontWeight: 600,
          labelFont: 'Inter',
        },
      },
      tooltip: [
        { field: 'group', type: 'nominal', title: 'Animal Group' },
        { field: 'status', type: 'nominal', title: 'Status' },
        { field: 'total_count', type: 'quantitative', title: 'Count' },
      ],
    },
    config: {
      background: 'transparent',
      axis: {
        grid: false,
      },
    },
  };

  return <VegaLiteChart spec={spec} />;
};
