import { useEffect, useRef } from 'react';
import vegaEmbed from 'vega-embed';

interface VegaLiteChartProps {
  spec: any;
  className?: string;
}

export const VegaLiteChart = ({ spec, className = "" }: VegaLiteChartProps) => {
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
      });
    }
  }, [spec]);

  return <div ref={containerRef} className={className} style={{ width: '100%' }} />;
};
