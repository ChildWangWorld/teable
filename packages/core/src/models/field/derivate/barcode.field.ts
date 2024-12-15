import { z } from 'zod';
import { FieldType } from '../constant';
import type { CellValueType, DbFieldType } from '../constant';
import { FieldCore } from '../field';
import { unionFormattingSchema } from '../formatting';
import { unionShowAsSchema } from '../show-as';

const barcodeFormatSchema = z.enum(['auto', 'text', 'link', 'number']);
const barcodeDataTypeSchema = z.enum(['text', 'link', 'number']);

export const barcodeFieldOptionsSchema = z
  .object({
    onlyMobileScan: z.boolean().optional().default(false),
    defaultValue: z.string().optional(),
    allowedTypes: z
      .array(barcodeDataTypeSchema)
      .min(1)
      .optional()
      .default(['text', 'link', 'number']),
    format: barcodeFormatSchema.optional().default('auto'),
    showAs: unionShowAsSchema.optional(),
    formatting: unionFormattingSchema.optional(),
  })
  .strict();

export interface IBarcodeFieldOptions extends z.infer<typeof barcodeFieldOptionsSchema> {
  type: FieldType.Barcode;
}

export class BarcodeFieldCore extends FieldCore {
  declare type: FieldType.Barcode;
  declare options: IBarcodeFieldOptions;
  declare cellValueType: CellValueType.String;
  declare dbFieldType: DbFieldType.Text;
  declare isMultipleCellValue?: false;

  static defaultOptions(): IBarcodeFieldOptions {
    return {
      type: FieldType.Barcode,
      onlyMobileScan: false,
      allowedTypes: ['text', 'link', 'number'],
      format: 'auto',
    };
  }

  validateOptions(): z.SafeParseReturnType<unknown, unknown> {
    return barcodeFieldOptionsSchema
      .extend({
        type: z.literal(FieldType.Barcode),
      })
      .safeParse(this.options);
  }

  validateCellValue(cellValue: unknown): z.SafeParseReturnType<unknown, unknown> {
    if (cellValue == null) return z.string().nullable().safeParse(cellValue);
    return z.string().safeParse(cellValue);
  }

  cellValue2String(value: unknown): string {
    if (value == null) return '';
    return String(value);
  }

  item2String(value: unknown): string {
    return this.cellValue2String(value);
  }

  convertStringToCellValue(value: string): string | null {
    if (value === '' || value == null) {
      return null;
    }

    return value.trim();
  }

  repair(value: unknown): string | null {
    if (value == null) return null;

    if (typeof value === 'string') {
      return this.convertStringToCellValue(value);
    }

    return String(value);
  }
}

export type IBarcodeField = InstanceType<typeof BarcodeFieldCore>;
