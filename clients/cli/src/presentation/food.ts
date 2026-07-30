import type { NutritionFacts, Product } from '@weight-tracker/api-client';
import chalk from 'chalk';
import Table from 'cli-table3';
import type { CliOutput } from '../output';

export function printProduct(output: CliOutput, product: Product): void {
  output.print();
  output.print(chalk.bold(product.name ?? 'Product'));
  output.print();
  printField(output, 'Code', product.code);
  printField(output, 'Quantity', product.quantity);
  printField(output, 'Serving size', product.servingSize);
  printField(output, 'Ingredients', product.ingredients);
  printField(output, 'Image', product.imageUrl);

  printNutrition(output, 'Nutrition per 100', product.nutrition?.per100);
  printNutrition(
    output,
    'Nutrition per serving',
    product.nutrition?.perServing,
  );
  output.print();
}

function printNutrition(
  output: CliOutput,
  title: string,
  facts: NutritionFacts | null | undefined,
): void {
  if (!facts) {
    return;
  }

  const table = createNutritionTable(facts);

  if (table.length === 0) {
    return;
  }

  output.print();
  output.print(chalk.bold(formatNutritionTitle(title, facts)));
  output.print(table.toString());
}

function createNutritionTable(facts: NutritionFacts): Table.Table {
  const table = new Table({
    colAligns: ['left', 'right'],
    head: ['Nutrient', 'Value'],
  });

  addRow(table, 'Energy', facts.energyKcal, 'kcal');
  addRow(table, 'Energy', facts.energyKj, 'kJ');
  addRow(table, 'Fat', facts.fatG, 'g');
  addRow(table, 'Saturated fat', facts.saturatedFatG, 'g');
  addRow(table, 'Carbohydrates', facts.carbohydratesG, 'g');
  addRow(table, 'Sugars', facts.sugarsG, 'g');
  addRow(table, 'Added sugars', facts.addedSugarsG, 'g');
  addRow(table, 'Fiber', facts.fiberG, 'g');
  addRow(table, 'Protein', facts.proteinG, 'g');
  addRow(table, 'Salt', facts.saltG, 'g');

  return table;
}

function addRow(
  table: Table.Table,
  label: string,
  value: number | null | undefined,
  unit: string,
): void {
  if (value != null) {
    table.push([label, `${value} ${unit}`]);
  }
}

function formatNutritionTitle(title: string, facts: NutritionFacts): string {
  if (facts.referenceAmount == null && !facts.referenceUnit) {
    return title;
  }

  const reference = [facts.referenceAmount, facts.referenceUnit]
    .filter(value => value != null && value !== '')
    .join(' ');

  if (
    title === 'Nutrition per 100' &&
    facts.referenceAmount != null &&
    facts.referenceUnit
  ) {
    return `Nutrition per ${reference}`;
  }

  return `${title} (${reference})`;
}

function printField(
  output: CliOutput,
  label: string,
  value: string | null | undefined,
): void {
  if (value) {
    output.print(`${chalk.bold(`${label}:`)} ${value}`);
  }
}
