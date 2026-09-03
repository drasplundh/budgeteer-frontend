export interface IIncome {
    incomeId: number,
    amount: number,
    date: string,
    user: string,
    subcategory?: {
        subcategoryName: string,
        category?: {
            categoryName: string
        }
    }
}