import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchExpenses } from '../api/ExpenseApi';
import { fetchCategories } from '../api/CategoryApi';
import { useQueries } from '@tanstack/react-query';

Chart.register(...registerables);

function ChartComponent() {
  // all hooks must come first
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [expensesQuery, categoriesQuery] = useQueries({
    queries: [
      { queryKey: ['expenses'], queryFn: fetchExpenses },
      { queryKey: ['categories'], queryFn: fetchCategories }
    ]
  });



  useEffect(() => {
     if (!canvasRef.current || !categories || !expenses) return; // guard here
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Amount Spent',
            data: data,
            backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 
              'orange', 'white', 'brown', 'black', '#5ae6e8',
            '#ffd35c'],
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      },
    });
    return () => {
      myChart.destroy();
    };
  }, []);

  // early returns after all hooks
  if (expensesQuery.isLoading || categoriesQuery.isLoading) return <div>Loading...</div>;
  if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
  if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;

  const expenses = expensesQuery.data;
  const categories = categoriesQuery.data;

  const data = categories.map((category: any) => {
    return expenses
    .filter((e: any) => e.category?.categoryId === category.categoryId)
    .reduce((sum: number, e: any) => sum + e.cost, 0);
  })
  const labels = categories.map((cat: any) => cat.categoryName)


  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default ChartComponent;