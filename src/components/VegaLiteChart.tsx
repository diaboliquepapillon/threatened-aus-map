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
      vegaEmbed(containerRef.current, spec, {
        actions: {
          export: true,
          source: false,
          compiled: false,
          editor: false,
        },
        renderer: 'svg',
      }).then((result) => {
        if (onStateClick && result.view) {
          // Listen for clicks on the visualization
          result.view.addEventListener('click', (event: any, item: any) => {
            if (item && item.datum && item.datum.properties && item.datum.properties.STE_NAME16) {
              onStateClick(item.datum.properties.STE_NAME16);
            }
          });
        }
      });
    }
  }, [spec, onStateClick]);

  return <div ref={containerRef} className={className} style={{ width: '100%' }} />;
};
