import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Stack, Separator, DefaultButton, PrimaryButton, IComboBoxOption } from '@fluentui/react';
import { Dialog, DialogFooter } from '@fluentui/react';
import { ServerPropTypes, getInvoiceSerial, getInvoiceData, supabase } from 'libs';
import { RHF, InvoiceTemplate } from 'components';

interface Props {
  serialValue: string;
  customerOptions: IComboBoxOption[];
}

const NewInvoiceForm = ({ serialValue, customerOptions }: Props): React.ReactElement => {
  const [currValue, setCurrValue] = useState<string>(serialValue);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<ServerPropTypes.CustomerMst>();
  const [serviceData, setServiceData] = useState<ServerPropTypes.ServiceMst[]>();
  const [pdfData, setPdfData] = useState<{
    invoiceData?: ServerPropTypes.InvoiceMst;
    ownerData?: ServerPropTypes.OwnerMst;
  }>();
  const { control, handleSubmit, setValue, reset } = useForm<ServerPropTypes.NewInvoice>();

  const onSelectCustomer = async (customer_id: number) => {
    setShowForm(false);
    setValue('invoice_id', currValue);
    setValue('date', new Date());
    const { data: customer_mst } = await supabase
      .from<ServerPropTypes.CustomerMst>('customer')
      .select()
      .eq('customer_id', customer_id);
    if (!customer_mst) return;
    setCustomerData(customer_mst[0]);
    setValue('payment_terms', customer_mst[0].payment_terms ?? '');
    const { data: service_mst } = await supabase
      .from('service')
      .select()
      .in('service_id', customer_mst[0].services ?? []);
    if (!service_mst) return;
    setServiceData(service_mst);
    setShowForm(true);
  };

  const onReset = () => {
    reset();
    setShowForm(false);
  };

  const onSubmit: SubmitHandler<ServerPropTypes.NewInvoice> = async (formData) => {
    if (customerData && serviceData) {
      const { data } = await supabase
        .from('invoice')
        .insert([getInvoiceData(formData, customerData, serviceData)]);
      if (!data) return;
      if (!pdfData?.ownerData) {
        const { data } = await supabase.from<ServerPropTypes.OwnerMst>('owner').select().limit(1);
        if (!data) return;
        setPdfData((rest) => ({ ...rest, ownerData: data[0] }));
      }
      setPdfData((rest) => ({ ...rest, invoiceData: data[0] }));
      setCurrValue(getInvoiceSerial(data[0].invoice_id));
      onReset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '587px' }}>
      <RHF.ComboBox
        label="Select Existing Customer"
        options={customerOptions}
        control={control}
        name="customer_id"
        rules={{ onChange: (e) => onSelectCustomer(e.target.value) }}
        styles={{ root: { marginBottom: '12px', width: '587px' } }}
      />
      {showForm && (
        <>
          <Stack horizontal tokens={{ childrenGap: 28 }}>
            <RHF.TextField
              label="Invoice ID"
              description="Auto-incrementing invoice number"
              defaultValue={currValue}
              readOnly
              control={control}
              name="invoice_id"
            />
            <RHF.DatePicker
              label="Invoice Date"
              textField={{ description: 'Date to be printed on invoice' }}
              maxDate={new Date()}
              control={control}
              name="date"
              rules={{ required: 'Required Field' }}
              styles={{ root: { width: '177px' } }}
            />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 28 }}>
            <RHF.DatePicker
              label="Billing Period: Start"
              textField={{ description: 'Start date for bill payment' }}
              control={control}
              name="billing_period.start"
              rules={{ required: 'Required Field' }}
              styles={{ root: { width: '177px' } }}
            />
            <RHF.DatePicker
              label="Billing Period: End"
              textField={{ description: 'End date for bill payment' }}
              control={control}
              name="billing_period.end"
              rules={{ required: 'Required Field' }}
              styles={{ root: { width: '177px' } }}
            />
          </Stack>
          <RHF.TextField
            label="Payment Terms"
            description="Optional terms for bill payment"
            control={control}
            name="payment_terms"
            rules={{ required: 'Required Field' }}
          />
          <Separator styles={{ root: { margin: '4px 0' } }}>Particulars & Amount</Separator>
          {serviceData?.map((item, index) => {
            return (
              <Stack
                horizontal
                tokens={{ childrenGap: 28 }}
                key={index}
                styles={{ root: { marginBottom: 4 } }}
              >
                <RHF.TextField
                  label={`${item?.description} (SAC: ${item?.sac})`}
                  description="Optional description"
                  control={control}
                  name={`particulars.${item.service_id}.optional`}
                  styles={{ root: { width: 354 } }}
                />
                <RHF.TextField
                  label="Amount"
                  description="Fixed to 2 fractional digits"
                  type="number"
                  prefix="&#8377;"
                  control={control}
                  name={`particulars.${item.service_id}.amount`}
                  rules={{ required: 'Required Field' }}
                />
              </Stack>
            );
          })}
          <Stack
            horizontal
            horizontalAlign="end"
            tokens={{ childrenGap: '28px' }}
            style={{ marginTop: '18px' }}
          >
            <DefaultButton onClick={onReset}>Reset</DefaultButton>
            <PrimaryButton type="submit">New Invoice</PrimaryButton>
          </Stack>
        </>
      )}
      <Dialog
        hidden={!(pdfData?.invoiceData && pdfData?.ownerData)}
        onDismiss={() => setPdfData((rest) => ({ ...rest, invoiceData: undefined }))}
        dialogContentProps={{
          title: 'Save Invoice',
          subText: 'This is the only time you will be able to download the original invoice.',
        }}
        modalProps={{ isBlocking: true }}
      >
        <DialogFooter>
          {pdfData?.invoiceData && pdfData?.ownerData && (
            <PDFDownloadLink
              document={
                <InvoiceTemplate invoiceData={pdfData.invoiceData} ownerData={pdfData.ownerData} />
              }
              fileName={`${pdfData.invoiceData.invoice_id}.pdf`}
            >
              {({ loading }) => <PrimaryButton disabled={loading}>Download</PrimaryButton>}
            </PDFDownloadLink>
          )}
        </DialogFooter>
      </Dialog>
    </form>
  );
};

export default NewInvoiceForm;
