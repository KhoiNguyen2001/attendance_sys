import React, { useEffect, useRef } from 'react';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

const Chart = ({ chartId, height, width, filter }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-manage-attendance-ftwmgww',
    });

    const renderChart = async () => {
      try {
        const chart = sdk.createChart({
          chartId: chartId,
          height: height,
          width: width,
        });

        await chart.render(chartRef.current);

        if (filter) {
          await chart.setFilter(filter);
        }
      } catch (err) {
        console.error('Error during Charts rendering.', err);
      }
    };

    renderChart();

  }, [chartId, height, width, filter]);

  return <div ref={chartRef} style={{ width, height }}></div>;
};

export default Chart;
