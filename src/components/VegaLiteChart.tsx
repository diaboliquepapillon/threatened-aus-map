import { useEffect, useRef } from 'react';
import vegaEmbed from 'vega-embed';

interface VegaLiteChartProps {
  spec: any;
  className?: string;
  onStateClick?: (stateName: string | null) => void;
}

export const VegaLiteChart = ({ spec, className = "", onStateClick }: VegaLiteChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      console.log('Embedding chart with spec:', spec);
      vegaEmbed(containerRef.current, spec, {
        actions: {
          export: true,
          source: false,
          compiled: false,
          editor: false,
        },
        renderer: 'svg',
      }).then((result) => {
        console.log('Chart embedded successfully:', result);
        if (onStateClick && result.view) {
          // Listen for clicks on the visualization
          result.view.addEventListener('click', (event: any, item: any) => {
            const stateName =
              item?.datum?.state ||
              item?.datum?.properties?.STE_NAME21 ||
              item?.datum?.properties?.STATE_NAME ||
              item?.datum?.properties?.state ||
              null;
            if (stateName) {
              onStateClick(stateName);
            }
          });
        }
      }).catch(error => {
        console.error('Error embedding visualization:', error);
        console.error('Full error details:', error);
      });
    }
  }, [spec, onStateClick]);

  return <div ref={containerRef} className={className} style={{ width: '100%' }} />;
};
