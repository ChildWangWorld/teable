import { z } from 'zod';
import type { CellValueType, DbFieldType, FieldType } from '../constant';
import { FieldCore } from '../field';
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

export class BarcodeFieldCore extends FieldCore {
  declare type: FieldType.Barcode;
  declare options: IBarcodeFieldOptions;
  declare cellValueType: CellValueType.String;
  declare dbFieldType: DbFieldType.Text;
  declare isMultipleCellValue?: false;

  static defaultOptions(): IBarcodeFieldOptions {
    return {
      onlyMobileScan: false,
      allowedTypes: ['text', 'link', 'number'],
      format: 'auto',
    };
  }

  override validateOptions(): z.SafeParseReturnType<unknown, unknown> {
    return barcodeFieldOptionsSchema.safeParse(this.options);
  }

  override validateCellValue(value: unknown): z.SafeParseReturnType<unknown, unknown> {
    if (value == null) return z.string().nullable().safeParse(value);

    if (typeof value !== 'string') {
      return z.string().safeParse(value);
    }

    // Additional validation based on format
    if (this.options.format !== 'auto') {
      try {
        switch (this.options.format) {
          case 'number':
            if (isNaN(Number(value))) {
              return z
                .string()
                .refine((v) => !isNaN(Number(v)))
                .safeParse(value);
            }
            break;
          case 'link':
            return z.string().url().safeParse(value);
        }
      } catch (e) {
        return z.string().safeParse(value);
      }
    }

    return z.string().safeParse(value);
  }

  override cellValue2String(value: unknown): string {
    if (value == null) return '';
    return String(value);
  }

  override item2String(value: unknown): string {
    return this.cellValue2String(value);
  }

  override convertStringToCellValue(value: string): string | null {
    if (value === '' || value == null) {
      return null;
    }

    return value.trim();
  }

  override repair(value: unknown): string | null {
    if (value == null) return null;

    if (typeof value === 'string') {
      return this.convertStringToCellValue(value);
    }

    return String(value);
  }
}
