import { z } from 'zod';
import type { CellValueType, DbFieldType, FieldType } from '../constant';
import { commonOptionsSchema } from '../field.schema';

// Barcode format validation schema
const barcodeFormatSchema = z.enum(['auto', 'text', 'link', 'number']).openapi({
  title: 'Barcode Format',
  description: 'Format for interpreting barcode data',
});

// Barcode data type validation schema
const barcodeDataTypeSchema = z.enum(['text', 'link', 'number']).openapi({
  title: 'Barcode Data Type',
  description: 'Supported data types for barcode values',
});

// Barcode field options schema
export const barcodeFieldOptionsSchema = commonOptionsSchema
  .extend({
    onlyMobileScan: z.boolean().optional().default(false),
    defaultValue: z.string().optional(),
    allowedTypes: z
      .array(barcodeDataTypeSchema)
      .min(1)
      .optional()
      .default(['text', 'link', 'number']),
    format: barcodeFormatSchema.optional().default('auto'),
  })
  .strict()
  .openapi({
    title: 'Barcode Field Options Schema',
    description:
      'Schema for barcode field options including mobile scanning and data type settings',
  });

export type IBarcodeFieldOptions = z.infer<typeof barcodeFieldOptionsSchema>;

export const barcodeFieldOptionsRoSchema = barcodeFieldOptionsSchema;
export type IBarcodeFieldOptionsRo = z.infer<typeof barcodeFieldOptionsRoSchema>;

export interface IBarcodeField {
  type: FieldType.Barcode;
  options: IBarcodeFieldOptions;
  cellValueType: CellValueType.String;
  dbFieldType: DbFieldType.Text;
  isMultipleCellValue?: false;
}
