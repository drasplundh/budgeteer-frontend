import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchExpenses } from '../api/ExpenseApi';
import { fetchCategories } from '../api/CategoryApi';
import { fetchSubcategories } from '../api/SubcategoryApi';
import { useQueries } from '@tanstack/react-query';

Chart.register(...registerables);

interface ChartComponentProps {
  showCategories: boolean;
}

function ChartComponent({showCategories}: ChartComponentProps) {
  // all hooks must come first
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [expensesQuery, categoriesQuery, subcategoriesQuery] = useQueries({
    queries: [
      { queryKey: ['expenses'], queryFn: fetchExpenses },
      { queryKey: ['categories'], queryFn: fetchCategories },
      { queryKey: ['subcategories'], queryFn: fetchSubcategories }
    ]
  });


  const isCategories = false;
  const isSubcategories = true;
  let data: number[] = [];  
  let labels: string[] = [];

  useEffect(() => {
     if (!canvasRef.current || !categories || !expenses || !subcategories) return; // guard here
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
  }, [data, labels]);

  // early returns after all hooks
  if (expensesQuery.isLoading || categoriesQuery.isLoading || subcategoriesQuery.isLoading) return <div>Loading...</div>;
  if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
  if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;


  const expenses = expensesQuery.data;
  const categories = categoriesQuery.data;
  const subcategories = subcategoriesQuery.data;

  // toggle passed from homepage component
  if (showCategories) {
    data = categories.map((category: any) => {
      return expenses
      .filter((e: any) => e.subcategory?.category?.categoryId === category.categoryId)
      .reduce((sum: number, e: any) => sum + e.cost, 0);
    })
    labels = categories.map((cat: any) => cat.categoryName)
  } else {
    data = subcategories.map((subcategory: any) => {
      return expenses
      .filter((e: any) => e.subcategory?.subcategoryId === subcategory.subcategoryId)
      .reduce((sum: number, e: any) => sum + e.cost, 0);  
    })
    labels = subcategories.map((subcat: any) => subcat.subcategoryName)
  }


  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default ChartComponent;