import type { IBarcodeFieldOptions, IFieldVo } from '@teable/core';
import { FieldType, CellValueType, DbFieldType } from '@teable/core';
import { useIsMobile } from '@teable/sdk';
import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import type { IFieldOptionsProps } from '../features/app/components/field-setting/FieldOptions';
import { BarcodeOptions } from '../features/app/components/field-setting/options/BarcodeOptions';

const BarcodeScanner: React.FC<{ onResult: (text: string) => void }> = ({ onResult }) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
  });

  return (
    <div className="relative">
      <video ref={ref} className="w-full max-w-md rounded border">
        <track kind="captions" src="" label="Position barcode/QR code in view to scan" default />
      </video>
      <p className="mt-2 text-sm text-gray-500">Position barcode/QR code in view to scan</p>
    </div>
  );
};

const TestBarcodePage = () => {
  const [fieldOptions, setFieldOptions] = useState<IBarcodeFieldOptions>({
    type: FieldType.Barcode,
    onlyMobileScan: false,
    allowedTypes: ['text', 'link', 'number'],
    format: 'auto',
  });
  const [scanResult, setScanResult] = useState<string>('');
  const [forceMobile, setForceMobile] = useState(false);
  const realIsMobile = useIsMobile();
  const isMobile = forceMobile || realIsMobile;

  const mockField: IFieldVo = {
    id: 'test-field',
    name: 'Test Barcode Field',
    type: FieldType.Barcode,
    options: fieldOptions,
    dbFieldName: 'test_field',
    cellValueType: CellValueType.String,
    dbFieldType: DbFieldType.Text,
    isComputed: false,
  };

  const handleScan = (value: string) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue) && value.trim() !== '') {
      console.log('Scanned number:', numberValue);
      setScanResult(`Number: ${numberValue}`);
      return;
    }

    try {
      new URL(value);
      console.log('Scanned URL:', value);
      setScanResult(`URL: ${value}`);
    } catch {
      console.log('Scanned text:', value);
      setScanResult(`Text: ${value}`);
    }
  };

  const handleOptionsChange: IFieldOptionsProps['onChange'] = (newOptions) => {
    console.log('Options changed:', newOptions);
    setFieldOptions((prevOptions: IBarcodeFieldOptions) => {
      const updatedOptions = { ...prevOptions };
      if ('onlyMobileScan' in newOptions) {
        updatedOptions.onlyMobileScan = newOptions.onlyMobileScan as boolean;
      }
      if ('allowedTypes' in newOptions) {
        updatedOptions.allowedTypes = newOptions.allowedTypes as ('text' | 'link' | 'number')[];
      }
      if ('format' in newOptions) {
        updatedOptions.format = newOptions.format as 'auto' | 'text' | 'link' | 'number';
      }
      return updatedOptions;
    });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl">Barcode Field Test Page</h1>
      <div className="mb-4">
        <p>Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
        <p>Scan Result: {scanResult}</p>
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => setForceMobile(!forceMobile)}
        >
          Toggle Mobile Mode (Currently: {forceMobile ? 'On' : 'Off'})
        </button>
      </div>
      <div className="mb-4 rounded border p-4">
        <BarcodeOptions field={mockField} onChange={handleOptionsChange} />
      </div>
      {(!fieldOptions.onlyMobileScan || isMobile) && (
        <div className="mt-4">
          <h2 className="mb-2 text-lg">Scan Barcode/QR Code</h2>
          <BarcodeScanner onResult={handleScan} />
        </div>
      )}
      <div className="mt-4">
        <h2 className="mb-2 text-lg">Test Data</h2>
        <div className="space-y-2">
          <button
            className="block rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
            onClick={() => handleScan('123456')}
          >
            Test Number Input
          </button>
          <button
            className="block rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
            onClick={() => handleScan('https://example.com')}
          >
            Test URL Input
          </button>
          <button
            className="block rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
            onClick={() => handleScan('Hello World')}
          >
            Test Text Input
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestBarcodePage;
