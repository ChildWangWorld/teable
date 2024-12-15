import type { IBarcodeFieldOptions } from '@teable/core';
import { Qrcode } from '@teable/icons';
import { useIsMobile } from '@teable/sdk';
import { Label, Switch, Button } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { tableConfig } from '@/features/i18n/table.config';
import type { IFieldOptionsProps } from '../FieldOptions';

const ScanButton: React.FC<{ onScan: (value: string) => void }> = ({ onScan }) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  return (
    <Button
      variant="outline"
      className="mt-2 w-full"
      onClick={() => {
        onScan('mock-scanned-value');
      }}
    >
      <Qrcode className="mr-2 size-4" />
      {t('field.editor.scanBarcode', '扫描条码')}
    </Button>
  );
};

export const BarcodeOptions: React.FC<IFieldOptionsProps> = ({ field, onChange }) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const options = field.options as IBarcodeFieldOptions;
  const isMobile = useIsMobile();

  const handleScan = (value: string) => {
    console.log('Scanned value:', value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="field-options-mobile-scan"
          checked={options.onlyMobileScan}
          onCheckedChange={(checked) => {
            onChange({ onlyMobileScan: checked });
          }}
        />
        <Label htmlFor="field-options-mobile-scan">
          {t('field.editor.onlyMobileScan', '仅可通过移动端扫码录入')}
        </Label>
      </div>
      {isMobile && <ScanButton onScan={handleScan} />}
    </div>
  );
};
