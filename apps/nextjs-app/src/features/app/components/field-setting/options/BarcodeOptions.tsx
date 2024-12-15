import type { IBarcodeFieldOptions } from '@teable/core';
import { Qrcode } from '@teable/icons';
import { useIsMobile } from '@teable/sdk';
import { Label, Switch, Button } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useZxing } from 'react-zxing';
import { tableConfig } from '@/features/i18n/table.config';
import type { IFieldOptionsProps } from '../FieldOptions';

const BarcodeScanner: React.FC<{ onResult: (value: string) => void }> = ({ onResult }) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
  });

  return (
    <div className="relative">
      <video ref={ref} className="w-full h-64 rounded-lg">
        <track kind="captions" src="" label={t('field.editor.scannerCaption', '扫码区域')} />
      </video>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 border-2 border-primary rounded-lg" />
      </div>
    </div>
  );
};

export const BarcodeOptions: React.FC<IFieldOptionsProps> = ({ field, onChange }) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const options = field.options as IBarcodeFieldOptions;
  const isMobile = useIsMobile();
  const [isScanning, setIsScanning] = React.useState(false);

  const handleScan = (value: string) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue) && value.trim() !== '') {
      console.log('Scanned number:', numberValue);
      setIsScanning(false);
      return;
    }

    try {
      new URL(value);
      console.log('Scanned URL:', value);
      setIsScanning(false);
      return;
    } catch {
      console.log('Scanned text:', value);
      setIsScanning(false);
    }
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
      {isMobile &&
        (isScanning ? (
          <div className="space-y-4">
            <BarcodeScanner onResult={handleScan} />
            <Button variant="outline" className="w-full" onClick={() => setIsScanning(false)}>
              {t('field.editor.cancelScan', '取消扫描')}
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="mt-2 w-full" onClick={() => setIsScanning(true)}>
            <Qrcode className="mr-2 size-4" />
            {t('field.editor.scanBarcode', '扫描条码')}
          </Button>
        ))}
    </div>
  );
};
