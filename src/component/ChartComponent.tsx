import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchExpenses } from '../api/ExpenseApi';
import { fetchCategories } from '../api/CategoryApi';
import { fetchSubcategories } from '../api/SubcategoryApi';
import { useQueries } from '@tanstack/react-query';
import { sub } from 'date-fns';

Chart.register(...registerables);

interface ChartComponentProps {
  dateFilterStartDate: string | null;
  dateFilterEndDate: string | null;
  showCategories: boolean;
  showSubcategories: boolean;
  expandCategory: any | null;
  setExpandCategory: (category: any | null) => void;
}

function ChartComponent({dateFilterStartDate, dateFilterEndDate, showCategories, showSubcategories, expandCategory, setExpandCategory}: ChartComponentProps) {
  // all hooks must come first
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [expensesQuery, categoriesQuery, subcategoriesQuery] = useQueries({
    queries: [
      { queryKey: ['expenses'], queryFn: fetchExpenses },
      { queryKey: ['categories'], queryFn: fetchCategories },
      { queryKey: ['subcategories'], queryFn: fetchSubcategories }
    ]
  });

  const [expandCategoryColor, setExpandCategoryColor] = useState<string>('#e63946');

  let data: number[] = [];  
  let labels: string[] = [];
  let filteredExpenses;

  // helper function to build chart data
  function buildChartData(items: any[], getTotal: (item: any) => number, getLabel: (item: any) => string ) {
    const paired = items.map((item) => ({
      label: getLabel(item),
      total: getTotal(item),
    }));

    const nonZero = paired.filter((p) => p.total > 0);

    return {
      data: nonZero.map((p) => p.total),
      labels: nonZero.map((p) => p.label),
    };
  }


  const isLoading = expensesQuery.isLoading || categoriesQuery.isLoading || subcategoriesQuery.isLoading;
  const isError = expensesQuery.isError || categoriesQuery.isError || subcategoriesQuery.isError;

  const expenses = expensesQuery.data;
  const categories = categoriesQuery.data;
  const subcategories = subcategoriesQuery.data;
  const categoryColors = ['#ff0000', '#8cff00', , '#ff6f00', '#ffbb00', '#fff200', '#00d9ff', '#0022ff', '#6600ff', '#ff00f7']

  if (!isLoading && !isError) {
    if (expandCategory) {
      const relevantSubcategoires = subcategories.filter((sc : any) => sc.category.categoryName === expandCategory.categoryName);
      const result = buildChartData(
        relevantSubcategoires,
        (sc) => (filteredExpenses ?? expenses)
        .filter((e: any) => e.subcategory?.subcategoryId === sc.subcategoryId)
        .reduce((sum: number, e: any) => sum + e.cost, 0),
        (sc) => sc.subcategoryName
      );
      data = result.data;
      labels = result.labels;
    } else if (showCategories) {
      const result = buildChartData(
        categories,
         (c) => expenses
         .filter((e: any) => e.subcategory?.category?.categoryId === c.categoryId)
         .reduce((sum: number, e: any) => sum + e.cost, 0),
         (c) => c.categoryName
      );
      data = result.data;
      labels = result.labels;
    } else if (showSubcategories) {
      const result = buildChartData(
        subcategories,
        (sc) => expenses
        .filter((e: any) => e.subcategory?.subcategoryId === sc.subcategoryId)
        .reduce((sum: number, e: any) => sum + e.cost, 0),
        (sc) => sc.subcategoryName
      );
      data = result.data;
      labels = result.labels;
    }
  }

if (dateFilterStartDate && dateFilterEndDate) {
  filteredExpenses = expenses.filter((expense: any) => {
    return expense.date >= dateFilterStartDate && expense.date <= dateFilterEndDate;
  });
  console.log('filtered expenses', filteredExpenses); // moved outside the callback
}

if (filteredExpenses) {
      data = categories.map((category: any) =>
        filteredExpenses
          .filter((e: any) => e.subcategory?.category?.categoryId === category.categoryId)
          .reduce((sum: number, e: any) => sum + e.cost, 0)
      );
      labels = categories.map((cat: any) => cat.categoryName);
}

  


  useEffect(() => {
    if (!canvasRef.current || !categories || !expenses || !subcategories) return; // guard here
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const backgroundColors = expandCategory ? generateShades(expandCategoryColor, data.length) : categoryColors.slice(0, data.length);
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Amount Spent',
            data: data,
            backgroundColor: backgroundColors
          },
        ],
      },
      options: {
        onClick: (event, elements) => {
          // reset view if clicked away
          if (elements.length === 0) {
            if (expandCategory) {
              setExpandCategory(null);
            }
              return;

          }
          const index = elements[0].index;
          const clickedCategory = categories[index];
          const clickedColor = categoryColors[index];

          if (!expandCategory) {
            setExpandCategory(clickedCategory);
            setExpandCategoryColor(clickedColor);
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      },
    });
    return () => {
      myChart.destroy();
    };
  }, [data, labels, expandCategory, showCategories]);

  // early returns after all hooks
  if (expensesQuery.isLoading || categoriesQuery.isLoading || subcategoriesQuery.isLoading) return <div>Loading...</div>;
  if (expensesQuery.isError) return <div>Expenses Error: {(expensesQuery.error as Error).message}</div>;
  if (categoriesQuery.isError) return <div>Categories Error: {(categoriesQuery.error as Error).message}</div>;


// helper function to generate shades of the pie slice
function generateShades(hexColor: string, count: number): string[] {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    // Spread shades from darker to lighter across the count
    const factor = 0.4 + (i / Math.max(count - 1, 1)) * 0.6; // ranges ~0.4 to 1.0
    const newR = Math.min(255, Math.round(r * factor + 255 * (1 - factor) * 0.3));
    const newG = Math.min(255, Math.round(g * factor + 255 * (1 - factor) * 0.3));
    const newB = Math.min(255, Math.round(b * factor + 255 * (1 - factor) * 0.3));
    shades.push(`rgb(${newR}, ${newG}, ${newB})`);
  }
  return shades;
}

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
}

export default ChartComponent;